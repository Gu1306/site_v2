import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calculator, CalendarDays, Dumbbell, Gauge, HandCoins, Home, ListChecks, LogOut, Megaphone, Users } from 'lucide-react';
import './gestao.css';

// Mesmo login e mesmo cookie dos painéis de fortalecimento e avaliação de força.
export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }

export async function apiGestao<T>(route: string, data?: unknown): Promise<T> {
  const response = await fetch('/api/gestao/' + route, {
    method: data === undefined ? 'GET' : 'POST',
    credentials: 'same-origin',
    headers: data === undefined ? {} : { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(60000),
  });
  let json: { error?: string } & T;
  try { json = await response.json(); } catch { throw new ApiError('O servidor não respondeu como esperado. Atualize a página.', response.status); }
  if (!response.ok) throw new ApiError(json.error || 'Não foi possível concluir.', response.status);
  return json;
}

export type Sessao = { user: string; financeiro: boolean };

export function useSessaoGestao() {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [verificando, setVerificando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    apiGestao<Sessao>('session')
      .then(setSessao)
      .catch(e => { if (!(e instanceof ApiError && e.status === 401)) setErro(e instanceof Error ? e.message : 'Falha na conexão.'); })
      .finally(() => setVerificando(false));
  }, []);

  const sair = useCallback(async () => {
    try { await apiGestao('logout', {}); } finally { setSessao(null); }
  }, []);

  return { sessao, setSessao, verificando, erro, sair };
}

export function TelaLogin({ titulo, onEntrar, aviso }: { titulo: string; onEntrar: (s: Sessao) => void; aviso?: string }) {
  const [form, setForm] = useState({ user: '', password: '' });
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState(aviso || '');
  return (
    <div className="gs-login">
      <form onSubmit={async e => {
        e.preventDefault(); setOcupado(true); setErro('');
        try {
          await apiGestao('login', form);
          onEntrar(await apiGestao<Sessao>('session'));
        } catch (err) { setErro(err instanceof Error ? err.message : 'Falha na conexão.'); }
        finally { setOcupado(false); setForm(f => ({ ...f, password: '' })); }
      }}>
        <span className="gs-eyebrow">CAREFIT · ESPAÇO PROTEGIDO</span>
        <h1>{titulo}</h1>
        <p>Acesso restrito à equipe CareFit.</p>
        <label>Usuário<input autoComplete="username" required value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} /></label>
        <label>Senha<input type="password" autoComplete="current-password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        {erro && <p className="gs-erro" role="alert">{erro}</p>}
        <button type="submit" className="gs-botao gs-botao-cheio" disabled={ocupado}>{ocupado ? 'Entrando…' : 'Entrar'}</button>
      </form>
    </div>
  );
}

// Menu lateral da central: uma linha por área. Área nova = linha nova aqui (e cartão em GestaoInicio).
// `breve` = ainda não existe; aparece apagada para mostrar o rumo da central.
export type AreaMenu = { chave: string; para: string; titulo: string; icone: typeof Home; soFinanceiro?: boolean; breve?: boolean; externa?: boolean };
export const AREAS: AreaMenu[] = [
  { chave: 'inicio', para: '/gestao', titulo: 'Início', icone: Home },
  { chave: 'financeiro', para: '/gestao/financeiro', titulo: 'Financeiro', icone: BarChart3, soFinanceiro: true },
  { chave: 'equipe', para: '/gestao/equipe', titulo: 'Equipe', icone: HandCoins, soFinanceiro: true },
  { chave: 'campanha', para: '/gestao/campanha', titulo: 'Campanha', icone: Calculator, soFinanceiro: true },
  { chave: 'fortalecimento', para: '/painel-fortalecimento', titulo: 'Fortalecimento', icone: Dumbbell, externa: true },
  { chave: 'forca', para: '/painel-avaliacao-forca', titulo: 'Avaliação de força', icone: Gauge, externa: true },
  { chave: 'tarefas', para: '#', titulo: 'Tarefas', icone: ListChecks, breve: true },
  { chave: 'agenda', para: '#', titulo: 'Agenda', icone: CalendarDays, breve: true },
  { chave: 'conteudo', para: '#', titulo: 'Conteúdo', icone: Megaphone, breve: true },
  { chave: 'atletas', para: '#', titulo: 'Atletas', icone: Users, breve: true },
];

const primeiroNome = (u: string) => u.charAt(0).toUpperCase() + u.slice(1).split(/[.\s_-]/)[0];

/** Barra lateral da central. As páginas continuam chamando `Topo` (nome antigo); o `voltar` não é mais usado. */
export function Topo({ usuario, financeiro, onSair, children }: { usuario: string; financeiro?: boolean; onSair: () => void; voltar?: boolean; children?: ReactNode }) {
  const { pathname } = useLocation();
  const [aberto, setAberto] = useState(false);
  useEffect(() => { setAberto(false); }, [pathname]);
  return (
    <>
      <button type="button" className="gs-menu-botao gs-sem-impressao" aria-expanded={aberto} aria-controls="gs-lateral" onClick={() => setAberto(a => !a)}>Menu</button>
      <aside id="gs-lateral" className={'gs-lateral gs-sem-impressao' + (aberto ? ' gs-lateral-aberta' : '')}>
        <Link to="/gestao" className="gs-marca" aria-label="CareFit Run Base, central de gestão">
          <span className="gs-marca-selo" aria-hidden="true">C</span>
          <span>CareFit <em>run base</em></span>
        </Link>
        <div className="gs-pessoa">
          <span className="gs-avatar" aria-hidden="true">{usuario.charAt(0).toUpperCase()}</span>
          <span><strong>{primeiroNome(usuario)}</strong><small>equipe CareFit</small></span>
        </div>
        <span className="gs-lateral-rotulo">SUA CENTRAL</span>
        <nav className="gs-nav" aria-label="Áreas da central">
          {AREAS.filter(a => financeiro || !a.soFinanceiro).map(a => {
            const ativa = a.para !== '#' && (a.para === '/gestao' ? pathname === '/gestao' : pathname.startsWith(a.para));
            if (a.breve) return <span key={a.chave} className="gs-nav-item gs-nav-breve" title="Em breve"><a.icone size={16} aria-hidden="true" />{a.titulo}<i>em breve</i></span>;
            if (a.externa) return <a key={a.chave} href={a.para} className="gs-nav-item"><a.icone size={16} aria-hidden="true" />{a.titulo}</a>;
            return <Link key={a.chave} to={a.para} className={'gs-nav-item' + (ativa ? ' gs-nav-ativa' : '')} aria-current={ativa ? 'page' : undefined}><a.icone size={16} aria-hidden="true" />{a.titulo}</Link>;
          })}
        </nav>
        {children}
        <button type="button" className="gs-nav-item gs-sair" onClick={onSair}><LogOut size={16} aria-hidden="true" /> Sair</button>
      </aside>
      {aberto && <div className="gs-lateral-fundo" onClick={() => setAberto(false)} aria-hidden="true" />}
    </>
  );
}

/** Trilha + título serifado + subtítulo em itálico, como no cabeçalho de cada área. */
export function Titulo({ trilha, titulo, sub, children }: { trilha: string; titulo: string; sub: string; children?: ReactNode }) {
  return (
    <section className="gs-cabeca">
      <div>
        <span className="gs-trilha">CAREFIT <b>/</b> {trilha}</span>
        <h1>{titulo} <em>{sub}</em></h1>
      </div>
      {children}
    </section>
  );
}

export const Carregando = () => <div className="gs-carregando" role="status">Carregando…</div>;
