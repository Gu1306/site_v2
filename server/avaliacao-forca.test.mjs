import test from 'node:test';
import assert from 'node:assert/strict';
import { lerExportFightTech, calcularAvaliacao, reconhecerMovimento, numero, calcularIdade, faixaAssimetria, CV_MAXIMO } from '../src/lib/avaliacaoForca.ts';

const cabecalho = ['', '', 'Exercise', 'L/R', 'Peak force(KG)', 'Relative peak force', 'Time to peak force(ms)', 'Mean force(KG)'];

// As seis linhas abaixo são o conteúdo real do export de demonstração do FightTech:
// números como texto, e identificação apenas na primeira linha de cada bloco.
const amostra = [
  cabecalho,
  ['2026-09-12 09:14', 'Gustavo Rosa', 'Flexão Isométrica do Quadril', 'L', '27.65', '0.31', 1720, '23.11'],
  ['', '', '', '', '27.17', '0.31', 1588, '16.94'],
  ['', '', '', '', '28.97', '0.33', 1660, '4.09'],
  ['2026-09-12 09:14', 'Gustavo Rosa', 'Flexão Isométrica do Quadril', 'R', '23.24', '0.26', 376, '21.83'],
  ['', '', '', '', '26.31', '0.30', 1784, '20.03'],
  ['', '', '', '', '28.62', '0.32', 1684, '5.28'],
];

const atleta = { nome: 'Atleta de Demonstração', nascimento: '1990-05-10', peso: 88, email: 'atleta@exemplo.com' };

test('lê o export real preenchendo para baixo a identificação que só vem na primeira linha', () => {
  const leitura = lerExportFightTech(amostra);
  assert.deepEqual(leitura.problemas, []);
  assert.equal(leitura.tentativas.length, 6);
  assert.equal(leitura.atletaNoApp, 'Gustavo Rosa');
  assert.deepEqual(leitura.datas, ['2026-09-12']);
  assert.deepEqual(leitura.naoReconhecidos, []);
  // a ordem da tentativa vem só da posição da linha; reinicia a cada lado
  assert.deepEqual(leitura.tentativas.map(t => `${t.lado}${t.ordem}`), ['E1', 'E2', 'E3', 'D1', 'D2', 'D3']);
  assert.equal(leitura.tentativas[0].chave, 'flexao-quadril');
});

test('calcula média dos três picos e assimetria pela fórmula do manual', () => {
  const { movimentos } = calcularAvaliacao(lerExportFightTech(amostra), atleta);
  assert.equal(movimentos.length, 1);
  const flexao = movimentos[0];
  assert.equal(flexao.esquerdo.media.toFixed(2), '27.93');
  assert.equal(flexao.direito.media.toFixed(2), '26.06');
  assert.equal(flexao.esquerdo.maior, 28.97);
  // simetria = menor / maior x 100; assimetria = 100 - simetria
  assert.equal(flexao.simetria.toFixed(1), '93.3');
  assert.equal(flexao.assimetria.toFixed(1), '6.7');
  assert.equal(flexao.ladoMenor, 'D');
  // força relativa calculada com o peso digitado pela equipe, não com o cadastro do app
  assert.equal(flexao.relativaEsquerdo.toFixed(2), '0.32');
});

test('sinaliza o efeito de aprendizagem e a variação alta entre tentativas', () => {
  const { movimentos } = calcularAvaliacao(lerExportFightTech(amostra), atleta);
  const flexao = movimentos[0];
  assert.equal(flexao.direito.crescente, true, 'os três picos do lado direito sobem: 23,24 → 26,31 → 28,62');
  assert.equal(flexao.esquerdo.crescente, false);
  assert.ok(flexao.direito.cv > 10 && flexao.direito.cv < CV_MAXIMO, `CV do direito veio ${flexao.direito.cv}`);
  assert.ok(flexao.esquerdo.cv < 5);
  assert.ok(flexao.alertas.some(a => a.includes('familiarização')));
  // 10,4% fica abaixo do limite de 15% definido em 12/09/2026, então não alerta variação
  assert.ok(!flexao.alertas.some(a => a.includes('variação')));
});

test('alerta variação só acima do limite de 15%', () => {
  const instavel = [
    cabecalho,
    ['2026-09-12 09:14', 'A', 'Flexão Isométrica do Quadril — Unilateral', 'L', '10.0'], ['', '', '', '', '20.0'], ['', '', '', '', '30.0'],
  ];
  const { movimentos } = calcularAvaliacao(lerExportFightTech(instavel), atleta);
  assert.ok(movimentos[0].esquerdo.cv > CV_MAXIMO);
  assert.ok(movimentos[0].alertas.some(a => a.includes('variação')));
});

test('reconhece os sete nomes exatos que o FightTech usa', () => {
  const doApp = [
    ['Flexão Isométrica do Quadril — Unilateral', 'flexao-quadril'],
    ['Extensão Isométrica do Joelho — Unilateral', 'extensao-joelho'],
    ['Flexão Isométrica do Joelho — Unilateral', 'flexao-joelho'],
    ['Abdução Isométrica do Quadril — Unilateral', 'abducao-quadril'],
    ['Adução Isométrica do Quadril — Unilateral', 'aducao-quadril'],
    ['Extensão Isométrica do Quadril — Unilateral', 'extensao-quadril'],
    ['Flexão Plantar Isométrica – Joelho Estendido — Unilateral', 'flexao-plantar'],
  ];
  for (const [nome, esperado] of doApp) assert.equal(reconhecerMovimento(nome), esperado, nome);
  // um export com os sete não deixa nada por mapear
  const linhas = [cabecalho];
  for (const [nome] of doApp) {
    linhas.push(['2026-09-12 09:14', 'A', nome, 'L', '10.0'], ['', '', '', '', '10.0'], ['', '', '', '', '10.0']);
    linhas.push(['2026-09-12 09:14', 'A', nome, 'R', '9.0'], ['', '', '', '', '9.0'], ['', '', '', '', '9.0']);
  }
  const leitura = lerExportFightTech(linhas);
  assert.deepEqual(leitura.naoReconhecidos, []);
  const { movimentos, problemas } = calcularAvaliacao(leitura, atleta);
  assert.equal(movimentos.length, 7);
  assert.deepEqual(problemas, []);
});

test('faixa de assimetria é magnitude, não risco de lesão', () => {
  assert.equal(faixaAssimetria(0), 'baixa');
  assert.equal(faixaAssimetria(10), 'baixa');
  assert.equal(faixaAssimetria(10.1), 'media');
  assert.equal(faixaAssimetria(20), 'media');
  assert.equal(faixaAssimetria(20.1), 'alta');
  assert.equal(faixaAssimetria(null), null);
});

test('nunca usa a coluna Mean force do app como resultado', () => {
  const { movimentos } = calcularAvaliacao(lerExportFightTech(amostra), atleta);
  const medias = movimentos[0];
  // Mean force do app daria 14,71 no lado esquerdo; a média dos picos dá 27,93.
  assert.notEqual(medias.esquerdo.media.toFixed(2), '14.71');
  assert.equal(medias.esquerdo.media.toFixed(2), '27.93');
});

test('recusa arquivo que não é o export do FightTech', () => {
  const leitura = lerExportFightTech([['Nome do treino', 'Atleta'], ['Treino A', 'João']]);
  assert.equal(leitura.tentativas.length, 0);
  assert.ok(leitura.problemas[0].includes('não parece ser o export do FightTech'));
});

test('avisa quando o arquivo mistura datas ou atletas', () => {
  const misturado = [
    cabecalho,
    ['2026-09-12 09:14', 'Gustavo Rosa', 'Flexão Isométrica do Quadril', 'L', '27.65'],
    ['2026-09-13 10:00', 'Outra Pessoa', 'Flexão Isométrica do Quadril', 'R', '23.24'],
  ];
  const leitura = lerExportFightTech(misturado);
  assert.ok(leitura.problemas.some(p => p.includes('datas diferentes')));
  assert.ok(leitura.problemas.some(p => p.includes('nomes diferentes')));
});

test('marca como não reconhecido o exercício que não bate com os sete testes', () => {
  const leitura = lerExportFightTech([
    cabecalho,
    ['2026-09-12 09:14', 'Gustavo Rosa', 'Rotação Interna de Ombro', 'L', '12.00'],
  ]);
  assert.deepEqual(leitura.naoReconhecidos, ['Rotação Interna de Ombro']);
  assert.equal(leitura.tentativas[0].chave, null);
});

test('reconhece os sete movimentos com e sem acento', () => {
  assert.equal(reconhecerMovimento('Flexão Isométrica do Quadril'), 'flexao-quadril');
  assert.equal(reconhecerMovimento('FLEXAO DE QUADRIL'), 'flexao-quadril');
  assert.equal(reconhecerMovimento('Extensão de joelho'), 'extensao-joelho');
  assert.equal(reconhecerMovimento('Abdução de quadril'), 'abducao-quadril');
  assert.equal(reconhecerMovimento('Adução de quadril'), 'aducao-quadril');
  assert.equal(reconhecerMovimento('Flexão plantar'), 'flexao-plantar');
  assert.equal(reconhecerMovimento('Hip extension'), 'extensao-quadril');
  assert.equal(reconhecerMovimento('Supino unilateral'), null);
});

test('converte número em texto, com ponto ou vírgula, e rejeita lixo', () => {
  assert.equal(numero('27.65'), 27.65);
  assert.equal(numero('27,65'), 27.65);
  assert.equal(numero(1720), 1720);
  assert.equal(numero('sem dados'), null);
  assert.equal(numero(''), null);
  assert.equal(numero(null), null);
});

test('avisa quando um lado tem menos de três tentativas', () => {
  const incompleto = [
    cabecalho,
    ['2026-09-12 09:14', 'Gustavo Rosa', 'Flexão Isométrica do Quadril', 'L', '27.65'],
    ['', '', '', '', '27.17'],
    ['2026-09-12 09:14', 'Gustavo Rosa', 'Flexão Isométrica do Quadril', 'R', '23.24'],
    ['', '', '', '', '26.31'],
    ['', '', '', '', '28.62'],
  ];
  const { movimentos } = calcularAvaliacao(lerExportFightTech(incompleto), atleta);
  assert.ok(movimentos[0].alertas.some(a => a.includes('2 tentativa(s) em vez de 3')));
});

test('calcula razões entre músculos opostos e marca a que não é comparável', () => {
  const completo = [
    cabecalho,
    ['2026-09-12 09:14', 'A', 'Flexão de joelho', 'L', '10.0'], ['', '', '', '', '10.0'], ['', '', '', '', '10.0'],
    ['2026-09-12 09:14', 'A', 'Extensão de joelho', 'L', '20.0'], ['', '', '', '', '20.0'], ['', '', '', '', '20.0'],
    ['2026-09-12 09:14', 'A', 'Flexão de quadril', 'L', '15.0'], ['', '', '', '', '15.0'], ['', '', '', '', '15.0'],
    ['2026-09-12 09:14', 'A', 'Extensão de quadril', 'L', '30.0'], ['', '', '', '', '30.0'], ['', '', '', '', '30.0'],
  ];
  const { razoes } = calcularAvaliacao(lerExportFightTech(completo), atleta);
  const joelho = razoes.find(r => r.titulo.startsWith('Joelho'));
  assert.equal(joelho.valor.toFixed(0), '50');
  assert.equal(joelho.comparavel, true);
  const quadril = razoes.find(r => r.titulo.startsWith('Quadril') && r.titulo.includes('flexores'));
  assert.equal(quadril.comparavel, false, 'flexão e extensão de quadril são testadas em posições diferentes');
  assert.ok(quadril.nota.includes('posições e ângulos diferentes'));
});

test('calcula idade a partir da data de nascimento', () => {
  assert.equal(calcularIdade('1990-05-10', new Date(2026, 8, 12)), 36);
  assert.equal(calcularIdade('1990-12-31', new Date(2026, 8, 12)), 35);
  assert.equal(calcularIdade('', new Date(2026, 8, 12)), null);
  assert.equal(calcularIdade('data ruim', new Date(2026, 8, 12)), null);
});

// ---------- serviço que grava no ClickUp ----------

import { criarServicoAvaliacao, validarEnvio, empacotar, desempacotar } from './avaliacao-forca.mjs';
import { IDS } from './fortalecimento.mjs';

const envioValido = () => ({
  requestId: '11111111-1111-4111-8111-111111111111',
  data: '2026-09-12',
  atleta: { nome: 'Pessoa Teste', nascimento: '1990-05-10', peso: 88, email: 'pessoa@exemplo.com' },
  resultados: [{
    chave: 'flexao-quadril', nome: 'Flexão de quadril',
    esquerdo: { picos: [27.65, 27.17, 28.97], media: 27.93, maior: 28.97 },
    direito: { picos: [23.24, 26.31, 28.62], media: 26.06, maior: 28.62 },
    assimetria: 6.71, ladoMenor: 'D',
  }],
});

function bancada() {
  const db = new Map();
  const anexos = [];
  let contador = 0;
  db.set('atleta1', { id: 'atleta1', name: 'Pessoa Teste', list: { id: IDS.athletes }, subtasks: [] });
  db.set('aula1', { id: 'aula1', name: 'Aula', list: { id: IDS.classes }, subtasks: [] });
  const api = async (url, method = 'GET', body) => {
    const path = url.split('?')[0];
    const get = /^\/task\/([^/]+)$/.exec(path);
    if (get) { const t = db.get(get[1]); if (!t) throw new Error('task desconhecida'); return structuredClone(t); }
    const list = /^\/list\/([^/]+)\/task$/.exec(path);
    if (list && method === 'GET') return { tasks: [...db.values()].filter(t => t.list.id === list[1] && !t.parent), last_page: true };
    if (list && method === 'POST') {
      const t = { id: 'sub' + ++contador, name: body.name, list: { id: list[1] }, parent: body.parent, markdown_description: body.markdown_content, subtasks: [] };
      db.set(t.id, t); db.get(body.parent).subtasks.push({ id: t.id, name: t.name }); return structuredClone(t);
    }
    throw new Error('caminho inesperado ' + path);
  };
  const upload = async (taskId, nome, bytes) => { anexos.push({ taskId, nome, tamanho: bytes.length }); return { id: 'anexo1' }; };
  return { db, anexos, servico: criarServicoAvaliacao(api, upload) };
}

test('salva a avaliação como subtarefa do atleta e anexa o Excel', async () => {
  const { db, anexos, servico } = bancada();
  const salvo = await servico.salvar('atleta1', { ...envioValido(), arquivoNome: 'teste.xlsx', arquivoBase64: Buffer.from('conteudo').toString('base64') }, 'livia');
  assert.equal(salvo.kind, 'avaliacao-forca');
  assert.equal(salvo.author, 'livia');
  assert.equal(salvo.anexo, true);
  assert.equal(anexos.length, 1);
  assert.equal(anexos[0].nome, 'teste.xlsx');
  const criada = db.get(salvo.id);
  assert.ok(criada.name.startsWith('Avaliação de força CareFit — 2026-09-12'));
  assert.equal(String(criada.parent), 'atleta1');
  // a tabela legível fica no card, e o JSON continua recuperável
  assert.ok(criada.markdown_description.includes('27,9 kg'));
  assert.ok(criada.markdown_description.includes('Assimetria não é diagnóstico'));
  assert.equal(desempacotar(criada).requestId, envioValido().requestId);
});

test('reenviar o mesmo requestId não cria uma segunda avaliação', async () => {
  const { db, servico } = bancada();
  const um = await servico.salvar('atleta1', envioValido(), 'livia');
  const dois = await servico.salvar('atleta1', envioValido(), 'livia');
  assert.equal(um.id, dois.id);
  assert.equal(db.get('atleta1').subtasks.length, 1);
});

test('recusa card que não está na lista de atletas', async () => {
  const { servico } = bancada();
  await assert.rejects(() => servico.salvar('aula1', envioValido(), 'livia'), /lista de atletas/);
});

test('histórico devolve as avaliações do atleta, da mais recente para a mais antiga', async () => {
  const { servico } = bancada();
  await servico.salvar('atleta1', envioValido(), 'livia');
  await servico.salvar('atleta1', { ...envioValido(), requestId: '22222222-2222-4222-8222-222222222222', data: '2026-12-01' }, 'lais');
  const historico = await servico.historicoDe('atleta1');
  assert.deepEqual(historico.map(h => h.data), ['2026-12-01', '2026-09-12']);
});

test('validação barra peso, datas, picos e volume fora da faixa', () => {
  assert.throws(() => validarEnvio({ ...envioValido(), requestId: 'nao-e-uuid' }), /Identificador/);
  assert.throws(() => validarEnvio({ ...envioValido(), data: '12/09/2026' }), /data da avaliação/);
  assert.throws(() => validarEnvio({ ...envioValido(), atleta: { nome: 'X', nascimento: '1990-05-10', peso: 5, email: 'x@x.com' } }), /25 e 250/);
  assert.throws(() => validarEnvio({ ...envioValido(), atleta: { nome: 'Pessoa', nascimento: '10/05/1990', peso: 80, email: 'x@x.com' } }), /nascimento/);
  assert.throws(() => validarEnvio({ ...envioValido(), resultados: [] }), /1 a 7 movimentos/);
  const picoAbsurdo = envioValido();
  picoAbsurdo.resultados[0].esquerdo.picos = [900];
  assert.throws(() => validarEnvio(picoAbsurdo), /fora da faixa/);
});

test('empacotar e desempacotar sobrevivem ao escape de Markdown do ClickUp', () => {
  const registro = { kind: 'avaliacao-forca', ...validarEnvio(envioValido()), author: 'livia', createdAt: '2026-09-12T12:00:00.000Z' };
  const texto = empacotar(registro);
  assert.deepEqual(desempacotar({ markdown_description: texto }), registro);
  const escapado = texto.replace(/[_[\]]/g, char => '\\' + char);
  assert.deepEqual(desempacotar({ description: texto, markdown_description: escapado }), registro);
  assert.equal(desempacotar({ description: 'CAREFIT_AVALIACAO_V1\nlixo' }), null);
});
