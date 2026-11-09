import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
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

export function Topo({ usuario, onSair, voltar, children }: { usuario: string; onSair: () => void; voltar?: boolean; children?: ReactNode }) {
  return (
    <header className="gs-topo gs-sem-impressao">
      <div className="gs-topo-marca">
        <Link to="/gestao" className="gs-wordmark">CAREFIT <b>RUN BASE</b></Link>
        <span className="gs-contexto">{voltar ? <Link to="/gestao"><ChevronLeft size={13} aria-hidden="true" /> CENTRAL DE GESTÃO</Link> : <><i aria-hidden="true" /> CENTRAL DE GESTÃO</>}</span>
      </div>
      <div className="gs-topo-acoes">
        {children}
        <span className="gs-usuario">{usuario}</span>
        <button type="button" className="gs-botao gs-botao-fantasma" onClick={onSair}><LogOut size={15} aria-hidden="true" /> Sair</button>
      </div>
    </header>
  );
}

export const Carregando = () => <div className="gs-carregando" role="status">Carregando…</div>;
