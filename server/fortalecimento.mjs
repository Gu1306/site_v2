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
// Quantas versões de treino o painel recebe ao abrir um atleta. O histórico inteiro
// continua no ClickUp e `Usar nesta aula` aceita qualquer versão por id; o limite existe
// porque a leitura é uma requisição por versão e um atleta de anos travaria a tela.
export const PANEL_REVISIONS = 20;
export const MAX_BLOCK = 4;
// Bi-set e tri-set: exercícios vizinhos com o mesmo `group` formam um bloco. O campo é
// opcional — treinos gravados antes desta versão não têm `group` e cada exercício vira
// um bloco de um. O painel envia os blocos já numerados; aqui a numeração é refeita do
// zero para que o registro no ClickUp nunca dependa do que o navegador mandou.
export function exerciseBlocks(exercises) {
  const blocks = [];
  exercises.forEach((exercise, index) => {
    const previous = blocks[blocks.length - 1];
    const id = exercise.group ?? null;
    if (id !== null && previous && (exercises[previous[previous.length - 1]].group ?? null) === id) previous.push(index);
    else blocks.push([index]);
  });
  return blocks;
}
export const blockLabel = size => (size === 2 ? 'Bi-set' : size === 3 ? 'Tri-set' : 'Circuito');
export function validateWorkout(w) {
  if (!w || !Array.isArray(w.exercises) || !w.exercises.length || w.exercises.length > 24) throw new PublicError('Cadastre de 1 a 24 exercícios.');
  const exercises = w.exercises.map(e => {
    if (!Number.isInteger(e.sets) || e.sets < 1 || e.sets > 20 || !Number.isInteger(e.rest) || e.rest < 0 || e.rest > 900) throw new PublicError('Séries: 1 a 20. Pausa: 0 a 900 segundos.');
    if (e.group !== undefined && e.group !== null && !Number.isInteger(e.group)) throw new PublicError('Confira o agrupamento dos exercícios.');
    return { name: clean(e.name, 'o exercício', 80), sets: e.sets, reps: clean(e.reps, 'as repetições/tempo', 25), load: clean(e.load, 'a carga com unidade', 25), rest: e.rest, group: e.group ?? null };
  });
  const blocks = exerciseBlocks(exercises);
  const seen = new Set();
  for (const block of blocks) {
    if (block.length > MAX_BLOCK) throw new PublicError(`Um bi-set ou tri-set aceita no máximo ${MAX_BLOCK} exercícios.`);
    const id = exercises[block[0]].group;
    if (id === null) continue;
    // Ids repetidos em blocos separados indicariam exercícios fora de ordem.
    if (seen.has(id)) throw new PublicError('Exercícios do mesmo bloco precisam ficar em sequência.');
    seen.add(id);
  }
  let number = 0;
  blocks.forEach(block => {
    const grouped = block.length > 1;
    if (grouped) number += 1;
    for (const index of block) {
      if (grouped) exercises[index].group = number;
      else delete exercises[index].group;
    }
  });
  return { title: clean(w.title, 'o nome do treino', 80), displayName: clean(w.displayName, 'o nome na TV', 32), exercises };
}
const MARKER = 'CAREFIT_PORTAL_V1';
export function unpack(task) {
  // ClickUp escapes underscores/brackets when exporting ordinary text as Markdown.
  // Prefer its plain-text representation; new records also protect JSON in a fence.
  for (const source of [task.description, task.markdown_description]) {
    if (typeof source !== 'string') continue;
    const text = source.replace(/\r\n/g, '\n');
    const index = text.indexOf(MARKER + '\n');
    if (index < 0) continue;
    const lines = text.slice(index + MARKER.length + 1).trimStart().split('\n');
    if (lines[0].startsWith('```')) lines.shift();
    try { return JSON.parse(lines[0]); } catch { /* Try the other representation. */ }
  }
  return null;
}
function pack(record, heading) {
  let text = heading + '\n\n';
  if (record.workout) {
    const exercises = record.workout.exercises;
    const blocks = exerciseBlocks(exercises);
    const names = new Map();
    let number = 0;
    for (const block of blocks) {
      if (block.length < 2) continue;
      number += 1;
      for (const index of block) names.set(index, `${blockLabel(block.length)} ${number}`);
    }
    // A coluna do bloco só aparece quando o treino tem bi-set ou tri-set, para
    // que os treinos simples continuem com a mesma tabela de sempre no ClickUp.
    const columns = names.size ? ['Bloco', 'Exercício', 'Séries', 'Repetições/tempo', 'Carga', 'Pausa'] : ['Exercício', 'Séries', 'Repetições/tempo', 'Carga', 'Pausa'];
    text += `${record.workout.title}\n\n${columns.join(' | ')}\n${columns.map(() => '---').join(' | ')}\n`;
    text += exercises.map((e, index) => {
      const cells = [e.name, e.sets, e.reps, e.load, `${e.rest} s`];
      if (names.size) cells.unshift(names.get(index) || '—');
      return cells.map(v => String(v).replace(/[|\r\n]/g, ' ')).join(' | ');
    }).join('\n');
  }
  if (record.evolution) text += '\n\nEvolução: ' + record.evolution;
  return text + `\n\nRegistro do painel CareFit — editar pelo painel para preservar o histórico.\n\n\`\`\`json\n${MARKER}\n${JSON.stringify(record)}\n\`\`\`\n`;
}
// ---------------------------------------------------------------- check-out pós-aula
// O envio continua sendo do robô do n8n (guardrails, 1 por atleta/dia, fusível diário).
// O painel só faz o que o treinador fazia à mão no ClickUp: marcar "IA pode Criar - Aula",
// ler/ajustar o "Check Out de Aula" e marcar "IA pode Enviar Check Out".
export const CHECKOUT = {
  dataAula: '55b91b8a-b0b3-458c-af17-d49aaf71fa15',
  criar: '1b9c51b3-a6b4-4909-b71d-9d67e4c8929e', // "IA pode Criar - Aula"
  texto: 'dae3a0c3-8076-4141-8f19-0be9c1b0d21d', // "Check Out de Aula"
  enviar: '0f0023bc-ed4c-4412-bd3c-f76535f740a9', // "IA pode Enviar Check Out"
};
export const CHECKOUT_MAX = 1300; // mesmo teto do validador do robô
export const PENDENTES_DIAS = 7; // até onde o painel cobra aula sem evolução
const ESPERA_GERACAO_MS = 25 * 60000; // o robô roda a cada 10 min; passou disso, algo barrou
const marcado = v => v === true || String(v).toLowerCase() === 'true';

/**
 * Em que pé está o check-out de uma aula. Função pura.
 * O recibo e os bloqueios do robô são COMENTÁRIOS no card (a lista não tem campo de
 * status), por isso o comentário mais recente sobre check-out é a verdade do envio.
 */
export function estadoCheckout({ evolucao = '', texto = '', criar = false, enviar = false, comentarios = [], atualizadoEm = 0, agora = Date.now() }) {
  const sobre = comentarios.filter(c => /check-out/i.test(c.texto || '')).sort((a, b) => b.quando - a.quando);
  const ultimo = sobre[0] || null;
  const resumo = c => String(c.texto || '').replace(/\s+/g, ' ').trim().slice(0, 400);
  if (ultimo && /^✅/.test(ultimo.texto.trim())) return { estado: 'enviado', quando: ultimo.quando };
  if (enviar && texto) return { estado: 'fila' };
  if (ultimo && /N[ÃA]O enviado|FALHOU/.test(ultimo.texto)) return { estado: 'bloqueado', motivo: resumo(ultimo) };
  if (texto) return { estado: 'pronto' };
  if (ultimo && /N[ÃA]O gerado/.test(ultimo.texto)) return { estado: 'reprovado', motivo: resumo(ultimo) };
  if (!evolucao) return { estado: 'sem-evolucao' };
  if (criar) return { estado: agora - atualizadoEm > ESPERA_GERACAO_MS ? 'parado' : 'gerando' };
  return { estado: 'sem-pedido' };
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
  async function records(parent, kind, limit = 0) {
    let subs = (parent.subtasks || []).filter(t => t.name?.startsWith(kind === 'workout' ? 'Treino CareFit — ' : 'Sessão CareFit — '));
    // Cada subtarefa custa uma leitura, então cortar depois de ler não economiza nada.
    // O nome do treino termina no `createdAt` ISO, o que permite ordenar e cortar ANTES.
    // Só vale para treino: o nome da sessão traz a data sem hora, e duas sessões do mesmo
    // dia empatariam — aí o corte poderia descartar justamente a mais recente.
    if (limit && kind === 'workout' && subs.length > limit) {
      subs = subs
        .map(t => ({ t, at: (/(\d{4}-\d{2}-\d{2}T[\d:.]+Z)$/.exec(t.name) || ['', ''])[1] }))
        .sort((a, b) => b.at.localeCompare(a.at))
        .slice(0, limit)
        .map(item => item.t);
    }
    const result = [];
    // Sequential reads respect ClickUp's rate limit. No contact/clinical data leaves the server.
    for (const s of subs) {
      const t = await api(`/task/${s.id}?include_markdown_description=true`);
      const data = unpack(t);
      if (data?.kind === kind && String(t.parent) === String(parent.id)) result.push({ ...data, id: t.id });
    }
    const seen = new Set();
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).filter(record => {
      const key = record.requestId || record.id;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
  }
  const athleteIds = t => (t.custom_fields?.find(f => f.id === IDS.relation)?.value || []).map(a => String(a.id));
  async function athlete(id, limit = 0) { const t = await task(id, IDS.athletes); return { id: t.id, name: t.name, revisions: await records(t, 'workout', limit) }; }
  async function snapshot(t) { return (await records(t, 'session'))[0] || null; }
  async function createRecord(parent, list, record, name, heading) {
    const t = await api(`/list/${list}/task`, 'POST', { name, parent, markdown_content: pack(record, heading), notify_all: false });
    const confirmed = unpack(await api(`/task/${t.id}?include_markdown_description=true`));
    if (confirmed?.requestId !== record.requestId) throw new PublicError('Não foi possível verificar o registro salvo. Atualize antes de tentar novamente.', 503);
    return { ...confirmed, id: t.id };
  }
  const valor = (t, id) => t.custom_fields?.find(f => f.id === id)?.value;
  async function lerCheckout(t, agora = Date.now()) {
    const evolucao = String(valor(t, IDS.evolution) || '').trim();
    const texto = String(valor(t, CHECKOUT.texto) || '').trim();
    // Comentário só interessa quando há algo em andamento: aula sem evolução não custa leitura.
    const comentarios = evolucao ? ((await api(`/task/${t.id}/comment`)).comments || []).map(c => ({ texto: String(c.comment_text || ''), quando: Number(c.date) || 0 })) : [];
    const pe = estadoCheckout({ evolucao, texto, criar: marcado(valor(t, CHECKOUT.criar)), enviar: marcado(valor(t, CHECKOUT.enviar)), comentarios, atualizadoEm: Number(t.date_updated) || 0, agora });
    return { state: pe.estado, reason: pe.motivo || '', sentAt: pe.quando ? new Date(pe.quando).toISOString() : null, evolution: evolucao, text: texto };
  }
  async function aulaNaJanela(id) {
    const t = await task(id, IDS.classes);
    if (t.status?.status !== 'realizada') throw new PublicError('O check-out só existe para aula realizada.', 409);
    const dia = t.start_date ? dayOf(t.start_date) : '';
    if (dia !== dayOf(Date.now()) && dia !== dayOf(Date.now() - 86400000)) throw new PublicError('O check-out só pode ser enviado no dia da aula ou no dia seguinte.', 409);
    return t;
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
      // Pede o rascunho do check-out ao robô. A aula já está concluída: se este passo
      // falhar, o treinador pede de novo pela lista de check-outs, sem perder nada.
      let checkout = 'pedido';
      try { await api(`/task/${id}/field/${CHECKOUT.criar}`, 'POST', { value: true }); } catch { checkout = 'falhou'; }
      return { completed: true, checkout };
    }); },
    /** Aulas realizadas de hoje e de ontem (a janela do robô), com o pé do check-out de cada uma. */
    async checkouts(agora = Date.now()) {
      const hoje = dayOf(agora); const ontem = dayOf(agora - 86400000);
      // Uma leitura só, de 7 dias: serve aos check-outs (hoje e ontem) e às aulas que passaram
      // e continuam "agendada", ou seja, sem evolução. Sem evolução não existe mensagem.
      const inicio = Date.parse(dayOf(agora - PENDENTES_DIAS * 86400000) + 'T00:00:00-03:00');
      const itens = await tasks(IDS.classes, `&start_date_gt=${inicio - 1}&start_date_lt=${Date.parse(hoje + 'T00:00:00-03:00') + 86400000}`);
      const pending = itens
        .filter(t => t.status?.status === 'agendada' && t.start_date && Number(t.due_date || t.start_date) < agora)
        .map(t => ({ id: t.id, name: t.name, day: dayOf(t.start_date), slot: slotOf(t) }))
        .sort((a, b) => b.day.localeCompare(a.day) || String(a.slot).localeCompare(String(b.slot)) || a.name.localeCompare(b.name));
      const result = [];
      for (const t of itens.filter(t => t.status?.status === 'realizada' && t.start_date)) {
        const dia = dayOf(t.start_date);
        if (dia !== hoje && dia !== ontem) continue;
        result.push({ id: t.id, name: t.name, day: dia, slot: slotOf(t), ...(await lerCheckout(t, agora)) });
      }
      result.sort((a, b) => b.day.localeCompare(a.day) || String(a.slot).localeCompare(String(b.slot)) || a.name.localeCompare(b.name));
      return { today: hoje, yesterday: ontem, items: result, pending, syncedAt: new Date(agora).toISOString() };
    },
    /** Pede (ou pede de novo) o rascunho: grava a evolução, limpa o texto antigo e marca "IA pode Criar". */
    async checkoutGenerate(id, body) { return locked('class:' + id, async () => {
      const evolution = clean(body.evolution, 'a evolução da aula', 5000);
      const t = await aulaNaJanela(id);
      const atual = await lerCheckout(t);
      if (atual.state === 'enviado') throw new PublicError('O check-out desta aula já foi enviado.', 409);
      if (atual.state === 'fila') throw new PublicError('O check-out desta aula já está na fila de envio.', 409);
      if (atual.state === 'bloqueado') throw new PublicError('O envio desta aula foi barrado pelo robô. Fale com o Gustavo antes de tentar de novo.', 409);
      await api(`/task/${id}/field/${IDS.evolution}`, 'POST', { value: evolution });
      // O robô só gera para aula SEM check-out gravado, e só de novo se a evolução mudou.
      if (atual.text) await api(`/task/${id}/field/${CHECKOUT.texto}`, 'POST', { value: '' });
      await api(`/task/${id}/field/${CHECKOUT.criar}`, 'POST', { value: true });
      return lerCheckout(await task(id, IDS.classes));
    }); },
    /** O treinador leu (e talvez ajustou) o texto: grava o ajuste e marca "IA pode Enviar Check Out". */
    async checkoutSend(id, body) { return locked('class:' + id, async () => {
      const text = clean(body.text, 'o texto do check-out', CHECKOUT_MAX);
      const t = await aulaNaJanela(id);
      const atual = await lerCheckout(t);
      if (atual.state !== 'pronto') throw new PublicError(atual.state === 'enviado' ? 'O check-out desta aula já foi enviado.' : atual.state === 'fila' ? 'O check-out desta aula já está na fila de envio.' : 'Este check-out não está pronto para envio. Atualize a tela.', 409);
      if (text !== atual.text) {
        await api(`/task/${id}/field/${CHECKOUT.texto}`, 'POST', { value: text });
        const conferido = await task(id, IDS.classes);
        if (String(valor(conferido, CHECKOUT.texto) || '').trim() !== text) throw new PublicError('O ajuste do texto não foi confirmado. Nada foi enviado.', 503);
      }
      await api(`/task/${id}/field/${CHECKOUT.enviar}`, 'POST', { value: true });
      return lerCheckout(await task(id, IDS.classes));
    }); }
  };
}
