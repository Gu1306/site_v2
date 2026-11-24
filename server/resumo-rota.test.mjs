import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, passwordHash } from './index.mjs';

// O serviço de fechamento é falso: o teste é sobre a porta, não sobre os números.
const fechamento = {
  atletas: async () => ({ lidoEm: Date.now(), atletas: [] }),
  listas: async () => ({ lidoEm: Date.now(), sessoes: [], fortalecimento: [], yoga: [] }),
};
const base = {
  PORTAL_ORIGIN: 'https://carefit.example',
  PORTAL_SESSION_SECRET: 'd'.repeat(64),
  PORTAL_USERS_JSON: JSON.stringify({ gustavo: passwordHash('senha-g') }),
  CLICKUP_API_TOKEN: 'fake-test-token',
};
const TOKEN = 'z'.repeat(48);

async function comServidor(env, usar) {
  const server = createServer({ ...base, ...env }, {}, {}, fechamento, { disponivel: false, fila: async () => { throw new Error('sem whatsapp'); } });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  try { await usar(`http://127.0.0.1:${server.address().port}/api/resumo`); } finally { server.close(); }
}
const comToken = token => ({ headers: { Authorization: 'Bearer ' + token } });

test('sem RESUMO_TOKEN configurado a porta fica fechada', async () => {
  await comServidor({}, async url => {
    const r = await fetch(url, comToken(TOKEN));
    assert.equal(r.status, 503);
    assert.match((await r.json()).error, /não foi configurado/);
  });
});

test('token curto não serve de senha', async () => {
  await comServidor({ RESUMO_TOKEN: 'curto' }, async url => {
    assert.equal((await fetch(url, comToken('curto'))).status, 503);
  });
});

test('sem token, com token errado ou no lugar errado: 401', async () => {
  await comServidor({ RESUMO_TOKEN: TOKEN }, async url => {
    assert.equal((await fetch(url)).status, 401, 'sem cabeçalho');
    assert.equal((await fetch(url, comToken('y'.repeat(48)))).status, 401, 'token errado');
    assert.equal((await fetch(url, comToken(TOKEN.slice(0, 40)))).status, 401, 'token cortado');
    assert.equal((await fetch(url, { headers: { Authorization: TOKEN } })).status, 401, 'sem o Bearer');
    // Query string entra em log de servidor: o token só vale no cabeçalho.
    assert.equal((await fetch(url + '?token=' + TOKEN)).status, 401);
  });
});

test('com o token certo devolve o texto do resumo e não indexa', async () => {
  await comServidor({ RESUMO_TOKEN: TOKEN }, async url => {
    const r = await fetch(url, comToken(TOKEN));
    assert.equal(r.status, 200);
    assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow');
    const corpo = await r.json();
    assert.match(corpo.texto, /\*CareFit —/);
    assert.match(corpo.texto, /\*Carteira\*/);
    assert.equal(corpo.whatsapp, false, 'WhatsApp fora do ar não derruba a rota');
    assert.match(corpo.hoje, /^\d{4}-\d{2}-\d{2}$/);
  });
});

test('o resumo não carrega telefone nem conversa', async () => {
  await comServidor({ RESUMO_TOKEN: TOKEN }, async url => {
    const corpo = await (await fetch(url, comToken(TOKEN))).json();
    assert.ok(!/\d{10,}/.test(corpo.texto), 'nenhum número de telefone no texto');
    assert.equal(Object.keys(corpo).sort().join(','), 'hoje,texto,whatsapp');
  });
});

test('só GET', async () => {
  await comServidor({ RESUMO_TOKEN: TOKEN }, async url => {
    const r = await fetch(url, { method: 'POST', ...comToken(TOKEN) });
    assert.equal(r.status, 405);
  });
});
