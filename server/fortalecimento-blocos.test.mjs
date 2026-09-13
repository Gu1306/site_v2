import test from 'node:test';
import assert from 'node:assert/strict';
import { blocksOf, blockLabel, canJoinWithPrevious, defaultMetrics, joinedWithPrevious, normalizeBlocks, paginate, toggleJoin } from '../src/lib/fortalecimentoBlocos.ts';

const exercise = (name, group = null, rest = 60) => ({ name, sets: 3, reps: '10', load: 'corpo', rest, group });

test('exercícios soltos não viram bloco e vizinhos com o mesmo grupo viram', () => {
  assert.deepEqual(blocksOf([exercise('A'), exercise('B')]), [[0], [1]]);
  assert.deepEqual(blocksOf([exercise('A', 1), exercise('B', 1), exercise('C')]), [[0, 1], [2]]);
  // Mesmo id longe dali é outro bloco: bi-set é sempre sequência.
  assert.deepEqual(blocksOf([exercise('A', 1), exercise('B'), exercise('C', 1)]), [[0], [1], [2]]);
});

test('normalizar renumera os blocos e desfaz bloco de um só exercício', () => {
  const list = normalizeBlocks([exercise('A', 7), exercise('B', 7), exercise('C', 9), exercise('D', 4), exercise('E', 4)]);
  assert.deepEqual(list.map(e => e.group), [1, 1, null, 2, 2]);
});

test('juntar zera a pausa interna e separar devolve o exercício e o que vem depois', () => {
  const base = [exercise('A'), exercise('B'), exercise('C'), exercise('D')];
  const biset = toggleJoin(base, 1);
  assert.deepEqual(biset.map(e => e.group), [1, 1, null, null]);
  assert.equal(biset[0].rest, 0, 'a pausa existe só no fim do bloco');
  assert.equal(biset[1].rest, 60);
  const triset = toggleJoin(biset, 2);
  assert.deepEqual(triset.map(e => e.group), [1, 1, 1, null]);
  assert.deepEqual(triset.map(e => e.rest), [0, 0, 60, 60]);
  // Separar o do meio leva junto quem vinha depois dele no bloco.
  const split = toggleJoin(triset, 1);
  assert.deepEqual(split.map(e => e.group), [null, 1, 1, null]);
  assert.ok(joinedWithPrevious(split, 2));
  assert.ok(!joinedWithPrevious(split, 1));
});

test('o bloco para em quatro exercícios', () => {
  let list = [exercise('A'), exercise('B'), exercise('C'), exercise('D'), exercise('E')];
  for (const index of [1, 2, 3]) list = toggleJoin(list, index);
  assert.deepEqual(list.map(e => e.group), [1, 1, 1, 1, null]);
  assert.equal(canJoinWithPrevious(list, 4), false);
  assert.deepEqual(toggleJoin(list, 4).map(e => e.group), [1, 1, 1, 1, null], 'juntar além do limite não muda nada');
});

test('o rótulo do bloco segue o tamanho', () => {
  assert.equal(blockLabel(2), 'BI-SET');
  assert.equal(blockLabel(3), 'TRI-SET');
  assert.equal(blockLabel(4), 'CIRCUITO');
});

test('a TV nunca parte um bi-set ou tri-set entre duas páginas', () => {
  const metrics = { ...defaultMetrics, available: 280 };
  // Referência: nesta altura cabem dois exercícios soltos (2 x 132), não três.
  assert.equal(paginate([exercise('A'), exercise('B'), exercise('C')], metrics).length, 2);
  // O tri-set que antes quebrava em duas páginas agora cabe inteiro em uma.
  const triset = [exercise('A', 1), exercise('B', 1), exercise('C', 1)];
  const pages = paginate(triset, metrics);
  assert.equal(pages.length, 1);
  assert.deepEqual(pages[0], [[0, 1, 2]]);
});

test('bloco maior que a página fica sozinho nela em vez de sumir ou repetir', () => {
  const metrics = { ...defaultMetrics, available: 140 };
  const pages = paginate([exercise('A'), exercise('B', 1), exercise('C', 1), exercise('D')], metrics);
  assert.deepEqual(pages, [[[0]], [[1, 2]], [[3]]]);
  // Todo exercício aparece uma única vez, em alguma página.
  assert.deepEqual(pages.flat(2), [0, 1, 2, 3]);
});

test('blocos e exercícios soltos se misturam sem perder ninguém', () => {
  const exercises = [exercise('A'), exercise('B', 1), exercise('C', 1), exercise('D'), exercise('E', 2), exercise('F', 2), exercise('G', 2)];
  const pages = paginate(exercises, defaultMetrics);
  assert.deepEqual(pages.flat(2), [0, 1, 2, 3, 4, 5, 6]);
  for (const page of pages) for (const block of page) assert.ok(block.length === 1 || block.every((index, position) => index === block[0] + position), 'bloco sempre em sequência');
});
