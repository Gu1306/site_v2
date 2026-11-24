import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, ExternalLink, MessageCircle, Printer, RefreshCw } from 'lucide-react';
import { ApiError, apiGestao, Carregando, TelaLogin, Titulo, Topo, useSessaoGestao } from './acesso';

type Pessoa = {
  id: string; nome: string; url: string | null; fisio: string | null; plano: string | null;
  valorPlano: number | null; valorSuspeito: number | null; ultima: string | null; proxima: string | null;
  restam: number; feitas: number; fimDoPlano: string | null; entrada: boolean;
  motivo?: string; diasAteFim?: number | null; diasParado?: number; pagamento?: string;
};
type Carteira = {
  limites: { poucasSessoes: number; planoTerminaEm: number; sumidoDias: number; finalizadoDias: number };
  resumo: { total: number; ativos: number; leads: number; finalizados: number; inativos: number; emRisco: number; aCobrar: number };
  renovacao: Pessoa[]; sumidos: Pessoa[]; pagamento: Pessoa[]; finalizados: Pessoa[];
  valoresSuspeitos: { quantidade: number; exemplos: { nome: string; valor: number; plano: string | null; url: string | null }[] };
};
type Conversa = {
  motivo: 'sem_resposta' | 'esfriou'; nome: string; final: string; link: string | null; noCrm: boolean;
  status: string | null; fisio: string | null; ultimaSessao: string | null; proximaSessao: string | null;
  horas: number; dias: number; quem: 'contato' | 'carefit'; previa: string; em: string;
};
type WhatsApp = {
  regras: { janelaDias: number; semRespostaHoras: number; esfriouDias: number };
  resumo: { conversas: number; emDia: number; semEntradaRecente: number; semResposta: number; esfriou: number; comSessaoMarcada: number };
  fila: Conversa[]; atualizadoEm: string;
};
type Operacao = { hoje: string; atualizadoEm: string; carteira: Carteira; whatsapp: WhatsApp | null; whatsappErro: string | null };

const TZ = 'America/Sao_Paulo';
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const brlRedondo = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0, minimumFractionDigits: 0 });
const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const hora = (iso: string | null) => (iso ? new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '');
const espera = (c: Conversa) => (c.horas < 24 ? `${c.horas} h` : `${Math.round(c.horas / 24)} dias`);
/** Data de término do plano: pode já ter passado, e aí o texto muda. */
const prazo = (dias: number | null | undefined) => {
  if (dias === null || dias === undefined) return '';
  if (dias < 0) return ` · plano terminou há ${Math.abs(dias)} dias`;
  if (dias === 0) return ' · plano termina hoje';
  return ` · termina em ${dias} dias`;
};

const MOTIVOS: Record<string, string> = {
  sem_sessao_marcada: 'sem nada marcado',
  ultimas_sessoes: 'últimas sessões do plano',
  plano_termina: 'plano termina logo',
};

function Kpi({ rotulo, valor, detalhe, destaque, verde }: { rotulo: string; valor: string; detalhe?: string; destaque?: boolean; verde?: boolean }) {
  return (
    <div className={'gs-kpi' + (destaque ? ' gs-kpi-destaque' : '') + (verde ? ' gs-kpi-verde' : '')}>
      <span>{rotulo}</span>
      <strong>{valor}</strong>
      {detalhe && <small>{detalhe}</small>}
    </div>
  );
}

const MOSTRAR = 8; // uma lista longa some com a tela: o resto fica a um clique

/** Uma lista de gente com o porquê e o link do card. */
function Lista({ titulo, nota, pessoas, detalhe, vazio }: { titulo: string; nota?: string; pessoas: Pessoa[]; detalhe: (p: Pessoa) => string; vazio: string }) {
  const [tudo, setTudo] = useState(false);
  if (!pessoas.length) return (
    <div className="gs-fila-grupo">
      <h3>{titulo} <span>0</span></h3>
      <p className="gs-vazio">{vazio}</p>
    </div>
  );
  const visiveis = tudo ? pessoas : pessoas.slice(0, MOSTRAR);
  return (
    <div className="gs-fila-grupo">
      <h3>{titulo} <span>{pessoas.length}</span></h3>
      {nota && <p className="gs-nota">{nota}</p>}
      <ul className="gs-fila">
        {visiveis.map(p => (
          <li key={p.id}>
            <span className="gs-fila-nome">{p.nome}{p.fisio && <em> · {p.fisio}</em>}</span>
            <span className="gs-fila-detalhe">{detalhe(p)}</span>
            <span className="gs-fila-valor">
              {p.valorPlano !== null ? brl(p.valorPlano) : p.valorSuspeito !== null ? <b className="gs-pendente" title="Valor digitado errado no ClickUp">valor a conferir</b> : '—'}
            </span>
            {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="gs-pend-link">ClickUp <ExternalLink size={13} aria-hidden="true" /></a>}
          </li>
        ))}
      </ul>
      {pessoas.length > MOSTRAR && (
        <button type="button" className="gs-botao-fantasma gs-ver-mais gs-sem-impressao" onClick={() => setTudo(t => !t)}>
          {tudo ? 'Mostrar menos' : `Ver os outros ${pessoas.length - MOSTRAR}`}
        </button>
      )}
    </div>
  );
}

function FilaWhatsApp({ w, erro }: { w: WhatsApp | null; erro: string | null }) {
  const [aba, setAba] = useState<'sem_resposta' | 'esfriou'>('sem_resposta');
  const [tudo, setTudo] = useState(false);
  if (!w) return (
    <section className="gs-bloco">
      <h2>WhatsApp</h2>
      <p className="gs-nota">{erro || 'WhatsApp não lido.'}</p>
    </section>
  );
  const todas = w.fila.filter(c => c.motivo === aba);
  const lista = tudo ? todas : todas.slice(0, MOSTRAR);
  const quantos = (m: string) => w.fila.filter(c => c.motivo === m).length;
  return (
    <section className="gs-bloco">
      <h2>WhatsApp</h2>
      <p className="gs-nota">
        Leitura do número oficial da CareFit, só leitura — nada é respondido automaticamente.
        {' '}{w.resumo.conversas} conversa(s) nos últimos {w.regras.janelaDias} dias, {w.resumo.emDia} em dia
        {w.resumo.comSessaoMarcada > 0 && <> e {w.resumo.comSessaoMarcada} já com sessão marcada</>}.
      </p>
      <div className="gs-abas gs-sem-impressao" role="tablist">
        <button type="button" role="tab" aria-selected={aba === 'sem_resposta'} className={aba === 'sem_resposta' ? 'gs-aba-ativa' : ''} onClick={() => { setAba('sem_resposta'); setTudo(false); }}>
          Esperando resposta <span>{quantos('sem_resposta')}</span>
        </button>
        <button type="button" role="tab" aria-selected={aba === 'esfriou'} className={aba === 'esfriou' ? 'gs-aba-ativa' : ''} onClick={() => { setAba('esfriou'); setTudo(false); }}>
          Esfriou <span>{quantos('esfriou')}</span>
        </button>
      </div>
      {lista.length === 0 ? (
        <p className="gs-vazio">{aba === 'sem_resposta' ? 'Ninguém esperando resposta há mais de ' + w.regras.semRespostaHoras + ' h. Caixa limpa.' : 'Ninguém parou de responder nos últimos dias.'}</p>
      ) : (
        <ul className="gs-conversas">
          {lista.map((c, i) => (
            <li key={c.final + i}>
              <div className="gs-conversa-topo">
                <strong>{c.nome}</strong>
                <small>…{c.final}{c.noCrm ? ` · ${c.status}` : ' · fora do CRM'}{c.fisio ? ` · ${c.fisio}` : ''}</small>
                <b className={c.horas >= 24 ? 'gs-pendente' : ''}>{espera(c)}</b>
              </div>
              <p className="gs-conversa-previa">
                <span>{c.quem === 'contato' ? 'ele(a):' : 'nós:'}</span> {c.previa}
              </p>
              <div className="gs-conversa-pe">
                <small>
                  {c.ultimaSessao ? `última sessão ${ddmm(c.ultimaSessao)}` : 'sem sessão registrada'}
                  {c.proximaSessao && ` · próxima ${ddmm(c.proximaSessao)}`}
                </small>
                {c.link && <a href={c.link} target="_blank" rel="noopener noreferrer" className="gs-botao"><MessageCircle size={14} aria-hidden="true" /> Abrir conversa</a>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {todas.length > MOSTRAR && (
        <button type="button" className="gs-botao-fantasma gs-ver-mais gs-sem-impressao" onClick={() => setTudo(t => !t)}>
          {tudo ? 'Mostrar menos' : `Ver as outras ${todas.length - MOSTRAR}`}
        </button>
      )}
    </section>
  );
}

export default function GestaoOperacao() {
  const { sessao, setSessao, verificando, erro: erroSessao, sair } = useSessaoGestao();
  const [dados, setDados] = useState<Operacao | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => { document.title = 'Operação do dia · CareFit'; }, []);

  const carregar = useCallback(async (forcar = false) => {
    setCarregando(true); setErro('');
    try { setDados(await apiGestao<Operacao>(`operacao${forcar ? '?atualizar=1' : ''}`)); }
    catch (e) {
      if (e instanceof ApiError && e.status === 401) setSessao(null);
      setErro(e instanceof Error ? e.message : 'Falha na conexão.');
    } finally { setCarregando(false); }
  }, [setSessao]);

  useEffect(() => { if (sessao?.financeiro) void carregar(); }, [sessao, carregar]);

  if (verificando) return <Carregando />;
  if (!sessao) return <TelaLogin titulo="Operação do dia" onEntrar={setSessao} aviso={erroSessao} />;
  if (!sessao.financeiro) return (
    <div className="gs-pagina">
      <Topo usuario={sessao.user} financeiro={sessao.financeiro} onSair={() => void sair()} />
      <main className="gs-casca gs-casca-estreita"><section className="gs-bloco"><h2>Sem acesso</h2><p>A carteira de atletas é restrita. Fale com o Gustavo se precisar.</p><p><Link to="/gestao" className="gs-link">← Voltar à central</Link></p></section></main>
    </div>
  );

  const o = dados;
  const c = o?.carteira;
  const esperando = o?.whatsapp?.fila.filter(f => f.motivo === 'sem_resposta').length ?? 0;

  return (
    <div className="gs-pagina">
      <Topo usuario={sessao.user} financeiro={sessao.financeiro} onSair={() => void sair()} />
      <main className="gs-casca">
        <Titulo trilha="OPERAÇÃO" titulo="Operação" sub="O que precisa de você hoje">
          <div className="gs-controles gs-sem-impressao">
            <button type="button" className="gs-botao" onClick={() => void carregar(true)} disabled={carregando} title="Relê o ClickUp e o WhatsApp (no máximo uma vez por minuto)">
              <RefreshCw size={15} aria-hidden="true" className={carregando ? 'gs-girando' : ''} /> Atualizar
            </button>
            <button type="button" className="gs-botao" disabled={!o} onClick={() => window.print()}><Printer size={15} aria-hidden="true" /> Imprimir / PDF</button>
          </div>
        </Titulo>

        {erro && <p className="gs-erro" role="alert">{erro}</p>}
        {!o && !erro && <div className="gs-carregando-bloco" role="status">Lendo o ClickUp e o WhatsApp…</div>}

        {o && c && (
          <>
            <section className="gs-kpis">
              <Kpi destaque rotulo="ESPERANDO RESPOSTA" valor={o.whatsapp ? String(esperando) : '—'}
                detalhe={o.whatsapp ? `${o.whatsapp.resumo.esfriou} conversa(s) esfriaram` : (o.whatsappErro || 'WhatsApp não lido')} />
              <Kpi verde rotulo="PARA RENOVAR" valor={String(c.renovacao.length)}
                detalhe={`${c.resumo.ativos} atletas ativos na carteira`} />
              <Kpi rotulo="SUMIRAM" valor={String(c.sumidos.length)}
                detalhe={`ativos sem sessão há mais de ${c.limites.sumidoDias} dias`} />
              <Kpi rotulo="A COBRAR" valor={brlRedondo(c.resumo.aCobrar)}
                detalhe={`${c.pagamento.length} plano(s) com pagamento em aberto`} />
            </section>

            {c.valoresSuspeitos.quantidade > 0 && (
              <p className="gs-alerta-linha" role="alert">
                <CircleAlert size={16} aria-hidden="true" />
                <span>
                  {c.valoresSuspeitos.quantidade} atleta(s) com “Valor total do plano” acima de R$ 20.000 — provável vírgula faltando. Ficaram fora das somas:{' '}
                  {c.valoresSuspeitos.exemplos.map((x, i) => (
                    <span key={i}>{i > 0 && ' · '}{x.nome} ({brl(x.valor)}){x.url && <> <a href={x.url} target="_blank" rel="noopener noreferrer" className="gs-aviso-link">corrigir</a></>}</span>
                  ))}
                </span>
              </p>
            )}

            <FilaWhatsApp w={o.whatsapp} erro={o.whatsappErro} />

            <section className="gs-bloco">
              <h2>Carteira</h2>
              <p className="gs-nota">
                {c.resumo.ativos} ativos · {c.resumo.finalizados} com plano finalizado · {c.resumo.leads} leads · {c.resumo.inativos} inativos.
                {' '}{brl(c.resumo.emRisco)} em planos que dependem de uma conversa acontecer.
              </p>
              <div className="gs-duas">
                <Lista
                  titulo="Fechar plano"
                  nota="Fizeram a porta de entrada (dupla, avaliação, avulsa) e ainda não compraram plano."
                  pessoas={c.renovacao.filter(p => p.entrada)}
                  detalhe={p => `${MOTIVOS[p.motivo || ''] || p.motivo} · ${p.plano || 'sem plano'} · última ${p.ultima ? ddmm(p.ultima) : '—'}`}
                  vazio="Ninguém parado depois da primeira sessão."
                />
                <Lista
                  titulo="Renovar plano"
                  nota={`Plano acabando: ${c.limites.poucasSessoes} sessão(ões) ou menos, ou término em até ${c.limites.planoTerminaEm} dias.`}
                  pessoas={c.renovacao.filter(p => !p.entrada)}
                  detalhe={p => `restam ${p.restam} · ${p.plano || 'sem plano'}${prazo(p.diasAteFim)}`}
                  vazio="Nenhum plano ativo chegando ao fim."
                />
              </div>
              <div className="gs-duas">
                <Lista
                  titulo="Sumiram"
                  nota={`Ativos sem sessão realizada há mais de ${c.limites.sumidoDias} dias e sem nada marcado.`}
                  pessoas={c.sumidos}
                  detalhe={p => `${p.diasParado} dias parado · última ${p.ultima ? ddmm(p.ultima) : '—'} · ${p.feitas} sessão(ões) no total`}
                  vazio="Ninguém sumido entre os ativos."
                />
                <Lista
                  titulo="Pagamento em aberto"
                  nota="Status de pagamento “Pendente” ou “Atrasado” no CRM."
                  pessoas={c.pagamento}
                  detalhe={p => `${p.pagamento} · ${p.plano || 'sem plano'} · última ${p.ultima ? ddmm(p.ultima) : '—'}`}
                  vazio="Nada em aberto."
                />
              </div>
              <Lista
                titulo="Terminaram o plano e não voltaram"
                nota={`Fecharam o plano nos últimos ${c.limites.finalizadoDias} dias e não têm nada marcado — a fila natural de reativação.`}
                pessoas={c.finalizados}
                detalhe={p => `${p.diasParado} dias desde a última · ${p.plano || 'sem plano'} · ${p.feitas} sessão(ões)`}
                vazio="Ninguém nessa situação."
              />
            </section>

            <p className="gs-rodape-nota">
              Fonte: ClickUp (CRM e sessões) e WhatsApp da CareFit, só leitura · lido às {hora(o.atualizadoEm)}
              {o.whatsapp && ` · WhatsApp às ${hora(o.whatsapp.atualizadoEm)}`}. Nenhuma mensagem é enviada por esta página.
            </p>
          </>
        )}
        <footer className="gs-rodape">CareFit Run Base · Dados protegidos por acesso individual</footer>
      </main>
    </div>
  );
}
