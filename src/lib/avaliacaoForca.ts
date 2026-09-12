/**
 * Leitura do Excel exportado pelo app FightTech (dinamômetro QUELINGSPORT DC01)
 * e cálculo dos resultados conforme o protocolo 1 da CareFit — o "01 / MANUAL CLÍNICO".
 *
 * Regras que vêm do manual e não podem ser alteradas aqui sem decisão técnica:
 *   - resultado principal = média dos 3 picos (p. 10); maior pico é secundário (p. 11)
 *   - índice de simetria = membro mais fraco ÷ mais forte × 100; assimetria = 100 − simetria (p. 13)
 *   - as três tentativas são sempre preservadas, inclusive a mais baixa (p. 9 e 21)
 *   - `Mean force` do app NÃO é a média dos picos e nunca substitui o cálculo (p. 12)
 *
 * Armadilhas do export, todas verificadas no arquivo real:
 *   - todas as colunas numéricas chegam como TEXTO, menos `Time to peak force(ms)`
 *   - data, nome, exercício e lado só aparecem na primeira linha de cada bloco
 *   - não existe coluna com o número da tentativa: a ordem das linhas é a única fonte
 */

export type Lado = 'E' | 'D';

/**
 * Variação máxima aceita entre as três tentativas de um mesmo lado.
 * Decisão de 12/09/2026: começa em 15%. Acima disso o relatório sinaliza,
 * porque costuma ser falha de execução ou de fixação, não diferença de força.
 */
export const CV_MAXIMO = 15;

export type MovimentoChave =
  | 'flexao-quadril'
  | 'extensao-quadril'
  | 'abducao-quadril'
  | 'aducao-quadril'
  | 'extensao-joelho'
  | 'flexao-joelho'
  | 'flexao-plantar';

export type Movimento = { chave: MovimentoChave; nome: string; sinonimos: string[] };

/**
 * Os sete testes do protocolo. Os nomes confirmados pelo Gustavo em 12/09/2026, lidos
 * direto do FightTech, vêm primeiro; os demais sinônimos cobrem variações e o inglês.
 * A normalização remove acentos e troca os travessões do app por espaço, então
 * "Flexão Plantar Isométrica – Joelho Estendido — Unilateral" chega aqui achatado.
 */
export const MOVIMENTOS: Movimento[] = [
  { chave: 'flexao-quadril', nome: 'Flexão de quadril', sinonimos: ['flexao isometrica do quadril unilateral', 'flexao isometrica do quadril', 'flexao de quadril', 'flexao do quadril', 'hip flexion'] },
  { chave: 'extensao-quadril', nome: 'Extensão de quadril', sinonimos: ['extensao isometrica do quadril unilateral', 'extensao isometrica do quadril', 'extensao de quadril', 'extensao do quadril', 'hip extension'] },
  { chave: 'abducao-quadril', nome: 'Abdução de quadril', sinonimos: ['abducao isometrica do quadril unilateral', 'abducao isometrica do quadril', 'abducao de quadril', 'abducao do quadril', 'hip abduction'] },
  { chave: 'aducao-quadril', nome: 'Adução de quadril', sinonimos: ['aducao isometrica do quadril unilateral', 'aducao isometrica do quadril', 'aducao de quadril', 'aducao do quadril', 'hip adduction'] },
  { chave: 'extensao-joelho', nome: 'Extensão de joelho', sinonimos: ['extensao isometrica do joelho unilateral', 'extensao isometrica do joelho', 'extensao de joelho', 'extensao do joelho', 'knee extension'] },
  { chave: 'flexao-joelho', nome: 'Flexão de joelho', sinonimos: ['flexao isometrica do joelho unilateral', 'flexao isometrica do joelho', 'flexao de joelho', 'flexao do joelho', 'knee flexion'] },
  { chave: 'flexao-plantar', nome: 'Flexão plantar', sinonimos: ['flexao plantar isometrica joelho estendido unilateral', 'flexao plantar isometrica joelho estendido', 'flexao plantar isometrica', 'flexao plantar', 'panturrilha', 'plantar flexion'] },
];

export type Tentativa = {
  exercicioBruto: string;
  chave: MovimentoChave | null;
  lado: Lado;
  ordem: number;
  pico: number;
  data: string;
  atletaNoApp: string;
  linha: number;
};

export type LeituraExcel = {
  tentativas: Tentativa[];
  problemas: string[];
  naoReconhecidos: string[];
  atletaNoApp: string;
  datas: string[];
};

export type LadoResultado = {
  picos: number[];
  media: number;
  maior: number;
  cv: number;
  crescente: boolean;
};

export type MovimentoResultado = {
  chave: MovimentoChave;
  nome: string;
  esquerdo: LadoResultado | null;
  direito: LadoResultado | null;
  simetria: number | null;
  assimetria: number | null;
  ladoMenor: Lado | null;
  relativaEsquerdo: number | null;
  relativaDireito: number | null;
  alertas: string[];
};

/**
 * Faixas de MAGNITUDE da assimetria, usadas só para colorir o relatório.
 * Descrevem o tamanho do número; não são classificação de risco de lesão —
 * ver a decisão D23 do projeto e a p. 13 do manual CareFit.
 */
export type Faixa = 'baixa' | 'media' | 'alta';
export const faixaAssimetria = (valor: number | null): Faixa | null =>
  valor === null ? null : valor <= 10 ? 'baixa' : valor <= 20 ? 'media' : 'alta';

export type Razao = {
  titulo: string;
  lado: Lado;
  valor: number;
  detalhe: string;
  comparavel: boolean;
  nota?: string;
};

export type Atleta = { nome: string; nascimento: string; peso: number; email: string };

export type Avaliacao = {
  atleta: Atleta;
  idade: number | null;
  data: string;
  movimentos: MovimentoResultado[];
  razoes: Razao[];
  problemas: string[];
};

const semAcento = (valor: unknown) => String(valor ?? '')
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[‐-―-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/** O export traz "27.65" como texto. Aceita vírgula porque o app é localizado. */
export const numero = (valor: unknown): number | null => {
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : null;
  const texto = String(valor ?? '').trim().replace(',', '.');
  if (!texto || !/^-?\d+(\.\d+)?$/.test(texto)) return null;
  const n = Number(texto);
  return Number.isFinite(n) ? n : null;
};

export const reconhecerMovimento = (nome: string): MovimentoChave | null => {
  const alvo = semAcento(nome);
  if (!alvo) return null;
  for (const movimento of MOVIMENTOS) {
    if (movimento.sinonimos.some(sinonimo => alvo === sinonimo || alvo.includes(sinonimo))) return movimento.chave;
  }
  return null;
};

const lerLado = (valor: unknown): Lado | null => {
  const texto = semAcento(valor);
  if (texto === 'l' || texto === 'e' || texto === 'left' || texto === 'esquerdo') return 'E';
  if (texto === 'r' || texto === 'd' || texto === 'right' || texto === 'direito') return 'D';
  return null;
};

const COLUNAS = { data: 0, atleta: 1, exercicio: 2, lado: 3, pico: 4 } as const;

/**
 * Lê as linhas cruas da aba `All`. Repete data, nome, exercício e lado para baixo,
 * porque o app só preenche a primeira linha de cada bloco de tentativas.
 */
export function lerExportFightTech(linhas: unknown[][]): LeituraExcel {
  const tentativas: Tentativa[] = [];
  const problemas: string[] = [];
  const naoReconhecidos = new Set<string>();
  const datas = new Set<string>();
  const nomes = new Set<string>();

  let data = '';
  let atleta = '';
  let exercicio = '';
  let lado: Lado | null = null;
  let ordem = 0;

  const cabecalho = linhas[0] ?? [];
  if (semAcento(cabecalho[COLUNAS.exercicio]) !== 'exercise' || semAcento(cabecalho[COLUNAS.pico]).indexOf('peak force') !== 0) {
    problemas.push('Este arquivo não parece ser o export do FightTech. Esperado o cabeçalho com as colunas “Exercise”, “L/R” e “Peak force(KG)”.');
    return { tentativas, problemas, naoReconhecidos: [], atletaNoApp: '', datas: [] };
  }

  for (let i = 1; i < linhas.length; i++) {
    const linha = linhas[i] ?? [];
    const pico = numero(linha[COLUNAS.pico]);
    if (pico === null) continue;

    const dataCelula = String(linha[COLUNAS.data] ?? '').trim();
    const atletaCelula = String(linha[COLUNAS.atleta] ?? '').trim();
    const exercicioCelula = String(linha[COLUNAS.exercicio] ?? '').trim();
    const ladoCelula = lerLado(linha[COLUNAS.lado]);

    if (dataCelula) data = dataCelula;
    if (atletaCelula) atleta = atletaCelula;
    if (exercicioCelula) exercicio = exercicioCelula;
    // Bloco novo sempre que o app declara o lado; é o único marcador de início de série.
    if (ladoCelula) { lado = ladoCelula; ordem = 0; }

    if (!lado) { problemas.push(`Linha ${i + 1}: não foi possível saber se a tentativa é do lado direito ou esquerdo.`); continue; }
    if (!exercicio) { problemas.push(`Linha ${i + 1}: tentativa sem nome de exercício.`); continue; }
    if (pico <= 0) { problemas.push(`Linha ${i + 1}: pico de ${pico} kg não é um resultado válido.`); continue; }

    const chave = reconhecerMovimento(exercicio);
    if (!chave) naoReconhecidos.add(exercicio);
    if (data) datas.add(data.slice(0, 10));
    if (atleta) nomes.add(atleta);

    ordem += 1;
    tentativas.push({ exercicioBruto: exercicio, chave, lado, ordem, pico, data, atletaNoApp: atleta, linha: i + 1 });
  }

  if (!tentativas.length) problemas.push('Nenhuma tentativa foi encontrada no arquivo.');
  if (datas.size > 1) problemas.push(`O arquivo tem tentativas de ${datas.size} datas diferentes (${[...datas].join(', ')}). O protocolo compara lados medidos na mesma sessão.`);
  if (nomes.size > 1) problemas.push(`O arquivo tem ${nomes.size} nomes diferentes (${[...nomes].join(', ')}). Exporte um atleta por vez.`);

  return { tentativas, problemas, naoReconhecidos: [...naoReconhecidos], atletaNoApp: [...nomes][0] ?? '', datas: [...datas] };
}

const media = (valores: number[]) => valores.reduce((soma, v) => soma + v, 0) / valores.length;

const coeficienteVariacao = (valores: number[]) => {
  if (valores.length < 2) return 0;
  const m = media(valores);
  if (!m) return 0;
  const variancia = valores.reduce((soma, v) => soma + (v - m) ** 2, 0) / (valores.length - 1);
  return (Math.sqrt(variancia) / m) * 100;
};

function resumirLado(picos: number[]): LadoResultado {
  return {
    picos,
    media: media(picos),
    maior: Math.max(...picos),
    cv: coeficienteVariacao(picos),
    // Sinaliza o efeito de aprendizagem: o manual mantém as 3 tentativas, então o
    // relatório mostra a tendência em vez de escondê-la dentro da média.
    crescente: picos.length >= 3 && picos.every((p, i) => i === 0 || p > picos[i - 1]),
  };
}

/** Pares agonista/antagonista. `comparavel` diz se a razão é lida sem ressalva. */
const PARES: { titulo: string; a: MovimentoChave; b: MovimentoChave; comparavel: boolean; nota?: string }[] = [
  {
    titulo: 'Joelho — flexores / extensores', a: 'flexao-joelho', b: 'extensao-joelho', comparavel: true,
  },
  {
    titulo: 'Quadril — abdutores / adutores', a: 'abducao-quadril', b: 'aducao-quadril', comparavel: true,
  },
  {
    titulo: 'Quadril — flexores / extensores', a: 'flexao-quadril', b: 'extensao-quadril', comparavel: false,
    nota: 'Os dois testes são feitos em posições e ângulos diferentes, então esta razão não é comparável com valores de outros protocolos. Serve para acompanhar o próprio atleta ao longo do tempo.',
  },
];

export const calcularIdade = (nascimento: string, referencia = new Date()): number | null => {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(nascimento);
  if (!partes) return null;
  const nasc = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
  if (Number.isNaN(nasc.getTime())) return null;
  let idade = referencia.getFullYear() - nasc.getFullYear();
  const mes = referencia.getMonth() - nasc.getMonth();
  if (mes < 0 || (mes === 0 && referencia.getDate() < nasc.getDate())) idade -= 1;
  return idade >= 0 && idade < 120 ? idade : null;
};

export function calcularAvaliacao(leitura: LeituraExcel, atleta: Atleta, hoje = new Date()): Avaliacao {
  const problemas = [...leitura.problemas];
  const movimentos: MovimentoResultado[] = [];

  for (const definicao of MOVIMENTOS) {
    const doMovimento = leitura.tentativas.filter(t => t.chave === definicao.chave);
    if (!doMovimento.length) continue;

    const alertas: string[] = [];
    const porLado = (lado: Lado): LadoResultado | null => {
      const picos = doMovimento.filter(t => t.lado === lado).sort((a, b) => a.ordem - b.ordem).map(t => t.pico);
      if (!picos.length) return null;
      const nome = lado === 'E' ? 'esquerdo' : 'direito';
      if (picos.length !== 3) alertas.push(`Lado ${nome}: ${picos.length} tentativa(s) em vez de 3. O protocolo pede três tentativas válidas.`);
      return resumirLado(picos);
    };

    const esquerdo = porLado('E');
    const direito = porLado('D');

    if (!esquerdo || !direito) alertas.push('Só um dos lados foi medido; não é possível calcular assimetria.');
    for (const [resultado, nome] of [[esquerdo, 'esquerdo'], [direito, 'direito']] as const) {
      if (!resultado) continue;
      if (resultado.cv > CV_MAXIMO) alertas.push(`Lado ${nome}: variação de ${resultado.cv.toFixed(1)}% entre as tentativas. Acima de ${CV_MAXIMO}% costuma indicar problema de execução ou de fixação.`);
      if (resultado.crescente) alertas.push(`Lado ${nome}: os três picos subiram do primeiro ao último. Parte do resultado pode ser familiarização com o teste, e a média subestima a força real.`);
    }

    let simetria: number | null = null;
    let assimetria: number | null = null;
    let ladoMenor: Lado | null = null;
    if (esquerdo && direito) {
      const menor = Math.min(esquerdo.media, direito.media);
      const maior = Math.max(esquerdo.media, direito.media);
      simetria = maior > 0 ? (menor / maior) * 100 : null;
      assimetria = simetria === null ? null : 100 - simetria;
      ladoMenor = esquerdo.media === direito.media ? null : esquerdo.media < direito.media ? 'E' : 'D';
    }

    const relativa = (resultado: LadoResultado | null) => resultado && atleta.peso > 0 ? resultado.media / atleta.peso : null;

    movimentos.push({
      chave: definicao.chave, nome: definicao.nome, esquerdo, direito,
      simetria, assimetria, ladoMenor,
      relativaEsquerdo: relativa(esquerdo), relativaDireito: relativa(direito),
      alertas,
    });
  }

  const razoes: Razao[] = [];
  for (const par of PARES) {
    const a = movimentos.find(m => m.chave === par.a);
    const b = movimentos.find(m => m.chave === par.b);
    if (!a || !b) continue;
    for (const lado of ['E', 'D'] as Lado[]) {
      const campo = lado === 'E' ? 'esquerdo' : 'direito';
      const forcaA = a[campo]?.media;
      const forcaB = b[campo]?.media;
      if (!forcaA || !forcaB) continue;
      razoes.push({
        titulo: par.titulo, lado, valor: (forcaA / forcaB) * 100,
        detalhe: `${forcaA.toFixed(1).replace('.', ',')} kg / ${forcaB.toFixed(1).replace('.', ',')} kg`,
        comparavel: par.comparavel, nota: par.nota,
      });
    }
  }

  const faltando = MOVIMENTOS.filter(m => !movimentos.some(r => r.chave === m.chave));
  if (faltando.length && movimentos.length) {
    problemas.push(`Movimento(s) sem resultado nesta avaliação: ${faltando.map(m => m.nome).join(', ')}.`);
  }

  return {
    atleta,
    idade: calcularIdade(atleta.nascimento, hoje),
    data: leitura.datas[0] ?? '',
    movimentos, razoes, problemas,
  };
}
