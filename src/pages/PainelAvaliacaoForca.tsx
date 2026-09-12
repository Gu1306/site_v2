import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Printer, Upload, FileSpreadsheet, CircleAlert, RotateCcw, Save, Check } from 'lucide-react';
import {
  lerExportFightTech, calcularAvaliacao, MOVIMENTOS,
  type Avaliacao, type LeituraExcel, type MovimentoChave,
} from '@/lib/avaliacaoForca';
import RelatorioForca from './RelatorioForca';
import './painel-avaliacao-forca.css';

class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }

async function api<T>(route: string, data?: unknown): Promise<T> {
  const response = await fetch('/api/avaliacao-forca/' + route, {
    method: data === undefined ? 'GET' : 'POST',
    credentials: 'same-origin',
    headers: data === undefined ? {} : { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(120000),
  });
  const json = await response.json();
  if (!response.ok) throw new ApiError(json.error || 'Não foi possível concluir.', response.status);
  return json;
}

const hoje = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const dataBR = (iso: string) => /^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10).split('-').reverse().join('/') : iso;
const kg = (valor: number | null | undefined) => valor === null || valor === undefined ? '—' : `${valor.toFixed(1).replace('.', ',')} kg`;
const pct = (valor: number | null | undefined, casas = 1) => valor === null || valor === undefined ? '—' : `${valor.toFixed(casas).replace('.', ',')}%`;

export default function PainelAvaliacaoForca() {
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [login, setLogin] = useState({ user: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [nome, setNome] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [peso, setPeso] = useState('');
  const [email, setEmail] = useState('');
  const [dataAvaliacao, setDataAvaliacao] = useState(hoje);

  const [arquivo, setArquivo] = useState('');
  const [arquivoBase64, setArquivoBase64] = useState('');
  const [leitura, setLeitura] = useState<LeituraExcel | null>(null);
  const [mapa, setMapa] = useState<Record<string, MovimentoChave | ''>>({});
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [atletas, setAtletas] = useState<{ id: string; name: string }[]>([]);
  const [atletaId, setAtletaId] = useState('');
  const requestId = useRef(crypto.randomUUID());

  const falhar = useCallback((e: unknown) => {
    if (e instanceof ApiError && e.status === 401) setUser(null);
    setError(e instanceof Error ? e.message : 'Falha na conexão. Tente novamente.');
  }, []);

  useEffect(() => {
    document.title = 'Avaliação de força · CareFit';
    api<{ user: string }>('session')
      .then(r => setUser(r.user))
      .catch(e => { if (!(e instanceof ApiError && e.status === 401)) falhar(e); })
      .finally(() => setChecking(false));
  }, [falhar]);

  useEffect(() => {
    if (!user) return;
    api<{ id: string; name: string }[]>('atletas').then(setAtletas).catch(falhar);
  }, [user, falhar]);

  // Pré-seleciona o card quando o nome digitado bate com um atleta do ClickUp.
  useEffect(() => {
    if (atletaId || !atletas.length || nome.trim().length < 3) return;
    const alvo = nome.trim().toLowerCase();
    const achado = atletas.find(a => a.name.toLowerCase() === alvo)
      || atletas.find(a => a.name.toLowerCase().startsWith(alvo));
    if (achado) setAtletaId(achado.id);
  }, [nome, atletas, atletaId]);

  async function executar(acao: () => Promise<void>) {
    setBusy(true); setError(''); setNotice('');
    try { await acao(); } catch (e) { falhar(e); } finally { setBusy(false); }
  }

  function limpar() {
    setArquivo(''); setArquivoBase64(''); setLeitura(null); setMapa({}); setAvaliacao(null);
    setSalvo(false); setAtletaId(''); setError(''); setNotice('');
    requestId.current = crypto.randomUUID();
  }

  async function lerArquivo(file: File) {
    if (file.size > 2_000_000) { setError('O arquivo deve ter no máximo 2 MB. Use o Excel exportado pelo FightTech.'); return; }
    limpar();
    setArquivo(file.name);
    await executar(async () => {
      const { readSheet } = await import('read-excel-file/browser');
      let linhas: unknown[][];
      try { linhas = await readSheet(file, 'All') as unknown[][]; }
      catch { throw new ApiError('Não foi possível abrir a aba “All”. Exporte novamente pelo FightTech, sem editar o arquivo.', 400); }
      const resultado = lerExportFightTech(linhas);
      setLeitura(resultado);
      setMapa(Object.fromEntries(resultado.naoReconhecidos.map(nome => [nome, ''])));
      const buffer = await file.arrayBuffer();
      let binario = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.length; i++) binario += String.fromCharCode(bytes[i]);
      setArquivoBase64(btoa(binario));
    });
  }

  const pesoNumero = Number(peso.replace(',', '.'));
  const pesoValido = Number.isFinite(pesoNumero) && pesoNumero >= 25 && pesoNumero <= 250;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const faltamMapear = leitura ? leitura.naoReconhecidos.filter(nome => !mapa[nome]).length : 0;
  const podeGerar = Boolean(leitura?.tentativas.length) && !leitura?.problemas.length && nome.trim().length > 2 && /^\d{4}-\d{2}-\d{2}$/.test(nascimento) && pesoValido && emailValido && faltamMapear === 0;

  function gerar() {
    if (!leitura || !podeGerar) return;
    // Aplica o de-para preenchido pela equipe antes de calcular.
    const ajustada: LeituraExcel = {
      ...leitura,
      tentativas: leitura.tentativas.map(t => t.chave ? t : { ...t, chave: (mapa[t.exercicioBruto] || null) as MovimentoChave | null }),
    };
    const resultado = calcularAvaliacao(ajustada, { nome: nome.trim(), nascimento, peso: pesoNumero, email: email.trim().toLowerCase() });
    setAvaliacao({ ...resultado, data: dataAvaliacao });
    setSalvo(false);
    setNotice('');
  }

  async function salvar() {
    if (!avaliacao) return;
    await executar(async () => {
      await api(`atletas/${atletaId}/avaliacoes`, {
        requestId: requestId.current,
        atleta: avaliacao.atleta,
        data: avaliacao.data,
        arquivoNome: arquivo,
        arquivoBase64,
        idade: avaliacao.idade,
        // A VPS renderiza o PDF a partir daqui; se faltar campo, falta no documento.
        resultados: avaliacao.movimentos.map(m => ({
          chave: m.chave, nome: m.nome,
          esquerdo: m.esquerdo && { picos: m.esquerdo.picos, media: m.esquerdo.media, maior: m.esquerdo.maior, cv: m.esquerdo.cv, crescente: m.esquerdo.crescente },
          direito: m.direito && { picos: m.direito.picos, media: m.direito.media, maior: m.direito.maior, cv: m.direito.cv, crescente: m.direito.crescente },
          assimetria: m.assimetria, ladoMenor: m.ladoMenor,
          alertas: m.alertas,
        })),
        razoes: avaliacao.razoes,
        problemas: avaliacao.problemas,
      });
      setSalvo(true);
      setNotice('Salva no card do atleta, com o Excel anexado. O PDF com a leitura clínica é gerado na VPS e aparece no mesmo card em alguns minutos.');
    });
  }

  // Espelha a checagem do servidor para avisar antes de tentar salvar no card errado.
  const nomeBateComCard = useMemo(() => {
    const card = atletas.find(a => a.id === atletaId);
    if (!card || !nome.trim()) return true;
    const partes = (t: string) => new Set(t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(x => x.length >= 3));
    const a = partes(nome); const b = partes(card.name);
    return [...a].some(x => b.has(x));
  }, [atletas, atletaId, nome]);

  const alertas = useMemo(() => avaliacao ? avaliacao.movimentos.flatMap(m => m.alertas.map(texto => ({ movimento: m.nome, texto }))) : [], [avaliacao]);

  if (checking) return <div className="af-carregando">Carregando…</div>;

  if (!user) return (
    <div className="af-login">
      <form onSubmit={e => { e.preventDefault(); void executar(async () => { const r = await api<{ user: string }>('login', login); setUser(r.user); setLogin({ user: '', password: '' }); }); }}>
        <h1>Avaliação de força</h1>
        <p>Acesso restrito à equipe CareFit.</p>
        <label>Usuário<Input autoComplete="username" required value={login.user} onChange={e => setLogin({ ...login, user: e.target.value })} /></label>
        <label>Senha<Input type="password" autoComplete="current-password" required value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} /></label>
        {error && <p className="af-erro" role="alert">{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</Button>
      </form>
    </div>
  );

  return (
    <div className="af-pagina">
      <header className="af-topo af-sem-impressao">
        <div>
          <h1>Avaliação de força</h1>
          <span>{user}</span>
        </div>
        <Button variant="ghost" onClick={() => void executar(async () => { await api('logout', {}); setUser(null); })}><LogOut size={17} /> Sair</Button>
      </header>

      <main className="af-conteudo">
        <section className="af-form af-sem-impressao">
          <h2>1. Dados do atleta</h2>
          <div className="af-campos">
            <label>Nome completo<Input required maxLength={80} value={nome} onChange={e => { setNome(e.target.value); setAvaliacao(null); }} placeholder="Nome do atleta" /></label>
            <label>Data de nascimento<Input type="date" required value={nascimento} onChange={e => { setNascimento(e.target.value); setAvaliacao(null); }} /></label>
            <label>E-mail<Input required type="email" maxLength={120} value={email} onChange={e => { setEmail(e.target.value); setAvaliacao(null); }} placeholder="atleta@email.com" />
              {email && !emailValido && <small className="af-erro-campo">E-mail inválido.</small>}
            </label>
            <label>Peso (kg)<Input required inputMode="decimal" value={peso} onChange={e => { setPeso(e.target.value); setAvaliacao(null); }} placeholder="72,5" />
              {peso && !pesoValido && <small className="af-erro-campo">Peso entre 25 e 250 kg.</small>}
            </label>
            <label>Data da avaliação<Input type="date" required value={dataAvaliacao} onChange={e => { setDataAvaliacao(e.target.value); setAvaliacao(null); }} /></label>
          </div>
          <p className="af-nota">O peso é digitado aqui de propósito: a força relativa é calculada com este valor, e não com o cadastro do aplicativo, que ninguém confere.</p>
        </section>

        <section className="af-form af-sem-impressao">
          <h2>2. Excel do FightTech</h2>
          <label className="af-arquivo">
            <span><Upload size={17} /> Escolher arquivo exportado</span>
            <Input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" disabled={busy}
              onChange={event => { const file = event.target.files?.[0]; event.currentTarget.value = ''; if (file) void lerArquivo(file); }} />
          </label>
          <p className="af-nota">O arquivo é lido neste computador. Nada é enviado antes de você clicar em salvar.</p>

          {arquivo && leitura && (
            <div className="af-arquivo-resumo">
              <FileSpreadsheet size={18} />
              <span>{arquivo}</span>
              <strong>{leitura.tentativas.length} tentativa(s)</strong>
              {leitura.atletaNoApp && <em>no app: {leitura.atletaNoApp}</em>}
            </div>
          )}

          {leitura && leitura.problemas.length > 0 && (
            <div className="af-problemas" role="alert">
              <div><CircleAlert size={18} /><strong>Corrija antes de gerar o relatório</strong></div>
              {leitura.problemas.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}

          {leitura && leitura.naoReconhecidos.length > 0 && (
            <div className="af-mapa">
              <strong>Diga a que teste corresponde cada exercício do app</strong>
              <p>Estes nomes ainda não estão no de-para. Depois da primeira sessão completa eles entram no código e esta etapa some.</p>
              {leitura.naoReconhecidos.map(bruto => (
                <label key={bruto}>
                  <span>{bruto}</span>
                  <select value={mapa[bruto] || ''} onChange={e => { setMapa({ ...mapa, [bruto]: e.target.value as MovimentoChave | '' }); setAvaliacao(null); }}>
                    <option value="">Escolha o teste…</option>
                    {MOVIMENTOS.map(m => <option key={m.chave} value={m.chave}>{m.nome}</option>)}
                  </select>
                </label>
              ))}
            </div>
          )}

          {error && <p className="af-erro" role="alert">{error}</p>}

          <div className="af-acoes">
            <Button disabled={!podeGerar || busy} onClick={gerar}>Gerar relatório</Button>
            {(leitura || avaliacao) && <Button variant="ghost" onClick={limpar}><RotateCcw size={16} /> Limpar</Button>}
          </div>
        </section>

        {avaliacao && (
          <>
            <div className="af-acoes af-sem-impressao af-acoes-relatorio">
              <Button onClick={() => window.print()}><Printer size={16} /> Imprimir / salvar PDF</Button>
              <label className="af-atleta">
                <span>Card no ClickUp</span>
                <select value={atletaId} onChange={e => { setAtletaId(e.target.value); setSalvo(false); }} disabled={busy || salvo}>
                  <option value="">Escolha o atleta…</option>
                  {atletas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </label>
              {atletaId && !nomeBateComCard && <span className="af-aviso">O nome digitado não parece o mesmo do card escolhido. Confira antes de salvar.</span>}
              <Button variant="outline" className="af-botao-claro" disabled={busy || salvo || !atletaId} onClick={() => void salvar()}>
                {salvo ? <><Check size={16} /> Salvo</> : <><Save size={16} /> {busy ? 'Salvando…' : 'Salvar no ClickUp'}</>}
              </Button>
              {notice && <span className="af-ok">{notice}</span>}
            </div>
            <p className="af-nota af-sem-impressao af-conferencia">
              Abaixo é a <strong>conferência</strong> dos números antes de salvar. O relatório oficial, com a leitura
              clínica escrita a partir destes dados, é montado na VPS e anexado ao card do atleta no ClickUp.
            </p>
            <RelatorioForca avaliacao={avaliacao} avaliador={user} alertas={alertas} />
          </>
        )}
      </main>
    </div>
  );
}
