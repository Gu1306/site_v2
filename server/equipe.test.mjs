import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularComissao, diasDoMes, mesAnterior, montarEquipe, REGRAS, validarMes } from './equipe.mjs';
import { CAMPOS, reduzirSessao } from './fechamento.mjs';
import { createServer, passwordHash } from './index.mjs';

// Sessões já reduzidas (o que o cache do fechamento guarda).
const s = (atleta, dia, profissional, tipo, valor, extra = {}) => ({
  id: atleta + dia, url: 'https://app.clickup.com/t/' + atleta, atleta, status: 'realizada',
  data: dia, profissional, tipo, valor, pagamento: 'PIX', atletaId: null, ...extra,
});
const aula = (atleta, dia, valor, status = 'realizada') => ({ id: atleta + dia, atleta, status, data: dia, valor, url: null });

const DADOS = {
  sessoes: [
    s('Ana', '2026-11-03', 'Lais Faria', 'Mensal', 200),
    s('Bia', '2026-11-05', 'Lais Faria', 'Reabilitação', 130),
    s('Caio', '2026-11-05', 'Lais Faria', 'Mensal', 0, { pagamento: 'Cortesia' }), // cortesia: não entra no ticket
    s('Dani', '2026-11-06', 'Igor', 'Avaliação', 180, { pagamento: 'À Pagar (exceção)' }),
    s('Edu', '2026-11-10', 'Lívia Dias', 'Mensal', 200), // depois de hoje (06/11): fora
    s('Fê', '2026-11-04', 'Lais Faria', 'Semestral', 190000), // erro de digitação: fora da conta
    s('Gil', '2026-10-28', 'Lais Faria', 'Mensal', 200), // outro mês
    { ...s('Hugo', '2026-11-04', 'Igor', 'Mensal', 200), status: 'cancelada' },
    { ...s('Ivo', '2026-11-04', 'Igor', 'Mensal', 200), status: '🆕 aguardando' },
  ],
  fortalecimento: [aula('Ana', '2026-11-03', 110), aula('Bia', '2026-11-04', 110, 'faltou'), aula('Caio', '2026-11-20', 110)],
  yoga: [aula('Dani', '2026-11-05', 50)],
};
const HOJE = '2026-11-06';
const mes = (dados = DADOS, m = '2026-11', hoje = HOJE) => montarEquipe(dados, m, hoje, null);

test('comissão percentual: produção menos 18%, dividido por 2', () => {
  const c = calcularComissao(REGRAS['Lais Faria'], 1000, 0);
  assert.equal(c.valor, 410);
  assert.equal(c.confirmada, true);
  assert.match(c.formula, /÷ 2/);
});

test('comissão fixa soma o bônus por volume só acima do limite', () => {
  assert.equal(calcularComissao(REGRAS['Lívia Dias'], 0, 100).valor, 4000);
  assert.equal(calcularComissao(REGRAS['Lívia Dias'], 0, 105).valor, 4075);
  assert.equal(calcularComissao(REGRAS['Lívia Dias'], 0, 105).bonus, 75);
});

test('quem não tem regra registrada não ganha número inventado', () => {
  const c = calcularComissao(undefined, 5000, 200);
  assert.equal(c.valor, null);
  assert.equal(c.confirmada, false);
});

test('Lucas recebe pela mesma regra dos outros comissionados', () => {
  assert.equal(calcularComissao(REGRAS['Lucas Pereira'], 1000, 0).valor, 410);
});

test('quem saiu da equipe só aparece nos meses em que atendeu', () => {
  assert.ok(REGRAS['Lilian Vidal'].foraDaEquipe);
  assert.equal(mes().profissionais.some(p => p.nome === 'Lilian Vidal'), false);
  const comLilian = { ...DADOS, sessoes: [...DADOS.sessoes, s('Nina', '2026-11-04', 'Lilian Vidal', 'Mensal', 200)] };
  const p = mes(comLilian).profissionais.find(x => x.nome === 'Lilian Vidal');
  assert.equal(p.atendimentos, 1);
  assert.equal(p.comissao.valor, 82); // (200 − 18%) / 2
  assert.equal(p.foraDaEquipe, true);
});

test('mês em curso conta só até hoje e projeta o fechamento', () => {
  const r = mes();
  assert.equal(r.mes.emCurso, true);
  assert.equal(r.mes.limite, HOJE);
  // Sessões de 03 a 06/11 realizadas e com valor aproveitável: Ana, Bia, Caio, Dani, Fê (valor zerado).
  assert.equal(r.totais.sessoes, 5);
  assert.equal(r.totais.producao, 200 + 130 + 0 + 180 + 0 + 110 + 110 + 50);
  assert.ok(r.totais.projecao.producao > r.totais.producao);
});

test('mês fechado não projeta', () => {
  const r = mes(DADOS, '2026-10', HOJE);
  assert.equal(r.mes.emCurso, false);
  assert.equal(r.mes.limite, '2026-10-31');
  assert.equal(r.totais.projecao.producao, null);
  assert.equal(r.totais.sessoes, 1); // só o Gil
});

test('por profissional: atendimentos, produção, recebimento por atendimento e comissão', () => {
  const r = mes();
  const lais = r.profissionais.find(p => p.nome === 'Lais Faria');
  assert.equal(lais.atendimentos, 4); // Ana, Bia, Caio (cortesia) e Fê (valor absurdo)
  assert.equal(lais.producao, 330);
  assert.equal(lais.cortesias, 2); // Caio e a sessão com valor fora do normal
  assert.equal(lais.porAtendimento, 165); // 330 / 2 sessões pagas
  assert.equal(lais.comissao.valor, 135.3); // (330 − 18%) / 2
  assert.equal(lais.custoPorAtendimento, 33.83);
  assert.equal(lais.lista.length, 4);

  const semFisio = r.profissionais.find(p => p.nome === 'Sem profissional');
  assert.equal(semFisio, undefined, 'o exemplo não tem card sem fisio');
  const lucas = r.profissionais.find(p => p.nome === 'Lucas Pereira');
  assert.equal(lucas.atendimentos, 0);
  assert.equal(lucas.comissao.valor, 0, 'sem produção, sem comissão');
});

test('valor absurdo fica fora da produção e é listado para conferir', () => {
  const r = mes();
  assert.equal(r.foraDoNormal.quantidade, 1);
  assert.equal(r.foraDoNormal.exemplos[0].atleta, 'Fê');
  assert.ok(!r.profissionais.some(p => p.producao > 10000));
});

test('à pagar (exceção) vira lista de a receber', () => {
  const r = mes();
  assert.equal(r.recebimento.total, 180);
  assert.deepEqual(r.recebimento.aReceber.map(x => x.atleta), ['Dani']);
  assert.equal(r.recebimento.formas.find(f => f.forma === 'PIX').quantidade, 3);
});

test('turma conta falta como produção e soma alunos', () => {
  const r = mes();
  assert.equal(r.fortalecimento.aulas, 1);
  assert.equal(r.fortalecimento.faltas, 1);
  assert.equal(r.fortalecimento.producao, 220);
  assert.equal(r.yoga.producao, 50);
});

test('bônus: conta as sessões de todos e mostra quanto falta', () => {
  const r = mes();
  assert.equal(r.bonus.sessoes, 5);
  assert.equal(r.bonus.valor, 0);
  assert.equal(r.bonus.faltam, 96);
});

test('histórico cobre seis meses terminando no mês pedido', () => {
  const r = mes();
  assert.equal(r.historico.length, 6);
  assert.equal(r.historico.at(-1).mes, '2026-11');
  assert.equal(r.historico.at(0).mes, '2026-06');
  assert.equal(r.historico.find(h => h.mes === '2026-10').sessoes, 1);
});

test('reduzirSessao traz forma de pagamento e progresso do plano', () => {
  const PAG = { id: CAMPOS.pagamento, type_config: { options: [{ id: 'p', name: 'PIX', orderindex: 0 }, { id: 'a', name: 'À Pagar (exceção)', orderindex: 8 }] } };
  const r = reduzirSessao({
    id: 't1', name: 'Ana Silva — Sessão 3/4 — Mensal', status: { status: '✅ realizada' },
    custom_fields: [{ ...PAG, value: 'a' }, { id: CAMPOS.numeroSessao, value: 3 }, { id: CAMPOS.totalPlano, value: 4 }],
  });
  assert.equal(r.pagamento, 'À Pagar (exceção)');
  assert.equal(r.numeroSessao, 3);
  assert.equal(r.totalPlano, 4);
});

test('mês inválido ou futuro é recusado', () => {
  assert.equal(validarMes('', '2026-11-23'), '2026-11');
  assert.equal(validarMes('2026-10', '2026-11-23'), '2026-10');
  assert.throws(() => validarMes('2026-13', '2026-11-23'), /inválido/);
  assert.throws(() => validarMes('2026-12', '2026-11-23'), /entre 2024/);
  assert.throws(() => validarMes('2023-12', '2026-11-23'), /entre 2024/);
});

test('limites de mês e mês anterior', () => {
  assert.deepEqual(diasDoMes('2026-02'), { de: '2026-02-01', ate: '2026-02-28' });
  assert.deepEqual(diasDoMes('2024-02'), { de: '2024-02-01', ate: '2024-02-29' });
  assert.deepEqual(diasDoMes('2026-12'), { de: '2026-12-01', ate: '2026-12-31' });
  assert.equal(mesAnterior('2026-01', 1), '2025-12');
  assert.equal(mesAnterior('2026-11', 5), '2026-06');
});

test('a rota /api/gestao/equipe exige login e acesso ao financeiro', async () => {
  const env = { PORTAL_ORIGIN: 'https://carefit.example', PORTAL_SESSION_SECRET: 'c'.repeat(64), PORTAL_USERS_JSON: JSON.stringify({ gustavo: passwordHash('senha-g'), lucas: passwordHash('senha-l') }), CLICKUP_API_TOKEN: 'fake-test-token' };
  const fechamento = { listas: async () => ({ lidoEm: Date.parse('2026-11-23T12:00:00Z'), ...DADOS }) };
  const server = createServer(env, {}, {}, fechamento);
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/api/gestao/`;
  try {
    assert.equal((await fetch(base + 'equipe')).status, 401);
    const entrar = async (user, password) => (await fetch(base + 'login', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: env.PORTAL_ORIGIN }, body: JSON.stringify({ user, password }) })).headers.get('set-cookie').split(';')[0];
    const lucas = await entrar('lucas', 'senha-l');
    assert.equal((await fetch(base + 'equipe', { headers: { Cookie: lucas } })).status, 403, 'comissão da equipe é só do financeiro');
    const gustavo = await entrar('gustavo', 'senha-g');
    const ok = await fetch(base + 'equipe?mes=2026-11', { headers: { Cookie: gustavo } });
    assert.equal(ok.status, 200);
    const corpo = await ok.json();
    assert.equal(corpo.mes.referencia, '2026-11');
    assert.ok(corpo.profissionais.length > 0);
    // Mês futuro é recusado com mensagem pública, não com erro 500.
    const futuro = await fetch(base + 'equipe?mes=2030-01', { headers: { Cookie: gustavo } });
    assert.equal(futuro.status, 400);
    assert.match((await futuro.json()).error, /entre 2024/);
  } finally { server.close(); }
});
