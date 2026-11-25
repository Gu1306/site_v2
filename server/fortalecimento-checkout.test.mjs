import test from 'node:test';
import assert from 'node:assert/strict';
import { createService, estadoCheckout, CHECKOUT, CHECKOUT_MAX, IDS, dayOf } from './fortalecimento.mjs';

const AGORA = Date.now();
const HOJE = dayOf(AGORA);
const ONTEM = dayOf(AGORA - 86400000);
const inicio = (dia, hora = '07') => String(Date.parse(`${dia}T${hora}:00:00-03:00`));
const fim = (dia, hora = '07') => String(Date.parse(`${dia}T${hora}:00:00-03:00`) + 3600000);

function aula(id, extra = {}) {
  const { campos = {}, comentarios = [], dia = HOJE, status = 'realizada', ...resto } = extra;
  return {
    id, name: `Pessoa ${id} — Aula 3/24`, list: { id: IDS.classes }, status: { status }, subtasks: [],
    start_date: inicio(dia), due_date: fim(dia), tags: [{ name: '07h00-08h00' }], date_updated: String(AGORA),
    custom_fields: [{ id: IDS.relation, value: [{ id: 'atleta-' + id }] }, ...Object.entries(campos).map(([k, value]) => ({ id: k, value }))],
    comentarios, ...resto,
  };
}

function fixture(aulas) {
  const db = new Map(aulas.map(a => [a.id, a])); const calls = [];
  const api = async (url, method = 'GET', body) => {
    calls.push({ url, method, body }); const path = url.split('?')[0];
    const comentario = /^\/task\/([^/]+)\/comment$/.exec(path);
    if (comentario) return { comments: db.get(comentario[1]).comentarios.map(c => ({ comment_text: c.texto, date: String(c.quando) })) };
    const campo = /^\/task\/([^/]+)\/field\/([^/]+)$/.exec(path);
    if (campo) { const t = db.get(campo[1]); t.custom_fields = [...t.custom_fields.filter(f => f.id !== campo[2]), { id: campo[2], value: body.value }]; return {}; }
    const uma = /^\/task\/([^/]+)$/.exec(path);
    if (uma) { const t = db.get(uma[1]); if (!t) throw new Error('Unknown task'); return structuredClone(t); }
    if (/^\/list\/[^/]+\/task$/.test(path)) return { tasks: [...db.values()].map(t => structuredClone(t)), last_page: true };
    throw new Error('Unexpected API path ' + path);
  };
  const valor = (id, campoId) => db.get(id).custom_fields.find(f => f.id === campoId)?.value;
  return { db, calls, service: createService(api), valor };
}

test('estado do check-out: o comentário mais recente do robô manda no envio', () => {
  const base = { evolucao: 'Fez agachamento 3x10', agora: AGORA, atualizadoEm: AGORA };
  assert.equal(estadoCheckout({ agora: AGORA }).estado, 'sem-evolucao');
  assert.equal(estadoCheckout({ ...base }).estado, 'sem-pedido');
  assert.equal(estadoCheckout({ ...base, criar: true }).estado, 'gerando');
  assert.equal(estadoCheckout({ ...base, criar: true, atualizadoEm: AGORA - 40 * 60000 }).estado, 'parado');
  assert.equal(estadoCheckout({ ...base, criar: true, texto: 'Oi, Ana.' }).estado, 'pronto');
  assert.equal(estadoCheckout({ ...base, texto: 'Oi, Ana.', enviar: true }).estado, 'fila');
  const enviado = estadoCheckout({ ...base, texto: 'Oi, Ana.', comentarios: [{ texto: '🛑 Check-out NÃO enviado — falha de conexão', quando: 10 }, { texto: '✅ Check-out enviado no WhatsApp 5516… em 25/11', quando: 20 }] });
  assert.deepEqual(enviado, { estado: 'enviado', quando: 20 });
  const barrado = estadoCheckout({ ...base, texto: 'Oi, Ana.', comentarios: [{ texto: '🛑 Check-out NÃO enviado — trava de segurança (atleta_dia).\n\nJá existe check-out hoje.', quando: 30 }] });
  assert.equal(barrado.estado, 'bloqueado');
  assert.match(barrado.motivo, /trava de segurança/);
  assert.equal(estadoCheckout({ ...base, criar: true, comentarios: [{ texto: '🤖 Check-out NAO gerado — o rascunho foi reprovado', quando: 5 }] }).estado, 'reprovado');
  // Comentário que não fala de check-out não muda nada.
  assert.equal(estadoCheckout({ ...base, texto: 'Oi.', comentarios: [{ texto: 'Ficha pre-aula', quando: 99 }] }).estado, 'pronto');
});

test('lista: só aula realizada de hoje e de ontem, sem ler comentário de quem não tem evolução', async () => {
  const { service, calls } = fixture([
    aula('aaa', { campos: { [IDS.evolution]: 'Treino de força', [CHECKOUT.texto]: 'Oi, A.' } }),
    aula('bbb', { dia: ONTEM, campos: { [IDS.evolution]: 'Treino de força', [CHECKOUT.criar]: true } }),
    aula('ccc', {}),
    aula('ddd', { status: 'agendada', campos: { [IDS.evolution]: 'x' } }),
    aula('eee', { dia: dayOf(AGORA - 3 * 86400000), campos: { [IDS.evolution]: 'x' } }),
  ]);
  const r = await service.checkouts(AGORA);
  assert.deepEqual(r.items.map(i => [i.id, i.state]), [['aaa', 'pronto'], ['ccc', 'sem-evolucao'], ['bbb', 'gerando']]);
  assert.equal(r.items[0].text, 'Oi, A.');
  assert.equal(calls.filter(c => c.url.endsWith('/comment')).length, 2);
  assert.doesNotMatch(JSON.stringify(r), /atleta-|custom_fields/);
  // "ddd" é de hoje às 7h e segue agendada: só entra como pendente depois que a aula acabou.
  const acabou = Number(fim(HOJE)) + 60000;
  assert.deepEqual((await service.checkouts(acabou)).pending.map(p => p.id), ['ddd']);
  assert.deepEqual((await service.checkouts(Number(inicio(HOJE)) - 60000)).pending.map(p => p.id), []);
});

test('enviar: só o que está pronto, grava o ajuste do treinador e marca a autorização', async () => {
  const { service, valor, calls } = fixture([
    aula('aaa', { campos: { [IDS.evolution]: 'Treino de força', [CHECKOUT.texto]: 'Oi, A. Texto do robô.' } }),
    aula('fila', { campos: { [IDS.evolution]: 'x', [CHECKOUT.texto]: 'Oi.', [CHECKOUT.enviar]: true } }),
    aula('foi', { campos: { [IDS.evolution]: 'x', [CHECKOUT.texto]: 'Oi.' }, comentarios: [{ texto: '✅ Check-out enviado no WhatsApp', quando: 5 }] }),
    aula('velha', { dia: dayOf(AGORA - 4 * 86400000), campos: { [IDS.evolution]: 'x', [CHECKOUT.texto]: 'Oi.' } }),
    aula('aberta', { status: 'agendada' }),
  ]);
  await assert.rejects(service.checkoutSend('aaa', { text: ' ' }));
  await assert.rejects(service.checkoutSend('aaa', { text: 'x'.repeat(CHECKOUT_MAX + 1) }));
  await assert.rejects(service.checkoutSend('fila', { text: 'Oi.' }), { status: 409 });
  await assert.rejects(service.checkoutSend('foi', { text: 'Oi.' }), { status: 409 });
  await assert.rejects(service.checkoutSend('velha', { text: 'Oi.' }), { status: 409 });
  await assert.rejects(service.checkoutSend('aberta', { text: 'Oi.' }), { status: 409 });
  assert.ok(!calls.some(c => c.url.includes('/field/' + CHECKOUT.enviar)));

  const r = await service.checkoutSend('aaa', { text: 'Oi, A. Texto ajustado pelo treinador.' });
  assert.equal(r.state, 'fila');
  assert.equal(valor('aaa', CHECKOUT.texto), 'Oi, A. Texto ajustado pelo treinador.');
  assert.equal(valor('aaa', CHECKOUT.enviar), true);
  // Segundo clique não reenvia nem regrava.
  await assert.rejects(service.checkoutSend('aaa', { text: 'Oi, A. Texto ajustado pelo treinador.' }), { status: 409 });
});

test('pedir de novo: grava a evolução, limpa o rascunho antigo e marca a geração', async () => {
  const { service, valor } = fixture([
    aula('aaa', { campos: { [IDS.evolution]: 'treinou normal', [CHECKOUT.texto]: 'Oi, A. Rascunho antigo.' } }),
    aula('foi', { campos: { [IDS.evolution]: 'x', [CHECKOUT.texto]: 'Oi.' }, comentarios: [{ texto: '✅ Check-out enviado no WhatsApp', quando: 5 }] }),
    aula('barrada', { campos: { [IDS.evolution]: 'x', [CHECKOUT.texto]: 'Oi.' }, comentarios: [{ texto: '🛑 Check-out NÃO enviado — trava de segurança', quando: 5 }] }),
  ]);
  await assert.rejects(service.checkoutGenerate('aaa', { evolution: '  ' }));
  await assert.rejects(service.checkoutGenerate('foi', { evolution: 'Nova evolução' }), { status: 409 });
  await assert.rejects(service.checkoutGenerate('barrada', { evolution: 'Nova evolução' }), { status: 409 });
  const r = await service.checkoutGenerate('aaa', { evolution: 'Agachamento 3x10 com 20 kg, prancha 3x30s.' });
  assert.equal(r.state, 'gerando');
  assert.equal(valor('aaa', IDS.evolution), 'Agachamento 3x10 com 20 kg, prancha 3x30s.');
  assert.equal(valor('aaa', CHECKOUT.texto), '');
  assert.equal(valor('aaa', CHECKOUT.criar), true);
});
