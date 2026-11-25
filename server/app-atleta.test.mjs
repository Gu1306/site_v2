import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, passwordHash } from './index.mjs';
import { CAMPO_CANCELOU, LIMITES, criarClienteAgenda, criarEnviadorWhatsapp, criarServicoApp, criarSessoes, comDdi, oito } from './app-atleta.mjs';

const ANA = { id: 'crm-ana', nome: 'Ana Souza Lima', telefone: '+55 16 99111-2222', sessoes: [{}, {}] };
const BIA = { id: 'crm-bia', nome: 'Bia Rocha', telefone: '16988883333', sessoes: [] };
const TOKEN = 'T'.repeat(32);

function montar(extra = {}) {
  const enviados = []; const chamadasClickup = []; const tarefas = []; const pedidosAgenda = [];
  let relogio = Date.parse('2026-11-25T12:00:00Z');
  const estado = {
    fort: [
      { id: 'aula-1', atletaId: 'crm-ana', status: 'em aberto', data: null },
      { id: 'aula-2', atletaId: 'crm-ana', status: 'em aberto', data: null },
      { id: 'aula-3', atletaId: 'crm-ana', status: 'agendada', data: '2026-11-27' },
      { id: 'aula-4', atletaId: 'crm-ana', status: 'realizada', data: '2026-11-20' },
      { id: 'aula-9', atletaId: 'crm-bia', status: 'agendada', data: '2026-11-27' },
    ],
    cancelada: false,
  };
  const fechamento = {
    atletas: async () => ({ lidoEm: relogio, atletas: [ANA, BIA] }),
    emails: async () => new Map([['crm-ana', 'ana@email.com'], ['crm-bia', '']]),
    listas: async () => ({ lidoEm: relogio, sessoes: [], fortalecimento: estado.fort, yoga: [] }),
  };
  const agenda = {
    minhas: async (m, telefone) => { pedidosAgenda.push(['minhas', m, telefone]); return m === 'fortalecimento' ? [{ aulaId: '2026-11-27T07:00', data: '2026-11-27', horaInicio: '07:00', quando: 'sexta-feira, 27/11, às 07h00', token: TOKEN }] : []; },
    reservar: async (m, pedido) => { pedidosAgenda.push(['reservar', m, pedido]); return { aulaId: pedido.aulaId, quando: 'segunda-feira, 30/11, às 06h00', inicioISO: 'i', fimISO: 'f', email: pedido.email, token: TOKEN }; },
    reserva: async () => ({ aulaId: '2026-11-27T07:00', quando: 'sexta-feira, 27/11, às 07h00', cancelada: estado.cancelada, passada: false, primeiroNome: 'Ana' }),
    cancelar: async (m, token) => { pedidosAgenda.push(['cancelar', m, token]); const ja = estado.cancelada; estado.cancelada = true; return { jaCancelada: ja, reserva: { aulaId: '2026-11-27T07:00', quando: 'sexta-feira, 27/11, às 07h00', tel8: '91112222', email: 'ana@email.com', nome: 'Ana Souza Lima' } }; },
    ...extra.agenda,
  };
  const whatsapp = extra.semWhatsapp ? null : { enviar: async (numero, texto) => { if (extra.whatsappFalha) throw new Error('fora do ar'); enviados.push({ numero, texto }); } };
  const api = async (caminho, metodo, corpo) => { chamadasClickup.push({ caminho, metodo, corpo }); if (extra.clickupFalha) throw new Error('clickup'); return {}; };
  let proximo = 123456;
  const app = criarServicoApp({ fechamento, api, agenda, whatsapp, agora: () => relogio, sortear: () => proximo, agendar: (fn, ms) => tarefas.push({ fn, ms }) });
  return { app, enviados, chamadasClickup, tarefas, pedidosAgenda, estado, avancar: ms => { relogio += ms; }, codigo: n => { proximo = n; } };
}
const codigoDe = texto => /\b(\d{6})\b/.exec(texto)[1];

test('telefone: últimos 8 dígitos e DDI', () => {
  assert.equal(oito('+55 (16) 99111-2222'), '91112222');
  assert.equal(oito('123'), '');
  assert.equal(comDdi('16991112222'), '5516991112222');
  assert.equal(comDdi('+5516991112222'), '5516991112222');
  assert.equal(comDdi('991112222'), '');
});

test('código vai para o número do CADASTRO e entra', async () => {
  const { app, enviados } = montar();
  assert.deepEqual(await app.pedirCodigo('(16) 99111-2222'), { ok: true });
  assert.equal(enviados.length, 1);
  assert.equal(enviados[0].numero, '5516991112222');
  assert.match(enviados[0].texto, /código de acesso é 123456/);
  assert.deepEqual(await app.confirmarCodigo('16991112222', codigoDe(enviados[0].texto)), { atletaId: 'crm-ana', tel8: '91112222' });
  // O código vale uma vez só.
  await assert.rejects(app.confirmarCodigo('16991112222', '123456'), { status: 401 });
});

test('número fora do cadastro recebe a mesma resposta e nenhuma mensagem sai', async () => {
  const { app, enviados } = montar();
  assert.deepEqual(await app.pedirCodigo('11977776666'), { ok: true });
  assert.equal(enviados.length, 0);
  await assert.rejects(app.confirmarCodigo('11977776666', '123456'), { status: 401 });
});

test('código errado, vencido ou tentado demais não entra', async () => {
  const { app, avancar } = montar();
  await app.pedirCodigo('16991112222');
  await assert.rejects(app.confirmarCodigo('16991112222', '000000'), { status: 401 });
  await assert.rejects(app.confirmarCodigo('16991112222', 'abc'), { status: 401 });
  avancar(LIMITES.codigoValeMs + 1);
  await assert.rejects(app.confirmarCodigo('16991112222', '123456'), { status: 401 });

  const outro = montar();
  await outro.app.pedirCodigo('16991112222');
  for (let i = 0; i < LIMITES.tentativasPorCodigo; i++) await assert.rejects(outro.app.confirmarCodigo('16991112222', '000000'), { status: 401 });
  // Depois do limite, nem o código certo serve: é preciso pedir outro.
  await assert.rejects(outro.app.confirmarCodigo('16991112222', '123456'), { status: 401 });
});

test('limite por número segura o envio, e volta depois de uma hora', async () => {
  const { app, enviados, avancar } = montar();
  for (let i = 0; i < LIMITES.pedidosPorHora; i++) await app.pedirCodigo('16991112222');
  await assert.rejects(app.pedirCodigo('16991112222'), { status: 429 });
  assert.equal(enviados.length, LIMITES.pedidosPorHora);
  // O limite vale também para número desconhecido: a resposta não denuncia quem é cliente.
  for (let i = 0; i < LIMITES.pedidosPorHora; i++) await app.pedirCodigo('11977776666');
  await assert.rejects(app.pedirCodigo('11977776666'), { status: 429 });

  avancar(3600001);
  await app.pedirCodigo('16991112222');
  assert.equal(enviados.length, LIMITES.pedidosPorHora + 1);
});

test('fusível diário fecha a porta quando estoura no mesmo dia', async () => {
  const fechamento = { atletas: async () => ({ atletas: Array.from({ length: 80 }, (_, i) => ({ id: 'a' + i, nome: 'Atleta ' + i, telefone: '1699000' + String(1000 + i), sessoes: [] })) }) };
  const enviados = [];
  const app = criarServicoApp({ fechamento, api: async () => ({}), agenda: {}, whatsapp: { enviar: async n => { enviados.push(n); } }, agora: () => Date.parse('2026-11-25T15:00:00Z') });
  let barrado = null;
  for (let i = 0; i < 80 && !barrado; i++) await app.pedirCodigo('1699000' + String(1000 + i)).catch(e => { barrado = e; });
  assert.equal(enviados.length, LIMITES.enviosPorDia);
  assert.equal(barrado.status, 503);
});

test('sem WhatsApp configurado, ou com ele fora do ar, o código não fica valendo', async () => {
  await assert.rejects(montar({ semWhatsapp: true }).app.pedirCodigo('16991112222'), { status: 503 });
  const { app } = montar({ whatsappFalha: true });
  await assert.rejects(app.pedirCodigo('16991112222'));
  await assert.rejects(app.confirmarCodigo('16991112222', '123456'), { status: 401 });
});

test('início: saldo só das aulas do próprio atleta, e as reservas das duas agendas', async () => {
  const { app, pedidosAgenda } = montar();
  const inicio = await app.inicio({ atletaId: 'crm-ana', tel8: '91112222' });
  assert.equal(inicio.primeiroNome, 'Ana');
  assert.deepEqual(inicio.fortalecimento, { temPacote: true, disponiveis: 2, agendadas: 1 });
  assert.equal(inicio.reservas.length, 1);
  assert.equal(inicio.reservas[0].modalidade, 'fortalecimento');
  assert.deepEqual(inicio.avisos, []);
  assert.ok(pedidosAgenda.every(p => p[2] === ANA.telefone));
  // Nada do cadastro vaza: nem telefone, nem id do ClickUp.
  assert.ok(!JSON.stringify(inicio).includes('crm-ana') && !JSON.stringify(inicio).includes('99111'));
});

test('início: agenda fora do ar vira aviso, não erro', async () => {
  const { app } = montar({ agenda: { minhas: async () => { throw new Error('caiu'); } } });
  const inicio = await app.inicio({ atletaId: 'crm-ana', tel8: '91112222' });
  assert.deepEqual(inicio.reservas, []);
  assert.equal(inicio.avisos.length, 2);
});

test('sessão sem atleta, ou com telefone trocado no cadastro, cai', async () => {
  const { app } = montar();
  await assert.rejects(app.inicio(null), { status: 401 });
  await assert.rejects(app.inicio({ atletaId: 'crm-ana', tel8: '00000000' }), { status: 401 });
  await assert.rejects(app.inicio({ atletaId: 'crm-sumiu', tel8: '91112222' }), { status: 401 });
});

test('reservar manda os dados do CADASTRO, não os do navegador', async () => {
  const { app, pedidosAgenda } = montar();
  const feita = await app.reservar({ atletaId: 'crm-ana', tel8: '91112222' }, { modalidade: 'yoga', aulaId: '2026-11-30T06:00', idempotencia: 'a'.repeat(32), nome: 'Outra Pessoa', telefone: '11900000000' });
  assert.deepEqual(pedidosAgenda.at(-1), ['reservar', 'yoga', { aulaId: '2026-11-30T06:00', nome: 'Ana Souza Lima', email: 'ana@email.com', telefone: '+5516991112222', idempotencia: 'a'.repeat(32) }]);
  assert.equal(feita.token, TOKEN);
  await assert.rejects(app.reservar({ atletaId: 'crm-ana', tel8: '91112222' }, { modalidade: 'pilates', aulaId: '2026-11-30T06:00', idempotencia: 'a'.repeat(32) }), { status: 400 });
  await assert.rejects(app.reservar({ atletaId: 'crm-ana', tel8: '91112222' }, { modalidade: 'yoga', aulaId: 'amanhã', idempotencia: 'a'.repeat(32) }), { status: 400 });
  await assert.rejects(app.reservar(null, { modalidade: 'yoga', aulaId: '2026-11-30T06:00', idempotencia: 'a'.repeat(32) }), { status: 401 });
});

test('atleta sem e-mail no cadastro reserva sem e-mail', async () => {
  const { app, pedidosAgenda } = montar();
  await app.reservar({ atletaId: 'crm-bia', tel8: '88883333' }, { modalidade: 'fortalecimento', aulaId: '2026-11-30T06:00', idempotencia: 'b'.repeat(32) });
  assert.equal(pedidosAgenda.at(-1)[2].email, '');
});

test('cancelar fortalecimento: planilha primeiro, depois o checkbox no card certo', async () => {
  const { app, chamadasClickup, pedidosAgenda, tarefas } = montar();
  const r = await app.cancelar('fortalecimento', TOKEN);
  assert.deepEqual(pedidosAgenda.at(-1), ['cancelar', 'fortalecimento', TOKEN]);
  assert.equal(r.credito, 'devolvido');
  assert.equal(r.jaCancelada, false);
  // Só o card `agendada` da Ana naquele dia; o da Bia, no mesmo dia, fica intacto.
  assert.deepEqual(chamadasClickup, [{ caminho: `/task/aula-3/field/${CAMPO_CANCELOU}`, metodo: 'POST', corpo: { value: true } }]);
  assert.equal(tarefas.length, 0);
});

test('cancelar duas vezes não marca o card de novo', async () => {
  const { app, chamadasClickup } = montar();
  await app.cancelar('fortalecimento', TOKEN);
  const segunda = await app.cancelar('fortalecimento', TOKEN);
  assert.equal(segunda.jaCancelada, true);
  assert.equal(chamadasClickup.length, 1);
});

test('yoga cancela só na planilha', async () => {
  const { app, chamadasClickup } = montar();
  const r = await app.cancelar('yoga', TOKEN);
  assert.equal(r.credito, null);
  assert.equal(chamadasClickup.length, 0);
});

test('reserva que ainda não virou card: confere depois da varredura, e só se continuar cancelada', async () => {
  const caso = montar();
  caso.estado.fort = caso.estado.fort.filter(c => c.id !== 'aula-3');
  const r = await caso.app.cancelar('fortalecimento', TOKEN);
  assert.equal(r.credito, 'sem-aula');
  assert.equal(caso.tarefas.length, 1);
  assert.equal(caso.tarefas[0].ms, LIMITES.conferirDepoisMs);
  // A varredura criou o card nesse meio-tempo: a conferência devolve o crédito.
  caso.estado.fort.push({ id: 'aula-3', atletaId: 'crm-ana', status: 'agendada', data: '2026-11-27' });
  await caso.tarefas[0].fn();
  assert.equal(caso.chamadasClickup.length, 1);

  // Mesmo cenário, mas a atleta reservou a MESMA aula de novo: a vaga nova não pode cair.
  const outro = montar();
  outro.estado.fort = outro.estado.fort.filter(c => c.id !== 'aula-3');
  await outro.app.cancelar('fortalecimento', TOKEN);
  outro.estado.fort.push({ id: 'aula-3', atletaId: 'crm-ana', status: 'agendada', data: '2026-11-27' });
  outro.estado.cancelada = false;
  await outro.tarefas[0].fn();
  assert.equal(outro.chamadasClickup.length, 0);
});

test('ClickUp fora do ar não desfaz o cancelamento', async () => {
  const { app, tarefas } = montar({ clickupFalha: true });
  const r = await app.cancelar('fortalecimento', TOKEN);
  assert.equal(r.ok, true);
  assert.equal(r.credito, 'falhou');
  assert.equal(tarefas.length, 1);
});

test('duas aulas do atleta no mesmo dia: não mexe em nenhuma', async () => {
  const caso = montar();
  caso.estado.fort.push({ id: 'aula-5', atletaId: 'crm-ana', status: 'agendada', data: '2026-11-27' });
  const r = await caso.app.cancelar('fortalecimento', TOKEN);
  assert.equal(r.credito, 'ambiguo');
  assert.equal(caso.chamadasClickup.length, 0);
});

test('token e modalidade malformados nem chegam à agenda', async () => {
  const { app, pedidosAgenda } = montar();
  await assert.rejects(app.cancelar('fortalecimento', 'curto'), { status: 400 });
  await assert.rejects(app.cancelar('natacao', TOKEN), { status: 400 });
  await assert.rejects(app.detalhe('fortalecimento', '../../etc'), { status: 400 });
  assert.equal(pedidosAgenda.length, 0);
});

test('sessão: assinatura, validade e separação do cookie da equipe', () => {
  let agora = 1000;
  const s = criarSessoes('s'.repeat(40), () => agora);
  const valor = s.emitir('crm-ana', '91112222');
  assert.deepEqual(s.ler(valor), { atletaId: 'crm-ana', tel8: '91112222' });
  assert.equal(s.ler(valor.slice(0, -2) + 'xx'), null);
  assert.equal(criarSessoes('outro-segredo'.repeat(4), () => agora).ler(valor), null);
  agora += LIMITES.sessaoMs + 1;
  assert.equal(s.ler(valor), null);
  assert.equal(s.ler(''), null);
});

test('cliente da agenda: chave só no corpo, erro de negócio com código', async () => {
  const pedidos = [];
  const responder = corpo => async (url, opcoes) => { pedidos.push({ url, opcoes }); return { text: async () => JSON.stringify(corpo) }; };
  const agenda = criarClienteAgenda({ AGENDA_CHAVE: 'c'.repeat(40), AGENDA_YOGA_URL: 'https://agenda.example/yoga' }, responder({ ok: true, reservas: [{ aulaId: 'x' }] }));
  assert.deepEqual(await agenda.minhas('yoga', '16991112222'), [{ aulaId: 'x' }]);
  assert.equal(pedidos[0].url, 'https://agenda.example/yoga');
  assert.equal(pedidos[0].opcoes.method, 'POST');
  assert.deepEqual(JSON.parse(pedidos[0].opcoes.body), { acao: 'minhas', chave: 'c'.repeat(40), telefone: '16991112222' });

  const lotada = criarClienteAgenda({ AGENDA_CHAVE: 'c'.repeat(40) }, responder({ ok: false, codigo: 'LOTADA', mensagem: 'Acabou.' }));
  await assert.rejects(lotada.reservar('fortalecimento', { aulaId: 'x' }), { status: 409, codigo: 'LOTADA', message: 'Acabou.' });

  const semChave = criarClienteAgenda({}, responder({ ok: true }));
  await assert.rejects(semChave.minhas('yoga', '1'), { status: 503 });
  // Cancelar pelo link não depende da chave do servidor.
  const cancelou = criarClienteAgenda({}, responder({ ok: true, reserva: { aulaId: 'x' } }));
  assert.deepEqual(await cancelou.cancelar('yoga', TOKEN), { reserva: { aulaId: 'x' }, jaCancelada: false });

  const html = criarClienteAgenda({}, async () => ({ text: async () => '<html>login</html>' }));
  await assert.rejects(html.reserva('yoga', TOKEN), { status: 502 });
});

test('enviador do WhatsApp: fechado sem configuração, e manda number + text', async () => {
  assert.equal(criarEnviadorWhatsapp({}), null);
  assert.equal(criarEnviadorWhatsapp({ EVOLUTION_BASE_URL: 'http://inseguro', EVOLUTION_INSTANCE: 'i', EVOLUTION_API_KEY: 'k' }), null);
  const pedidos = [];
  const zap = criarEnviadorWhatsapp({ EVOLUTION_BASE_URL: 'https://evo.example/', EVOLUTION_INSTANCE: 'care fit', EVOLUTION_API_KEY: 'k' }, async (url, opcoes) => { pedidos.push({ url, opcoes }); return { ok: true }; });
  await zap.enviar('5516991112222', 'oi');
  assert.equal(pedidos[0].url, 'https://evo.example/message/sendText/care%20fit');
  assert.deepEqual(JSON.parse(pedidos[0].opcoes.body), { number: '5516991112222', text: 'oi' });
  const fora = criarEnviadorWhatsapp({ EVOLUTION_BASE_URL: 'https://evo.example', EVOLUTION_INSTANCE: 'i', EVOLUTION_API_KEY: 'k' }, async () => ({ ok: false }));
  await assert.rejects(fora.enviar('1', 'x'), { status: 503 });
});

// ---------------------------------------------------------------- A porta HTTP
const base = {
  PORTAL_ORIGIN: 'https://carefit.example',
  PORTAL_SESSION_SECRET: 'd'.repeat(64),
  PORTAL_USERS_JSON: JSON.stringify({ gustavo: passwordHash('senha-g') }),
  CLICKUP_API_TOKEN: 'fake-test-token',
};
async function comServidor(app, usar, env = {}) {
  const server = createServer({ ...base, ...env }, {}, {}, {}, {}, {}, app);
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  try { await usar(`http://127.0.0.1:${server.address().port}`); } finally { server.close(); }
}
const post = (url, corpo, extra = {}) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://carefit.example', ...extra }, body: JSON.stringify(corpo) });

test('porta: entrar grava o cookie do atleta e o início só abre com ele', async () => {
  const { app, enviados } = montar();
  await comServidor(app, async url => {
    assert.equal((await fetch(url + '/api/app/inicio')).status, 401);
    assert.equal((await post(url + '/api/app/codigo', { telefone: '16991112222' })).status, 200);
    const entrou = await post(url + '/api/app/entrar', { telefone: '16991112222', codigo: codigoDe(enviados[0].texto) });
    assert.equal(entrou.status, 200);
    const cookie = entrou.headers.get('set-cookie');
    assert.match(cookie, /^carefit_atleta=[^;]+; HttpOnly; SameSite=Strict; Path=\/api\/app; Max-Age=5184000; Secure$/);
    const inicio = await fetch(url + '/api/app/inicio', { headers: { Cookie: cookie.split(';')[0] } });
    assert.equal(inicio.status, 200);
    assert.equal((await inicio.json()).primeiroNome, 'Ana');
    assert.equal(inicio.headers.get('x-robots-tag'), 'noindex, nofollow');
    // O cookie do atleta não abre o painel da equipe.
    assert.equal((await fetch(url + '/api/gestao/session', { headers: { Cookie: cookie.split(';')[0].replace('carefit_atleta', 'carefit_session') } })).status, 401);
  });
});

test('porta: POST de outra origem é recusado; cancelar pelo link funciona sem login', async () => {
  const { app, chamadasClickup } = montar();
  await comServidor(app, async url => {
    assert.equal((await post(url + '/api/app/cancelar', { modalidade: 'fortalecimento', token: TOKEN }, { Origin: 'https://outro.example' })).status, 403);
    assert.equal(chamadasClickup.length, 0);
    const detalhe = await fetch(`${url}/api/app/reserva?m=fortalecimento&t=${TOKEN}`);
    assert.equal(detalhe.status, 200);
    assert.equal((await detalhe.json()).quando, 'sexta-feira, 27/11, às 07h00');
    const r = await post(url + '/api/app/cancelar', { modalidade: 'fortalecimento', token: TOKEN });
    assert.equal(r.status, 200);
    assert.equal((await r.json()).credito, 'devolvido');
    assert.equal((await fetch(url + '/api/app/nada')).status, 404);
  });
});

test('porta: erro de negócio da agenda chega com o código para a tela reagir', async () => {
  const { ErroAgenda } = await import('./app-atleta.mjs');
  const { app } = montar({ agenda: { reservar: async () => { throw new ErroAgenda('LOTADA', 'A última vaga acabou.'); } } });
  const cookie = 'carefit_atleta=' + criarSessoes(base.PORTAL_SESSION_SECRET).emitir('crm-ana', '91112222');
  await comServidor(app, async url => {
    const r = await post(url + '/api/app/reservar', { modalidade: 'yoga', aulaId: '2026-11-30T06:00', idempotencia: 'a'.repeat(32) }, { Cookie: cookie });
    assert.equal(r.status, 409);
    assert.deepEqual(await r.json(), { error: 'A última vaga acabou.', codigo: 'LOTADA' });
  });
});

test('porta: sem segredo de sessão o app fica fechado', async () => {
  const { app } = montar();
  await comServidor(app, async url => { assert.equal((await fetch(url + '/api/app/inicio')).status, 503); }, { PORTAL_SESSION_SECRET: 'curto' });
});
