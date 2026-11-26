import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, passwordHash } from './index.mjs';
import { criarServicoApp, validarAnotacao, textoDoComentario, lerAnotacao, MARCA_DIARIO, LIMITES_DIARIO } from './app-atleta.mjs';

const ANA = { id: 'crm-ana', nome: 'Ana Souza Lima', telefone: '+55 16 99111-2222', sessoes: [] };
const SESSAO = { atletaId: 'crm-ana', tel8: '91112222' };
const HOJE = '2026-11-26';

function montar() {
  let relogio = Date.parse('2026-11-26T11:41:00Z'); // 08:41 em Brasília
  const comentarios = []; // do mais novo para o mais antigo, como o ClickUp devolve
  const chamadas = [];
  let n = 0;
  const api = async (caminho, metodo, corpo) => {
    chamadas.push({ caminho, metodo, corpo });
    const m = /^\/task\/([^/?]+)\/comment(?:\?start=(\d+)&start_id=([^&]+))?$/.exec(caminho);
    if (!m) throw new Error('rota inesperada ' + caminho);
    if (metodo === 'POST') { n += 1; comentarios.unshift({ id: 'c' + n, task: m[1], comment_text: corpo.comment_text, date: String(relogio + n) }); return { id: 'c' + n }; }
    const doCard = comentarios.filter(c => c.task === m[1]);
    const inicio = m[3] ? doCard.findIndex(c => c.id === decodeURIComponent(m[3])) + 1 : 0;
    return { comments: doCard.slice(inicio, inicio + 25) };
  };
  const fechamento = { atletas: async () => ({ lidoEm: relogio, atletas: [ANA] }) };
  const app = criarServicoApp({ fechamento, api, agenda: {}, whatsapp: null, agora: () => relogio });
  return { app, api, comentarios, chamadas, avancar: ms => { relogio += ms; } };
}
const boa = (extra = {}) => ({ data: '2026-11-25', hora: '18:30', momento: 'Depois do treino', intensidade: 6, texto: 'Fisgada na panturrilha esquerda no fim do longão.', ...extra });

test('diário: validação barra futuro, passado demais, hora, momento, intensidade e texto', () => {
  assert.deepEqual(validarAnotacao(boa(), HOJE), boa());
  assert.deepEqual(validarAnotacao(boa({ hora: '', momento: '', intensidade: null }), HOJE), boa({ hora: '', momento: '', intensidade: null }));
  assert.equal(validarAnotacao(boa({ intensidade: 0 }), HOJE).intensidade, 0);
  for (const ruim of [
    { data: '2026-11-27' }, { data: '2026-09-01' }, { data: '26/11/2026' }, { data: '' },
    { hora: '25:00' }, { hora: '8h' }, { momento: 'De madrugada' },
    { intensidade: 11 }, { intensidade: -1 }, { intensidade: 5.5 }, { intensidade: '7' },
    { texto: 'ai' }, { texto: '   ' }, { texto: 'x'.repeat(LIMITES_DIARIO.texto + 1) },
  ]) assert.throws(() => validarAnotacao(boa(ruim), HOJE), { status: 400 }, JSON.stringify(ruim));
  // Caracteres de controle somem; quebra de linha fica, sem linhas em branco em série.
  assert.equal(validarAnotacao(boa({ texto: 'Dor\u0007 na lombar\r\n\n\n\nmelhorou à tarde' }), HOJE).texto, 'Dor na lombar\n\nmelhorou à tarde');
});

test('diário: o comentário é legível para a fisio e o app lê de volta exatamente o que gravou', () => {
  const texto = textoDoComentario(boa(), '26/11/2026 08:41');
  assert.equal(texto, [
    MARCA_DIARIO,
    'Quando: qua, 25/11/2026 às 18:30 · Depois do treino',
    'Intensidade: 6/10',
    'Anotado em: 26/11/2026 08:41',
    '',
    'Fisgada na panturrilha esquerda no fim do longão.',
  ].join('\n'));
  assert.deepEqual(lerAnotacao(texto), boa());
  const sem = boa({ hora: '', momento: '', intensidade: null, texto: 'Canela bem melhor.\nCorri 10 km sem dor.' });
  assert.deepEqual(lerAnotacao(textoDoComentario(sem, '26/11/2026 08:41')), sem);
  // Comentário qualquer do card (robô, equipe) não é anotação.
  assert.equal(lerAnotacao('Plano renovado pelo robô'), null);
  assert.equal(lerAnotacao(MARCA_DIARIO + '\nQuando: ontem\nIntensidade: 6/10\nAnotado em: x\n\noi'), null);
  assert.equal(lerAnotacao(undefined), null);
});

test('diário: anotar grava comentário no card do CRM, sem notificar, e só com sessão válida', async () => {
  const { app, chamadas, comentarios } = montar();
  await assert.rejects(app.anotar(null, boa()), { status: 401 });
  await assert.rejects(app.anotar({ atletaId: 'crm-ana', tel8: '00000000' }, boa()), { status: 401 });
  await assert.rejects(app.anotar(SESSAO, boa({ data: '2026-11-27' })), { status: 400 });
  assert.equal(chamadas.length, 0);
  assert.deepEqual(await app.anotar(SESSAO, boa()), { ok: true });
  assert.equal(chamadas.length, 1);
  assert.equal(chamadas[0].caminho, '/task/crm-ana/comment');
  assert.equal(chamadas[0].metodo, 'POST');
  assert.equal(chamadas[0].corpo.notify_all, false);
  assert.match(comentarios[0].comment_text, /Anotado em: 26\/11\/2026 08:41/);
});

test('diário: toque duplo não duplica; limite por dia; no dia seguinte libera', async () => {
  const { app, comentarios, avancar } = montar();
  await app.anotar(SESSAO, boa());
  assert.deepEqual(await app.anotar(SESSAO, boa()), { ok: true, repetida: true });
  assert.equal(comentarios.length, 1);
  avancar(3 * 60000);
  await app.anotar(SESSAO, boa()); // mesmo texto, 3 min depois: é outra anotação
  assert.equal(comentarios.length, 2);
  for (let i = 2; i < LIMITES_DIARIO.porDia; i++) await app.anotar(SESSAO, boa({ texto: 'anotação ' + i }));
  assert.equal(comentarios.length, LIMITES_DIARIO.porDia);
  await assert.rejects(app.anotar(SESSAO, boa({ texto: 'mais uma' })), { status: 429 });
  avancar(24 * 3600000);
  await app.anotar(SESSAO, boa({ data: '2026-11-26', texto: 'novo dia' }));
  assert.equal(comentarios.length, LIMITES_DIARIO.porDia + 1);
});

test('diário: lista só as anotações do app, da mais recente para a mais antiga, passando de página', async () => {
  const { app, comentarios } = montar();
  for (let i = 1; i <= 30; i++) comentarios.unshift({ id: 'r' + i, task: 'crm-ana', comment_text: 'comentário do robô ' + i, date: String(i) });
  await app.anotar(SESSAO, boa({ data: '2026-11-20', hora: '', texto: 'antiga' }));
  await app.anotar(SESSAO, boa({ data: '2026-11-25', hora: '07:00', momento: 'Ao acordar', texto: 'lombar ao acordar' }));
  await app.anotar(SESSAO, boa({ data: '2026-11-25', hora: '18:30', texto: 'panturrilha' }));
  // Uma anotação antiga lá atrás, depois de 25+ comentários de robô.
  comentarios.push({ id: 'velha', task: 'crm-ana', comment_text: textoDoComentario(boa({ data: '2026-10-01', hora: '', texto: 'bem antiga' }), '01/10/2026 10:00'), date: '0' });
  const { anotacoes } = await app.diario(SESSAO);
  assert.deepEqual(anotacoes.map(a => a.texto), ['panturrilha', 'lombar ao acordar', 'antiga', 'bem antiga']);
  assert.equal(anotacoes[1].momento, 'Ao acordar');
  await assert.rejects(app.diario(null), { status: 401 });
});

test('diário pela porta HTTP: sem login 401, de outra origem 403', async () => {
  const { app } = montar();
  const env = { PORTAL_ORIGIN: 'https://carefit.example', PORTAL_SESSION_SECRET: 'd'.repeat(64), PORTAL_USERS_JSON: JSON.stringify({ gustavo: passwordHash('senha-g') }), CLICKUP_API_TOKEN: 'fake' };
  const server = createServer(env, {}, {}, {}, {}, {}, app);
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  try {
    const url = `http://127.0.0.1:${server.address().port}/api/app/diario`;
    assert.equal((await fetch(url)).status, 401);
    assert.equal((await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://carefit.example' }, body: JSON.stringify(boa()) })).status, 401);
    assert.equal((await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://outro.example' }, body: JSON.stringify(boa()) })).status, 403);
  } finally { server.close(); }
});
