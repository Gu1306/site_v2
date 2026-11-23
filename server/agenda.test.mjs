import test from 'node:test';
import assert from 'node:assert/strict';
import { interpretarTitulo, criarLeitorAgenda } from './agenda.mjs';
import { mesmoNome, montarObservacoes, ENTRADAS } from './fechamento.mjs';

test('título da reserva vira fisio, tipo e atleta; bloqueios e almoço ficam de fora', () => {
  assert.deepEqual(interpretarTitulo('Fisio Lívia - Sessão Jornada Recovery (Juliana Vinha)'), { fisio: 'Lívia', tipo: 'Sessão Jornada Recovery', atleta: 'Juliana Vinha' });
  assert.deepEqual(interpretarTitulo('Fisio Lívia - Primeira Sessão - 80 min (Mariana Engracia)'), { fisio: 'Lívia', tipo: 'Primeira Sessão - 80 min', atleta: 'Mariana Engracia' });
  assert.equal(interpretarTitulo('Fisio Lívia - Sessão Reabilitação (Raquel  Josino )').atleta, 'Raquel Josino');
  assert.equal(interpretarTitulo('A - ALMOÇO'), null);
  assert.equal(interpretarTitulo('Agenda fechada — Lais e Igor atendendo'), null);
  assert.equal(interpretarTitulo('Reunião (Gustavo)'), null);
});

test('mesmo nome tolera acento, espaço duplo, nome do meio e sobrenome a mais', () => {
  assert.ok(mesmoNome('João Alberto  Fernandes', 'João Alberto Fernades — x'.split(' — ')[0]) === false, 'sobrenome digitado diferente não casa');
  assert.ok(mesmoNome('Joao Fernandes', 'João Alberto Fernandes'));
  assert.ok(mesmoNome('Gabriela Bortoleto Gallo', 'Gabriela Gallo'));
  assert.ok(mesmoNome('Ana Paula M Cabral', 'Ana Paula Cabral'));
  assert.ok(!mesmoNome('Rafael Paiva', 'Rafael Ribeiro'));
  assert.ok(!mesmoNome('Ana Silva', 'Bruna Silva'));
});

const sess = (atleta, data, tipo = 'Mensal', status = 'realizada', valor = 100, id = 1) => ({ id, url: 'u', atleta, status, data, profissional: 'Lívia', tipo, valor, atletaId: null });
const res = (atleta, data, hora = '08:00', tipo = 'Sessão Jornada Recovery') => ({ id: 'e', agenda: 'x', data, hora, fisio: 'Lívia', tipo, atleta });

test('observações: reserva sem card, card sem reserva e data diferente', () => {
  const dados = {
    sessoes: [sess('Juliana Vinha', '2026-11-16'), sess('Rafael Paiva', '2026-11-19'), sess('Thais Vignini', '2026-11-17')],
    fortalecimento: [{ atleta: 'Bruna Barbosa', status: 'realizada', data: '2026-11-19', valor: 45, url: null }],
    yoga: [],
  };
  const reservas = [res('Juliana Vinha', '2026-11-16'), res('Rafael Paiva', '2026-11-18'), res('Bruna  Barbosa ', '2026-11-19'), res('Faras Heluy', '2026-11-21'), res('Alguém Futuro', '2026-11-22')];
  const o = montarObservacoes(dados, reservas, '2026-11-16', '2026-11-21');
  assert.equal(o.agenda.reservas, 4, 'reserva depois de hoje não conta');
  assert.equal(o.agenda.casadas, 3);
  assert.deepEqual(o.agenda.semCard.map(r => r.atleta), ['Faras Heluy']);
  assert.deepEqual(o.agenda.dataDiferente.map(d => [d.reserva.atleta, d.card.data]), [['Rafael Paiva', '2026-11-19']]);
  assert.deepEqual(o.agenda.semReserva.map(c => c.atleta), ['Thais Vignini']);
});

test('observações: sem agenda configurada o bloco de agenda é nulo e a dupla continua saindo', () => {
  const dupla = ENTRADAS.recovery;
  const dados = {
    sessoes: [
      sess('Mariana Engracia', '2026-11-03', dupla, 'realizada', 230), sess('Mariana Engracia', '2026-11-17', dupla, 'realizada', 0), sess('Mariana Engracia', null, 'Mensal', 'aguardando', 150),
      sess('Pedro Só Uma', '2026-11-18', dupla, 'realizada', 230),
      sess('Carla Antiga', '2026-09-01', dupla, 'realizada', 230), sess('Carla Antiga', '2026-09-10', dupla, 'realizada', 0),
      sess('Leo Sem Plano', '2026-10-28', dupla, 'realizada', 230), sess('Leo Sem Plano', '2026-11-04', dupla, 'realizada', 0),
    ],
    fortalecimento: [], yoga: [],
  };
  const o = montarObservacoes(dados, null, '2026-11-16', '2026-11-21');
  assert.equal(o.agenda, null);
  assert.deepEqual(o.duplas.lista.map(d => [d.atleta, d.naSemana, d.continuou, d.plano]), [['Mariana Engracia', true, true, 'Mensal'], ['Leo Sem Plano', false, false, null]]);
});

test('leitor de agenda: sem variável devolve null; com variável monta o token e reduz os eventos', async () => {
  assert.equal(criarLeitorAgenda({}), null);
  const { generateKeyPairSync } = await import('node:crypto');
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
  const env = { GOOGLE_CALENDAR_SA_JSON: JSON.stringify({ client_email: 'x@y', private_key: privateKey }) };
  const chamadas = [];
  const fetchFn = async (url, opts) => {
    chamadas.push(url);
    if (url.includes('oauth2')) return { ok: true, json: async () => ({ access_token: 'tok' }) };
    assert.equal(opts.headers.Authorization, 'Bearer tok');
    return { ok: true, json: async () => ({ items: [
      { id: '1', summary: 'Fisio Lívia - Sessão Reabilitação (Andre LAVEZ)', start: { dateTime: '2026-11-16T08:00:00-03:00' }, attendees: [{ email: 'segredo@x' }], description: 'nunca sai' },
      { id: '2', summary: 'A - ALMOÇO', start: { dateTime: '2026-11-16T12:30:00-03:00' } },
      { id: '3', summary: 'Fisio Lívia - Sessão (Cancelada)', status: 'cancelled', start: { dateTime: '2026-11-16T13:00:00-03:00' } },
    ] }) };
  };
  const leitor = criarLeitorAgenda(env, fetchFn, () => Date.parse('2026-11-23T12:00:00Z'));
  const r = await leitor.reservas('2026-11-16', '2026-11-23');
  assert.deepEqual(r, [{ id: '1', agenda: 'CareFit Run Base (Lívia)', data: '2026-11-16', hora: '08:00', fisio: 'Lívia', tipo: 'Sessão Reabilitação', atleta: 'Andre LAVEZ' }]);
  await leitor.reservas('2026-11-16', '2026-11-23');
  assert.equal(chamadas.filter(u => u.includes('oauth2')).length, 1, 'token fica em cache');
});
