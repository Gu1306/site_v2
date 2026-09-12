import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Printer, Upload, FileSpreadsheet, CircleAlert, RotateCcw, Save, Check } from 'lucide-react';
import {
  lerExportFightTech, calcularAvaliacao, MOVIMENTOS,
  type Avaliacao, type LeituraExcel, type MovimentoChave, type Lado,
} from '@/lib/avaliacaoForca';
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
  const faltamMapear = leitura ? leitura.naoReconhecidos.filter(nome => !mapa[nome]).length : 0;
  const podeGerar = Boolean(leitura?.tentativas.length) && !leitura?.problemas.length && nome.trim().length > 2 && /^\d{4}-\d{2}-\d{2}$/.test(nascimento) && pesoValido && faltamMapear === 0;

  function gerar() {
    if (!leitura || !podeGerar) return;
    // Aplica o de-para preenchido pela equipe antes de calcular.
    const ajustada: LeituraExcel = {
      ...leitura,
      tentativas: leitura.tentativas.map(t => t.chave ? t : { ...t, chave: (mapa[t.exercicioBruto] || null) as MovimentoChave | null }),
    };
    const resultado = calcularAvaliacao(ajustada, { nome: nome.trim(), nascimento, peso: pesoNumero });
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
        resultados: avaliacao.movimentos.map(m => ({
          chave: m.chave, nome: m.nome,
          esquerdo: m.esquerdo && { picos: m.esquerdo.picos, media: m.esquerdo.media, maior: m.esquerdo.maior },
          direito: m.direito && { picos: m.direito.picos, media: m.direito.media, maior: m.direito.maior },
          assimetria: m.assimetria, ladoMenor: m.ladoMenor,
        })),
      });
      setSalvo(true);
      setNotice('Avaliação salva no card do atleta no ClickUp, junto com o Excel original.');
    });
  }

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
              <Button variant="outline" className="af-botao-claro" disabled={busy || salvo || !atletaId} onClick={() => void salvar()}>
                {salvo ? <><Check size={16} /> Salvo</> : <><Save size={16} /> {busy ? 'Salvando…' : 'Salvar no ClickUp'}</>}
              </Button>
              {notice && <span className="af-ok">{notice}</span>}
            </div>
            <Relatorio avaliacao={avaliacao} avaliador={user} alertas={alertas} />
          </>
        )}
      </main>
    </div>
  );
}

function Relatorio({ avaliacao, avaliador, alertas }: { avaliacao: Avaliacao; avaliador: string; alertas: { movimento: string; texto: string }[] }) {
  const ladoNome = (lado: Lado | null) => lado === 'E' ? 'esquerdo' : lado === 'D' ? 'direito' : '—';
  return (
    <article className="af-relatorio">
      <header className="af-rel-topo">
        <div>
          <p className="af-rel-marca">CareFit Run Base</p>
          <h2>Relatório de avaliação de força</h2>
          <p className="af-rel-sub">Dinamometria isométrica de membros inferiores</p>
        </div>
        <div className="af-rel-id">
          <p><strong>{avaliacao.atleta.nome}</strong></p>
          <p>{avaliacao.idade !== null ? `${avaliacao.idade} anos` : 'Idade não informada'} · {avaliacao.atleta.peso.toFixed(1).replace('.', ',')} kg</p>
          <p>Avaliação: {dataBR(avaliacao.data)}</p>
          <p>Avaliador: {avaliador}</p>
        </div>
      </header>

      <section>
        <h3>Força por movimento</h3>
        <table className="af-tabela">
          <thead>
            <tr>
              <th>Movimento</th>
              <th>Esquerdo<br /><span>média dos 3 picos</span></th>
              <th>Direito<br /><span>média dos 3 picos</span></th>
              <th>Assimetria</th>
              <th>Lado menor</th>
            </tr>
          </thead>
          <tbody>
            {avaliacao.movimentos.map(m => (
              <tr key={m.chave}>
                <td>{m.nome}</td>
                <td>{kg(m.esquerdo?.media)}</td>
                <td>{kg(m.direito?.media)}</td>
                <td className={m.assimetria !== null && m.assimetria >= 10 ? 'af-destaque' : ''}>{pct(m.assimetria)}</td>
                <td>{ladoNome(m.ladoMenor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="af-legenda">
          Assimetria = 100 − (membro mais fraco ÷ membro mais forte × 100), conforme o protocolo CareFit.
          O destaque a partir de 10% marca apenas a magnitude do número — não é classificação de risco de lesão.
        </p>
      </section>

      <section>
        <h3>As três tentativas</h3>
        <table className="af-tabela">
          <thead>
            <tr><th>Movimento</th><th>Lado</th><th>1ª</th><th>2ª</th><th>3ª</th><th>Média</th><th>Maior</th><th>Variação</th></tr>
          </thead>
          <tbody>
            {avaliacao.movimentos.flatMap(m => (['E', 'D'] as Lado[]).map(lado => {
              const r = lado === 'E' ? m.esquerdo : m.direito;
              if (!r) return null;
              return (
                <tr key={`${m.chave}-${lado}`}>
                  <td>{m.nome}</td>
                  <td>{ladoNome(lado)}</td>
                  {[0, 1, 2].map(i => <td key={i}>{r.picos[i] !== undefined ? kg(r.picos[i]) : '—'}</td>)}
                  <td><strong>{kg(r.media)}</strong></td>
                  <td>{kg(r.maior)}</td>
                  <td className={r.cv > 10 ? 'af-destaque' : ''}>{pct(r.cv)}</td>
                </tr>
              );
            }).filter(Boolean))}
          </tbody>
        </table>
        <p className="af-legenda">
          As três tentativas ficam registradas, inclusive a mais baixa. Variação acima de 10% entre elas costuma indicar
          problema de execução ou de fixação, e não diferença real de força.
        </p>
      </section>

      {avaliacao.razoes.length > 0 && (
        <section>
          <h3>Relação entre músculos opostos</h3>
          <table className="af-tabela">
            <thead><tr><th>Relação</th><th>Lado</th><th>Valor</th><th>Forças</th></tr></thead>
            <tbody>
              {avaliacao.razoes.map((r, i) => (
                <tr key={i}>
                  <td>{r.titulo}{!r.comparavel && <sup>*</sup>}</td>
                  <td>{ladoNome(r.lado)}</td>
                  <td>{pct(r.valor, 0)}</td>
                  <td>{r.detalhe}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {avaliacao.razoes.some(r => !r.comparavel) && (
            <p className="af-legenda">* {avaliacao.razoes.find(r => !r.comparavel)?.nota}</p>
          )}
        </section>
      )}

      {alertas.length > 0 && (
        <section>
          <h3>Observações de execução</h3>
          <ul className="af-lista">
            {alertas.map((a, i) => <li key={i}><strong>{a.movimento}:</strong> {a.texto}</li>)}
          </ul>
        </section>
      )}

      {avaliacao.problemas.length > 0 && (
        <section>
          <h3>Limitações desta avaliação</h3>
          <ul className="af-lista">{avaliacao.problemas.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </section>
      )}

      <footer className="af-rel-rodape">
        <h3>Como ler este relatório</h3>
        <p>
          Os valores vêm de dinamometria isométrica com fixação externa. Cada movimento foi testado três vezes de cada
          lado, com cinco segundos de contração e um minuto de descanso, e o resultado principal é a média dos três picos.
        </p>
        <p>
          As comparações que valem aqui são <strong>entre os seus dois lados</strong> e <strong>entre as suas próprias
          avaliações</strong> ao longo do tempo. O valor absoluto em quilos depende do aparelho, da posição e do ponto
          onde a cinta é presa, e por isso não deve ser comparado com medições feitas em outro serviço ou com outro
          equipamento.
        </p>
        <p>
          Uma diferença entre os lados é informação, não diagnóstico. Ela precisa ser lida junto com histórico de lesão,
          sintomas, capacidade funcional e demanda de treino. Este documento não prevê lesão individual e não substitui
          a avaliação clínica.
        </p>
        <p className="af-rel-assinatura">
          CareFit Run Base · Av. Áurea Aparecida Bragheto Machado, 241 — Ribeirão Preto, SP<br />
          Emitido em {dataBR(hoje())} por {avaliador}.
        </p>
      </footer>
    </article>
  );
}
