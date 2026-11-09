import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RefreshCw, Copy, Check, Printer, CircleAlert, ExternalLink } from 'lucide-react';
import { ApiError, apiGestao, Carregando, TelaLogin, Topo, useSessaoGestao } from './acesso';

type Grupo = { nome: string; quantidade: number; producao: number; cortesias: number };
type Pendencia = { data: string; atleta: string; status: string; url: string | null; profissional?: string; tipo?: string; lista?: string };
type Aulas = { realizadas: number; faltas: number; alunos: number; cortesias: number; producao: number; pendentes: Pendencia[]; porVir: number };
type SemanaResumo = { segunda: string; sessoes: number; fortalecimento: number; yoga: number; producao: number; atendimentos: number };
type Fechamento = {
  semana: { inicio: string; fim: string; encerrada: boolean; hoje: string };
  atualizadoEm: string | null;
  total: { atendimentos: number; producao: number };
  anterior: Omit<SemanaResumo, 'segunda'> & { segunda: string };
  sessoes: {
    realizadas: number; atletas: number; producao: number; cortesias: number; ticketMedio: number | null;
    porProfissional: Grupo[]; porTipo: Grupo[]; matriz: { profissional: string; porTipo: Record<string, number> }[];
    pendentes: Pendencia[]; porVir: number; canceladas: number;
  };
  fortalecimento: Aulas;
  yoga: Aulas;
  porDia: { data: string; sessoes: number; fortalecimento: number; yoga: number }[];
  historico: SemanaResumo[];
  mes: { referencia: string; ate: string; sessoes: number; bonusLivia: number; faltamParaBonus: number };
  semData: Pendencia[];
};

const TZ = 'America/Sao_Paulo';
const hojeSP = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
const somarDias = (iso: string, n: number) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const segundaDe = (iso: string) => { const d = new Date(iso + 'T12:00:00Z'); return somarDias(iso, -((d.getUTCDay() + 6) % 7)); };
// O fechamento é no domingo: no domingo abre a semana que termina hoje; nos outros
// dias, a última semana já fechada. A semana em andamento fica a um clique.
const semanaPadrao = () => { const hoje = hojeSP(); const seg = segundaDe(hoje); return somarDias(seg, 6) === hoje ? seg : somarDias(seg, -7); };

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
// No cartão de resumo os centavos só atrapalham a leitura; as tabelas mantêm o valor exato.
const brlRedondo = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0, minimumFractionDigits: 0 });
const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const nomeMes = (ref: string) => new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' }).format(new Date(ref + '-15T12:00:00Z'));
const hora = (iso: string | null) => (iso ? new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '');

function variacao(atual: number, anterior: number, moeda = false) {
  const d = Math.round((atual - anterior) * 100) / 100;
  if (d === 0) return 'igual à semana anterior';
  const valor = moeda ? brl(Math.abs(d)) : String(Math.abs(d));
  return `${d > 0 ? '▲' : '▼'} ${d > 0 ? '+' : '−'}${valor} vs semana anterior`;
}

function resumoTexto(f: Fechamento) {
  const linhas = [
    `*Fechamento CareFit — semana ${ddmm(f.semana.inicio)} a ${ddmm(f.semana.fim)}*`,
    '',
    `Atendimentos: ${f.total.atendimentos} (semana anterior: ${f.anterior.atendimentos})`,
    `Sessões: ${f.sessoes.realizadas}` + (f.sessoes.porProfissional.length ? ` — ${f.sessoes.porProfissional.map(p => `${p.nome} ${p.quantidade}`).join(' · ')}` : ''),
    f.sessoes.porTipo.length ? `Por tipo: ${f.sessoes.porTipo.map(t => `${t.nome} ${t.quantidade}`).join(' · ')}` : null,
    `Fortalecimento em turma: ${f.fortalecimento.realizadas} aula(s)` + (f.fortalecimento.faltas ? `, ${f.fortalecimento.faltas} falta(s)` : ''),
    `Yoga: ${f.yoga.realizadas} aula(s)` + (f.yoga.faltas ? `, ${f.yoga.faltas} falta(s)` : ''),
    `Produção: ${brl(f.total.producao)}`,
  ];
  const pend = f.sessoes.pendentes.length + f.fortalecimento.pendentes.length + f.yoga.pendentes.length;
  if (pend) linhas.push('', `Atenção: ${pend} atendimento(s) da semana ainda sem baixa no ClickUp.`);
  return linhas.filter(l => l !== null).join('\n');
}

function Kpi({ rotulo, valor, detalhe, destaque }: { rotulo: string; valor: string; detalhe?: string; destaque?: boolean }) {
  return (
    <div className={'gs-kpi' + (destaque ? ' gs-kpi-destaque' : '')}>
      <span>{rotulo}</span>
      <strong>{valor}</strong>
      {detalhe && <small>{detalhe}</small>}
    </div>
  );
}

function TabelaGrupos({ titulo, primeira, grupos }: { titulo: string; primeira: string; grupos: Grupo[] }) {
  const maior = Math.max(1, ...grupos.map(g => g.quantidade));
  const total = grupos.reduce((s, g) => s + g.quantidade, 0);
  return (
    <section className="gs-bloco">
      <h2>{titulo}</h2>
      {grupos.length === 0 ? <p className="gs-vazio">Nenhuma sessão realizada nesta semana.</p> : (
        <div className="gs-rolagem">
          <table className="gs-tabela">
            <thead><tr><th>{primeira}</th><th className="gs-num">Sessões</th><th className="gs-barra-col" aria-hidden="true" /><th className="gs-num">Cortesias</th><th className="gs-num">Produção</th></tr></thead>
            <tbody>
              {grupos.map(g => (
                <tr key={g.nome}>
                  <td>{g.nome}</td>
                  <td className="gs-num"><strong>{g.quantidade}</strong> <span className="gs-mudo">{Math.round((g.quantidade / total) * 100)}%</span></td>
                  <td className="gs-barra-col" aria-hidden="true"><span className="gs-barra" style={{ width: `${(g.quantidade / maior) * 100}%` }} /></td>
                  <td className="gs-num">{g.cortesias || '—'}</td>
                  <td className="gs-num">{brl(g.producao)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td>Total</td><td className="gs-num"><strong>{total}</strong></td><td className="gs-barra-col" /><td className="gs-num">{grupos.reduce((s, g) => s + g.cortesias, 0) || '—'}</td><td className="gs-num">{brl(grupos.reduce((s, g) => s + g.producao, 0))}</td></tr></tfoot>
          </table>
        </div>
      )}
    </section>
  );
}

function BlocoAulas({ titulo, aulas, unidade }: { titulo: string; aulas: Aulas; unidade: string }) {
  return (
    <section className="gs-bloco">
      <h2>{titulo}</h2>
      <dl className="gs-numeros">
        <div><dt>Aulas realizadas</dt><dd>{aulas.realizadas}</dd></div>
        <div><dt>Faltas</dt><dd>{aulas.faltas}</dd></div>
        <div><dt>{unidade} diferentes</dt><dd>{aulas.alunos}</dd></div>
        <div><dt>Produção</dt><dd>{brl(aulas.producao)}</dd></div>
      </dl>
      {aulas.cortesias > 0 && <p className="gs-nota">{aulas.cortesias} aula(s) cortesia (valor zero) entre as realizadas.</p>}
      {aulas.pendentes.length > 0 && <p className="gs-alerta-linha"><CircleAlert size={15} aria-hidden="true" /> {aulas.pendentes.length} aula(s) com data na semana ainda sem baixa — veja as pendências abaixo.</p>}
      {aulas.porVir > 0 && <p className="gs-nota">{aulas.porVir} aula(s) ainda por acontecer nesta semana.</p>}
    </section>
  );
}

function Tendencia({ historico, selecionada }: { historico: SemanaResumo[]; selecionada: string }) {
  const maior = Math.max(1, ...historico.map(h => h.atendimentos));
  const teto = Math.ceil(maior / 10) * 10;
  return (
    <section className="gs-bloco">
      <h2>Atendimentos nas últimas 8 semanas</h2>
      <p className="gs-nota">Sessões + aulas de fortalecimento + yoga realizadas. Passe o mouse (ou toque) numa coluna para ver a divisão.</p>
      <div className="gs-grafico" role="img" aria-label={`Atendimentos por semana: ${historico.map(h => `${ddmm(h.segunda)}: ${h.atendimentos}`).join('; ')}`}>
        <div className="gs-grafico-guia"><span>{teto}</span></div>
        <div className="gs-colunas">
          {historico.map(h => {
            const ativa = h.segunda === selecionada;
            const altura = `${(h.atendimentos / teto) * 100}%`;
            return (
              <div key={h.segunda} className={'gs-coluna' + (ativa ? ' gs-coluna-ativa' : '')} tabIndex={0}>
                <div className="gs-coluna-area">
                  {ativa && <span className="gs-coluna-valor" style={{ bottom: altura }}>{h.atendimentos}</span>}
                  <span className="gs-coluna-barra" style={{ height: altura }} />
                </div>
                <span className="gs-coluna-rotulo">{ddmm(h.segunda)}</span>
                <div className="gs-dica" role="tooltip">
                  <strong>Semana de {ddmm(h.segunda)}</strong>
                  <span>Atendimentos <b>{h.atendimentos}</b></span>
                  <span>Sessões <b>{h.sessoes}</b></span>
                  <span>Fortalecimento <b>{h.fortalecimento}</b></span>
                  <span>Yoga <b>{h.yoga}</b></span>
                  <span>Produção <b>{brl(h.producao)}</b></span>
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
            <thead><tr><th>Semana</th><th className="gs-num">Sessões</th><th className="gs-num">Fortalecimento</th><th className="gs-num">Yoga</th><th className="gs-num">Total</th><th className="gs-num">Produção</th></tr></thead>
            <tbody>{historico.map(h => <tr key={h.segunda}><td>{ddmm(h.segunda)} a {ddmm(somarDias(h.segunda, 6))}</td><td className="gs-num">{h.sessoes}</td><td className="gs-num">{h.fortalecimento}</td><td className="gs-num">{h.yoga}</td><td className="gs-num"><strong>{h.atendimentos}</strong></td><td className="gs-num">{brl(h.producao)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function ListaPendencias({ titulo, itens }: { titulo: string; itens: Pendencia[] }) {
  if (!itens.length) return null;
  return (
    <div className="gs-pendencias">
      <h3>{titulo} <span>{itens.length}</span></h3>
      <ul>
        {itens.map((p, i) => (
          <li key={(p.url || p.atleta) + i}>
            <span className="gs-pend-data">{p.data ? `${DIAS[(new Date(p.data + 'T12:00:00Z').getUTCDay() + 6) % 7]} ${ddmm(p.data)}` : 'sem data'}</span>
            <span className="gs-pend-nome">{p.atleta}{p.profissional && <em> · {p.profissional} · {p.tipo}</em>}{p.lista && <em> · {p.lista}</em>}</span>
            <span className="gs-pend-status">{p.status}</span>
            {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="gs-pend-link">ClickUp <ExternalLink size={13} aria-hidden="true" /></a>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GestaoFinanceiro() {
  const { sessao, setSessao, verificando, erro: erroSessao, sair } = useSessaoGestao();
  const [params, setParams] = useSearchParams();
  const semana = segundaDe(/^\d{4}-\d{2}-\d{2}$/.test(params.get('semana') || '') ? params.get('semana')! : semanaPadrao());
  const [dados, setDados] = useState<Fechamento | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [copiado, setCopiado] = useState(false);

  useEffect(() => { document.title = 'Fechamento semanal · CareFit'; }, []);

  const carregar = useCallback(async (forcar = false) => {
    setCarregando(true); setErro('');
    try { setDados(await apiGestao<Fechamento>(`fechamento?semana=${semana}${forcar ? '&atualizar=1' : ''}`)); }
    catch (e) {
      if (e instanceof ApiError && e.status === 401) setSessao(null);
      setErro(e instanceof Error ? e.message : 'Falha na conexão.');
    } finally { setCarregando(false); }
  }, [semana, setSessao]);

  useEffect(() => { if (sessao?.financeiro) void carregar(); }, [sessao, carregar]);

  const irPara = (seg: string) => { setParams({ semana: seg }); setCopiado(false); };
  const semanaAtual = segundaDe(hojeSP());
  const pendentes = useMemo(() => dados ? dados.sessoes.pendentes.length + dados.fortalecimento.pendentes.length + dados.yoga.pendentes.length : 0, [dados]);

  if (verificando) return <Carregando />;
  if (!sessao) return <TelaLogin titulo="Financeiro" onEntrar={setSessao} aviso={erroSessao} />;
  if (!sessao.financeiro) return (
    <div className="gs-pagina">
      <Topo usuario={sessao.user} onSair={() => void sair()} voltar />
      <main className="gs-casca gs-casca-estreita"><section className="gs-bloco"><h2>Sem acesso ao financeiro</h2><p>Seu usuário entra nos painéis da equipe, mas não no financeiro. Fale com o Gustavo se precisar.</p><p><Link to="/gestao" className="gs-link">← Voltar à central</Link></p></section></main>
    </div>
  );

  const f = dados && dados.semana.inicio === semana ? dados : null;

  return (
    <div className="gs-pagina">
      <Topo usuario={sessao.user} onSair={() => void sair()} voltar />
      <main className="gs-casca">
        <section className="gs-cabeca">
          <div>
            <span className="gs-eyebrow">FINANCEIRO · FECHAMENTO SEMANAL</span>
            <h1>Semana de {ddmm(semana)} a {ddmm(somarDias(semana, 6))}</h1>
            <p className="gs-sub">
              {f ? (f.semana.encerrada ? 'Semana encerrada.' : `Semana em andamento — fecha no domingo, ${ddmm(f.semana.fim)}.`) : 'Lendo o ClickUp…'}
              {f?.atualizadoEm && <> Dados do ClickUp lidos às {hora(f.atualizadoEm)}.</>}
            </p>
          </div>
          <div className="gs-controles gs-sem-impressao">
            <button type="button" className="gs-botao" onClick={() => irPara(somarDias(semana, -7))} disabled={carregando}><ChevronLeft size={16} aria-hidden="true" /> Anterior</button>
            <button type="button" className="gs-botao" onClick={() => irPara(somarDias(semana, 7))} disabled={carregando || semana >= semanaAtual}>Próxima <ChevronRight size={16} aria-hidden="true" /></button>
            <button type="button" className="gs-botao" onClick={() => void carregar(true)} disabled={carregando} title="Relê o ClickUp (no máximo uma vez por minuto)"><RefreshCw size={15} aria-hidden="true" className={carregando ? 'gs-girando' : ''} /> Atualizar</button>
            <button type="button" className="gs-botao" disabled={!f} onClick={async () => { if (!f) return; try { await navigator.clipboard.writeText(resumoTexto(f)); setCopiado(true); } catch { setErro('Não consegui copiar. Selecione o texto manualmente.'); } }}>{copiado ? <><Check size={15} aria-hidden="true" /> Copiado</> : <><Copy size={15} aria-hidden="true" /> Copiar resumo</>}</button>
            <button type="button" className="gs-botao" disabled={!f} onClick={() => window.print()}><Printer size={15} aria-hidden="true" /> Imprimir / PDF</button>
          </div>
        </section>

        {erro && <p className="gs-erro gs-bloco" role="alert">{erro}</p>}
        {!f && !erro && <div className="gs-carregando-bloco" role="status">Lendo sessões, aulas de fortalecimento e yoga no ClickUp… (leva alguns segundos na primeira vez)</div>}

        {f && (
          <>
            {pendentes > 0 && (
              <a href="#pendencias" className="gs-aviso">
                <CircleAlert size={18} aria-hidden="true" />
                <span><strong>Antes de fechar: {pendentes} atendimento(s) com data nesta semana ainda sem baixa no ClickUp.</strong> Eles só entram nos números quando o card vira “realizada” (ou “faltou”, na turma). Ver a lista →</span>
              </a>
            )}

            <section className="gs-kpis" aria-label="Resumo da semana">
              <Kpi destaque rotulo="Atendimentos" valor={String(f.total.atendimentos)} detalhe={variacao(f.total.atendimentos, f.anterior.atendimentos)} />
              <Kpi rotulo="Sessões" valor={String(f.sessoes.realizadas)} detalhe={`${f.sessoes.atletas} atletas · ${f.sessoes.cortesias} cortesia(s)`} />
              <Kpi rotulo="Fortalecimento (turma)" valor={String(f.fortalecimento.realizadas)} detalhe={f.fortalecimento.pendentes.length ? `${f.fortalecimento.pendentes.length} sem baixa` : `${f.fortalecimento.faltas} falta(s)`} />
              <Kpi rotulo="Yoga" valor={String(f.yoga.realizadas)} detalhe={f.yoga.pendentes.length ? `${f.yoga.pendentes.length} sem baixa` : `${f.yoga.faltas} falta(s)`} />
              <Kpi rotulo="Produção" valor={brlRedondo(f.total.producao)} detalhe={variacao(f.total.producao, f.anterior.producao, true)} />
              <Kpi rotulo="Ticket médio" valor={f.sessoes.ticketMedio === null ? '—' : brlRedondo(f.sessoes.ticketMedio)} detalhe="por sessão, sem cortesias" />
            </section>

            <div className="gs-duas">
              <TabelaGrupos titulo="Sessões por profissional" primeira="Profissional" grupos={f.sessoes.porProfissional} />
              <TabelaGrupos titulo="Sessões por tipo" primeira="Tipo de sessão" grupos={f.sessoes.porTipo} />
            </div>

            {f.sessoes.matriz.length > 0 && (
              <section className="gs-bloco">
                <h2>Profissional × tipo de sessão</h2>
                <div className="gs-rolagem">
                  <table className="gs-tabela gs-matriz">
                    <thead><tr><th>Profissional</th>{f.sessoes.porTipo.map(t => <th key={t.nome} className="gs-num">{t.nome}</th>)}<th className="gs-num">Total</th></tr></thead>
                    <tbody>{f.sessoes.matriz.map(m => (
                      <tr key={m.profissional}><td>{m.profissional}</td>{f.sessoes.porTipo.map(t => <td key={t.nome} className="gs-num">{m.porTipo[t.nome] || <span className="gs-mudo">·</span>}</td>)}<td className="gs-num"><strong>{Object.values(m.porTipo).reduce((s, n) => s + n, 0)}</strong></td></tr>
                    ))}</tbody>
                  </table>
                </div>
              </section>
            )}

            <div className="gs-duas">
              <BlocoAulas titulo="Fortalecimento em turma" aulas={f.fortalecimento} unidade="Alunos" />
              <BlocoAulas titulo="Yoga" aulas={f.yoga} unidade="Alunos" />
            </div>

            <section className="gs-bloco">
              <h2>Dia a dia</h2>
              <div className="gs-rolagem">
                <table className="gs-tabela gs-dias">
                  <thead><tr><th />{f.porDia.map((d, i) => <th key={d.data} className="gs-num">{DIAS[i]}<br /><span className="gs-mudo">{ddmm(d.data)}</span></th>)}<th className="gs-num">Semana</th></tr></thead>
                  <tbody>
                    {([['Sessões', 'sessoes'], ['Fortalecimento', 'fortalecimento'], ['Yoga', 'yoga']] as const).map(([rotulo, chave]) => (
                      <tr key={chave}><td>{rotulo}</td>{f.porDia.map(d => <td key={d.data} className="gs-num">{d[chave] || <span className="gs-mudo">·</span>}</td>)}<td className="gs-num"><strong>{f.porDia.reduce((s, d) => s + d[chave], 0)}</strong></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <Tendencia historico={f.historico} selecionada={f.semana.inicio} />

            <section className="gs-bloco gs-mes">
              <h2>Mês de {nomeMes(f.mes.referencia)} até {ddmm(f.mes.ate)}</h2>
              <dl className="gs-numeros">
                <div><dt>Sessões realizadas no mês</dt><dd>{f.mes.sessoes}</dd></div>
                <div><dt>Bônus Lívia até aqui</dt><dd>{brl(f.mes.bonusLivia)}</dd></div>
              </dl>
              <p className="gs-nota">
                Regra do bônus: R$ 15 por sessão que passar de 100 no mês, contando as sessões de todos os profissionais (lista Sessões Carefit, sem as aulas em turma).
                {f.mes.faltamParaBonus > 0 ? ` Faltam ${f.mes.faltamParaBonus} sessão(ões) para o bônus começar.` : ' O bônus já está correndo.'}
              </p>
            </section>

            <section className="gs-bloco" id="pendencias">
              <h2>Pendências de baixa</h2>
              {pendentes === 0 && !f.semData.length ? <p className="gs-vazio">Nada pendente: tudo o que tinha data nesta semana já está com baixa no ClickUp.</p> : (
                <>
                  <p className="gs-nota">Cards com data nesta semana (até hoje) que ainda não viraram “realizada”, “faltou” ou “cancelada”. Abra no ClickUp, dê a baixa e clique em Atualizar.</p>
                  <ListaPendencias titulo="Sessões" itens={f.sessoes.pendentes} />
                  <ListaPendencias titulo="Fortalecimento em turma" itens={f.fortalecimento.pendentes} />
                  <ListaPendencias titulo="Yoga" itens={f.yoga.pendentes} />
                  <ListaPendencias titulo="Realizadas sem data (não entram em semana nenhuma)" itens={f.semData} />
                </>
              )}
            </section>

            <p className="gs-rodape-nota">
              Produção = valor do plano rateado por sessão ou aula, como está no ClickUp. Não é caixa: não bate com o extrato do Inter. Falta na turma queima crédito e entra na produção; cortesia entra com valor zero.
              O profissional é o do campo “Físio Carefit Que Atende”, que vem do plano: se outro profissional atendeu e o card não foi trocado, a sessão aparece com o nome antigo.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
