import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Upload, FileSpreadsheet, CircleAlert, RotateCcw, Save, Check } from 'lucide-react';
import {
  lerExportFightTech, calcularAvaliacao, recalcularResultados, nomesCombinam, dataValida, MOVIMENTOS,
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
  const ultimaAssinatura = useRef('');
  const [identidadeConferida, setIdentidadeConferida] = useState('');
  const [motivoAssociacao, setMotivoAssociacao] = useState('');
  type Montagem = {distanciaCm: string; anguloGraus: string; referencia: string; ancoragem: string};
  const [montagens, setMontagens] = useState<Record<string, Partial<Record<'E' | 'D', Montagem>>>>({});
  const nomeCard = atletas.find(a => a.id === atletaId)?.name || '';
  const identidadeAtual = JSON.stringify([nome, nascimento, email, atletaId, nomeCard, leitura?.atletaNoApp, arquivoBase64]);
  const identidadeDiverge = Boolean(leitura && (!nomesCombinam(nome, leitura.atletaNoApp) || (atletaId && !nomesCombinam(nome, nomeCard))));


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
;
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
    ultimaAssinatura.current = ''; setIdentidadeConferida(''); setMotivoAssociacao(''); setMontagens({});
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
      if (resultado.datas.length === 1) setDataAvaliacao(resultado.datas[0]);
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
  const podeGerar = Boolean(leitura?.tentativas.length) && !leitura?.problemas.length && nome.trim().length > 2 && dataValida(nascimento) && pesoValido && emailValido && faltamMapear === 0;

  function gerar() {
    if (!leitura || !podeGerar) return;
    // Aplica o de-para preenchido pela equipe antes de calcular.
    const ajustada: LeituraExcel = {
      ...leitura,
      tentativas: leitura.tentativas.map(t => t.chave ? t : { ...t, chave: (mapa[t.exercicioBruto] || null) as MovimentoChave | null }),
    };
    const atleta = {nome: nome.trim(), nascimento, peso: pesoNumero, email: email.trim().toLowerCase()};
    try {
      const previa = calcularAvaliacao(ajustada, atleta);
      const resultado = recalcularResultados(previa.movimentos, atleta, dataAvaliacao);
      requestId.current = crypto.randomUUID(); ultimaAssinatura.current = '';
      setAvaliacao(resultado); setError('');
    } catch (e) { falhar(e); return; }
    setSalvo(false);
    setNotice('');
  }

  async function salvar() {
    if (!avaliacao) return;
    await executar(async () => {
      const payload = {
        requestId: requestId.current,
        atleta: avaliacao.atleta,
        data: avaliacao.data,
        arquivoNome: arquivo,
        mapa, montagens,
        confirmacao: {conferida: identidadeConferida === identidadeAtual, cardId: atletaId, nomeCard, atletaNoApp: leitura?.atletaNoApp, motivo: motivoAssociacao},
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
      };
      const assinatura = JSON.stringify({...payload, requestId: undefined});
      if (ultimaAssinatura.current && ultimaAssinatura.current !== assinatura) requestId.current = crypto.randomUUID();
      ultimaAssinatura.current = assinatura;
      payload.requestId = requestId.current;
      const resposta = await api<{anexo: boolean}>(`atletas/${atletaId}/avaliacoes`, payload);
      if (!resposta.anexo) throw new Error('Avaliação salva, mas o Excel ainda não foi confirmado. Repita o envio.');
      setSalvo(true);
      setNotice('Avaliação salva e Excel confirmado na subtarefa do atleta. Com o serviço da VPS ativo, o PDF será anexado à mesma subtarefa.');
    });
  }

  const nomeBateComCard = !nomeCard || nomesCombinam(nome, nomeCard);

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

      <main className="af-conteudo"><fieldset disabled={busy} style={{border: 0, padding: 0, margin: 0, minWidth: 0}}>
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
            <label>Data da avaliação<Input type="date" required value={dataAvaliacao} readOnly title="Data medida no Excel" /></label>
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
            <section className="af-form af-sem-impressao">
              <h2>3. Registro das montagens</h2>
              <p>Por lado: distância do marco anatômico ao centro da cinta, ângulo articular e identificação da montagem/ancoragem. Preserve esses registros na reavaliação.</p>
              {avaliacao.movimentos.flatMap(m => (['E', 'D'] as const).filter(l => l === 'E' ? m.esquerdo : m.direito).map(l => {
                const valor = montagens[m.chave]?.[l] || {distanciaCm: '', anguloGraus: '', referencia: '', ancoragem: ''};
                const alterar = (campo: keyof Montagem, texto: string) => {setMontagens(prev => ({...prev, [m.chave]: {...prev[m.chave], [l]: {...valor, [campo]: texto}}})); setSalvo(false);};
                return <div key={m.chave + l}>
                  <h3>{m.nome} — {l === 'E' ? 'esquerdo' : 'direito'}</h3>
                  <div className="af-campos">
                    <label>Distância (cm)<Input type="number" min="0.1" max="200" step="0.1" value={valor.distanciaCm} onChange={e => alterar('distanciaCm', e.target.value)} /></label>
                    <label>Ângulo articular (°)<Input type="number" min="0" max="180" value={valor.anguloGraus} onChange={e => alterar('anguloGraus', e.target.value)} /></label>
                    <label>Marco anatômico<Input maxLength={120} placeholder="Ex.: trocânter maior" value={valor.referencia} onChange={e => alterar('referencia', e.target.value)} /></label>
                    <label>Montagem e âncora<Input maxLength={300} placeholder="Identificação da foto/estrutura e posição" value={valor.ancoragem} onChange={e => alterar('ancoragem', e.target.value)} /></label>
                  </div>
                </div>;
              }))}
            </section>
            <div className="af-acoes af-sem-impressao af-acoes-relatorio">
              <label className="af-atleta">
                <span>Card no ClickUp</span>
                <select value={atletaId} onChange={e => { setAtletaId(e.target.value); setSalvo(false); }} disabled={busy || salvo}>
                  <option value="">Escolha o atleta…</option>
                  {atletas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </label>
              {leitura && atletaId && <div>
                <p>No Excel: <strong>{leitura.atletaNoApp}</strong> · Relatório: <strong>{nome}</strong> · Card: <strong>{nomeCard}</strong></p>
                {identidadeDiverge && <label>Explique a associação dos nomes diferentes<Input maxLength={300} value={motivoAssociacao} onChange={e => {setMotivoAssociacao(e.target.value); setIdentidadeConferida(''); setSalvo(false);}} placeholder="Ex.: cadastro genérico do app, identidade conferida na sessão" /></label>}
                <label><input type="checkbox" checked={identidadeConferida === identidadeAtual} onChange={e => setIdentidadeConferida(e.target.checked ? identidadeAtual : '')} /> Conferi o atleta, o Excel desta sessão e o card selecionado.</label>
              </div>}
              {atletaId && !nomeBateComCard && <span className="af-aviso">O nome digitado não parece o mesmo do card escolhido. Confira antes de salvar.</span>}
              <Button variant="outline" className="af-botao-claro" disabled={busy || salvo || !atletaId || identidadeConferida !== identidadeAtual || (identidadeDiverge && motivoAssociacao.trim().length < 12)} onClick={() => void salvar()}>
                {salvo ? <><Check size={16} /> Salvo</> : <><Save size={16} /> {busy ? 'Salvando…' : 'Salvar no ClickUp'}</>}
              </Button>
              {notice && <span className="af-ok">{notice}</span>}
              {error && <p className="af-erro" role="alert">{error}</p>}
            </div>
            <p className="af-nota af-sem-impressao af-conferencia">
              Abaixo é a <strong>conferência</strong> dos números antes de salvar. O relatório oficial, com a leitura
              automática descritiva a partir destes dados, é montado na VPS e anexado ao card do atleta no ClickUp.
            </p>
            <RelatorioForca avaliacao={avaliacao} avaliador={user} alertas={alertas} />
          </>
        )}
      </fieldset></main>
    </div>
  );
}
