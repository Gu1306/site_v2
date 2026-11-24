import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, ExternalLink, RefreshCw } from 'lucide-react';
import { ApiError, apiGestao, Carregando, TelaLogin, Titulo, Topo, useSessaoGestao } from './acesso';

type Estado = { estado: string; onde: string };
type Post = {
  quando: string; chave: string; texto: string; titulo: string; formato: string;
  ig: Estado; fb: Estado; tt: Estado; link: string | null; passado: boolean;
};
type Aviso = { quando: string; titulo: string };
type Conteudo = {
  atualizadoEm: string; inicio: string; fim: string; dias: number;
  posts: Post[];
  resumo: { total: number; completos: number; semEspelho: Aviso[]; rascunhos: Aviso[] };
  fontes: { postiz: boolean; buffer: boolean; feed: boolean };
  avisos: string[];
};

const TZ = 'America/Sao_Paulo';
const SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const horaBrt = (iso: string) => new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
/** Data em Brasília como 'YYYY-MM-DD', para agrupar por dia sem o fuso do navegador atrapalhar. */
const diaBrt = (iso: string) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date(iso));
const ddmm = (dia: string) => `${dia.slice(8, 10)}/${dia.slice(5, 7)}`;

/** Classe do chip pelo estado, no vocabulário de cor do tema. */
const CLASSE: Record<string, string> = {
  publicado: 'gs-ct-ok', agendado: 'gs-ct-prog', rascunho: 'gs-ct-atencao',
  'não vai': 'gs-ct-falta', 'não saiu': 'gs-ct-neutro', erro: 'gs-ct-falta',
};

function Chip({ rede, estado }: { rede: string; estado: Estado }) {
  return (
    <li className={'gs-ct-chip ' + (CLASSE[estado.estado] || 'gs-ct-neutro')} title={estado.onde || undefined}>
      <b>{rede}</b><span>{estado.estado}</span>
    </li>
  );
}

function Dia({ dia, posts, hoje }: { dia: string; posts: Post[]; hoje: string }) {
  const d = new Date(dia + 'T12:00:00Z');
  return (
    <section className={'gs-ct-dia' + (dia === hoje ? ' gs-ct-hoje' : '') + (posts.length ? '' : ' gs-ct-livre')}>
      <div className="gs-ct-data">
        <span className="gs-ct-sem">{SEM[d.getUTCDay()]}{dia === hoje ? ' · hoje' : ''}</span>
        <span className="gs-ct-num">{dia.slice(8, 10)}</span>
        <span className="gs-ct-mes">{MES[d.getUTCMonth()]}</span>
      </div>
      <div className="gs-ct-posts">
        {posts.length === 0 && <p className="gs-ct-vazio">sem post</p>}
        {posts.map(p => (
          <article key={p.chave} className={'gs-ct-post' + (p.passado ? ' gs-ct-passado' : '')}>
            <p className="gs-ct-meta">
              <time>{horaBrt(p.quando)}</time>
              {p.formato && <> · {p.formato}</>}
              {p.ig.estado === 'publicado' && p.ig.onde && <> · {p.ig.onde}</>}
              {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer">ver no Instagram <ExternalLink size={12} aria-hidden="true" /></a>}
            </p>
            <h3>{p.titulo || '(sem texto)'}</h3>
            <ul className="gs-ct-chips">
              <Chip rede="Instagram" estado={p.ig} />
              <Chip rede="Facebook" estado={p.fb} />
              <Chip rede="TikTok" estado={p.tt} />
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function GestaoConteudo() {
  const { sessao, setSessao, verificando, erro: erroSessao, sair } = useSessaoGestao();
  const [dados, setDados] = useState<Conteudo | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => { document.title = 'Conteúdo · CareFit'; }, []);

  const carregar = useCallback(async (forcar = false) => {
    setCarregando(true); setErro('');
    try { setDados(await apiGestao<Conteudo>(`conteudo${forcar ? '?atualizar=1' : ''}`)); }
    catch (e) {
      if (e instanceof ApiError && e.status === 401) setSessao(null);
      setErro(e instanceof Error ? e.message : 'Falha na conexão.');
    } finally { setCarregando(false); }
  }, [setSessao]);

  useEffect(() => { if (sessao?.financeiro) void carregar(); }, [sessao, carregar]);

  if (verificando) return <Carregando />;
  if (!sessao) return <TelaLogin titulo="Conteúdo" onEntrar={setSessao} aviso={erroSessao} />;
  if (!sessao.financeiro) return (
    <div className="gs-pagina">
      <Topo usuario={sessao.user} financeiro={sessao.financeiro} onSair={() => void sair()} />
      <main className="gs-casca gs-casca-estreita"><section className="gs-bloco"><h2>Sem acesso</h2><p>O painel de conteúdo é restrito. Fale com o Gustavo se precisar.</p><p><Link to="/gestao" className="gs-link">← Voltar à central</Link></p></section></main>
    </div>
  );

  // Os dias saem da janela que o servidor devolveu, para o calendário não ter buraco.
  const dias: string[] = [];
  if (dados) {
    const primeiro = new Date(diaBrt(dados.inicio) + 'T12:00:00Z');
    for (let d = 0; d < dados.dias; d += 1) {
      dias.push(new Date(primeiro.getTime() + d * 86400000).toISOString().slice(0, 10));
    }
  }
  const hoje = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
  const porDia = (dia: string) => (dados?.posts || []).filter(p => diaBrt(p.quando) === dia);

  return (
    <div className="gs-pagina">
      <Topo usuario={sessao.user} financeiro={sessao.financeiro} onSair={() => void sair()} />
      <main className="gs-casca">
        <Titulo trilha="CONTEÚDO" titulo="Conteúdo" sub="O que sai nas próximas duas semanas, e o que já saiu">
          <button type="button" className="gs-botao gs-sem-impressao" onClick={() => void carregar(true)} disabled={carregando}>
            <RefreshCw size={15} aria-hidden="true" /> {carregando ? 'Atualizando…' : 'Atualizar'}
          </button>
        </Titulo>

        {erro && <p className="gs-aviso"><CircleAlert size={16} aria-hidden="true" /> {erro}</p>}
        {carregando && !dados && <div className="gs-carregando-bloco">Lendo Postiz, Buffer e o feed do Instagram…</div>}

        {dados && (
          <>
            <section className="gs-bloco">
              <div className="gs-kpis">
                <div className="gs-kpi"><span>POSTS NA JANELA</span><strong>{dados.resumo.total}</strong></div>
                <div className="gs-kpi gs-kpi-verde"><span>NAS TRÊS REDES</span><strong>{dados.resumo.completos}</strong></div>
                <div className={'gs-kpi' + (dados.resumo.semEspelho.length ? ' gs-kpi-destaque' : '')}>
                  <span>SEM FACEBOOK/TIKTOK</span><strong>{dados.resumo.semEspelho.length}</strong>
                </div>
              </div>
              <p className="gs-ct-fonte">
                Instagram pelo Postiz · Facebook e TikTok pelo Buffer · "publicado" vem do feed real da conta.
                {' '}Lido às {horaBrt(dados.atualizadoEm)}.
              </p>
            </section>

            {dados.avisos.length > 0 && (
              <section className="gs-bloco">
                {dados.avisos.map(a => <p key={a} className="gs-aviso"><CircleAlert size={16} aria-hidden="true" /> {a}</p>)}
              </section>
            )}

            {(dados.resumo.semEspelho.length > 0 || dados.resumo.rascunhos.length > 0) && (
              <section className="gs-bloco">
                {dados.resumo.semEspelho.length > 0 && (
                  <p className="gs-alerta-linha"><b>Sem Facebook/TikTok:</b>{' '}
                    {dados.resumo.semEspelho.map(i => `${ddmm(diaBrt(i.quando))} ${horaBrt(i.quando)} ${i.titulo}`).join(' · ')}</p>
                )}
                {dados.resumo.rascunhos.length > 0 && (
                  <p className="gs-alerta-linha"><b>Rascunho (não sai sozinho):</b>{' '}
                    {dados.resumo.rascunhos.map(i => `${ddmm(diaBrt(i.quando))} ${i.titulo}`).join(' · ')}</p>
                )}
              </section>
            )}

            <section className="gs-bloco">
              {dias.map((dia, indice) => (
                <div key={dia}>
                  {(indice === 0 || indice === 7) && (
                    <h2 className="gs-ct-semana">
                      {indice === 0 ? 'Esta semana' : 'Semana seguinte'}
                      <span>{ddmm(dia)} a {ddmm(dias[Math.min(indice + 6, dias.length - 1)])}</span>
                    </h2>
                  )}
                  <Dia dia={dia} posts={porDia(dia)} hoje={hoje} />
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
