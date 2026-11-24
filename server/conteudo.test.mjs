import test from 'node:test';
import assert from 'node:assert/strict';
import { chaveHorario, criarLeitorConteudo, criarServicoConteudo, montarConteudo, resumir, titulo } from './conteudo.mjs';

const INICIO = '2026-11-24T03:00:00.000Z'; // 24/11 00:00 em Brasília
const FIM = '2026-12-08T02:59:00.000Z';
const AGORA = '2026-11-24T12:00:00.000Z'; // 24/11 09:00 em Brasília

const pz = (publishDate, content, state = 'QUEUE') => ({ publishDate, content, state });
const bf = (dueAt, channelService, status = 'scheduled', extra = {}) =>
  ({ dueAt, channelService, status, text: 'do buffer', assets: [{ mimeType: 'image/jpeg' }], ...extra });

test('junta as três redes no mesmo horário', () => {
  const lista = montarConteudo({
    postiz: [pz('2026-11-24T21:30:00.000Z', 'Black Friday da CareFit\nsegunda linha')],
    buffer: [bf('2026-11-24T21:30:00.000Z', 'facebook'), bf('2026-11-24T21:30:00.000Z', 'tiktok')],
    agora: AGORA, inicio: INICIO, fim: FIM,
  });
  assert.equal(lista.length, 1);
  assert.equal(lista[0].titulo, 'Black Friday da CareFit');
  assert.equal(lista[0].ig.estado, 'agendado');
  assert.equal(lista[0].fb.estado, 'agendado');
  assert.equal(lista[0].tt.estado, 'agendado');
});

test('post só no Instagram aparece como "não vai" no Facebook e no TikTok', () => {
  const [i] = montarConteudo({
    postiz: [pz('2026-12-02T21:00:00.000Z', 'Os detalhes da corrida')],
    agora: AGORA, inicio: INICIO, fim: FIM,
  });
  assert.equal(i.ig.estado, 'agendado');
  assert.equal(i.fb.estado, 'não vai');
  assert.equal(i.tt.estado, 'não vai');
  assert.equal(resumir([i], AGORA).semEspelho.length, 1);
});

test('o que já passou sem registro é "não saiu", não "não vai"', () => {
  const [i] = montarConteudo({
    buffer: [bf('2026-11-24T11:00:00.000Z', 'facebook', 'sent')],
    agora: AGORA, inicio: INICIO, fim: FIM,
  });
  assert.equal(i.fb.estado, 'publicado');
  assert.equal(i.ig.estado, 'não saiu');
  assert.equal(i.passado, true);
});

test('o feed manda: publicado no celular vence o "agendado" e cola no post de até 30 min', () => {
  const lista = montarConteudo({
    postiz: [pz('2026-11-24T11:00:00.000Z', 'Medal Monday')],
    feed: [{ quando: '2026-11-24T11:20:00.000Z', tipo: 'carrossel', curtidas: 28, comentarios: 6, texto: 'Medal Monday', link: 'https://instagram.com/p/x' }],
    agora: AGORA, inicio: INICIO, fim: FIM,
  });
  assert.equal(lista.length, 1, 'não duplica o post que já estava agendado');
  assert.equal(lista[0].ig.estado, 'publicado');
  assert.equal(lista[0].ig.onde, '28 curtidas · 6 coment.');
  assert.equal(lista[0].link, 'https://instagram.com/p/x');
});

test('post fora da janela de 30 min entra como item próprio', () => {
  const lista = montarConteudo({
    postiz: [pz('2026-11-24T11:00:00.000Z', 'Agendado')],
    feed: [{ quando: '2026-11-24T14:00:00.000Z', tipo: 'Reels', curtidas: 1, comentarios: 0, texto: 'Outro', link: null }],
    agora: AGORA, inicio: INICIO, fim: FIM,
  });
  assert.equal(lista.length, 2);
});

test('rascunho do Postiz vira alerta: não sai sozinho', () => {
  const lista = montarConteudo({
    postiz: [pz('2026-12-04T18:00:00.000Z', 'Escute o corpo', 'DRAFT')],
    agora: AGORA, inicio: INICIO, fim: FIM,
  });
  assert.equal(lista[0].ig.estado, 'rascunho');
  assert.equal(lista[0].ig.onde, 'Postiz, falta liberar');
  assert.equal(resumir(lista, AGORA).rascunhos.length, 1);
});

test('o leitor do Buffer descarta story e o que está fora da janela', async () => {
  const resposta = (nodes) => ({
    ok: true,
    json: async () => ({ data: { posts: { edges: nodes.map(node => ({ node })) } } }),
  });
  let chamada = 0;
  const fetchFn = async () => {
    chamada += 1;
    return chamada === 1
      ? resposta([
          bf('2026-11-25T18:00:00.000Z', 'instagram', 'scheduled', { externalLink: 'https://instagram.com/stories/123' }),
          bf('2026-11-25T18:00:00.000Z', 'facebook'),
          bf('2027-01-05T18:00:00.000Z', 'tiktok'), // depois do fim
        ])
      : resposta([]);
  };
  const leitor = criarLeitorConteudo({ BUFFER_API_KEY: 'x' }, fetchFn);
  const saida = await leitor.buffer(INICIO, FIM);
  assert.deepEqual(saida.map(n => n.channelService), ['facebook']);
});

test('fora da janela não entra', () => {
  const lista = montarConteudo({
    postiz: [pz('2026-12-20T15:00:00.000Z', 'Longe demais')],
    agora: AGORA, inicio: INICIO, fim: FIM,
  });
  assert.equal(lista.length, 0);
});

test('chaveHorario e titulo', () => {
  assert.equal(chaveHorario('2026-11-24T21:30:00.000Z'), '2026-11-24T18:30');
  assert.equal(titulo('uma linha\noutra'), 'uma linha');
  assert.equal(titulo('x'.repeat(200)).endsWith('…'), true);
});

test('uma fonte fora do ar não derruba o painel: vira aviso', async () => {
  const leitor = {
    configurado: true, temPostiz: true, temBuffer: true, temFeed: true,
    postiz: async () => [pz('2026-11-24T21:30:00.000Z', 'Black Friday')],
    buffer: async () => { throw new Error('caiu'); },
    feed: async () => null,
  };
  const dados = await criarServicoConteudo(leitor, () => Date.parse(AGORA)).painel();
  assert.equal(dados.posts.length, 1);
  assert.equal(dados.fontes.buffer, false);
  assert.equal(dados.avisos.length, 1);
  assert.match(dados.avisos[0], /Buffer/);
});

test('fonte sem chave avisa, em vez de sumir calada com a rede inteira', async () => {
  const leitor = {
    configurado: true, temPostiz: false, temBuffer: true, temFeed: false,
    postiz: async () => null, buffer: async () => [], feed: async () => null,
  };
  const dados = await criarServicoConteudo(leitor, () => Date.parse(AGORA)).painel();
  assert.equal(dados.avisos.length, 2);
  assert.match(dados.avisos.join(' '), /Postiz.*não está configurada/s);
  assert.match(dados.avisos.join(' '), /Feed do Instagram/);
});

test('sem chave nenhuma, a página recebe 503 com explicação', async () => {
  const servico = criarServicoConteudo({ configurado: false }, () => Date.parse(AGORA));
  await assert.rejects(() => servico.painel(), /não está ligado/);
});
