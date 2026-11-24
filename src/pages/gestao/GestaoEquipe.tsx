import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, CircleAlert, Copy, ExternalLink, Printer, RefreshCw } from 'lucide-react';
import { ApiError, apiGestao, Carregando, TelaLogin, Titulo, Topo, useSessaoGestao } from './acesso';

type Comissao = { valor: number | null; formula: string | null; confirmada: boolean; fixo: number | null; bonus: number | null };
type Atendimento = { data: string; atleta: string; tipo: string; valor: number; pagamento: string | null; url: string | null };
type Profissional = {
  nome: string; vinculo: string; atendimentos: number; atletas: number; producao: number; cortesias: number;
  porAtendimento: number | null; porTipo: { nome: string; quantidade: number; producao: number }[];
  regra: { tipo: string; descricao: string; nota: string | null } | null;
  comissao: Comissao; custoPorAtendimento: number | null; lista: Atendimento[];
};
type Turma = { rotulo: string; aulas: number; faltas: number; alunos: number; producao: number };
type MesResumo = { mes: string; sessoes: number; fortalecimento: number; yoga: number; atendimentos: number; producao: number; porProfissional: Record<string, number> };
type Equipe = {
  atualizadoEm: string | null;
  mes: { referencia: string; de: string; ate: string; limite: string; emCurso: boolean; diasCorridos: number; diasNoMes: number; hoje: string };
  totais: {
    atendimentos: number; sessoes: number; producao: number; producaoSessoes: number; atletas: number;
    porAtendimento: number | null; aPagar: number; aConfirmar: number; pesoDaEquipe: number | null;
    projecao: { producao: number | null; atendimentos: number | null };
  };
  profissionais: Profissional[];
  fortalecimento: Turma;
  yoga: Turma;
  bonus: { de: string; sessoes: number; limite: number; porSessao: number; valor: number; faltam: number };
  recebimento: {
    formas: { forma: string; quantidade: number; valor: number }[];
    aReceber: { data: string; atleta: string; tipo: string; valor: number; profissional: string; url: string | null }[];
    total: number;
  };
  historico: MesResumo[];
  foraDoNormal: { quantidade: number; exemplos: { valor: number; atleta: string; tipo: string; url: string | null }[] };
};

const TZ = 'America/Sao_Paulo';
const hojeSP = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const brlRedondo = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0, minimumFractionDigits: 0 });
const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const nomeMes = (ref: string) => new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(ref + '-15T12:00:00Z'));
const mesCurto = (ref: string) => new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(new Date(ref + '-15T12:00:00Z')).replace('.', '');
const hora = (iso: string | null) => (iso ? new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '');
const porcento = (v: number) => (v * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
const mesVizinho = (mes: string, passo: number) => {
  const [ano, numero] = mes.split('-').map(Number);
  return new Date(Date.UTC(ano, numero - 1 + passo, 1)).toISOString().slice(0, 7);
};
const primeiroNome = (nome: string) => nome.split(' ')[0];

/** Demonstrativo em texto, do jeito que vai no WhatsApp do profissional. */
function demonstrativoTexto(p: Profissional, mes: string) {
  const linhas = [
    `*${p.nome} — ${nomeMes(mes)}*`,
    '',
    ...p.lista.map(a => `${ddmm(a.data)} · ${a.atleta} · ${a.tipo} · ${brl(a.valor)}`),
    '',
    `Atendimentos: ${p.atendimentos}`,
    `Produção: ${brl(p.producao)}`,
  ];
  if (p.comissao.valor !== null) linhas.push('', `*Comissão: ${brl(p.comissao.valor)}*`, p.comissao.formula || '');
  return linhas.filter(l => l !== '').join('\n');
}

function Kpi({ rotulo, valor, detalhe, destaque, verde }: { rotulo: string; valor: string; detalhe?: string; destaque?: boolean; verde?: boolean }) {
  return (
    <div className={'gs-kpi' + (destaque ? ' gs-kpi-destaque' : '') + (verde ? ' gs-kpi-verde' : '')}>
      <span>{rotulo}</span>
      <strong>{valor}</strong>
      {detalhe && <small>{detalhe}</small>}
    </div>
  );
}

function CartaoPessoa({ p, mes, teto }: { p: Profissional; mes: string; teto: number }) {
  const [copiado, setCopiado] = useState(false);
  const semMovimento = p.atendimentos === 0;
  return (
    <article className={'gs-equipe-cartao' + (semMovimento ? ' gs-equipe-parada' : '')}>
      <header>
        <span className="gs-avatar" aria-hidden="true">{p.nome.charAt(0)}</span>
        <div>
          <h3>{p.nome}</h3>
          <small>{p.vinculo}</small>
        </div>
        {semMovimento
          ? <b className="gs-equipe-valor gs-equipe-aberto">—<i>sem atendimento no mês</i></b>
          : p.comissao.valor !== null
            ? <b className="gs-equipe-valor">{brl(p.comissao.valor)}<i>a pagar no mês</i></b>
            : <b className="gs-equipe-valor gs-equipe-aberto">regra a confirmar<i>sem cálculo de comissão</i></b>}
      </header>

      {semMovimento ? <p className="gs-nota">Nenhum atendimento registrado em {nomeMes(mes)}.</p> : (
        <>
          <div className="gs-equipe-numeros">
            <span><b>{p.atendimentos}</b>atendimentos</span>
            <span><b>{p.atletas}</b>atletas</span>
            <span><b>{brlRedondo(p.producao)}</b>produção</span>
            <span><b>{p.porAtendimento === null ? '—' : brlRedondo(p.porAtendimento)}</b>por atendimento</span>
            {p.custoPorAtendimento !== null && <span><b>{brlRedondo(p.custoPorAtendimento)}</b>custo por atendimento</span>}
            {p.cortesias > 0 && <span><b>{p.cortesias}</b>sem valor</span>}
          </div>

          <div className="gs-equipe-barra" aria-hidden="true">
            <span style={{ width: `${teto > 0 ? Math.max(2, (p.producao / teto) * 100) : 0}%` }} />
          </div>

          {p.regra && (
            <p className="gs-equipe-regra">
              <strong>Como se calcula:</strong> {p.regra.descricao}
              {p.comissao.formula && <><br /><code>{p.comissao.formula}</code></>}
              {p.regra.nota && <><br /><em>{p.regra.nota}</em></>}
            </p>
          )}

          <p className="gs-equipe-tipos">
            {p.porTipo.map(t => <span key={t.nome}>{t.nome} <b>{t.quantidade}</b></span>)}
          </p>

          <details className="gs-detalhes">
            <summary>Demonstrativo do mês ({p.lista.length} atendimentos)</summary>
            <div className="gs-controles gs-sem-impressao">
              <button type="button" className="gs-botao" onClick={async () => {
                try { await navigator.clipboard.writeText(demonstrativoTexto(p, mes)); setCopiado(true); } catch { /* sem permissão de área de transferência */ }
              }}>{copiado ? <><Check size={15} aria-hidden="true" /> Copiado</> : <><Copy size={15} aria-hidden="true" /> Copiar para o WhatsApp</>}</button>
            </div>
            <div className="gs-rolagem">
              <table className="gs-tabela">
                <thead><tr><th>Dia</th><th>Atleta</th><th>Tipo</th><th>Pagamento</th><th className="gs-num">Valor</th><th /></tr></thead>
                <tbody>
                  {p.lista.map((a, i) => (
                    <tr key={(a.url || a.atleta) + i}>
                      <td>{ddmm(a.data)}</td>
                      <td>{a.atleta}</td>
                      <td>{a.tipo}</td>
                      <td>{a.pagamento || <span className="gs-pendente">sem forma</span>}</td>
                      <td className="gs-num">{a.valor === 0 ? '—' : brl(a.valor)}</td>
                      <td>{a.url && <a href={a.url} target="_blank" rel="noopener noreferrer" className="gs-pend-link">ClickUp <ExternalLink size={12} aria-hidden="true" /></a>}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr><th colSpan={4}>Total</th><th className="gs-num">{brl(p.producao)}</th><th /></tr></tfoot>
              </table>
            </div>
          </details>
        </>
      )}
    </article>
  );
}

export default function GestaoEquipe() {
  const { sessao, setSessao, verificando, erro: erroSessao, sair } = useSessaoGestao();
  const [params, setParams] = useSearchParams();
  const pedido = params.get('mes') || '';
  const mes = /^\d{4}-(0[1-9]|1[0-2])$/.test(pedido) ? pedido : hojeSP().slice(0, 7);
  const [dados, setDados] = useState<Equipe | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => { document.title = 'Equipe e comissões · CareFit'; }, []);

  const carregar = useCallback(async (forcar = false) => {
    setCarregando(true); setErro('');
    try { setDados(await apiGestao<Equipe>(`equipe?mes=${mes}${forcar ? '&atualizar=1' : ''}`)); }
    catch (e) {
      if (e instanceof ApiError && e.status === 401) setSessao(null);
      setErro(e instanceof Error ? e.message : 'Falha na conexão.');
    } finally { setCarregando(false); }
  }, [mes, setSessao]);

  useEffect(() => { if (sessao?.financeiro) void carregar(); }, [sessao, carregar]);

  if (verificando) return <Carregando />;
  if (!sessao) return <TelaLogin titulo="Equipe e comissões" onEntrar={setSessao} aviso={erroSessao} />;
  if (!sessao.financeiro) return (
    <div className="gs-pagina">
      <Topo usuario={sessao.user} financeiro={sessao.financeiro} onSair={() => void sair()} />
      <main className="gs-casca gs-casca-estreita"><section className="gs-bloco"><h2>Sem acesso</h2><p>Produção e comissão da equipe são restritas. Fale com o Gustavo se precisar.</p><p><Link to="/gestao" className="gs-link">← Voltar à central</Link></p></section></main>
    </div>
  );

  const e = dados && dados.mes.referencia === mes ? dados : null;
  const mesAtual = hojeSP().slice(0, 7);
  const teto = e ? Math.max(1, ...e.profissionais.map(p => p.producao)) : 1;
  const tetoHistorico = e ? Math.max(1, ...e.historico.map(h => h.producao)) : 1;

  return (
    <div className="gs-pagina">
      <Topo usuario={sessao.user} financeiro={sessao.financeiro} onSair={() => void sair()} />
      <main className="gs-casca">
        <Titulo trilha="EQUIPE" titulo="Equipe" sub="Produção e comissões do mês">
          <div className="gs-controles gs-sem-impressao">
            <button type="button" className="gs-botao" onClick={() => void carregar(true)} disabled={carregando} title="Relê o ClickUp (no máximo uma vez por minuto)">
              <RefreshCw size={15} aria-hidden="true" className={carregando ? 'gs-girando' : ''} /> Atualizar
            </button>
            <button type="button" className="gs-botao" disabled={!e} onClick={() => window.print()}><Printer size={15} aria-hidden="true" /> Imprimir / PDF</button>
          </div>
        </Titulo>

        <section className="gs-semana">
          <div className="gs-semana-nav gs-sem-impressao">
            <button type="button" className="gs-botao-redondo" onClick={() => setParams({ mes: mesVizinho(mes, -1) })} aria-label="Mês anterior"><ChevronLeft size={18} aria-hidden="true" /></button>
            <div>
              <strong>{nomeMes(mes)}</strong>
              <small>{e ? (e.mes.emCurso ? `do dia 1 ao dia ${e.mes.diasCorridos} · mês em curso` : `${ddmm(e.mes.de)} a ${ddmm(e.mes.ate)} · mês fechado`) : '—'}</small>
            </div>
            <button type="button" className="gs-botao-redondo" onClick={() => setParams({ mes: mesVizinho(mes, 1) })} disabled={mes >= mesAtual} aria-label="Mês seguinte"><ChevronRight size={18} aria-hidden="true" /></button>
          </div>
          {mes !== mesAtual && <button type="button" className="gs-botao-fantasma gs-sem-impressao" onClick={() => setParams({})}>Ir para o mês atual</button>}
        </section>

        {erro && <p className="gs-erro" role="alert">{erro}</p>}
        {!e && !erro && <div className="gs-carregando-bloco" role="status">Lendo o ClickUp…</div>}

        {e && (
          <>
            <section className="gs-kpis">
              <Kpi destaque rotulo="PRODUÇÃO NO MÊS" valor={brlRedondo(e.totais.producao)}
                detalhe={e.mes.emCurso && e.totais.projecao.producao !== null ? `no ritmo atual, fecha em ${brlRedondo(e.totais.projecao.producao)}` : 'mês fechado'} />
              <Kpi verde rotulo="ATENDIMENTOS" valor={String(e.totais.atendimentos)}
                detalhe={`${e.totais.sessoes} sessões · ${e.fortalecimento.aulas + e.fortalecimento.faltas} fortalecimento · ${e.yoga.aulas + e.yoga.faltas} yoga`} />
              <Kpi rotulo="RECEBIDO POR ATENDIMENTO" valor={e.totais.porAtendimento === null ? '—' : brl(e.totais.porAtendimento)}
                detalhe={`média de tudo que foi atendido · ${e.totais.atletas} atletas`} />
              <Kpi rotulo="COMISSÃO A PAGAR" valor={brlRedondo(e.totais.aPagar)}
                detalhe={(e.totais.pesoDaEquipe !== null ? `${porcento(e.totais.pesoDaEquipe)} da produção` : '') + (e.totais.aConfirmar ? ` · ${e.totais.aConfirmar} sem regra` : '')} />
            </section>

            {e.foraDoNormal.quantidade > 0 && (
              <p className="gs-alerta-linha" role="alert">
                <CircleAlert size={16} aria-hidden="true" />
                <span>
                  {e.foraDoNormal.quantidade} sessão(ões) do mês com valor acima de R$ 1.000 — provável vírgula faltando no ClickUp. Ficaram fora da produção e da comissão:{' '}
                  {e.foraDoNormal.exemplos.map((x, i) => (
                    <span key={i}>{i > 0 && ' · '}{x.atleta} ({x.tipo}, {brl(x.valor)}){x.url && <> <a href={x.url} target="_blank" rel="noopener noreferrer" className="gs-aviso-link">corrigir</a></>}</span>
                  ))}
                </span>
              </p>
            )}

            <section className="gs-bloco">
              <h2>Quem atendeu em {nomeMes(mes)}</h2>
              <p className="gs-nota">Produção = soma do campo “Valor da sessão” das sessões com baixa de realizada. Comissão = regra registrada para cada pessoa; quem ainda não tem regra aparece sem número.</p>
              <div className="gs-equipe-grade">
                {e.profissionais.map(p => <CartaoPessoa key={p.nome} p={p} mes={mes} teto={teto} />)}
              </div>
            </section>

            <section className="gs-bloco">
              <h2>Bônus por volume</h2>
              <p className="gs-nota">R$ {e.bonus.porSessao} por sessão acima de {e.bonus.limite} no mês, contando todos os profissionais — vai para {e.bonus.de}.</p>
              <div className="gs-equipe-meta">
                <div className="gs-equipe-trilho" aria-hidden="true">
                  <span style={{ width: `${Math.min(100, (e.bonus.sessoes / e.bonus.limite) * 100)}%` }} />
                  <i style={{ left: '100%' }} />
                </div>
                <p>
                  <strong>{e.bonus.sessoes}</strong> sessões no mês.{' '}
                  {e.bonus.faltam > 0
                    ? <>Faltam <strong>{e.bonus.faltam}</strong> para começar o bônus.</>
                    : <>Bônus acumulado: <strong>{brl(e.bonus.valor)}</strong>.</>}
                </p>
              </div>
            </section>

            <section className="gs-bloco gs-duas">
              <div>
                <h2>Turmas</h2>
                <table className="gs-tabela">
                  <thead><tr><th>Turma</th><th className="gs-num">Aulas</th><th className="gs-num">Faltas</th><th className="gs-num">Alunos</th><th className="gs-num">Produção</th></tr></thead>
                  <tbody>
                    {[e.fortalecimento, e.yoga].map(t => (
                      <tr key={t.rotulo}><td>{t.rotulo}</td><td className="gs-num">{t.aulas}</td><td className="gs-num">{t.faltas}</td><td className="gs-num">{t.alunos}</td><td className="gs-num">{brl(t.producao)}</td></tr>
                    ))}
                  </tbody>
                </table>
                <p className="gs-nota">Falta em turma queima crédito do pacote, então entra na produção. As aulas não têm profissional no card: por isso não entram na comissão de ninguém.</p>
                {e.recebimento.aReceber.length > 0 && (
                  <div className="gs-pendencias">
                    <h3>A receber (“À Pagar (exceção)”) <span>{brl(e.recebimento.total)}</span></h3>
                    <ul>
                      {e.recebimento.aReceber.map((a, i) => (
                        <li key={(a.url || a.atleta) + i}>
                          <span className="gs-pend-data">{ddmm(a.data)}</span>
                          <span className="gs-pend-nome">{a.atleta}<em> · {a.tipo} · {primeiroNome(a.profissional)}</em></span>
                          <span className="gs-pend-status">{brl(a.valor)}</span>
                          {a.url && <a href={a.url} target="_blank" rel="noopener noreferrer" className="gs-pend-link">ClickUp <ExternalLink size={13} aria-hidden="true" /></a>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <h2>Como o dinheiro entrou</h2>
                {e.recebimento.formas.length === 0 ? <p className="gs-vazio">Nenhuma sessão no mês.</p> : (
                  <table className="gs-tabela">
                    <thead><tr><th>Forma</th><th className="gs-num">Sessões</th><th className="gs-num">Valor</th></tr></thead>
                    <tbody>
                      {e.recebimento.formas.map(f => (
                        <tr key={f.forma}><td>{f.forma}</td><td className="gs-num">{f.quantidade}</td><td className="gs-num">{brl(f.valor)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            <section className="gs-bloco">
              <h2>Seis meses</h2>
              <div className="gs-grafico gs-grafico-simples">
                <div className="gs-colunas gs-colunas-meses">
                  {e.historico.map(h => {
                    const ativa = h.mes === mes;
                    const altura = `${(h.producao / tetoHistorico) * 100}%`;
                    return (
                      <div key={h.mes} className={'gs-coluna' + (ativa ? ' gs-coluna-ativa' : '')} tabIndex={0}>
                        <div className="gs-coluna-area">
                          {ativa && <span className="gs-coluna-valor" style={{ bottom: altura }}>{brlRedondo(h.producao)}</span>}
                          <span className="gs-coluna-barra" style={{ height: altura }} />
                        </div>
                        <span className="gs-coluna-rotulo">{mesCurto(h.mes)}</span>
                        <div className="gs-dica" role="tooltip">
                          <strong>{nomeMes(h.mes)}</strong>
                          <span>Produção <b>{brl(h.producao)}</b></span>
                          <span>Atendimentos <b>{h.atendimentos}</b></span>
                          <span>Sessões <b>{h.sessoes}</b></span>
                          {Object.entries(h.porProfissional).sort((a, b) => b[1] - a[1]).map(([nome, valor]) => (
                            <span key={nome}>{primeiroNome(nome)} <b>{brlRedondo(valor)}</b></span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <details className="gs-detalhes">
                <summary>Ver em tabela</summary>
                <div className="gs-rolagem">
                  <table className="gs-tabela">
                    <thead><tr><th>Mês</th><th className="gs-num">Sessões</th><th className="gs-num">Turmas</th><th className="gs-num">Atendimentos</th><th className="gs-num">Produção</th></tr></thead>
                    <tbody>
                      {e.historico.map(h => (
                        <tr key={h.mes}><td>{nomeMes(h.mes)}</td><td className="gs-num">{h.sessoes}</td><td className="gs-num">{h.fortalecimento + h.yoga}</td><td className="gs-num"><strong>{h.atendimentos}</strong></td><td className="gs-num">{brl(h.producao)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </section>

            <p className="gs-rodape-nota">
              Fonte: ClickUp, só leitura{e.atualizadoEm ? ` · lido às ${hora(e.atualizadoEm)}` : ''}. O mês em curso conta até {ddmm(e.mes.limite)}.
            </p>
          </>
        )}
        <footer className="gs-rodape">CareFit Run Base · Dados protegidos por acesso individual</footer>
      </main>
    </div>
  );
}
