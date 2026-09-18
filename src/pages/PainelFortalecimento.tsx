import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Monitor, ArrowLeft, Plus, Trash2, RefreshCw, Check, LogOut, ChevronLeft, ChevronRight, ExternalLink, Upload, Download, FileSpreadsheet, CircleAlert, Combine, Ungroup } from 'lucide-react';
import { buildWorkoutImport, type ImportWorkout } from '@/lib/fortalecimentoImport';
import { blocksOf, blockLabel, canJoinWithPrevious, defaultMetrics, joinedWithPrevious, normalizeBlocks, paginate, toggleJoin, type TvMetrics } from '@/lib/fortalecimentoBlocos';
import './painel-fortalecimento.css';

type Exercise = { name: string; sets: number; reps: string; load: string; rest: number; group?: number | null };
type Workout = { title: string; displayName: string; exercises: Exercise[] };
type Revision = { id: string; workout: Workout; createdAt: string; author: string };
type Session = Revision & { evolution?: string; completionRequestId?: string };
type ClassItem = { id: string; name: string; slot: string | null; athleteId: string | null; session: Session | null };
type Agenda = { day: string; classes: ClassItem[]; syncedAt: string };
type Athlete = { id: string; name: string; revisions: Revision[] };
type ImportItem = ImportWorkout & { requestId: string; state: 'ready' | 'saving' | 'saved' | 'failed'; message?: string };
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const slots = ['06', '07', '08'];
const slotLabel = (s: string) => `${s}h–${String(Number(s) + 1).padStart(2, '0')}h`;
const emptyExercise = (): Exercise => ({ name: '', sets: 3, reps: '', load: '', rest: 60, group: null });
class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
async function api<T>(route: string, data?: unknown): Promise<T> {
  const response = await fetch('/api/fortalecimento/' + route, { method: data === undefined ? 'GET' : 'POST', credentials: 'same-origin', headers: data === undefined ? {} : { 'Content-Type': 'application/json' }, body: data === undefined ? undefined : JSON.stringify(data), signal: AbortSignal.timeout(120000) });
  const json = await response.json();
  if (!response.ok) throw new ApiError(json.error || 'Não foi possível carregar os dados.', response.status);
  return json;
}
export default function PainelFortalecimento() {
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [day, setDay] = useState(today);
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [slot, setSlot] = useState('06');
  const [mode, setMode] = useState<'agenda' | 'tv'>('agenda');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editor, setEditor] = useState<Athlete | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [targetClass, setTargetClass] = useState<ClassItem | null>(null);
  const [picker, setPicker] = useState(false);
  const [athletes, setAthletes] = useState<{ id: string; name: string }[]>([]);
  const [query, setQuery] = useState('');
  const [completion, setCompletion] = useState<ClassItem | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState('');
  const [importItems, setImportItems] = useState<ImportItem[]>([]);
  const [importIssues, setImportIssues] = useState<string[]>([]);
  const [evolution, setEvolution] = useState('');
  const [page, setPage] = useState(0);
  const [metrics, setMetrics] = useState<TvMetrics>(defaultMetrics);
  const grid = useRef<HTMLDivElement>(null);
  const requestId = useRef(crypto.randomUUID());
  const completionId = useRef<string>(crypto.randomUUID());
  const loadSequence = useRef(0);
  // Retrato do treino como ele foi carregado, para saber se há edição não salva.
  const savedWorkout = useRef('');
  const fail = useCallback((e: unknown) => {
    if (e instanceof ApiError && e.status === 401) { setUser(null); setAgenda(null); setEditor(null); setWorkout(null); setCompletion(null); setMode('agenda'); }
    setError(e instanceof Error ? e.message : 'Falha na conexão. Tente novamente.');
  }, []);
  const refresh = useCallback(async () => {
    const sequence = ++loadSequence.current; setSyncing(true);
    try { const result = await api<Agenda>('agenda?day=' + day); if (sequence === loadSequence.current) { setAgenda(result); setError(''); } }
    catch (e) { if (sequence === loadSequence.current) fail(e); }
    finally { if (sequence === loadSequence.current) setSyncing(false); }
  }, [day, fail]);
  useEffect(() => { document.title = 'Fortalecimento · CareFit'; api<{ user: string }>('session').then(r => setUser(r.user)).catch(e => { if (!(e instanceof ApiError && e.status === 401)) fail(e); }).finally(() => setChecking(false)); }, [fail]);
  useEffect(() => {
    if (!user) return;
    setAgenda(null); void refresh();
    // Avoid overwriting unsaved form feedback; TV and agenda still refresh automatically.
    const timer = setInterval(() => { if (!document.hidden && !editor && !completion && !busy) void refresh(); }, 60000);
    return () => { clearInterval(timer); loadSequence.current++; };
  }, [user, refresh, editor, completion, busy]);
  useEffect(() => {
    if (mode !== 'tv' || !grid.current) return;
    const measure = () => {
      if (!grid.current) return;
      const nodes = (selector: string) => Array.from(grid.current!.querySelectorAll(selector));
      const heights = (selector: string) => nodes(selector).map(el => el.getBoundingClientRect().height);
      const overhead = Math.max(125, ...heights('.cf-card-head')) + Math.max(38, ...heights('footer'));
      const pads = nodes('.cf-block').map(el => {
        const head = el.querySelector('.cf-block-head')?.getBoundingClientRect().height || 0;
        const lines = Array.from(el.querySelectorAll('.cf-block-line')).reduce((total, line) => total + line.getBoundingClientRect().height, 0);
        return el.getBoundingClientRect().height - head - lines;
      });
      // O padrão entra só quando não há o que medir. Usá-lo como piso inflava o
      // bloco sempre que a altura real ficava abaixo dele, e aí sobrava um
      // tri-set por página mesmo havendo espaço para dois.
      const largest = (selector: string, fallback: number) => {
        const list = heights(selector);
        return list.length ? Math.max(...list) : fallback;
      };
      const available = Math.max(defaultMetrics.rowHeight, grid.current.clientHeight - overhead - 4);
      // As alturas dos exercícios só são medidas no bloco 1. Cada página tem
      // exercícios diferentes, então medir a página aberta mudava a paginação a
      // cada clique em "Próximo bloco" — e a mudança devolvia a TV ao bloco 1.
      const next = (previous: TvMetrics): TvMetrics => page > 0 ? { ...previous, available } : {
        available,
        rowHeight: largest('.cf-exercise:not(.cf-block)', defaultMetrics.rowHeight),
        blockHead: largest('.cf-block-head', defaultMetrics.blockHead),
        blockLine: largest('.cf-block-line', defaultMetrics.blockLine),
        blockPad: pads.length ? Math.max(...pads) : defaultMetrics.blockPad
      };
      // Só troca o estado quando a medida realmente mudou: o objeto novo a cada
      // render reabriria o ciclo de medição sem necessidade.
      setMetrics(previous => { const measured = next(previous); return (Object.keys(measured) as (keyof TvMetrics)[]).every(field => Math.abs(measured[field] - previous[field]) < 1) ? previous : measured; });
    };
    const resize = new ResizeObserver(measure);
    resize.observe(grid.current); return () => resize.disconnect();
  }, [mode, agenda, page]);
  // Mudança de medida não volta ao bloco 1: `safePage` já recua se sobrar página.
  useEffect(() => { setPage(0); }, [slot, day]);
  useEffect(() => {
    // O botão de voltar ficou discreto no modo TV; Esc é a saída óbvia.
    if (mode !== 'tv') return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMode('agenda');
      if (document.fullscreenElement) void document.exitFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode]);
  const classes = agenda?.day === day ? agenda.classes : [];
  const group = classes?.filter(c => c.slot === slot) || [];
  const pages = new Map(group.map(c => [c.id, c.session ? paginate(c.session.workout.exercises, metrics) : []]));
  const maxPages = Math.max(1, ...group.map(c => pages.get(c.id)!.length));
  const safePage = Math.min(page, maxPages - 1);
  const number = (index: number) => String(index + 1).padStart(2, '0');
  function tvBlocks(item: ClassItem) {
    const exercises = item.session?.workout.exercises || [];
    return (pages.get(item.id)?.[safePage] || []).map(block => {
      if (block.length === 1) {
        const e = exercises[block[0]];
        return <section className="cf-exercise" key={block[0]}><h3><span>{number(block[0])}</span>{e.name}</h3><div className="cf-metrics"><div><strong>{e.sets} × {e.reps}</strong><small>SÉRIES × REPETIÇÕES</small></div><div><strong>{e.load}</strong><small>CARGA</small></div><div><strong>{e.rest} s</strong><small>PAUSA</small></div></div></section>;
      }
      const last = exercises[block[block.length - 1]];
      return <section className="cf-exercise cf-block" key={block[0]}>
        <header className="cf-block-head"><span>{number(block[0])}–{number(block[block.length - 1])}</span><strong>{blockLabel(block.length)}</strong><em>{block.slice(0, -1).every(index => exercises[index].rest === 0) ? 'sem pausa entre eles · ' : ''}{last.rest} s ao fim</em></header>
        {block.map((index, position) => { const e = exercises[index]; return <div className="cf-block-line" key={index}><strong>{e.name}</strong><span>{e.sets} × {e.reps}</span><span>{e.load}{position < block.length - 1 && e.rest > 0 ? ` · ${e.rest} s` : ''}</span></div>; })}
      </section>;
    });
  }
  async function run(fn: () => Promise<void>) { setBusy(true); setError(''); setNotice(''); try { await fn(); } catch (e) { fail(e); } finally { setBusy(false); } }
  async function openEditor(id: string, item: ClassItem | null = null) {
    await run(async () => {
      const a = await api<Athlete>('athletes/' + id); setEditor(a); setTargetClass(item); setPicker(false);
      const loaded = a.revisions[0]?.workout || { title: 'Treino A', displayName: a.name.split(/\s+/).slice(0, 2).join(' ').slice(0, 32), exercises: [emptyExercise()] };
      setWorkout(loaded); savedWorkout.current = JSON.stringify(loaded);
      requestId.current = crypto.randomUUID();
    });
  }
  async function saveWorkout() {
    if (!editor || !workout) return;
    await run(async () => {
      const revision = await api<Revision>(`athletes/${editor.id}/workout`, { workout, baseRevision: editor.revisions[0]?.id || null, requestId: requestId.current });
      setEditor({ ...editor, revisions: [revision, ...editor.revisions.filter(r => r.id !== revision.id)] });
      savedWorkout.current = JSON.stringify(workout);
      requestId.current = crypto.randomUUID(); setNotice('Treino salvo no card do atleta.');
    });
  }
  async function readWorkbook(file: File) {
    if (file.size > 1_000_000) { setError('O arquivo deve ter no máximo 1 MB. Use somente o modelo CareFit.'); return; }
    setImportFile(file.name); setImportItems([]); setImportIssues([]);
    await run(async () => {
      const [{ readSheet }, list] = await Promise.all([
        import('read-excel-file/browser'),
        athletes.length ? Promise.resolve(athletes) : api<{ id: string; name: string }[]>('athletes')
      ]);
      if (!athletes.length) setAthletes(list);
      let workbookRows;
      try { workbookRows = await readSheet(file, 'Treinos'); }
      catch { throw new ApiError('Use o modelo CareFit e mantenha a aba chamada “Treinos”.', 400); }
      const parsed = buildWorkoutImport(workbookRows as unknown[][], list);
      setImportIssues(parsed.issues);
      setImportItems(parsed.workouts.map(item => ({ ...item, requestId: crypto.randomUUID(), state: 'ready' })));
    });
  }
  async function importWorkouts() {
    if (!importItems.length || importIssues.length) return;
    setBusy(true); setError(''); setNotice('');
    let saved = 0; let failed = 0;
    const next = [...importItems];
    for (let index = 0; index < next.length; index++) {
      if (next[index].state === 'saved') { saved++; continue; }
      next[index] = { ...next[index], state: 'saving', message: '' }; setImportItems([...next]);
      try {
        const current = await api<Athlete>('athletes/' + next[index].athleteId);
        await api<Revision>(`athletes/${next[index].athleteId}/workout`, {
          workout: { title: next[index].title, displayName: next[index].displayName, exercises: next[index].exercises },
          baseRevision: current.revisions[0]?.id || null,
          requestId: next[index].requestId
        });
        next[index] = { ...next[index], state: 'saved', message: 'Salvo no ClickUp' }; saved++;
      } catch (e) {
        next[index] = { ...next[index], state: 'failed', message: e instanceof Error ? e.message : 'Falha ao salvar' }; failed++;
      }
      setImportItems([...next]);
    }
    setBusy(false);
    if (failed) setError(`${saved} treino(s) salvo(s) e ${failed} com falha. Corrija e tente novamente; os já salvos não serão duplicados.`);
    else { setImportOpen(false); setImportItems([]); setImportIssues([]); setImportFile(''); setNotice(`${saved} treino(s) importado(s) para os cards dos atletas.`); }
  }
  async function selectWorkout(revision: Revision) {
    if (!targetClass) return;
    await run(async () => {
      await api(`classes/${targetClass.id}/select`, { revisionId: revision.id, baseSession: targetClass.session?.id || null, requestId: crypto.randomUUID() });
      setEditor(null); setWorkout(null); setTargetClass(null); setNotice('Treino separado para esta aula. Já pode abrir na TV.'); await refresh();
    });
  }
  function updateExercise(index: number, field: keyof Exercise, value: string) {
    if (!workout) return;
    setWorkout({ ...workout, exercises: workout.exercises.map((e, i) => i === index ? { ...e, [field]: field === 'sets' || field === 'rest' ? Number(value) : value } : e) });
    requestId.current = crypto.randomUUID();
  }
  // Toda mudança na lista passa por aqui: remover um exercício pode deixar um
  // bi-set com um só membro, e aí o bloco tem de desaparecer sozinho.
  function applyExercises(base: Workout, exercises: Exercise[]) {
    setWorkout({ ...base, exercises: normalizeBlocks(exercises) });
    requestId.current = crypto.randomUUID();
  }
  // Fechar sem salvar apagava o treino inteiro digitado — inclusive por um clique
  // fora do diálogo. Agora o clique fora não fecha nada e a saída pede confirmação
  // quando há edição pendente.
  function closeEditor() {
    if (busy) return;
    if (workout && JSON.stringify(workout) !== savedWorkout.current && !window.confirm('Sair sem salvar? O treino digitado será perdido.')) return;
    setEditor(null); setWorkout(null); setTargetClass(null);
  }
  function closeCompletion() {
    if (busy) return;
    if (evolution.trim() !== (completion?.session?.evolution || '').trim() && !window.confirm('Sair sem salvar? O texto da evolução será perdido.')) return;
    setCompletion(null);
  }
  async function enterTv() {
    setMode('tv'); setPage(0);
    try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); } catch { /* viewport still works; F11 available */ }
  }
  async function exitTv() { setMode('agenda'); if (document.fullscreenElement) await document.exitFullscreen(); }
  const alert = <>{error && <div className="cf-alert" role="alert">{error} {agenda && 'Os dados exibidos podem estar desatualizados.'}</div>}{notice && <div className="cf-notice" role="status">{notice}</div>}</>;
  if (!user) return <main className="cf-portal cf-login"><form onSubmit={e => { e.preventDefault(); const form = new FormData(e.currentTarget); void run(async () => { const r = await api<{ user: string }>('login', { user: form.get('user'), password: form.get('password') }); setUser(r.user); }); }}>
    <div className="cf-brand">carefit<span>RUN BASE</span></div><p className="cf-eyebrow">ESPAÇO DO TREINADOR</p><h1>Seu treino.<br />Seu ritmo.</h1><p>Aulas do dia, treinos e evolução em um só lugar.</p>{alert}
    <label>Usuário<Input name="user" autoComplete="username" required disabled={checking} /></label><label>Senha<Input name="password" type="password" autoComplete="current-password" required disabled={checking} /></label>
    <Button className="cf-primary" disabled={busy || checking} type="submit">{checking ? 'Verificando acesso…' : busy ? 'Entrando…' : 'Entrar'}</Button><small>Acesso reservado à equipe CareFit.</small>
  </form></main>;
  return <main className={'cf-portal ' + (mode === 'tv' ? 'cf-tv' : '')}>
    {/* Na TV a tela é do atleta: sai o cabeçalho inteiro e fica a marca sobre o treino.
        O botão de voltar segue no canto, discreto, e Esc também sai. */}
    {mode === 'tv' ? <div className="cf-tv-mark"><Button variant="ghost" onClick={() => void exitTv()}><ArrowLeft size={16} /> Voltar</Button><img src="/conheca-carefit/assets/carefit-logo-circle.png" alt="CareFit Run Base" /></div> : <>
      <header className="cf-top"><div><div className="cf-brand">carefit<span>FORTALECIMENTO</span></div><h1>Tudo pronto para a aula.</h1><p>{new Date(day + 'T12:00:00-03:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo' })}</p></div>
        <div className="cf-controls"><label className="cf-date">Dia das aulas<Input type="date" value={day} onChange={e => e.target.value && setDay(e.target.value)} /></label><Button variant="outline" onClick={() => { setDay(today()); }}>Hoje</Button><Button variant="outline" onClick={() => void run(async () => { await api('logout', {}); setUser(null); setAgenda(null); })} disabled={busy} aria-label="Sair"><LogOut size={18} /></Button></div>
      </header>
      <div className="cf-toolbar"><nav aria-label="Horários das aulas">{slots.map(s => <Button key={s} aria-pressed={slot === s} className={slot === s ? 'cf-primary' : ''} variant="outline" onClick={() => setSlot(s)}>{slotLabel(s)} <span className="cf-count">{classes?.filter(c => c.slot === s).length || 0}</span></Button>)}</nav>
        <div className="cf-actions"><Button variant="outline" disabled={busy} onClick={() => { setImportOpen(true); setImportFile(''); setImportItems([]); setImportIssues([]); setError(''); }}><Upload size={16} /> Importar Excel</Button><Button variant="outline" disabled={busy} onClick={() => void run(async () => { setAthletes(await api('athletes')); setQuery(''); setPicker(true); })}><Plus size={16} /> Programar treino</Button><Button className="cf-primary" onClick={() => void enterTv()} disabled={group.length === 0 || group.length > 3 || !group.some(c => c.session)}><Monitor size={17} /> Abrir na TV</Button></div>
      </div>
    </>}
    {alert}
    {mode === 'agenda' && <div className="cf-sync"><span>{syncing ? 'Atualizando aulas…' : agenda ? `Sincronizado às ${new Date(agenda.syncedAt).toLocaleTimeString('pt-BR')}` : 'Carregando aulas…'} · horário de Brasília</span><Button variant="ghost" size="sm" disabled={syncing} onClick={() => void refresh()}><RefreshCw size={14} /> Atualizar</Button></div>}
    {group.length > 3 ? <div className="cf-empty cf-alert"><h2>Há {group.length} atletas neste horário.</h2><p>Confira os agendamentos no ClickUp. A TV comporta três atletas por turma.</p></div> : <div ref={grid} className={'cf-grid ' + (mode === 'tv' ? 'cf-tv-grid' : '')}>
      {group.map((item, index) => <article className="cf-card" key={item.id}>
        <div className="cf-card-head"><p className="cf-eyebrow">ATLETA {String(index + 1).padStart(2, '0')}</p><h2>{item.session?.workout.displayName || item.name.replace(/\s*—\s*Aula.*$/i, '')}</h2><p>{item.session?.workout.title || 'Treino ainda não separado'}</p></div>
        {mode === 'tv' ? <div className="cf-exercises">{item.session ? tvBlocks(item) : <p className="cf-card-body">Lucas está preparando o treino.</p>}{item.session && safePage >= (pages.get(item.id)?.length || 0) && <p className="cf-card-body">Exercícios exibidos. Siga a orientação do Lucas.</p>}</div> : <div className="cf-card-body"><p>{item.session ? `${item.session.workout.exercises.length} exercícios · treino salvo para esta aula` : 'Escolha o treino do atleta para exibir nesta aula.'}</p><div className="cf-card-actions">
          {!item.session && <Button className="cf-primary" disabled={busy || !item.athleteId} onClick={() => item.athleteId && void openEditor(item.athleteId, item)}>Abrir treinos</Button>}
          {item.session && <><Button variant="outline" disabled={busy} onClick={() => void enterTv()}><Monitor size={16} /> Ver treino</Button><Button className="cf-primary" disabled={busy || day > today()} onClick={() => { setCompletion(item); setEvolution(item.session?.evolution || ''); completionId.current = item.session?.completionRequestId || crypto.randomUUID(); setError(''); }}>Registrar evolução</Button></>}
          {!item.athleteId && <p className="cf-alert">Confira o vínculo do atleta no ClickUp.</p>}
          {item.session && item.athleteId && !item.session.completionRequestId && <Button variant="ghost" disabled={busy} onClick={() => void openEditor(item.athleteId!, item)}>Trocar treino desta aula</Button>}
          <a href={`https://app.clickup.com/t/${item.id}`} target="_blank" rel="noreferrer">Card da aula <ExternalLink size={13} /></a>
        </div></div>}
        {mode === 'tv' && <footer>Siga a orientação do Lucas.</footer>}
      </article>)}
      {!group.length && <div className="cf-empty"><p className="cf-eyebrow">{slotLabel(slot)}</p><h2>Nenhuma aula agendada aqui.</h2><p>Escolha outro horário ou dia. Aulas concluídas permanecem no histórico do ClickUp.</p></div>}
      {mode === 'tv' && group.length > 0 && Array.from({ length: 3 - group.length }, (_, i) => <div className="cf-vacant" key={i}><span>carefit</span><p>Seu espaço.<br />Seu próximo passo.</p></div>)}
    </div>}
    {mode === 'tv' ? <div className="cf-tv-footer"><span>Turma {slotLabel(slot)} · {group.length}/3 atletas</span><img src="/conheca-carefit/assets/carefit-logo-circle.png" alt="" /><div><Button variant="outline" aria-label="Bloco anterior" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}><ChevronLeft /></Button><span>Bloco {safePage + 1} de {maxPages}</span><Button variant="outline" aria-label="Próximo bloco" disabled={safePage + 1 >= maxPages} onClick={() => setPage(safePage + 1)}><ChevronRight /></Button></div></div> : <><p className="cf-help">Na TV: espelhe o PC, escolha o horário e clique em “Abrir na TV”. Use F11 se o navegador não entrar em tela cheia.</p>{classes?.some(c => !c.slot) && <div className="cf-alert">{classes.filter(c => !c.slot).length} aula(s) com horário ou etiqueta inconsistente. {classes.filter(c => !c.slot).map(c => <a key={c.id} href={`https://app.clickup.com/t/${c.id}`} target="_blank" rel="noreferrer">Conferir {c.name} </a>)}</div>}</>}
    <Dialog open={picker} onOpenChange={setPicker}><DialogContent className="cf-dialog"><DialogHeader><DialogTitle>Programar treino</DialogTitle><DialogDescription>Escolha o atleta. O treino será salvo no card dele no ClickUp.</DialogDescription></DialogHeader><Input placeholder="Buscar atleta pelo nome" aria-label="Buscar atleta" value={query} onChange={e => setQuery(e.target.value)} /><div className="cf-athlete-list">{athletes.filter(a => a.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())).map(a => <Button variant="outline" key={a.id} disabled={busy} onClick={() => void openEditor(a.id)}>{a.name}</Button>)}</div></DialogContent></Dialog>
    <Dialog open={importOpen} onOpenChange={open => { if (!busy) setImportOpen(open); }}><DialogContent className="cf-dialog cf-import"><DialogHeader><DialogTitle>Importar treinos do Excel</DialogTitle><DialogDescription>Baixe o modelo, preencha uma linha por exercício e revise os atletas antes de gravar no ClickUp.</DialogDescription></DialogHeader>
      <div className="cf-import-start"><a className="cf-template-link" href="/modelo-treinos-carefit.xlsx" download><Download size={17} /> Baixar modelo Excel</a><label>Arquivo preenchido<Input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" disabled={busy} onChange={event => { const file = event.target.files?.[0]; event.currentTarget.value = ''; if (file) void readWorkbook(file); }} /></label></div>
      <p className="cf-import-privacy">O arquivo é conferido neste computador. Somente os treinos confirmados são enviados ao ClickUp.</p>
      {importFile && <div className="cf-import-file"><FileSpreadsheet size={18} /><span>{importFile}</span><strong>{importItems.length} treino(s)</strong></div>}
      {importIssues.length > 0 && <div className="cf-import-issues" role="alert"><div><CircleAlert size={18} /><strong>Corrija o arquivo antes de importar</strong></div>{importIssues.slice(0, 12).map((issue, index) => <p key={index}>{issue}</p>)}{importIssues.length > 12 && <p>Mais {importIssues.length - 12} problema(s).</p>}</div>}
      {importItems.length > 0 && <div className="cf-import-list">{importItems.map(item => <div className="cf-import-item" key={item.key}><div><strong>{item.athleteName}</strong><span>{item.title} · {item.exercises.length} exercício(s)</span></div><span className={`cf-import-status cf-${item.state}`}>{item.state === 'ready' ? 'Pronto' : item.state === 'saving' ? 'Salvando…' : item.state === 'saved' ? 'Salvo' : item.message || 'Falhou'}</span></div>)}</div>}
      {alert}<div className="cf-import-actions"><Button variant="outline" disabled={busy} onClick={() => setImportOpen(false)}>Fechar</Button><Button className="cf-primary" disabled={busy || !importItems.length || importIssues.length > 0 || importItems.every(item => item.state === 'saved')} onClick={() => void importWorkouts()}><Upload size={16} /> {busy ? 'Importando…' : 'Importar para o ClickUp'}</Button></div>
      <p className="cf-import-footnote">A importação salva uma versão no card do atleta. Na aula desejada, ainda é preciso clicar em “Usar nesta aula”.</p>
    </DialogContent></Dialog>
    <Dialog open={!!editor} onOpenChange={open => { if (!open) closeEditor(); }}><DialogContent className="cf-dialog cf-editor" onInteractOutside={event => event.preventDefault()}><DialogHeader><DialogTitle>{editor?.name}</DialogTitle><DialogDescription>{targetClass ? 'Prepare o treino e separe a versão que será usada nesta aula.' : 'Preencha os exercícios e salve. Cada alteração cria uma nova versão no ClickUp.'}</DialogDescription></DialogHeader>
      {workout && <form onSubmit={e => { e.preventDefault(); void saveWorkout(); }}><div className="cf-editor-meta"><label>Nome do treino<Input required maxLength={80} value={workout.title} onChange={e => { setWorkout({ ...workout, title: e.target.value }); requestId.current = crypto.randomUUID(); }} /></label><label>Nome curto na TV<Input required maxLength={32} value={workout.displayName} onChange={e => { setWorkout({ ...workout, displayName: e.target.value }); requestId.current = crypto.randomUUID(); }} /></label></div>
      <div className="cf-editor-rows">{workout.exercises.map((e, i) => {
        const blocks = blocksOf(workout.exercises);
        const block = blocks.find(b => b.includes(i)) || [i];
        const joined = joinedWithPrevious(workout.exercises, i);
        const merged = i > 0 ? (blocks.find(b => b.includes(i - 1)) || [i - 1]).length + block.length : 0;
        const pause = block.length === 1 ? 'Pausa (s)' : i === block[block.length - 1] ? 'Pausa do bloco' : 'Pausa interna';
        return <Fragment key={i}>
          {i > 0 && <div className={'cf-join' + (joined ? ' cf-joined' : '')}>{joined
            ? <><span>{blockLabel(block.length)} · sem pausa entre eles</span><Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => applyExercises(workout, toggleJoin(workout.exercises, i))}><Ungroup size={14} /> Separar</Button></>
            : <Button type="button" variant="ghost" size="sm" disabled={busy || !canJoinWithPrevious(workout.exercises, i)} onClick={() => applyExercises(workout, toggleJoin(workout.exercises, i))}><Combine size={14} /> {canJoinWithPrevious(workout.exercises, i) ? `Juntar em ${blockLabel(merged).toLowerCase()}` : 'Bloco cheio (máximo de 4)'}</Button>}</div>}
          <div className={'cf-editor-row' + (block.length > 1 ? ' cf-in-block' : '')}><label>Exercício {i + 1}<Input required maxLength={80} value={e.name} onChange={v => updateExercise(i, 'name', v.target.value)} /></label><label>Séries<Input type="number" min={1} max={20} required value={e.sets} onChange={v => updateExercise(i, 'sets', v.target.value)} /></label><label>Repetições/tempo<Input required placeholder="10 ou 30 s" maxLength={25} value={e.reps} onChange={v => updateExercise(i, 'reps', v.target.value)} /></label><label>Carga + unidade<Input required placeholder="12 kg / corpo" maxLength={25} value={e.load} onChange={v => updateExercise(i, 'load', v.target.value)} /></label><label>{pause}<Input type="number" required min={0} max={900} value={e.rest} onChange={v => updateExercise(i, 'rest', v.target.value)} /></label><Button type="button" variant="ghost" aria-label={`Remover exercício ${i + 1}`} disabled={workout.exercises.length === 1 || busy} onClick={() => applyExercises(workout, workout.exercises.filter((_, n) => n !== i))}><Trash2 size={17} /></Button></div>
        </Fragment>;
      })}</div>
      <div className="cf-editor-actions"><Button type="button" variant="outline" disabled={workout.exercises.length >= 24 || busy} onClick={() => applyExercises(workout, [...workout.exercises, emptyExercise()])}><Plus size={16} /> Exercício</Button><Button type="submit" disabled={busy} className="cf-primary"><Check size={16} /> {busy ? 'Salvando…' : 'Salvar treino'}</Button></div></form>}
      {targetClass && editor?.revisions.length > 0 && <div className="cf-revisions"><h3>Treinos salvos — escolha para esta aula</h3>{editor.revisions.map(r => <div key={r.id}><span>{r.workout.title} · {new Date(r.createdAt).toLocaleString('pt-BR')}</span><Button disabled={busy} variant="outline" onClick={() => void selectWorkout(r)}>Usar nesta aula</Button></div>)}</div>}{alert}
    </DialogContent></Dialog>
    <Dialog open={!!completion} onOpenChange={open => { if (!open) closeCompletion(); }}><DialogContent className="cf-dialog" onInteractOutside={event => event.preventDefault()}><DialogHeader><DialogTitle>Evolução da aula</DialogTitle><DialogDescription>{completion?.session?.workout.displayName} · {slotLabel(slot)}. O registro fica no card desta aula.</DialogDescription></DialogHeader><form onSubmit={e => { e.preventDefault(); void run(async () => { await api(`classes/${completion!.id}/complete`, { evolution, requestId: completionId.current }); setCompletion(null); setNotice('Evolução salva. Aula concluída no ClickUp.'); await refresh(); }); }}><label>Como foi a aula?<Textarea required maxLength={5000} rows={7} value={evolution} onChange={e => setEvolution(e.target.value)} placeholder="Execução, cargas realizadas, dificuldades e ajustes para a próxima aula…" /></label>{alert}<Button className="cf-primary" type="submit" disabled={busy || !evolution.trim()}>{busy ? 'Salvando…' : 'Salvar evolução e concluir aula'}</Button></form></DialogContent></Dialog>
  </main>;
}
