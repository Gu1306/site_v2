import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, ExternalLink, RefreshCw } from 'lucide-react';
import { ApiError, apiGestao, Carregando, TelaLogin, Topo, useSessaoGestao } from './acesso';

// Calculadora de tráfego pago (Google Pesquisa e Meta). O funil é simulado aqui no
// navegador; o que já aconteceu de verdade (quem entrou pela avaliação ou pela 1ª
// sessão dupla e continuou, e quanto deixou) vem do ClickUp por /api/gestao/campanha.

type Entrada = { tipo: string; atletas: number; continuaram: number; taxa: number | null; receitaMediana: number | null };
type SemanaNovos = { segunda: string; novos: number; fisio: number; recovery: number; origens: Record<string, number> | null; encerrada: boolean };
type PeriodoJornada = { chave: string; de: string; ate: string; novos: number; fisio: number; recovery: number; origens: Record<string, number> | null; encerrada: boolean };
type DadosCampanha = {
  atualizadoEm: string | null;
  janela: { de: string; ate: string };
  entradas: { fisio: Entrada; recovery: Entrada };
  novosPorSemana: SemanaNovos[];
  jornada: { inicio: string; semanas: PeriodoJornada[]; meses: PeriodoJornada[] };
  foraDoNormal: { quantidade: number; exemplos: { valor: number; tipo: string; url: string | null }[] };
};

type Canal = 'google' | 'meta';
type Oferta = 'fisio' | 'recovery' | 'outro';
type Chave = 'dia' | 'dias' | 'cpc' | 'custoConv' | 'pClique' | 'pAgenda' | 'pComp' | 'pCont' | 'ticket' | 'recCont' | 'margem' | 'meta';
type ChaveReal = 'gasto' | 'cliques' | 'conversas' | 'agendaram' | 'compareceram' | 'continuaram';
type CenarioPronto = 'teste' | 'search' | 'recovery' | 'meta';
type Cenario = CenarioPronto | 'custom';
type Estado = { canal: Canal; oferta: Oferta; cenario: Cenario; campos: Record<Chave, string>; reais: Record<ChaveReal, string> };

const CHAVE_LOCAL = 'carefit_gestao_campanha_jornada_20261111_v1';
const CAPACIDADE = 50; // +50 primeiras sessões por mês (Gustavo, 05/11/2026)
const CLIQUES_CIDADE = 400; // a Pesquisa relevante de Ribeirão soma ~150–400 cliques/mês
const AMOSTRA_MINIMA = 5;
const CHAVES: Chave[] = ['dia', 'dias', 'cpc', 'custoConv', 'pClique', 'pAgenda', 'pComp', 'pCont', 'ticket', 'recCont', 'margem', 'meta'];
const CHAVES_REAIS: ChaveReal[] = ['gasto', 'cliques', 'conversas', 'agendaram', 'compareceram', 'continuaram'];

const BASE: Record<Chave, number> = { dia: 15, dias: 30, cpc: 2.5, custoConv: 12, pClique: 8, pAgenda: 80, pComp: 90, pCont: 25, ticket: 180, recCont: 780, margem: 60, meta: 10 };
const CENARIOS: Record<CenarioPronto, { nome: string; canal: Canal; oferta: Oferta; v: Partial<Record<Chave, number>> }> = {
  teste: { nome: 'Teste Google · R$ 15/dia', canal: 'google', oferta: 'fisio', v: { dia: 15 } },
  search: { nome: 'Pesquisa completa · R$ 50/dia', canal: 'google', oferta: 'fisio', v: { dia: 50 } },
  recovery: { nome: 'Recovery R$ 230 + cortesia', canal: 'google', oferta: 'recovery', v: { dia: 10, cpc: 2, ticket: 230 } },
  meta: { nome: 'Meta / Instagram · R$ 20/dia', canal: 'meta', oferta: 'fisio', v: { dia: 20 } },
};
const OFERTAS: Record<Oferta, { rotulo: string; porta: string; ticket?: number; recContPremissa?: number; cortesia: boolean; fonteTicket: string }> = {
  fisio: { rotulo: 'Avaliação (fisio)', porta: 'pela avaliação', ticket: 180, recContPremissa: 780, cortesia: false, fonteTicket: 'oferta de 08/11, sem cortesia' },
  recovery: { rotulo: 'Recovery + cortesia', porta: 'pela 1ª sessão dupla', ticket: 230, recContPremissa: 840, cortesia: true, fonteTicket: 'leva a 2ª sessão de cortesia' },
  outro: { rotulo: 'Outro valor', porta: '', cortesia: false, fonteTicket: 'valor livre' },
};

// ---------- números ----------
function lerNum(texto: string) {
  let s = String(texto ?? '').trim().replace(/\s/g, '').replace(/^R\$/i, '').replace(/%$/, '');
  if (!s) return NaN;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : NaN;
}
const positivo = (texto: string) => { const n = lerNum(texto); return Number.isFinite(n) && n > 0 ? n : 0; };
const paraCampo = (n: number) => (Number.isFinite(n) ? String(Math.round(n * 100) / 100).replace('.', ',') : '');
const dividir = (a: number, b: number) => (b > 0 ? a / b : Infinity);
function brl(v: number, casas?: number) {
  if (!Number.isFinite(v)) return '—';
  const d = casas ?? (Math.abs(v) < 100 ? 2 : 0);
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: d, maximumFractionDigits: d });
}
const comSinal = (v: number) => (v >= 0 ? '+' : '−') + brl(Math.abs(v), 0);
const qtd = (v: number) => (Number.isFinite(v) ? v.toLocaleString('pt-BR', { maximumFractionDigits: v < 10 ? 1 : 0 }) : '—');
const pct = (v: number) => (Number.isFinite(v) ? (v * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%' : '—');
const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const hora = (iso: string | null) => (iso ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '');

/** Taxa de quem continua e receita típica dessa pessoa, quando o ClickUp tem amostra. */
function realDaOferta(oferta: Oferta, dados: DadosCampanha | null) {
  if (!dados || oferta === 'outro') return null;
  const e = dados.entradas[oferta];
  if (e.atletas < AMOSTRA_MINIMA || e.taxa === null || e.receitaMediana === null) return null;
  return { pCont: Math.round(e.taxa * 100), recCont: Math.round(e.receitaMediana), entrada: e };
}

const reaisVazios = (): Record<ChaveReal, string> => ({ gasto: '', cliques: '', conversas: '', agendaram: '', compareceram: '', continuaram: '' });

function estadoDoCenario(cenario: CenarioPronto, dados: DadosCampanha | null, reais: Record<ChaveReal, string>, meta?: string): Estado {
  const c = CENARIOS[cenario];
  const real = realDaOferta(c.oferta, dados);
  const valores = { ...BASE, recCont: OFERTAS[c.oferta].recContPremissa ?? BASE.recCont, ...c.v, ...(real ? { pCont: real.pCont, recCont: real.recCont } : {}) };
  const campos = Object.fromEntries(CHAVES.map(k => [k, paraCampo(valores[k])])) as Record<Chave, string>;
  if (meta) campos.meta = meta;
  return { canal: c.canal, oferta: c.oferta, cenario, campos, reais };
}

function lerLocal(): Estado | null {
  try {
    const s = JSON.parse(localStorage.getItem(CHAVE_LOCAL) || 'null');
    if (!s || typeof s !== 'object' || !s.campos) return null;
    const cenario: Cenario = s.cenario in CENARIOS ? s.cenario : 'custom';
    return {
      canal: s.canal === 'meta' ? 'meta' : 'google',
      oferta: s.oferta in OFERTAS ? s.oferta : 'fisio',
      cenario,
      campos: Object.fromEntries(CHAVES.map(k => [k, typeof s.campos[k] === 'string' ? s.campos[k] : paraCampo(BASE[k])])) as Record<Chave, string>,
      reais: Object.fromEntries(CHAVES_REAIS.map(k => [k, typeof s.reais?.[k] === 'string' ? s.reais[k] : ''])) as Record<ChaveReal, string>,
    };
  } catch { return null; }
}

function calcular(e: Estado) {
  const v = (k: Chave) => positivo(e.campos[k]);
  const g = e.canal === 'google';
  const m = v('margem') / 100; const ticket = v('ticket'); const recCont = v('recCont');
  const pClique = v('pClique') / 100; const pAgenda = v('pAgenda') / 100; const pComp = v('pComp') / 100; const pCont = v('pCont') / 100;
  const verba = v('dia') * v('dias');
  const cliques = g ? (v('cpc') > 0 ? verba / v('cpc') : 0) : NaN;
  const conversas = g ? cliques * pClique : (v('custoConv') > 0 ? verba / v('custoConv') : 0);
  const agendam = conversas * pAgenda; const sessoes = agendam * pComp; const continuam = sessoes * pCont;
  const receita = sessoes * ticket + continuam * recCont;
  const regua1 = m * ticket; const regua2 = m * (ticket + pCont * recCont);
  const taxaTopo = g ? pClique * pAgenda * pComp : pAgenda * pComp;
  return {
    g, verba, cliques, conversas, agendam, sessoes, continuam, receita,
    resultado: receita * m - verba, soEntrada: sessoes * ticket * m - verba,
    cpa: dividir(verba, sessoes), regua1, regua2, maximoTopo: regua2 * taxaTopo, taxaTopo,
    custoConversa: dividir(verba, conversas), cac: dividir(verba, continuam), roas: verba > 0 ? receita / verba : NaN,
    topoAtual: g ? v('cpc') : v('custoConv'), dias: v('dias'), meta: v('meta'), pAgenda, pComp,
  };
}

type Veredito = { classe: '' | 'ok' | 'warn' | 'bad'; texto: string };
function veredito(cpa: number, regua1: number, regua2: number, temVerba: boolean): Veredito {
  if (!temVerba) return { classe: '', texto: 'Sem verba' };
  if (!Number.isFinite(cpa)) return { classe: 'bad', texto: 'Nenhuma sessão no mês' };
  if (cpa <= regua1) return { classe: 'ok', texto: 'Paga já na 1ª sessão' };
  if (cpa <= regua2) return { classe: 'warn', texto: 'Paga só com quem continua' };
  return { classe: 'bad', texto: 'Perde dinheiro' };
}

// ---------- peças ----------
function Tag({ tipo, children }: { tipo: 'dado' | 'clickup' | 'prem'; children: ReactNode }) {
  return <span className={`gc-tag gc-tag-${tipo}`}>{children}</span>;
}

function Campo({ id, rotulo, valor, onChange, pre, suf, fonte, modo = 'decimal', placeholder }: {
  id: string; rotulo: string; valor: string; onChange: (v: string) => void; pre?: string; suf?: string; fonte?: ReactNode; modo?: 'decimal' | 'numeric'; placeholder?: string;
}) {
  return (
    <label className="gc-campo" htmlFor={id}>
      <span className="gc-rot">{rotulo}</span>
      <span className="gc-entrada">
        {pre && <span className="gc-pre">{pre}</span>}
        <input id={id} inputMode={modo} autoComplete="off" value={valor} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
        {suf && <span className="gc-suf">{suf}</span>}
      </span>
      {fonte && <span className="gc-fonte">{fonte}</span>}
    </label>
  );
}

function Etapa({ num, titulo, valor, unidade, largura, children }: { num: number; titulo: string; valor: string; unidade: string; largura?: number; children: ReactNode }) {
  return (
    <div className="gc-etapa">
      <div className="gc-num">{num}</div>
      <div className="gc-corpo"><h3>{titulo}</h3>{children}</div>
      <div className="gc-saida">
        <strong>{valor}</strong>
        <small>{unidade}</small>
        {largura !== undefined && <div className="gc-barra" aria-hidden="true"><i style={{ width: `${largura}%` }} /></div>}
      </div>
    </div>
  );
}

function NovosPorSemana({ semanas }: { semanas: SemanaNovos[] }) {
  const teto = Math.max(5, Math.ceil(Math.max(...semanas.map(s => s.novos)) / 5) * 5);
  return (
    <div className="gs-grafico" role="img" aria-label={`Atletas novos por semana: ${semanas.map(s => `${ddmm(s.segunda)}: ${s.novos}`).join('; ')}`}>
      <div className="gs-grafico-guia"><span>{teto}</span></div>
      <div className="gs-colunas">
        {semanas.map(s => {
          const altura = `${(s.novos / teto) * 100}%`;
          return (
            <div key={s.segunda} className={'gs-coluna' + (s.encerrada ? '' : ' gc-coluna-aberta')} tabIndex={0}>
              <div className="gs-coluna-area">
                <span className="gs-coluna-valor" style={{ bottom: altura }}>{s.novos}</span>
                <span className="gs-coluna-barra" style={{ height: altura }} />
              </div>
              <span className="gs-coluna-rotulo">{ddmm(s.segunda)}</span>
              <div className="gs-dica" role="tooltip">
                <strong>Semana de {ddmm(s.segunda)}{s.encerrada ? '' : ' (em andamento)'}</strong>
                <span>Atletas novos <b>{s.novos}</b></span>
                <span>Pela avaliação <b>{s.fisio}</b></span>
                <span>Pela 1ª sessão dupla <b>{s.recovery}</b></span>
                <span>Outra porta <b>{s.novos - s.fisio - s.recovery}</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type RegistroSemanal = { periodo: 'semana' | 'mes'; semana: string; canal: Canal; oferta: Oferta; reais: Record<ChaveReal, string> };
const CHAVE_SEMANAS = 'carefit_campanha_jornada_20261111_v1';
function segundaAtual() {
  const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function HistoricoSemanal({ estado }: { estado: Estado }) {
  const [periodo, setPeriodo] = useState<'semana' | 'mes'>('semana');
  const [semana, setSemana] = useState(segundaAtual);
  const [mes, setMes] = useState(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; });
  const [mensagem, setMensagem] = useState('');
  const [registros, setRegistros] = useState<RegistroSemanal[]>(() => {
    try { const dados = JSON.parse(localStorage.getItem(CHAVE_SEMANAS) || '[]'); return Array.isArray(dados) ? dados : []; } catch { return []; }
  });
  const salvar = () => {
    if (periodo === 'semana' && (!semana || new Date(`${semana}T12:00:00`).getDay() !== 1 || semana < '2026-11-09' || semana > segundaAtual())) { setMensagem('Escolha uma semana entre o início da jornada e a semana atual.'); return; }
    const agora = new Date(); const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
    if (periodo === 'mes' && (!/^\d{4}-\d{2}$/.test(mes) || mes < '2026-11' || mes > mesAtual)) { setMensagem('Escolha um mês entre novembro de 2026 e o mês atual.'); return; }
    if (!estado.reais.gasto.trim() && !estado.reais.cliques.trim() && !estado.reais.conversas.trim() && !estado.reais.agendaram.trim() && !estado.reais.compareceram.trim() && !estado.reais.continuaram.trim()) { setMensagem('Preencha pelo menos um número antes de salvar.'); return; }
    if (CHAVES_REAIS.some(k => estado.reais[k].trim() && (!/^\d+(?:[.,]\d+)?$/.test(estado.reais[k].trim()) || lerNum(estado.reais[k]) < 0 || (k !== 'gasto' && !Number.isInteger(lerNum(estado.reais[k])))))) { setMensagem('Confira os valores: use números não negativos e quantidades inteiras.'); return; }
    const chave = periodo === 'semana' ? semana : mes;
    const registro = { periodo, semana: chave, canal: estado.canal, oferta: estado.oferta, reais: { ...estado.reais } };
    const atualizados = [...registros.filter(r => !(r.periodo === periodo && r.semana === chave && r.canal === estado.canal && r.oferta === estado.oferta)), registro].sort((a, b) => b.semana.localeCompare(a.semana));
    try { localStorage.setItem(CHAVE_SEMANAS, JSON.stringify(atualizados)); setRegistros(atualizados); setMensagem('Período salvo neste navegador.'); } catch { setMensagem('Não foi possível salvar neste navegador.'); }
  };
  return <section className="gs-bloco">
    <h2>Registros semanais e mensais</h2>
    <p className="gs-nota">Jornada iniciada em 11/11/2026. Na primeira semana, informe apenas 11 a 15/11; em novembro, informe 11 a 30/11. Preencha os valores do período acima e salve. Os totais mensais são lançados separadamente, pois semanas podem atravessar meses.</p>
    <p className="gs-nota">Os registros ficam somente neste navegador e aparelho; não são compartilhados nem são backup. Agendamentos e comparecimentos podem vir de cliques anteriores.</p>
    <div className="gc-acoes"><label>Período <select value={periodo} onChange={e => { setPeriodo(e.target.value as 'semana' | 'mes'); setMensagem(''); }}><option value="semana">Semana</option><option value="mes">Mês</option></select></label>{periodo === 'semana' ? <label>Segunda-feira da semana <input type="date" value={semana} onChange={e => setSemana(e.target.value)} /></label> : <label>Mês <input type="month" value={mes} min="2026-11" onChange={e => setMes(e.target.value)} /></label>}<button type="button" className="gs-botao gs-botao-cheio" onClick={salvar}>Salvar período</button><span role="status">{mensagem}</span></div>
    <p className="gs-nota">Salvar novamente substitui o mesmo período, canal e oferta. Seleção: {estado.canal === 'google' ? 'Google' : 'Meta'} · {OFERTAS[estado.oferta].rotulo}.</p>
    {registros.length > 0 && <div className="gs-rolagem"><table className="gs-tabela"><thead><tr><th>Período</th><th>Canal e oferta</th><th>Gasto</th><th>Cliques</th><th>Conversas</th><th>Agendaram</th><th>Compareceram</th><th>Continuaram</th></tr></thead><tbody>{registros.map(r => <tr key={`${r.periodo}-${r.semana}-${r.canal}-${r.oferta}`}><td>{r.periodo === 'mes' ? `Mês ${r.semana.slice(5, 7)}/${r.semana.slice(0, 4)}` : `Semana ${r.semana === '2026-11-09' ? '11/11' : ddmm(r.semana)}/${r.semana.slice(0, 4)}`}</td><td>{r.canal === 'google' ? 'Google' : 'Meta'} · {OFERTAS[r.oferta]?.rotulo || 'Outro'}</td><td>{r.reais.gasto ? brl(lerNum(r.reais.gasto), 2) : '—'}</td>{(['cliques', 'conversas', 'agendaram', 'compareceram', 'continuaram'] as ChaveReal[]).map(k => <td key={k}>{r.reais[k] || '—'}</td>)}</tr>)}</tbody></table></div>}
  </section>;
}

// ---------- página ----------
export default function GestaoCampanha() {
  const { sessao, setSessao, verificando, erro: erroSessao, sair } = useSessaoGestao();
  const [dados, setDados] = useState<DadosCampanha | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [estado, setEstado] = useState<Estado>(() => lerLocal() ?? estadoDoCenario('teste', null, reaisVazios()));
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);
  const [visao, setVisao] = useState<'semanas' | 'meses'>('semanas');
  const painelRef = useRef<HTMLElement>(null);
  const [painelNaTela, setPainelNaTela] = useState(true);

  useEffect(() => { document.title = 'Calculadora de campanha · CareFit'; }, []);

  const carregar = useCallback(async (forcar = false) => {
    setCarregando(true); setErro('');
    try { setDados(await apiGestao<DadosCampanha>(`campanha${forcar ? '?atualizar=1' : ''}`)); }
    catch (e) {
      if (e instanceof ApiError && e.status === 401) setSessao(null);
      setErro(e instanceof Error ? e.message : 'Falha na conexão.');
    } finally { setCarregando(false); }
  }, [setSessao]);

  useEffect(() => { if (sessao?.financeiro) void carregar(); }, [sessao, carregar]);

  useEffect(() => { try { localStorage.setItem(CHAVE_LOCAL, JSON.stringify(estado)); } catch { /* sem armazenamento: só não lembra */ } }, [estado]);

  // No celular, uma barra no rodapé mostra o resultado enquanto o painel está fora da tela.
  useEffect(() => {
    const el = painelRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(([e]) => setPainelNaTela(e.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [sessao]);

  const r = useMemo(() => calcular(estado), [estado]);
  const ref = realDaOferta(estado.oferta, null);

  if (verificando) return <Carregando />;
  if (!sessao) return <TelaLogin titulo="Calculadora de campanha" onEntrar={setSessao} aviso={erroSessao} />;
  if (!sessao.financeiro) return (
    <div className="gs-pagina">
      <Topo usuario={sessao.user} onSair={() => void sair()} voltar />
      <main className="gs-casca gs-casca-estreita"><section className="gs-bloco"><h2>Sem acesso</h2><p>A calculadora mostra receita e margem, por isso fica com o financeiro. Fale com o Gustavo se precisar.</p><p><Link to="/gestao" className="gs-link">← Voltar à central</Link></p></section></main>
    </div>
  );

  const campo = (k: Chave) => estado.campos[k];
  const mudar = (k: Chave) => (valor: string) => setEstado(e => ({ ...e, cenario: k === 'meta' ? e.cenario : 'custom', campos: { ...e.campos, [k]: valor } }));
  const mudarReal = (k: ChaveReal) => (valor: string) => setEstado(e => ({ ...e, reais: { ...e.reais, [k]: valor } }));
  const escolherCenario = (c: CenarioPronto) => { setAviso(null); setEstado(e => estadoDoCenario(c, null, e.reais, e.campos.meta)); };
  const escolherCanal = (canal: Canal) => setEstado(e => (e.canal === canal ? e : { ...e, canal, cenario: 'custom' }));
  const escolherOferta = (oferta: Oferta) => setEstado(e => {
    const o = OFERTAS[oferta]; const real = realDaOferta(oferta, null); const campos = { ...e.campos };
    if (o.ticket) campos.ticket = paraCampo(o.ticket);
    if (real) { campos.recCont = paraCampo(real.recCont); campos.pCont = paraCampo(real.pCont); }
    else if (o.recContPremissa) campos.recCont = paraCampo(o.recContPremissa);
    return { ...e, oferta, cenario: 'custom', campos };
  });

  const usarReais = () => {
    const x = (k: ChaveReal) => positivo(estado.reais[k]);
    const gasto = x('gasto'), cliques = x('cliques'), conversas = x('conversas'), agendaram = x('agendaram'), compareceram = x('compareceram'), continuaram = x('continuaram');
    const campos = { ...estado.campos }; let canal = estado.canal; const mudou: string[] = [];
    const taxa = (k: Chave, valor: number) => { campos[k] = paraCampo(Math.round(valor * 10) / 10); };
    if (gasto > 0 && cliques > 0) { canal = 'google'; campos.cpc = paraCampo(gasto / cliques); mudou.push('CPC'); if (conversas > 0) { taxa('pClique', (conversas / cliques) * 100); mudou.push('clique → conversa'); } }
    else if (gasto > 0 && conversas > 0) { canal = 'meta'; campos.custoConv = paraCampo(gasto / conversas); mudou.push('custo por conversa'); }
    if (conversas > 0 && agendaram > 0) { taxa('pAgenda', (agendaram / conversas) * 100); mudou.push('agendamento'); }
    if (agendaram > 0 && compareceram > 0) { taxa('pComp', (compareceram / agendaram) * 100); mudou.push('comparecimento'); }
    if (compareceram > 0 && continuaram > 0) { taxa('pCont', (continuaram / compareceram) * 100); mudou.push('continuidade'); }
    if (!mudou.length) { setAviso({ ok: false, texto: 'Preencha ao menos o gasto e os cliques (ou as conversas) para calcular as taxas.' }); return; }
    setEstado(e => ({ ...e, canal, campos, cenario: 'custom' }));
    setAviso({ ok: true, texto: `Aplicado na simulação: ${mudou.join(', ')}.` });
  };

  // ---------- leitura do resultado ----------
  const v = veredito(r.cpa, r.regua1, r.regua2, r.verba > 0);
  let explicacao = '';
  if (v.classe === 'ok') explicacao = `Cada sessão custa ${brl(r.cpa)} e a entrada deixa ${brl(r.regua1)} de margem.`;
  else if (v.classe === 'warn') explicacao = `Cada sessão custa ${brl(r.cpa)}. A entrada deixa ${brl(r.regua1)}; o resto precisa vir de quem segue no tratamento ou plano.`;
  else if (v.classe === 'bad' && Number.isFinite(r.cpa)) explicacao = `Cada sessão custa ${brl(r.cpa)} e devolve no máximo ${brl(r.regua2)} de margem.`;
  else if (v.classe === 'bad') explicacao = 'Com essas taxas, ninguém chega à sessão. Confira o CPC e as conversões.';

  const escala = Math.max(Number.isFinite(r.cpa) ? r.cpa : 0, r.regua1, r.regua2, 1) * 1.2;
  const pos = (x: number) => Math.max(0, Math.min(100, (x / escala) * 100));
  const p1 = pos(r.regua1); const p2 = pos(r.regua2); const pc = Number.isFinite(r.cpa) ? pos(r.cpa) : 100;
  const deslocar = pc < 14 ? '-4px' : pc > 86 ? 'calc(-100% + 4px)' : '-50%';

  const topo = r.g ? r.cliques : r.conversas;
  const largura = (x: number) => (topo > 0 && Number.isFinite(x) ? Math.max(0, Math.min(100, (x / topo) * 100)) : 0);
  const n = r.g ? [1, 2, 3, 4, 5, 6] : [1, 2, 0, 3, 4, 5];

  const metaVerba = r.meta > 0 && Number.isFinite(r.cpa) ? r.meta * r.cpa : NaN;
  const metaCliques = r.g && r.taxaTopo > 0 ? r.meta / r.taxaTopo : NaN;
  const metaConversas = r.pAgenda * r.pComp > 0 ? r.meta / (r.pAgenda * r.pComp) : NaN;

  const reaisN = (k: ChaveReal) => positivo(estado.reais[k]);
  const rg = reaisN('gasto'), rc = reaisN('cliques'), rv = reaisN('conversas'), ra = reaisN('agendaram'), rs = reaisN('compareceram'), rk = reaisN('continuaram');
  const cpaReal = rg > 0 && rs > 0 ? rg / rs : NaN;
  const vReal = Number.isFinite(cpaReal) ? veredito(cpaReal, r.regua1, r.regua2, true) : null;

  const fechadas = dados ? dados.novosPorSemana.filter(s => s.encerrada) : [];
  const mediaNovos = fechadas.length ? fechadas.reduce((t, s) => t + s.novos, 0) / fechadas.length : NaN;

  const fonteContinuidade = ref ? (
    Math.round(positivo(campo('pCont'))) === ref.pCont
      ? <><Tag tipo="clickup">ClickUp</Tag>{ref.entrada.continuaram} de {ref.entrada.atletas} que entraram {OFERTAS[estado.oferta].porta}{ref.entrada.atletas < 20 ? ' (amostra pequena)' : ''}</>
      : <><Tag tipo="prem">editado</Tag>o ClickUp mostra {ref.pCont}% ({ref.entrada.continuaram} de {ref.entrada.atletas})</>
  ) : <><Tag tipo="prem">premissa</Tag>estimativa inicial; preencha os resultados da jornada</>;
  const fonteReceita = ref ? (
    Math.round(positivo(campo('recCont'))) === ref.recCont
      ? <><Tag tipo="clickup">ClickUp</Tag>mediana de quem continuou {OFERTAS[estado.oferta].porta}</>
      : <><Tag tipo="prem">editado</Tag>o ClickUp mostra {brl(ref.recCont, 0)} (mediana)</>
  ) : <><Tag tipo="prem">premissa</Tag>{estado.oferta === 'recovery' ? 'plano mensal de recovery' : '6 sessões de R$ 130'}</>;

  return (
    <div className="gs-pagina gc-pagina">
      <Topo usuario={sessao.user} onSair={() => void sair()} voltar />
      <main className="gs-casca">
        <section className="gs-cabeca">
          <div>
            <span className="gs-eyebrow">MARKETING · TRÁFEGO PAGO</span>
            <h1>Calculadora de campanha</h1>
            <p className="gs-sub">
              Quanto custa cada sessão comparecida e se a verba volta para o caixa.
              {dados?.atualizadoEm ? <> Dados do ClickUp lidos às {hora(dados.atualizadoEm)}.</> : carregando ? ' Lendo o ClickUp…' : ''}
            </p>
          </div>
          <div className="gs-controles">
            <button type="button" className="gs-botao" onClick={() => void carregar(true)} disabled={carregando} title="Relê o ClickUp (no máximo uma vez por minuto)"><RefreshCw size={15} aria-hidden="true" className={carregando ? 'gs-girando' : ''} /> Atualizar</button>
          </div>
        </section>

        {erro && <p className="gs-erro gs-bloco" role="alert">{erro} A calculadora funciona com as premissas enquanto isso.</p>}

        {dados && dados.foraDoNormal.quantidade > 0 && (
          <div className="gs-aviso">
            <CircleAlert size={18} aria-hidden="true" />
            <span>
              <strong>{dados.foraDoNormal.quantidade} card(s) de sessão com valor acima de R$ 1.000 ficaram fora da conta</strong> (ex.: {dados.foraDoNormal.exemplos[0].tipo} com {brl(dados.foraDoNormal.exemplos[0].valor, 2)}). Parece valor digitado sem vírgula. Quando virarem “realizada”, vão inflar a produção do fechamento.
              {dados.foraDoNormal.exemplos.filter(x => x.url).map((x, i) => <a key={x.url! + i} href={x.url!} target="_blank" rel="noopener noreferrer" className="gc-aviso-link">card {i + 1} <ExternalLink size={12} aria-hidden="true" /></a>)}
            </span>
          </div>
        )}

        <details className="gs-bloco"><summary>Histórico geral · referência</summary><p className="gs-nota">Dados gerais do ClickUp, apresentados como referência; não são resultados da campanha iniciada em 11/11/2026.</p><section className="gs-kpis" aria-label="Histórico do ClickUp">
          <EntradaKpi rotulo="Entrou pela avaliação e continuou" e={dados?.entradas.fisio} />
          <EntradaKpi rotulo="Entrou pela 1ª sessão dupla e continuou" e={dados?.entradas.recovery} />
          <div className="gs-kpi">
            <span>Atletas novos por semana</span>
            <strong>{Number.isFinite(mediaNovos) ? mediaNovos.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) : '—'}</strong>
            <small>{fechadas.length ? `média das ${fechadas.length} semanas fechadas` : 'lendo o ClickUp…'}</small>
          </div>
        </section></details>

        <div className="gc-cenarios" role="group" aria-label="Cenários prontos">
          <span className="gc-cenarios-rot">Cenário</span>
          {(Object.keys(CENARIOS) as CenarioPronto[]).map(c => (
            <button key={c} type="button" className="gc-chip" aria-pressed={estado.cenario === c} onClick={() => escolherCenario(c)}>{CENARIOS[c].nome}</button>
          ))}
          {estado.cenario === 'custom' && <span className="gc-personal">Personalizado</span>}
        </div>

        <div className="gc-grade">
          <section className="gc-funil" aria-label="Funil da campanha">
            <Etapa num={n[0]} titulo="Verba" valor={brl(r.verba, 0)} unidade="no mês">
              <div className="gc-campos">
                <Campo id="gc-dia" rotulo="Por dia" pre="R$" valor={campo('dia')} onChange={mudar('dia')} fonte={<><Tag tipo="dado">dado</Tag>teste proposto: R$ 15/dia</>} />
                <Campo id="gc-dias" rotulo="Dias no mês" suf="dias" modo="numeric" valor={campo('dias')} onChange={mudar('dias')} fonte="30 = mês cheio no ar" />
              </div>
            </Etapa>

            <Etapa num={n[1]} titulo="Anúncio" valor={qtd(topo)} unidade={r.g ? 'cliques' : 'conversas'} largura={topo > 0 ? 100 : 0}>
              <div className="gc-seg" role="group" aria-label="Canal">
                <button type="button" aria-pressed={r.g} onClick={() => escolherCanal('google')}>Google Pesquisa</button>
                <button type="button" aria-pressed={!r.g} onClick={() => escolherCanal('meta')}>Meta / Instagram</button>
              </div>
              <div className="gc-campos">
                {r.g
                  ? <Campo id="gc-cpc" rotulo="CPC médio" pre="R$" valor={campo('cpc')} onChange={mudar('cpc')} fonte={<><Tag tipo="prem">premissa</Tag>Planejador: topo R$ 1,30–4,50; teto do grupo R$ 3,50</>} />
                  : <Campo id="gc-custoConv" rotulo="Custo por conversa" pre="R$" valor={campo('custoConv')} onChange={mudar('custoConv')} fonte={<><Tag tipo="prem">premissa</Tag>sem histórico no Meta ainda</>} />}
              </div>
              {r.g && r.cliques > CLIQUES_CIDADE && <p className="gc-aviso-linha">{qtd(r.cliques)} cliques passa do que a Pesquisa de Ribeirão entrega (cerca de 150 a 400 por mês). A verba vai sobrar ou o CPC vai subir.</p>}
            </Etapa>

            {r.g && (
              <Etapa num={n[2]} titulo="Conversa" valor={qtd(r.conversas)} unidade="conversas" largura={largura(r.conversas)}>
                <div className="gc-campos">
                  <Campo id="gc-pClique" rotulo="Clique que vira conversa" suf="%" valor={campo('pClique')} onChange={mudar('pClique')} fonte={<><Tag tipo="prem">premissa</Tag>chamou no WhatsApp ou clicou em Agendar</>} />
                </div>
              </Etapa>
            )}

            <Etapa num={n[3]} titulo="Agendamento" valor={qtd(r.agendam)} unidade="agendam" largura={largura(r.agendam)}>
              <div className="gc-campos">
                <Campo id="gc-pAgenda" rotulo="Conversa que agenda" suf="%" valor={campo('pAgenda')} onChange={mudar('pAgenda')} fonte={<><Tag tipo="prem">premissa</Tag>Gustavo: “quem entra em contato fecha”</>} />
              </div>
            </Etapa>

            <Etapa num={n[4]} titulo="Comparecimento" valor={qtd(r.sessoes)} unidade="sessões comparecidas" largura={largura(r.sessoes)}>
              <div className="gc-campos">
                <Campo id="gc-pComp" rotulo="Agendado que comparece" suf="%" valor={campo('pComp')} onChange={mudar('pComp')} fonte={<><Tag tipo="dado">dado</Tag>Gustavo, 05/11</>} />
              </div>
            </Etapa>

            <Etapa num={n[5]} titulo="Continuidade" valor={qtd(r.continuam)} unidade="continuam" largura={largura(r.continuam)}>
              <div className="gc-campos">
                <Campo id="gc-pCont" rotulo="Segue em tratamento ou plano" suf="%" valor={campo('pCont')} onChange={mudar('pCont')} fonte={fonteContinuidade} />
              </div>
            </Etapa>

            <div className="gc-bloco-tit">O que cada pessoa deixa no caixa</div>
            <div className="gc-valor">
              <div className="gc-campos">
                <label className="gc-campo" htmlFor="gc-oferta">
                  <span className="gc-rot">Oferta de entrada</span>
                  <span className="gc-entrada">
                    <select id="gc-oferta" value={estado.oferta} onChange={e => escolherOferta(e.target.value as Oferta)}>
                      {(Object.keys(OFERTAS) as Oferta[]).map(o => <option key={o} value={o}>{OFERTAS[o].rotulo}</option>)}
                    </select>
                  </span>
                  <span className="gc-fonte">dor que limita a corrida = avaliação</span>
                </label>
                <Campo id="gc-ticket" rotulo="Valor da entrada" pre="R$" valor={campo('ticket')} onChange={mudar('ticket')} fonte={estado.oferta === 'outro' ? 'valor livre' : <><Tag tipo="dado">dado</Tag>{OFERTAS[estado.oferta].fonteTicket}</>} />
                <Campo id="gc-recCont" rotulo="Receita de quem continua" pre="R$" valor={campo('recCont')} onChange={mudar('recCont')} fonte={fonteReceita} />
                <Campo id="gc-margem" rotulo="Margem de contribuição" suf="%" valor={campo('margem')} onChange={mudar('margem')} fonte={<><Tag tipo="dado">dado</Tag>DRE out/26: 60,2%</>} />
              </div>
            </div>
          </section>

          <aside className="gc-painel" ref={painelRef} aria-label="Resultado projetado">
            <div className="gc-res">
              <span className="gc-olho">Resultado projetado do mês</span>
              <div className={'gc-grande ' + (r.verba > 0 ? (r.resultado >= 0 ? 'gc-pos' : 'gc-neg') : '')}>{r.verba > 0 ? comSinal(r.resultado) : brl(0, 0)}</div>
              <p className="gc-sub">margem que os clientes do mês deixam, menos a verba</p>
              {r.verba > 0 && <p className="gc-sub">Contando só a entrada: <b>{comSinal(r.soEntrada)}</b></p>}
            </div>
            <div className="gc-res" aria-live="polite">
              <span className={'gc-selo ' + (v.classe ? 'gc-selo-' + v.classe : '')}>{v.texto}</span>
              {explicacao && <p className="gc-expl">{explicacao}</p>}
            </div>

            <div className="gc-regua">
              <div className="gc-regua-tit"><span>Custo por sessão comparecida</span><strong>{brl(r.cpa)}</strong></div>
              <div className="gc-trilho" aria-hidden="true">
                <div className="gc-zona gc-zona-ok" style={{ left: 0, width: `${p1}%` }} />
                <div className="gc-zona gc-zona-warn" style={{ left: `${p1}%`, width: `${p2 - p1}%` }} />
                <div className="gc-zona gc-zona-bad" style={{ left: `${p2}%`, width: `${100 - p2}%` }} />
                <div className="gc-pino" style={{ left: `${pc}%` }} />
                <div className="gc-pino-rot" style={{ left: `${pc}%`, transform: `translateX(${deslocar})` }}>{Number.isFinite(r.cpa) ? `você: ${brl(r.cpa)}` : 'sem sessão'}</div>
              </div>
              <ul className="gc-leg">
                <li><i className="gc-zona-ok" />A entrada paga sozinha até <b>{brl(r.regua1)}</b></li>
                {r.regua2 > r.regua1 && <li><i className="gc-zona-warn" />Com quem continua, empata em <b>{brl(r.regua2)}</b></li>}
                <li><i className="gc-zona-bad" />Acima disso, a campanha dá prejuízo</li>
              </ul>
            </div>

            <dl className="gc-kpis">
              <div><dt>{r.g ? 'CPC máximo' : 'Conversa: custo máximo'}</dt><dd>{brl(r.maximoTopo, 2)}</dd><small>empata a conta · hoje {brl(r.topoAtual, 2)}</small></div>
              <div><dt>Custo por conversa</dt><dd>{brl(r.custoConversa)}</dd><small>WhatsApp ou Agendar</small></div>
              <div><dt>CAC</dt><dd>{brl(r.cac)}</dd><small>por cliente que continua</small></div>
              <div><dt>Receita gerada</dt><dd>{brl(r.receita, 0)}</dd><small>{Number.isFinite(r.roas) ? `volta ${r.roas.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}× a verba` : ''}</small></div>
            </dl>

            <div className="gc-cap">
              <span>Primeiras sessões: <b>{qtd(r.sessoes)}</b> das +{CAPACIDADE} que cabem no mês{OFERTAS[estado.oferta].cortesia && r.sessoes > 0 ? `, mais ${qtd(r.sessoes)} horários de cortesia` : ''}</span>
              <div className="gc-cap-barra"><i style={{ width: `${Math.min(100, (r.sessoes / CAPACIDADE) * 100)}%` }} /></div>
              {r.sessoes > CAPACIDADE && <span className="gc-alerta">Passa da capacidade da agenda.</span>}
            </div>

            <div className="gc-meta">
              <label htmlFor="gc-meta">Quero <input id="gc-meta" inputMode="numeric" autoComplete="off" value={campo('meta')} onChange={e => mudar('meta')(e.target.value)} /> sessões comparecidas por mês</label>
              {Number.isFinite(metaVerba) && r.dias > 0
                ? <p>Precisa de <b>{brl(metaVerba / r.dias, 2)}/dia</b> ({brl(metaVerba, 0)} no mês), cerca de {r.g ? `${qtd(metaCliques)} cliques` : `${qtd(metaConversas)} conversas`}.</p>
                : <p>{r.meta > 0 ? 'Ajuste o funil para ter ao menos uma sessão.' : ''}</p>}
              {r.g && metaCliques > CLIQUES_CIDADE && <p className="gc-alerta">A Pesquisa de Ribeirão não chega lá sozinha (cerca de 150 a 400 cliques por mês). Complete com Meta e indicação.</p>}
            </div>
          </aside>
        </div>

        <section className="gs-bloco">
          <h2>Conferir com o real</h2>
          <p className="gs-nota">Preencha os dados do mesmo período: gasto e cliques do Ads, conversas do WhatsApp e agendamentos, comparecimentos e continuações confirmados. Os valores ficam neste navegador. O botão troca as premissas pelas taxas reais.</p>
          <div className="gc-real-campos">
            <Campo id="gc-r-gasto" rotulo="Gasto" pre="R$" placeholder="0" valor={estado.reais.gasto} onChange={mudarReal('gasto')} />
            <Campo id="gc-r-cliques" rotulo="Cliques" modo="numeric" placeholder="0" valor={estado.reais.cliques} onChange={mudarReal('cliques')} />
            <Campo id="gc-r-conversas" rotulo="Conversas" modo="numeric" placeholder="0" valor={estado.reais.conversas} onChange={mudarReal('conversas')} />
            <Campo id="gc-r-agendaram" rotulo="Agendaram" modo="numeric" placeholder="0" valor={estado.reais.agendaram} onChange={mudarReal('agendaram')} />
            <Campo id="gc-r-compareceram" rotulo="Compareceram" modo="numeric" placeholder="0" valor={estado.reais.compareceram} onChange={mudarReal('compareceram')} />
            <Campo id="gc-r-continuaram" rotulo="Continuaram" modo="numeric" placeholder="0" valor={estado.reais.continuaram} onChange={mudarReal('continuaram')} />
          </div>
          <div className="gc-real-saida">
            <div><span>CPC real</span><b>{rg > 0 && rc > 0 ? brl(rg / rc, 2) : '—'}</b></div>
            <div><span>Clique → conversa</span><b>{rv > 0 && rc > 0 ? pct(rv / rc) : '—'}</b></div>
            <div><span>Custo por conversa</span><b>{rg > 0 && rv > 0 ? brl(rg / rv) : '—'}</b></div>
            <div><span>Conversa → agendamento</span><b>{ra > 0 && rv > 0 ? pct(ra / rv) : '—'}</b></div>
            <div><span>Comparecimento</span><b>{rs > 0 && ra > 0 ? pct(rs / ra) : '—'}</b></div>
            <div><span>Custo por sessão comparecida</span><b>{brl(cpaReal)}</b>{vReal && <span className={'gc-pill gc-pill-' + vReal.classe}>{vReal.texto}</span>}</div>
            <div><span>Continuaram</span><b>{rk > 0 && rs > 0 ? pct(rk / rs) : '—'}</b></div>
            <div><span>CAC real</span><b>{rg > 0 && rk > 0 ? brl(rg / rk) : '—'}</b></div>
          </div>
          <div className="gc-acoes">
            <button type="button" className="gs-botao gs-botao-cheio" onClick={usarReais}>Usar estas taxas na simulação</button>
            {aviso && <span className={aviso.ok ? 'gc-status' : 'gc-status gc-status-erro'} role="status">{aviso.texto}</span>}
          </div>
        </section>

        <HistoricoSemanal estado={estado} />

        {dados?.jornada && <section className="gs-bloco">
          <h2>Nova jornada · desde 11/11/2026</h2>
          <p className="gs-nota">Primeiras sessões realizadas desde o início da jornada, para todos os canais. A primeira semana e o primeiro mês começam em 11/11. A origem vem do CRM e é atualizada quando o campo é preenchido. O período inclui apenas sessões realizadas até a data atual.</p>
          <div className="gc-seg" role="group" aria-label="Visualização da jornada"><button type="button" aria-pressed={visao === 'semanas'} onClick={() => setVisao('semanas')}>Por semana</button><button type="button" aria-pressed={visao === 'meses'} onClick={() => setVisao('meses')}>Por mês</button></div>
          <div className="gs-rolagem"><table className="gs-tabela"><thead><tr><th>Período</th><th>Novos atletas</th><th>Avaliação</th><th>Recovery</th><th>Origem de marketing</th></tr></thead><tbody>{dados.jornada[visao].map(p => <tr key={p.chave}><td>{ddmm(p.de)}/{p.de.slice(0, 4)} a {ddmm(p.ate)}/{p.ate.slice(0, 4)}{p.encerrada ? '' : ' · em andamento'}</td><td>{p.novos}</td><td>{p.fisio}</td><td>{p.recovery}</td><td>{p.origens === null ? 'CRM indisponível' : Object.entries(p.origens).map(([nome, total]) => `${nome}: ${total}`).join(' · ') || 'Nenhum'}</td></tr>)}</tbody></table></div>
          <p className="gs-nota">Para agendamentos pela Agenda, pergunte como a pessoa conheceu a CareFit e registre “Origem de marketing” no CRM. Google Ads exige identificação; se não souber se foi anúncio, escolha Google busca (não identificado).</p>
        </section>}

        {dados && (
          <details className="gs-bloco"><summary>Atletas de semanas anteriores · histórico</summary>
            <p className="gs-nota">
              Quem fez a 1ª sessão realizada na lista Sessões Carefit naquela semana, por qualquer porta. A média anterior é {Number.isFinite(mediaNovos) ? mediaNovos.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) : '—'} por semana; a diferença não identifica quantos vieram dos anúncios. Só entra sessão com baixa (“realizada”): semana com baixa atrasada aparece menor do que foi. Passe o mouse (ou toque) numa coluna para ver por qual porta entraram.
            </p>
            <NovosPorSemana semanas={dados.novosPorSemana} />
            <h3>Origem de marketing dos novos atletas</h3>
            <p className="gs-nota">O campo “Origem de marketing” do card do atleta no CRM alimenta esta lista. Sem vínculo ou campo preenchido, a origem aparece como não informada. Google Ads só deve ser selecionado quando houver evidência; caso contrário, escolha Google busca (não identificado).</p>
            {dados.novosPorSemana.some(s => s.origens === null) ? <p>Não foi possível carregar as origens do CRM. Tente atualizar mais tarde.</p> : (
              <div className="gs-rolagem"><table className="gs-tabela"><thead><tr><th>Semana</th><th>Origem dos comparecimentos</th></tr></thead><tbody>
                {dados.novosPorSemana.map(s => <tr key={s.segunda}><td>{ddmm(s.segunda)}{s.encerrada ? '' : ' · em andamento'}</td><td>{Object.entries(s.origens || {}).map(([nome, total]) => `${nome}: ${total}`).join(' · ') || 'Nenhum'}</td></tr>)}
              </tbody></table></div>
            )}
          </details>
        )}

        <section className="gs-bloco">
          <h2>De onde vêm os números</h2>
          <ul className="gc-fontes">
            <li><b>Histórico geral de continuidade</b>: ClickUp, lista Sessões Carefit. Referência de atletas cuja 1ª sessão foi “Avaliação” ou “Primeira Sessão Dupla”{dados ? ` entre ${ddmm(dados.janela.de)}/${dados.janela.de.slice(2, 4)} e ${ddmm(dados.janela.ate)}/${dados.janela.ate.slice(2, 4)}` : ''}; esse histórico não é aplicado automaticamente à nova jornada. Continuou = tem sessão paga de outro tipo depois. A receita é a mediana do que essas pessoas deixaram, sem as canceladas.</li>
            <li><b>Comparecimento de 90%</b> e capacidade para <b>+50 primeiras sessões por mês</b>: Gustavo, 05/11/2026.</li>
            <li><b>Margem de contribuição de 60,2%</b>: DRE de outubro de 2026.</li>
            <li><b>Ofertas</b> (08/11/2026): dor que limita a corrida entra pela avaliação com fisioterapeuta, R$ 180, sem cortesia. Recovery e performance entram por R$ 230 com a 2ª sessão de cortesia, que ocupa um horário a mais na agenda e não está descontada da margem.</li>
            <li><b>CPC</b>: Planejador de Palavras-chave, Ribeirão Preto. Lance de topo de R$ 1,30 a R$ 4,50 para “fisioterapia ribeirão preto”; teto dos grupos na conta, R$ 3,50. Volume da cidade: cerca de 150 a 400 cliques por mês.</li>
            <li><b>Régua de 08/11</b>: os R$ 120 por sessão comparecida foram combinados com a oferta de R$ 230. Com R$ 180 e 60% de margem, a entrada sozinha paga até R$ 108.</li>
            <li><b>Ainda são premissas</b>: CPC de R$ 2,50, 8% dos cliques viram conversa, 80% das conversas agendam, conversa no Meta a R$ 12. A seção “Conferir com o real” troca cada uma pelo número da campanha.</li>
            <li>A receita de quem continua entra inteira no mês da 1ª sessão, mesmo que seja paga nos meses seguintes.</li>
          </ul>
        </section>
      </main>

      <div className={'gc-mini' + (painelNaTela ? ' gc-mini-oculta' : '')} aria-hidden="true">
        <span>Resultado <b className={r.verba > 0 ? (r.resultado >= 0 ? 'gc-pos' : 'gc-neg') : ''}>{r.verba > 0 ? comSinal(r.resultado) : brl(0, 0)}</b></span>
        <span>Sessão <b>{brl(r.cpa)}</b></span>
        <button type="button" tabIndex={-1} onClick={() => painelRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })}>Ver resultado</button>
      </div>
    </div>
  );
}

function EntradaKpi({ rotulo, e }: { rotulo: string; e?: Entrada }) {
  const pequena = e && e.atletas < 20;
  return (
    <div className="gs-kpi">
      <span>{rotulo}</span>
      <strong>{e && e.taxa !== null ? pct(e.taxa) : '—'}</strong>
      <small>
        {e ? (e.atletas ? `${e.continuaram} de ${e.atletas} atletas${pequena ? ' (amostra pequena)' : ''} · deixaram ${e.receitaMediana !== null ? brl(e.receitaMediana, 0) : '—'} (mediana)` : 'ninguém entrou por aqui na janela') : 'lendo o ClickUp…'}
      </small>
    </div>
  );
}
