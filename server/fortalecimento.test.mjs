import test from 'node:test';
import assert from 'node:assert/strict';
import { createService, IDS, slotOf, dayOf, validateWorkout, unpack } from './fortalecimento.mjs';
import { createServer, passwordHash } from './index.mjs';
const workout = { title: 'Treino teste', displayName: 'Pessoa Teste', exercises: [{ name: 'Exercício de teste', sets: 3, reps: '10', load: 'corpo', rest: 60 }] };
function fixture() {
  const db = new Map(); const calls = []; let count = 0; let failField = false;
  db.set('athlete1', { id: 'athlete1', name: 'Pessoa Teste', list: { id: IDS.athletes }, subtasks: [] });
  db.set('class1', { id: 'class1', name: 'Pessoa Teste — Aula 1', list: { id: IDS.classes }, status: { status: 'agendada' }, start_date: String(Date.parse('2026-01-01T06:00:00-03:00')), due_date: String(Date.parse('2026-01-01T07:00:00-03:00')), tags: [{ name: '06h00-07h00' }], subtasks: [], custom_fields: [{ id: IDS.relation, value: [{ id: 'athlete1' }] }] });
  const api = async (url, method = 'GET', body) => {
    calls.push({ url, method, body }); const path = url.split('?')[0];
    const get = /^\/task\/([^/]+)$/.exec(path);
    if (get) {
      const t = db.get(get[1]); if (!t) throw new Error('Unknown task');
      if (method === 'PUT') { if (body.markdown_content) t.markdown_description = body.markdown_content; if (body.status) t.status = { status: body.status }; }
      return structuredClone(t);
    }
    const list = /^\/list\/([^/]+)\/task$/.exec(path);
    if (list && method === 'GET') return { tasks: [...db.values()].filter(t => t.list.id === list[1] && !t.parent), last_page: true };
    if (list && method === 'POST') {
      const t = { id: 'sub' + ++count, name: body.name, list: { id: list[1] }, parent: body.parent, markdown_description: body.markdown_content };
      db.set(t.id, t); db.get(body.parent).subtasks.push({ id: t.id, name: t.name }); return structuredClone(t);
    }
    const field = /^\/task\/([^/]+)\/field\/([^/]+)$/.exec(path);
    if (field) {
      if (failField) throw new Error('Simulated ClickUp outage');
      const t = db.get(field[1]); t.custom_fields = [...t.custom_fields.filter(f => f.id !== field[2]), { id: field[2], value: body.value }]; return {};
    }
    throw new Error('Unexpected API path ' + path);
  };
  return { db, calls, service: createService(api), setFailField: value => { failField = value; } };
}
test('São Paulo boundary and conflicting time tags', () => {
  assert.equal(dayOf(Date.parse('2026-01-02T01:00:00Z')), '2026-01-01');
  const { db } = fixture(); assert.equal(slotOf(db.get('class1')), '06');
  db.get('class1').tags = []; assert.equal(slotOf(db.get('class1')), null);
  assert.throws(() => validateWorkout({ ...workout, exercises: [{ ...workout.exercises[0], sets: 0 }] }));
});
test('immutable revisions, idempotent save and concurrent editor conflict', async () => {
  const { service, db } = fixture();
  const first = await service.saveWorkout('athlete1', { workout, requestId: 'save1', baseRevision: null }, 'lucas');
  assert.equal((await service.saveWorkout('athlete1', { workout, requestId: 'save1' }, 'lucas')).id, first.id);
  await assert.rejects(service.saveWorkout('athlete1', { workout, requestId: 'save2', baseRevision: null }, 'lucas'), /outra tela/);
  await service.selectWorkout('class1', { revisionId: first.id, requestId: 'select1' }, 'lucas');
  const sessionId = db.get('class1').subtasks[0].id;
  await service.saveWorkout('athlete1', { workout: { ...workout, title: 'Nova versão' }, requestId: 'save3', baseRevision: first.id }, 'lucas');
  assert.equal(unpack(db.get(sessionId)).workout.title, 'Treino teste');
  assert.equal(db.get('athlete1').description, undefined);
});
test('evolution confirmed before completion, outage retry, no athlete status mutation', async () => {
  const f = fixture(); const { service, db, calls } = f;
  const r = await service.saveWorkout('athlete1', { workout, requestId: 'save1' }, 'lucas');
  await service.selectWorkout('class1', { revisionId: r.id, requestId: 'select1' }, 'lucas');
  await assert.rejects(service.complete('class1', { evolution: ' ', requestId: 'done1' }, 'lucas'));
  f.setFailField(true);
  await assert.rejects(service.complete('class1', { evolution: 'Registro de teste', requestId: 'done1' }, 'lucas'));
  assert.equal(db.get('class1').status.status, 'agendada');
  f.setFailField(false);
  await service.complete('class1', { evolution: 'Registro de teste', requestId: 'done1' }, 'lucas');
  assert.equal(db.get('class1').status.status, 'realizada');
  assert.equal((await service.complete('class1', { evolution: 'Registro de teste', requestId: 'done1' }, 'lucas')).completed, true);
  const statusIndex = calls.findIndex(c => c.body?.status === 'realizada');
  assert.ok(calls.slice(0, statusIndex).some(c => c.url.includes('/field/') && c.body?.value === 'Registro de teste'));
  assert.ok(!calls.some(c => c.url === '/task/athlete1' && c.method === 'PUT'));
  assert.equal((await service.agenda('2026-01-01')).classes.length, 0);
});
test('reject other lists, future completion and ambiguous athlete relation', async () => {
  const { service, db } = fixture();
  await assert.rejects(service.athlete('class1'), /autorizada/);
  db.get('class1').custom_fields[0].value.push({ id: 'other' });
  await assert.rejects(service.selectWorkout('class1', { revisionId: 'invalid' }, 'lucas'), /exatamente um/);
  db.get('class1').start_date = String(Date.parse('2099-01-01T06:00:00-03:00'));
  await assert.rejects(service.complete('class1', { evolution: 'teste' }, 'lucas'), /futura/);
});
test('private API authentication, CSRF, cookie security and authorization', async t => {
  const env = { PORTAL_ORIGIN: 'https://carefit.example', PORTAL_SESSION_SECRET: 'a'.repeat(64), PORTAL_USERS_JSON: JSON.stringify({ lucas: passwordHash('test-password') }), CLICKUP_API_TOKEN: 'fake-test-token' };
  const server = createServer(env, fixture().service); await new Promise(r => server.listen(0, '127.0.0.1', r));
  t.after(() => new Promise(r => server.close(r)));
  const base = `http://127.0.0.1:${server.address().port}/api/fortalecimento/`;
  assert.equal((await fetch(base + 'agenda?day=2026-01-01')).status, 401);
  const headers = { 'Content-Type': 'application/json', Origin: env.PORTAL_ORIGIN };
  assert.equal((await fetch(base + 'login', { method: 'POST', headers: { ...headers, Origin: 'https://evil.example' }, body: JSON.stringify({ user: 'lucas', password: 'test-password' }) })).status, 403);
  const login = await fetch(base + 'login', { method: 'POST', headers, body: JSON.stringify({ user: 'lucas', password: 'test-password' }) });
  assert.equal(login.status, 200); const cookie = login.headers.get('set-cookie'); assert.match(cookie, /HttpOnly/); assert.match(cookie, /Secure/); assert.match(cookie, /SameSite=Strict/);
  const response = await fetch(base + 'agenda?day=2026-01-01', { headers: { Cookie: cookie.split(';')[0] } });
  assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
  const payload = await response.text(); assert.ok(!payload.includes('fake-test-token')); assert.ok(!payload.includes('custom_fields'));
  assert.equal((await fetch(base + 'session', { headers: { Cookie: cookie.split(';')[0] + 'tampered' } })).status, 401);
});
