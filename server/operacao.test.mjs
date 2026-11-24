import test from 'node:test';
import assert from 'node:assert/strict';
import { ATIVO, FINALIZADO, montarCarteira, VALOR_MAXIMO_PLANO } from './carteira.mjs';
import { chaveTelefone, classificarMensagem, montarConversas, reduzirMensagem, REGRAS } from './conversas.mjs';
import { somarDias } from './fechamento.mjs';

const HOJE = '2026-11-23';
const atleta = (nome, status, extra = {}) => ({
  id: 'a' + nome, url: 'https://app.clickup.com/t/' + nome, nome, status,
  statusOriginal: status, telefone: '', fisio: 'Lívia Dias', plano: 'Mensal', origem: null,
  pagamento: null, valorPlano: 800, feitasDoPlano: null, faltamDoPlano: null,
  fimDoPlano: null, ultimaSessao: null, primeiraSessao: null, prova: { nome: null, data: null },
  sessoes: [], ...extra,
});
const sessao = (data, status = 'realizada') => ({ data, status, tipo: 'Mensal', valor: 200 });

test('ativo sem sessão marcada entra na renovação', () => {
  const c = montarCarteira([atleta('Ana', ATIVO, { sessoes: [sessao('2026-11-20')] })], HOJE);
  assert.equal(c.renovacao.length, 1);
  assert.equal(c.renovacao[0].motivo, 'sem_sessao_marcada');
  assert.equal(c.renovacao[0].restam, 0);
  assert.equal(c.resumo.ativos, 1);
});

test('restam poucas sessões, ou o plano termina logo, também puxam renovação', () => {
  const poucas = atleta('Bia', ATIVO, { sessoes: [sessao('2026-11-20'), sessao('2026-11-28', 'agendada')] });
  const termina = atleta('Caio', ATIVO, { fimDoPlano: somarDias(HOJE, 10), sessoes: [sessao('2026-11-20'), sessao('2026-11-25', 'agendada'), sessao('2026-11-27', 'agendada'), sessao('2026-11-29', 'agendada')] });
  const c = montarCarteira([poucas, termina], HOJE);
  assert.deepEqual(c.renovacao.map(r => r.motivo), ['ultimas_sessoes', 'plano_termina']);
  assert.equal(c.renovacao.find(r => r.nome === 'Caio').diasAteFim, 10);
});

test('quem parou há mais de 30 dias é sumido e não aparece duas vezes', () => {
  const c = montarCarteira([atleta('Dani', ATIVO, { sessoes: [sessao('2026-09-01')] })], HOJE);
  assert.equal(c.sumidos.length, 1);
  assert.equal(c.sumidos[0].diasParado, 83);
  assert.equal(c.renovacao.length, 0, 'não repete na renovação');
});

test('sessão marcada no futuro tira o atleta de sumidos', () => {
  const c = montarCarteira([atleta('Edu', ATIVO, { sessoes: [sessao('2026-09-01'), sessao('2026-11-30', 'agendada')] })], HOJE);
  assert.equal(c.sumidos.length, 0);
});

test('plano com valor digitado errado não soma e é listado para corrigir', () => {
  const c = montarCarteira([atleta('Fê', ATIVO, { valorPlano: 1040000, sessoes: [sessao('2026-11-20')] })], HOJE);
  assert.equal(c.renovacao[0].valorPlano, null);
  assert.equal(c.renovacao[0].valorSuspeito, 1040000);
  assert.equal(c.resumo.emRisco, 0);
  assert.equal(c.valoresSuspeitos.quantidade, 1);
  assert.ok(VALOR_MAXIMO_PLANO < 1040000);
});

test('pagamento pendente entra na cobrança, em qualquer status', () => {
  const c = montarCarteira([atleta('Gil', FINALIZADO, { pagamento: 'Pendente', valorPlano: 430, sessoes: [sessao('2026-11-20')] })], HOJE);
  assert.equal(c.pagamento.length, 1);
  assert.equal(c.resumo.aCobrar, 430);
});

test('quem terminou o plano há pouco vira lista de reativação; o antigo some', () => {
  const recente = atleta('Hugo', FINALIZADO, { sessoes: [sessao('2026-11-10')] });
  const antigo = atleta('Ivo', FINALIZADO, { sessoes: [sessao('2026-01-10')] });
  const c = montarCarteira([recente, antigo], HOJE);
  assert.deepEqual(c.finalizados.map(f => f.nome), ['Hugo']);
  assert.equal(c.finalizados[0].diasParado, 13);
});

test('porta de entrada é marcada: a ação é vender plano, não renovar', () => {
  const c = montarCarteira([atleta('Joana', ATIVO, { plano: 'Primeira Sessão Dupla', sessoes: [sessao('2026-11-21')] })], HOJE);
  assert.equal(c.renovacao[0].entrada, true);
});

// ---------------------------------------------------------------- conversas

const AGORA = Date.parse('2026-11-23T18:00:00-03:00');
const h = horas => Math.round((AGORA - horas * 36e5) / 1000);
const msg = (tel, de, horas, texto, extra = {}) => ({ id: tel + de + horas, tel, nome: 'Contato ' + tel, de, ts: h(horas), tipo: 'conversation', texto, ...extra });

test('grupo, lista e mensagem sem id ficam de fora', () => {
  assert.equal(reduzirMensagem({ key: { remoteJid: '12345@g.us', id: 'x' } }), null);
  assert.equal(reduzirMensagem({ key: { remoteJid: '55@broadcast', id: 'x' } }), null);
  assert.equal(reduzirMensagem({ key: { remoteJid: '5516999998888@s.whatsapp.net' } }), null);
  const m = reduzirMensagem({ key: { remoteJid: '5516999998888@s.whatsapp.net', id: 'abc', fromMe: true }, messageTimestamp: 1700000000, pushName: 'Ana', message: { conversation: 'oi' }, messageType: 'conversation' });
  assert.equal(m.tel, '5516999998888');
  assert.equal(m.de, 'carefit');
  assert.equal(m.texto, 'oi');
});

test('telefone casa ignorando o 55 e o nono dígito', () => {
  assert.equal(chaveTelefone('5516999998888'), '1699998888');
  assert.equal(chaveTelefone('1699998888'), '1699998888');
  assert.equal(chaveTelefone('(16) 99999-8888'), '1699998888');
  assert.equal(chaveTelefone('123'), '');
});

test('contato falou por último há horas: precisa de resposta', () => {
  const r = montarConversas([msg('5516911112222', 'carefit', 30, 'bom dia!'), msg('5516911112222', 'contato', 5, 'consigo quinta?')], [], AGORA);
  assert.equal(r.fila.length, 1);
  assert.equal(r.fila[0].motivo, 'sem_resposta');
  assert.equal(r.fila[0].horas, 5);
  assert.equal(r.fila[0].quem, 'contato');
  assert.equal(r.fila[0].final, '2222');
  assert.equal(r.fila[0].link, 'https://wa.me/5516911112222');
  assert.equal(r.fila[0].previa, 'consigo quinta?');
});

test('resposta recente da CareFit não entra na fila', () => {
  const r = montarConversas([msg('5516911112222', 'contato', 5, 'consigo quinta?'), msg('5516911112222', 'carefit', 1, 'consegue sim!')], [], AGORA);
  assert.equal(r.fila.length, 0);
  assert.equal(r.resumo.emDia, 1);
});

test('nós falamos por último e o contato sumiu: esfriou — mas não se tem sessão marcada', () => {
  const conversa = [msg('5516933334444', 'contato', 24 * 6, 'quero marcar'), msg('5516933334444', 'carefit', 24 * 4, 'tenho terça 7h')];
  const semSessao = montarConversas(conversa, [], AGORA);
  assert.equal(semSessao.fila[0].motivo, 'esfriou');

  const comSessao = montarConversas(conversa, [{ nome: 'Marina', status: ATIVO, telefone: '16933334444', fisio: 'Lais Faria', sessoes: [{ data: '2026-11-30', status: 'agendada' }] }], AGORA);
  assert.equal(comSessao.fila.length, 0);
  assert.equal(comSessao.resumo.comSessaoMarcada, 1);
});

test('o nome e o status vêm do CRM quando o telefone casa', () => {
  const r = montarConversas([msg('5516955556666', 'contato', 8, 'oi')], [{ nome: 'Carla Souza', status: ATIVO, telefone: '(16) 95555-6666', fisio: 'Igor', sessoes: [{ data: '2026-10-02', status: 'realizada' }] }], AGORA);
  assert.equal(r.fila[0].nome, 'Carla Souza');
  assert.equal(r.fila[0].noCrm, true);
  assert.equal(r.fila[0].ultimaSessao, '2026-10-02');
});

test('cadastro duplicado prefere o que não é novo lead', () => {
  const r = montarConversas([msg('5516977778888', 'contato', 8, 'oi')], [
    { nome: 'Duplicado lead', status: 'novo lead', telefone: '16977778888', sessoes: [] },
    { nome: 'Cadastro bom', status: ATIVO, telefone: '16977778888', sessoes: [] },
  ], AGORA);
  assert.equal(r.fila[0].nome, 'Cadastro bom');
});

test('disparo em massa não conta como conversa nossa', () => {
  const texto = 'Oi! A CareFit vai abrir uma turma nova de fortalecimento em dezembro, quer garantir a sua vaga?';
  const mensagens = [];
  for (let i = 0; i < 9; i++) {
    mensagens.push(msg('551691111' + String(1000 + i), 'contato', 24 * 8, 'oi'));
    mensagens.push(msg('551691111' + String(1000 + i), 'carefit', 24 * 4, texto));
  }
  const r = montarConversas(mensagens, [], AGORA);
  assert.equal(r.fila.length, 0, 'disparo não vira "esfriou"');
  assert.equal(r.resumo.emDia, 9);
});

test('contato que não escreve há mais de 21 dias sai da janela', () => {
  const r = montarConversas([msg('5516999990000', 'contato', 24 * (REGRAS.janelaDias + 1), 'oi')], [], AGORA);
  assert.equal(r.fila.length, 0);
  assert.equal(r.resumo.semEntradaRecente, 1);
});

test('áudio e imagem viram rótulo legível na prévia', () => {
  const r = montarConversas([msg('5516912121212', 'contato', 6, '', { tipo: 'audioMessage' })], [], AGORA);
  assert.equal(r.fila[0].previa, '[áudio]');
});

test('fila vem com quem espera resposta primeiro e há mais tempo', () => {
  const r = montarConversas([
    msg('5516900000001', 'contato', 4, 'consigo remarcar?'),
    msg('5516900000002', 'contato', 30, 'queria entender o valor do semestral'),
    msg('5516900000003', 'contato', 24 * 9, 'quero marcar'), msg('5516900000003', 'carefit', 24 * 5, 'tenho terça 7h'),
  ], [], AGORA);
  assert.deepEqual(r.fila.map(f => f.motivo), ['sem_resposta', 'sem_resposta', 'esfriou']);
  assert.equal(r.fila[0].horas, 30);
});

// ------------------------------------------------- assunto da última mensagem

test('agradecimento curto e emoji sozinho são conversa encerrada', () => {
  for (const t of ['Obrigada!', 'obrigado 🙏', 'Okkkk', 'Tmj', '❤', 'Valeu Gu', 'Tudo ótimo, obrigado.', 'Estou beem', 'Zero dor', 'Vamos que vamos Obrigadooo', 'Confirmado', 'Imagina Tmj']) {
    assert.equal(classificarMensagem(t, t), 'encerrada', `deveria encerrar: ${t}`);
  }
});

test('qualquer sinal de pergunta ou assunto em aberto mantém na fila', () => {
  for (const t of ['Consigo quinta?', 'qual o valor do plano', 'preciso remarcar', 'Obrigada, mas qual horário?', 'mas preciso', 'quanto fica', 'Boa tarde, queria agendar']) {
    assert.equal(classificarMensagem(t, t), 'aberta', `deveria ficar aberta: ${t}`);
  }
});

test('texto longo nunca é escondido, mesmo começando com obrigada', () => {
  const longo = 'Obrigada! Voltei a correr recente porque estava afastada porque fiz uma cirurgia e queria entender como retomar com segurança';
  assert.equal(classificarMensagem(longo, longo), 'aberta');
});

test('arquivo sem texto vira categoria própria', () => {
  assert.equal(classificarMensagem('', '[áudio]'), 'midia');
  assert.equal(classificarMensagem('', '[documento]'), 'midia');
  // Foto com legenda que pergunta algo continua sendo pergunta.
  assert.equal(classificarMensagem('é esse horário?', 'é esse horário?'), 'aberta');
});

test('a fila separa quem pede atenção de quem só agradeceu', () => {
  const r = montarConversas([
    msg('5516900000011', 'contato', 6, 'Obrigada!! 🙏'),
    msg('5516900000012', 'contato', 10, 'consigo marcar quinta?'),
    msg('5516900000013', 'contato', 8, '', { tipo: 'audioMessage' }),
    msg('5516900000014', 'contato', 24 * 9, 'oi'), msg('5516900000014', 'carefit', 24 * 5, 'tenho terça'),
  ], [], AGORA);
  assert.deepEqual(r.fila.map(f => f.assunto), ['aberta', 'midia', 'aberta', 'encerrada']);
  assert.deepEqual(r.fila.map(f => f.motivo), ['sem_resposta', 'sem_resposta', 'esfriou', 'sem_resposta']);
  assert.equal(r.resumo.semResposta, 1, 'só a que pede horário conta como esperando');
  assert.equal(r.resumo.midia, 1);
  assert.equal(r.resumo.encerradas, 1);
  assert.equal(r.resumo.esfriou, 1);
});
