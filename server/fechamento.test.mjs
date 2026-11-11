import test from 'node:test';
import assert from 'node:assert/strict';
import { CAMPOS, LISTAS, montarCampanha, montarFechamento, opcao, reduzirAula, reduzirSessao, segundaDe, criarServicoFechamento } from './fechamento.mjs';
import { createServer, passwordHash } from './index.mjs';

// Data como o ClickUp grava: meia-noite ou 04h de Brasília.
const ms = (dia, hora = '04:00') => String(Date.parse(`${dia}T${hora}:00-03:00`));
const PROF = { id: CAMPOS.profissional, type_config: { options: [{ id: 'p0', name: 'Lívia Dias', orderindex: 0 }, { id: 'p2', name: 'Lais Faria', orderindex: 2 }, { id: 'p4', name: 'Lucas Pereira', orderindex: 4 }] } };
const PLANO = { id: CAMPOS.plano, type_config: { options: [{ id: 'm', name: 'Mensal', orderindex: 2 }, { id: 'r', name: 'Reabilitação', orderindex: 5 }, { id: 'f', name: 'Fortalecimento', orderindex: 7 }] } };
function sessao(id, nome, status, dia, prof, plano, valor) {
  return { id, url: 'https://app.clickup.com/t/' + id, name: `${nome} — Sessão 1/4 — x`, status: { status },
    custom_fields: [{ id: CAMPOS.dataSessao, value: dia ? ms(dia) : null }, { ...PROF, value: prof }, { ...PLANO, value: plano }, { id: CAMPOS.valorSessao, value: valor }] };
}
function aula(id, nome, status, dia, valor, hora = '06:00') {
  return { id, url: 'https://app.clickup.com/t/' + id, name: `${nome} — Aula 1/24`, status: { status },
    custom_fields: [{ id: CAMPOS.dataAula, value: dia ? ms(dia, hora) : null }, { id: CAMPOS.valorAula, value: valor }] };
}

const SESSOES = [
  sessao('s1', 'Ana', '✅ realizada', '2026-11-02', 0, 'm', 200), // segunda: entra
  sessao('s2', 'Bia', '✅ realizada', '2026-11-08', 'p2', 'r', '130'), // domingo, id novo e valor em texto
  sessao('s3', 'Caio', '✅ realizada', '2026-11-09', 0, 'm', 200), // segunda seguinte: fora
  sessao('s4', 'Dani', '✅ realizada', '2026-11-03', 0, 'r', 0), // cortesia
  sessao('s5', 'Edu', '🆕 aguardando', '2026-11-05', 2, 'r', 130), // esqueceram a baixa
  sessao('s6', 'Fê', '📅 agendada', '2026-11-07', 4, 'f', 110), // ainda vai acontecer (hoje = 06/11)
  sessao('s7', 'Gil', '❌ cancelada', '2026-11-04', 0, 'm', 200),
  sessao('s8', 'Hugo', '✅ realizada', null, 0, 'm', 200), // realizada sem data
  sessao('s9', 'Ana', '✅ realizada', '2026-10-27', 0, 'm', 200), // semana anterior, mesmo mês? não: outubro
];
const FORT = [
  aula('f1', 'Juliana', 'realizada', '2026-11-04', 65),
  aula('f2', 'Sabrina', 'faltou', '2026-11-04', 70),
  aula('f3', 'Sabrina', 'agendada', '2026-11-06', 70),
  aula('f4', 'Ana G', 'agendada', '2026-11-02', 65),
  aula('f5', 'Juliana', 'realizada', '2026-11-03', 0, '00:30'), // 00h30 de terça em SP = 03h30 UTC: continua terça
];
const YOGA = [aula('y1', 'Gustavo Rosa', 'realizada', '2026-11-05', 60)];
const dados = () => ({ sessoes: SESSOES.map(reduzirSessao), fortalecimento: FORT.map(reduzirAula), yoga: YOGA.map(reduzirAula) });

test('dropdown resolve tanto o orderindex antigo quanto o id novo', () => {
  assert.equal(opcao({ ...PROF, value: 2 }), 'Lais Faria');
  assert.equal(opcao({ ...PROF, value: 'p4' }), 'Lucas Pereira');
  assert.equal(opcao({ ...PROF, value: null }), null);
  assert.equal(opcao({ ...PROF, value: 9 }), null);
});

test('a semana vai de segunda a domingo e qualquer dia aponta para a sua segunda', () => {
  assert.equal(segundaDe('2026-11-08'), '2026-11-02');
  assert.equal(segundaDe('2026-11-02'), '2026-11-02');
  assert.equal(segundaDe('2026-11-09'), '2026-11-09');
});

test('fechamento conta só a semana pedida, por profissional e por tipo', () => {
  const f = montarFechamento(dados(), '2026-11-02', '2026-11-06');
  assert.equal(f.semana.fim, '2026-11-08');
  assert.equal(f.sessoes.realizadas, 3, 'segunda e domingo entram; a segunda seguinte não');
  assert.equal(f.sessoes.producao, 330);
  assert.equal(f.sessoes.cortesias, 1);
  assert.equal(f.sessoes.ticketMedio, 165, 'ticket sem cortesia');
  assert.deepEqual(f.sessoes.porProfissional.map(p => [p.nome, p.quantidade]), [['Lívia Dias', 2], ['Lais Faria', 1]]);
  assert.deepEqual(f.sessoes.porTipo.map(p => [p.nome, p.quantidade]), [['Mensal', 1], ['Reabilitação', 2]].sort((a, b) => b[1] - a[1]));
  assert.equal(f.sessoes.matriz.find(m => m.profissional === 'Lívia Dias').porTipo['Reabilitação'], 1);
  assert.equal(f.sessoes.canceladas, 1);
});

test('pendência de baixa é só o que já passou; o resto da semana fica como "por vir"', () => {
  const f = montarFechamento(dados(), '2026-11-02', '2026-11-06');
  assert.deepEqual(f.sessoes.pendentes.map(p => p.atleta), ['Edu']);
  assert.equal(f.sessoes.pendentes[0].url, 'https://app.clickup.com/t/s5');
  assert.equal(f.sessoes.porVir, 1);
  assert.deepEqual(f.fortalecimento.pendentes.map(p => [p.data, p.atleta]), [['2026-11-02', 'Ana G'], ['2026-11-06', 'Sabrina']]);
  assert.equal(f.fortalecimento.porVir, 0);
});

test('turma: falta queima crédito e entra na produção; cortesia não soma', () => {
  const f = montarFechamento(dados(), '2026-11-02', '2026-11-09');
  assert.equal(f.fortalecimento.realizadas, 2);
  assert.equal(f.fortalecimento.faltas, 1);
  assert.equal(f.fortalecimento.alunos, 1);
  assert.equal(f.fortalecimento.cortesias, 1);
  assert.equal(f.fortalecimento.producao, 135);
  assert.equal(f.porDia.find(d => d.data === '2026-11-03').fortalecimento, 1, 'aula de 00h30 fica no dia certo em SP');
  assert.equal(f.yoga.realizadas, 1);
  assert.equal(f.total.atendimentos, 3 + 2 + 1);
  assert.equal(f.total.producao, 330 + 135 + 60);
  assert.equal(f.semana.encerrada, true);
});

test('histórico de 8 semanas termina na semana pedida e traz a anterior para comparar', () => {
  const f = montarFechamento(dados(), '2026-11-02', '2026-11-09');
  assert.equal(f.historico.length, 8);
  assert.equal(f.historico.at(-1).segunda, '2026-11-02');
  assert.equal(f.anterior.segunda, '2026-10-26');
  assert.equal(f.anterior.sessoes, 1);
});

test('bônus da Lívia conta todas as sessões do mês até o domingo da semana', () => {
  const base = dados();
  const muitas = Array.from({ length: 104 }, (_, i) => ({ id: 'x' + i, url: null, atleta: 'A' + i, status: 'realizada', data: '2026-11-0' + (1 + (i % 7)), profissional: 'Igor', tipo: 'Mensal', valor: 100 }));
  const f = montarFechamento({ ...base, sessoes: [...base.sessoes, ...muitas] }, '2026-11-02', '2026-11-09');
  assert.equal(f.mes.referencia, '2026-11');
  assert.equal(f.mes.sessoes, 104 + 3);
  assert.equal(f.mes.bonusLivia, 15 * 7);
  assert.equal(montarFechamento(dados(), '2026-11-02', '2026-11-09').mes.faltamParaBonus, 101 - 3);
});

test('realizada sem data aparece como aviso, porque não cai em semana nenhuma', () => {
  const f = montarFechamento(dados(), '2026-11-02', '2026-11-09');
  assert.deepEqual(f.semData.map(s => [s.lista, s.atleta]), [['Sessões', 'Hugo']]);
});

test('serviço lê as três listas em páginas, guarda em cache e recusa semana futura', async () => {
  let chamadas = 0; let agora = Date.parse('2026-11-06T15:00:00-03:00');
  const paginas = { [LISTAS.sessoes]: SESSOES, [LISTAS.fortalecimento]: FORT, [LISTAS.yoga]: YOGA };
  const api = async url => { chamadas++; const [, lista] = /\/list\/(\d+)\/task/.exec(url); const page = Number(/page=(\d+)/.exec(url)[1]); return page === 0 ? { tasks: paginas[lista], last_page: true } : { tasks: [], last_page: true }; };
  const servico = criarServicoFechamento(api, () => agora);
  const f = await servico.semana('');
  assert.equal(f.semana.inicio, '2026-11-02');
  const primeira = chamadas;
  await servico.semana('2026-10-28');
  assert.equal(chamadas, primeira, 'segunda consulta sai do cache');
  await servico.semana('', true);
  assert.equal(chamadas, primeira, 'atualizar logo em seguida não gasta a API');
  agora += 61000; await servico.semana('', true);
  assert.ok(chamadas > primeira, 'depois de um minuto, atualizar relê o ClickUp');
  await assert.rejects(servico.semana('2026-11-10'), /semana atual/);
  await assert.rejects(servico.semana('ontem'), /Semana inválida/);
});

test('nova jornada começa em 11 de novembro e separa semanas de meses', () => {
  const s = (id, data, tipo) => ({ id, atleta: id, atletaId: id, status: 'realizada', data, tipo, valor: 180 });
  const sessoes = [s('antes', '2026-11-10', 'Avaliação'), s('inicio', '2026-11-11', 'Avaliação'), s('fim', '2026-11-30', 'Primeira Sessão Dupla'), s('dez', '2026-12-01', 'Avaliação'), s('futuro', '2026-12-03', 'Avaliação')];
  const origens = new Map([['inicio', 'Google Ads'], ['dez', 'Indicação']]);
  const jornada = montarCampanha({ sessoes, origens }, '2026-12-02').jornada;
  assert.deepEqual(jornada.semanas[0], { chave: '2026-11-09', de: '2026-11-11', ate: '2026-11-15', novos: 1, fisio: 1, recovery: 0, origens: { 'Google Ads': 1 }, encerrada: true });
  assert.equal(jornada.semanas.at(-1).novos, 2);
  assert.deepEqual(jornada.meses.map(x => [x.chave, x.de, x.ate, x.novos]), [['2026-11', '2026-11-11', '2026-11-30', 2], ['2026-12', '2026-12-01', '2026-12-31', 1]]);
  assert.equal(jornada.meses[1].origens['Indicação'], 1);
});

test('campanha: origens são contadas pelo vínculo com CRM e sem origem ficam não informadas', () => {
  const sessao = (id, atletaId) => ({ id, atleta: 'Mesmo nome', atletaId, status: 'realizada', data: '2026-11-03', tipo: 'Avaliação', valor: 180 });
  const sessoes = [sessao('a', 'crm-a'), sessao('b', 'crm-b'), sessao('c', null)];
  const origens = new Map([['crm-a', 'Google Ads'], ['crm-b', 'Indicação']]);
  const semana = montarCampanha({ sessoes, origens }, '2026-11-09').novosPorSemana.find(s => s.segunda === '2026-11-02');
  assert.equal(semana.novos, 3);
  assert.deepEqual(semana.origens, { 'Google Ads': 1, 'Indicação': 1, 'Não informada': 1 });
  assert.equal(montarCampanha({ sessoes }, '2026-11-09').novosPorSemana.find(s => s.segunda === '2026-11-02').origens, null);
});

test('campanha: quem entrou pela avaliação ou pela 1ª sessão dupla e continuou', () => {
  const s = (atleta, tipo, data, valor, status = 'realizada') => ({ id: atleta + tipo + data, url: 'https://app.clickup.com/t/' + atleta, atleta, status, data, profissional: 'X', tipo, valor });
  const sessoes = [
    s('Ana', 'Avaliação', '2026-09-01', 180), s('Ana', 'Reabilitação', '2026-09-08', 130), s('Ana', 'Reabilitação', null, 130, 'aguardando'), // plano vendido, sem data: conta
    s('Bia', 'Avaliação', '2026-09-10', 180), // não continuou
    s('Fê', 'Avaliação', '2026-09-15', 180), s('Fê', 'Mensal', '2026-09-20', 200, 'cancelada'), // cancelada não conta
    s('Caio', 'Primeira Sessão Dupla', '2026-08-01', 115), s('Caio', 'Primeira Sessão Dupla', '2026-08-08', 115), s('Caio', 'Mensal', '2026-08-20', 210),
    s('Caio', 'Semestral', null, 190000, 'aguardando'), // erro de digitação: fora da receita e listado
    s('Dani', 'Primeira Sessão Dupla', '2026-10-25', 115), // entrou há menos de 30 dias: ainda decidindo
    s('Edu', 'Semestral', '2026-09-01', 190), s('Edu', 'Avaliação', '2026-09-08', 180), // já era atleta: não é coorte de entrada
    s('Gil', 'Avaliação', '2026-11-03', 180), // novo nesta semana
  ];
  const c = montarCampanha({ sessoes, fortalecimento: [], yoga: [] }, '2026-11-09');
  assert.deepEqual(c.janela, { de: '2025-11-09', ate: '2026-10-10' });
  assert.deepEqual([c.entradas.fisio.atletas, c.entradas.fisio.continuaram], [3, 1]);
  assert.equal(c.entradas.fisio.receitaMediana, 260);
  assert.ok(Math.abs(c.entradas.fisio.taxa - 1 / 3) < 1e-9);
  assert.deepEqual([c.entradas.recovery.atletas, c.entradas.recovery.continuaram, c.entradas.recovery.receitaMediana], [1, 1, 210]);
  assert.equal(c.foraDoNormal.quantidade, 1);
  assert.equal(c.foraDoNormal.exemplos[0].valor, 190000);
  assert.equal(c.novosPorSemana.length, 8);
  assert.equal(c.novosPorSemana.at(-1).segunda, '2026-11-09');
  assert.equal(c.novosPorSemana.at(-1).encerrada, false);
  assert.deepEqual(c.novosPorSemana.find(w => w.segunda === '2026-10-19'), { segunda: '2026-10-19', novos: 1, fisio: 0, recovery: 1, origens: null, encerrada: true });
  assert.equal(c.novosPorSemana.find(w => w.segunda === '2026-11-02').fisio, 1);
});

test('o financeiro exige login e só abre para quem está na lista do financeiro', async () => {
  const env = { PORTAL_ORIGIN: 'https://carefit.example', PORTAL_SESSION_SECRET: 'b'.repeat(64), PORTAL_USERS_JSON: JSON.stringify({ gustavo: passwordHash('senha-g'), lucas: passwordHash('senha-l') }), CLICKUP_API_TOKEN: 'fake-test-token' };
  const fechamento = { semana: async (s, forcar) => ({ pedido: s, forcar }), campanha: async forcar => ({ campanha: true, forcar }) };
  const server = createServer(env, {}, {}, fechamento); await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/api/gestao/`;
  try {
    assert.equal((await fetch(base + 'fechamento')).status, 401);
    const entrar = async (user, password) => (await fetch(base + 'login', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: env.PORTAL_ORIGIN }, body: JSON.stringify({ user, password }) })).headers.get('set-cookie').split(';')[0];
    const lucas = await entrar('lucas', 'senha-l');
    assert.deepEqual(await (await fetch(base + 'session', { headers: { Cookie: lucas } })).json(), { user: 'lucas', financeiro: false });
    const negado = await fetch(base + 'fechamento', { headers: { Cookie: lucas } });
    assert.equal(negado.status, 403);
    assert.equal((await fetch(base + 'campanha', { headers: { Cookie: lucas } })).status, 403, 'a calculadora mostra receita: só financeiro');
    const gustavo = await entrar('gustavo', 'senha-g');
    assert.deepEqual(await (await fetch(base + 'session', { headers: { Cookie: gustavo } })).json(), { user: 'gustavo', financeiro: true });
    const ok = await fetch(base + 'fechamento?semana=2026-11-02&atualizar=1', { headers: { Cookie: gustavo } });
    assert.equal(ok.status, 200);
    assert.deepEqual(await ok.json(), { pedido: '2026-11-02', forcar: true });
    assert.deepEqual(await (await fetch(base + 'campanha', { headers: { Cookie: gustavo } })).json(), { campanha: true, forcar: false });
    assert.equal((await fetch(base + 'outra-coisa', { headers: { Cookie: gustavo } })).status, 404);
    // O mesmo cookie vale para os painéis antigos: um login só para a equipe.
    assert.equal((await fetch(`http://127.0.0.1:${server.address().port}/api/fortalecimento/session`, { headers: { Cookie: gustavo } })).status, 200);
    const pagina = await fetch(`http://127.0.0.1:${server.address().port}/gestao/financeiro`);
    assert.equal(pagina.headers.get('x-robots-tag'), 'noindex, nofollow');
  } finally { server.close(); }
});
