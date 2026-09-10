// ClickUp is the durable store. Never expose its token or raw task objects to clients.
export const IDS = { classes: '901328170178', athletes: '901326722390', relation: 'be0b6e78-1c02-4036-9a55-58a5604749ed', evolution: 'a9c4c1a7-cdd5-41e4-9a16-7b4a65405627' };
export class PublicError extends Error { constructor(message, status = 400) { super(message); this.status = status; } }
export function dayOf(ms) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Number(ms))); }
export function slotOf(task) {
  if (!task.start_date || !task.due_date || Number(task.due_date) - Number(task.start_date) !== 3600000) return null;
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(Number(task.start_date)));
  const slot = { '06:00': '06', '07:00': '07', '08:00': '08' }[time];
  const tag = slot && `${slot}h00-${String(Number(slot) + 1).padStart(2, '0')}h00`;
  const timeTags = (task.tags || []).filter(t => /^\d{2}h00-\d{2}h00$/.test(t.name));
  return slot && timeTags.length === 1 && timeTags[0].name === tag ? slot : null;
}
function clean(value, label, max = 100, required = true) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new PublicError(`Confira ${label}.`);
  return value.trim();
}
export function validateWorkout(w) {
  if (!w || !Array.isArray(w.exercises) || !w.exercises.length || w.exercises.length > 24) throw new PublicError('Cadastre de 1 a 24 exercícios.');
  return { title: clean(w.title, 'o nome do treino', 80), displayName: clean(w.displayName, 'o nome na TV', 32), exercises: w.exercises.map(e => {
    if (!Number.isInteger(e.sets) || e.sets < 1 || e.sets > 20 || !Number.isInteger(e.rest) || e.rest < 0 || e.rest > 900) throw new PublicError('Séries: 1 a 20. Pausa: 0 a 900 segundos.');
    return { name: clean(e.name, 'o exercício', 80), sets: e.sets, reps: clean(e.reps, 'as repetições/tempo', 25), load: clean(e.load, 'a carga com unidade', 25), rest: e.rest };
  }) };
}
const MARKER = 'CAREFIT_PORTAL_V1';
export function unpack(task) {
  const text = task.markdown_description || task.description || '';
  try { return JSON.parse(text.split(`${MARKER}\n`)[1]?.split('\n')[0]); } catch { return null; }
}
function pack(record, heading) {
  let text = heading + '\n\n';
  if (record.workout) {
    text += `${record.workout.title}\n\nExercício | Séries | Repetições/tempo | Carga | Pausa\n--- | --- | --- | --- | ---\n`;
    text += record.workout.exercises.map(e => [e.name, e.sets, e.reps, e.load, `${e.rest} s`].map(v => String(v).replace(/[|\r\n]/g, ' ')).join(' | ')).join('\n');
  }
  if (record.evolution) text += '\n\nEvolução: ' + record.evolution;
  return text + `\n\nRegistro do painel CareFit — editar pelo painel para preservar o histórico.\n\n${MARKER}\n${JSON.stringify(record)}\n`;
}
export function clickupClient(token, fetcher = fetch) {
  return async (path, method = 'GET', body) => {
    let res;
    try { res = await fetcher(`https://api.clickup.com/api/v2${path}`, { method, headers: { Authorization: token, 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(25000) }); }
    catch { throw new PublicError('O ClickUp não respondeu. Atualize antes de tentar novamente.', 503); }
    if (!res.ok) throw new PublicError(res.status === 429 ? 'O ClickUp está ocupado. Aguarde um minuto e tente novamente.' : 'Não foi possível confirmar a operação no ClickUp. Atualize e tente novamente.', 503);
    return res.status === 204 ? {} : res.json();
  };
}
export function createService(api) {
  const locks = new Map();
  async function locked(key, fn) {
    const prior = locks.get(key) || Promise.resolve();
    let release; const next = new Promise(r => { release = r; }); locks.set(key, next);
    await prior;
    try { return await fn(); } finally { release(); if (locks.get(key) === next) locks.delete(key); }
  }
  async function task(id, list) {
    if (!/^[a-zA-Z0-9_-]{3,40}$/.test(id)) throw new PublicError('Card inválido.');
    const t = await api(`/task/${id}?include_subtasks=true&include_markdown_description=true`);
    if (String(t.list?.id) !== list || t.parent) throw new PublicError('Card fora da lista autorizada.', 403);
    return t;
  }
  async function tasks(list, extra = '') {
    const all = [];
    for (let page = 0; page < 100; page++) {
      const result = await api(`/list/${list}/task?include_closed=true&subtasks=false&page=${page}${extra}`);
      all.push(...(result.tasks || []).filter(t => !t.parent));
      if (result.last_page || result.tasks?.length < 100) return all;
    }
    throw new PublicError('A lista excedeu o limite de consulta. Contate o suporte.', 503);
  }
  async function records(parent, kind) {
    const subs = (parent.subtasks || []).filter(t => t.name?.startsWith(kind === 'workout' ? 'Treino CareFit — ' : 'Sessão CareFit — '));
    const result = [];
    // Sequential reads respect ClickUp's rate limit. No contact/clinical data leaves the server.
    for (const s of subs) {
      const t = await api(`/task/${s.id}?include_markdown_description=true`);
      const data = unpack(t);
      if (data?.kind === kind && String(t.parent) === String(parent.id)) result.push({ ...data, id: t.id });
    }
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const athleteIds = t => (t.custom_fields?.find(f => f.id === IDS.relation)?.value || []).map(a => String(a.id));
  async function athlete(id) { const t = await task(id, IDS.athletes); return { id: t.id, name: t.name, revisions: await records(t, 'workout') }; }
  async function snapshot(t) { return (await records(t, 'session'))[0] || null; }
  async function createRecord(parent, list, record, name, heading) {
    const t = await api(`/list/${list}/task`, 'POST', { name, parent, markdown_content: pack(record, heading), notify_all: false });
    const confirmed = unpack(await api(`/task/${t.id}?include_markdown_description=true`));
    if (confirmed?.requestId !== record.requestId) throw new PublicError('Não foi possível verificar o registro salvo. Atualize antes de tentar novamente.', 503);
    return { ...confirmed, id: t.id };
  }
  return {
    athlete,
    async athletes() { return (await tasks(IDS.athletes)).map(t => ({ id: t.id, name: t.name })).sort((a, b) => a.name.localeCompare(b.name)); },
    async agenda(day) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(day + 'T00:00:00-03:00'))) throw new PublicError('Data inválida.');
      const start = Date.parse(day + 'T00:00:00-03:00');
      const items = await tasks(IDS.classes, `&start_date_gt=${start - 1}&start_date_lt=${start + 86400000}`);
      const result = [];
      for (const t of items.filter(t => t.status?.status === 'agendada' && t.start_date && dayOf(t.start_date) === day)) {
        const ids = athleteIds(t); const session = await snapshot(await task(t.id, IDS.classes));
        result.push({ id: t.id, name: t.name, slot: slotOf(t), athleteId: ids.length === 1 ? ids[0] : null, session, status: 'agendada' });
      }
      return { day, classes: result, syncedAt: new Date().toISOString() };
    },
    async saveWorkout(id, body, user) { return locked('athlete:' + id, async () => {
      const workout = validateWorkout(body.workout); const a = await athlete(id);
      const duplicate = a.revisions.find(r => r.requestId === body.requestId); if (duplicate) return duplicate;
      if ((a.revisions[0]?.id || null) !== (body.baseRevision || null)) throw new PublicError('O treino foi alterado em outra tela. Reabra o atleta para carregar a versão atual.', 409);
      const record = { kind: 'workout', workout, requestId: body.requestId, createdAt: new Date().toISOString(), author: user };
      return createRecord(id, IDS.athletes, record, `Treino CareFit — ${workout.title} — ${record.createdAt}`, 'Programação de fortalecimento');
    }); },
    async selectWorkout(id, body, user) { return locked('class:' + id, async () => {
      const t = await task(id, IDS.classes);
      if (t.status?.status !== 'agendada') throw new PublicError('Esta aula não está mais agendada.', 409);
      if (!slotOf(t)) throw new PublicError('Confira início, término e etiqueta da aula no ClickUp.');
      const ids = athleteIds(t); if (ids.length !== 1) throw new PublicError('Vincule exatamente um atleta à aula no ClickUp.');
      const previous = await records(t, 'session');
      const duplicate = previous.find(r => r.requestId === body.requestId); if (duplicate) return duplicate;
      const current = previous[0] || null;
      if (current?.completionRequestId) throw new PublicError('A evolução desta aula já começou a ser salva. Conclua o registro antes de alterar o treino.', 409);
      if ((current?.id || null) !== (body.baseSession || null)) throw new PublicError('O treino da aula mudou em outra tela. Atualize antes de escolher novamente.', 409);
      const a = await athlete(ids[0]); const revision = a.revisions.find(r => r.id === body.revisionId);
      if (!revision) throw new PublicError('Selecione um treino deste atleta.');
      return createRecord(id, IDS.classes, { kind: 'session', workout: revision.workout, revisionId: revision.id, athleteId: ids[0], requestId: body.requestId, createdAt: new Date().toISOString(), author: user }, `Sessão CareFit — ${dayOf(t.start_date)}`, 'Treino separado para esta aula — versão preservada');
    }); },
    async complete(id, body, user) { return locked('class:' + id, async () => {
      const evolution = clean(body.evolution, 'a evolução da aula', 5000);
      const t = await task(id, IDS.classes); const s = await snapshot(t);
      if (t.status?.status === 'realizada' && s?.completionRequestId === body.requestId) return { completed: true };
      if (t.status?.status !== 'agendada') throw new PublicError('Esta aula já saiu de agendada. Confira o histórico no ClickUp.', 409);
      if (!t.start_date || dayOf(t.start_date) > dayOf(Date.now())) throw new PublicError('Não é possível concluir uma aula futura.');
      if (!s || !athleteIds(t).includes(s.athleteId)) throw new PublicError('Separe o treino da aula antes de registrar a evolução.');
      if (s.completionRequestId && s.completionRequestId !== body.requestId) throw new PublicError('A conclusão já começou em outra tela. Atualize e confira a evolução no ClickUp.', 409);
      const updated = { ...s, evolution, completionRequestId: body.requestId, completedBy: user, completedAt: new Date().toISOString() };
      await api(`/task/${s.id}`, 'PUT', { markdown_content: pack(updated, 'Treino aplicado e evolução da aula') });
      const verified = unpack(await api(`/task/${s.id}?include_markdown_description=true`));
      if (verified?.evolution !== evolution || verified?.completionRequestId !== body.requestId) throw new PublicError('Evolução não confirmada. A aula continua agendada.', 503);
      await api(`/task/${id}/field/${IDS.evolution}`, 'POST', { value: evolution });
      const confirmed = await task(id, IDS.classes);
      if (confirmed.custom_fields?.find(f => f.id === IDS.evolution)?.value !== evolution) throw new PublicError('Evolução não confirmada no card. A aula continua agendada.', 503);
      if (confirmed.status?.status !== 'agendada') throw new PublicError('A situação da aula mudou no ClickUp durante o registro. A evolução foi salva; confira o card.', 409);
      await api(`/task/${id}`, 'PUT', { status: 'realizada' });
      if ((await task(id, IDS.classes)).status?.status !== 'realizada') throw new PublicError('Evolução salva; conclusão ainda não confirmada. Tente novamente.', 503);
      return { completed: true };
    }); }
  };
}
