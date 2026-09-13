// Bi-set e tri-set: exercícios vizinhos com o mesmo `group` formam um bloco.
// O campo é opcional de propósito — treinos gravados antes desta versão não têm
// `group` e continuam válidos, cada exercício virando um bloco de um.
export type BlockExercise = { group?: number | null };

export const MAX_BLOCK = 4;

const key = (exercise: BlockExercise | undefined) => exercise?.group ?? null;

/** Índices agrupados por bloco, na ordem do treino. Um exercício solto é um bloco de um. */
export function blocksOf(exercises: BlockExercise[]): number[][] {
  const blocks: number[][] = [];
  exercises.forEach((exercise, index) => {
    const previous = blocks[blocks.length - 1];
    const id = key(exercise);
    if (id !== null && previous && key(exercises[previous[previous.length - 1]]) === id) previous.push(index);
    else blocks.push([index]);
  });
  return blocks;
}

/** Renumera os blocos de 1 em diante e desfaz bloco de um só exercício. */
export function normalizeBlocks<T extends BlockExercise>(exercises: T[]): T[] {
  let id = 0;
  return blocksOf(exercises).flatMap(block => {
    if (block.length < 2) return block.map(index => ({ ...exercises[index], group: null }));
    id += 1;
    return block.map(index => ({ ...exercises[index], group: id }));
  });
}

export const blockLabel = (size: number) => (size === 2 ? 'BI-SET' : size === 3 ? 'TRI-SET' : 'CIRCUITO');

export function joinedWithPrevious(exercises: BlockExercise[], index: number) {
  if (index < 1) return false;
  const id = key(exercises[index - 1]);
  return id !== null && id === key(exercises[index]);
}

const blockAt = (exercises: BlockExercise[], index: number) =>
  blocksOf(exercises).find(block => block.includes(index)) || [index];

/** Só dá para juntar se o bloco resultante couber no limite de exercícios. */
export function canJoinWithPrevious(exercises: BlockExercise[], index: number) {
  if (index < 1 || joinedWithPrevious(exercises, index)) return false;
  return blockAt(exercises, index - 1).length + blockAt(exercises, index).length <= MAX_BLOCK;
}

/**
 * Junta o exercício ao bloco anterior ou o separa dele. Ao separar, o exercício
 * leva junto os que vinham depois dele no mesmo bloco. Ao juntar, a pausa dos
 * exercícios que deixam de ser o último do bloco vai a zero: em bi-set a pausa
 * existe só no fim do bloco.
 */
export function toggleJoin<T extends BlockExercise & { rest: number }>(exercises: T[], index: number): T[] {
  if (index < 1) return exercises;
  const next = exercises.map(exercise => ({ ...exercise }));
  if (joinedWithPrevious(exercises, index)) {
    const id = key(exercises[index]);
    for (let i = index; i < next.length && key(exercises[i]) === id; i++) next[i].group = -1;
  } else {
    const merged = [...blockAt(exercises, index - 1), ...blockAt(exercises, index)];
    if (merged.length > MAX_BLOCK) return exercises;
    for (const i of merged) next[i].group = 0;
  }
  const normalized = normalizeBlocks(next);
  for (const block of blocksOf(normalized)) {
    if (block.length < 2) continue;
    for (const i of block.slice(0, -1)) normalized[i].rest = 0;
  }
  return normalized;
}

// Alturas do modo TV, em pixels, remedidas a cada render do painel. O bloco é mais
// baixo que a soma dos exercícios soltos que o compõem, e é isso que faz um tri-set
// inteiro caber onde antes só cabiam dois exercícios.
export type TvMetrics = { available: number; rowHeight: number; blockHead: number; blockLine: number; blockPad: number };

export const defaultMetrics: TvMetrics = { available: 560, rowHeight: 132, blockHead: 30, blockLine: 54, blockPad: 36 };

export const blockHeight = (size: number, m: TvMetrics) => (size === 1 ? m.rowHeight : m.blockPad + m.blockHead + size * m.blockLine);

/**
 * Distribui os blocos nas páginas da TV. Um bi-set ou tri-set nunca é partido:
 * se não couber no que resta da página, começa a próxima. Um bloco maior que a
 * página inteira fica sozinho nela e rola dentro do card.
 */
export function paginate<T extends BlockExercise>(exercises: T[], m: TvMetrics): number[][][] {
  const pages: number[][][] = [];
  let current: number[][] = [];
  let used = 0;
  for (const block of blocksOf(exercises)) {
    const height = blockHeight(block.length, m);
    if (current.length && used + height > m.available) { pages.push(current); current = []; used = 0; }
    current.push(block);
    used += height;
  }
  if (current.length) pages.push(current);
  return pages;
}
