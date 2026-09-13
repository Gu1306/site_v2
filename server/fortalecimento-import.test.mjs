import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWorkoutImport } from '../src/lib/fortalecimentoImport.ts';

const header = ['Nome do treino', 'Atleta no ClickUp', 'Nome curto na TV', 'Exercício', 'Séries', 'Repetições/tempo', 'Carga + unidade', 'Pausa (s)'];
const athletes = [{ id: 'athlete-1', name: 'João da Silva' }];

test('Excel rows become one validated workout and match accents safely', () => {
  const result = buildWorkoutImport([
    header,
    ['Treino A', 'joao da silva', 'João', 'Agachamento', 3, '10', '12 kg', 60],
    ['Treino A', 'JOÃO DA SILVA', 'João', 'Remada', 3, '12', '8 kg', 45]
  ], athletes);
  assert.deepEqual(result.issues, []);
  assert.equal(result.workouts.length, 1);
  assert.equal(result.workouts[0].athleteId, 'athlete-1');
  assert.equal(result.workouts[0].exercises.length, 2);
});

test('Excel import blocks bad values, unknown athletes and inconsistent TV names', () => {
  const result = buildWorkoutImport([
    header,
    ['Treino A', 'Pessoa inexistente', 'Pessoa', 'Agachamento', 3, '10', 'corpo', 60],
    ['Treino B', 'João da Silva', 'João', 'Remada', 0, '12', '8 kg', 45],
    ['Treino C', 'João da Silva', 'João', 'Prancha', 3, '30 s', 'corpo', 30],
    ['Treino C', 'João da Silva', 'Outro nome', 'Ponte', 3, '12', 'corpo', 30]
  ], athletes);
  assert.ok(result.issues.some(issue => issue.includes('não encontrado')));
  assert.ok(result.issues.some(issue => issue.includes('séries')));
  assert.ok(result.issues.some(issue => issue.includes('nome curto')));
});

test('a coluna Bloco agrupa linhas vizinhas e o modelo antigo continua válido', () => {
  const withBlock = [...header, 'Bloco'];
  const result = buildWorkoutImport([
    withBlock,
    ['Treino A', 'João da Silva', 'João', 'Agachamento', 3, '10', '20 kg', 0, 'A'],
    ['Treino A', 'João da Silva', 'João', 'Afundo', 3, '10', '12 kg', 90, 'A'],
    ['Treino A', 'João da Silva', 'João', 'Prancha', 3, '30 s', 'corpo', 60, ''],
    ['Treino A', 'João da Silva', 'João', 'Remada', 3, '12', '8 kg', 60, 'A']
  ], athletes);
  assert.deepEqual(result.issues, []);
  // O mesmo rótulo longe dali não volta ao bloco anterior.
  assert.deepEqual(result.workouts[0].exercises.map(e => e.group), [1, 1, null, null]);
  const semColuna = buildWorkoutImport([header, ['Treino A', 'João da Silva', 'João', 'Agachamento', 3, '10', '12 kg', 60]], athletes);
  assert.deepEqual(semColuna.issues, []);
  assert.equal(semColuna.workouts[0].exercises[0].group, null);
});

test('bloco com mais de quatro exercícios é recusado na importação', () => {
  const rows = Array.from({ length: 5 }, (_, i) => ['Treino A', 'João da Silva', 'João', `Exercício ${i + 1}`, 3, '10', 'corpo', 0, 'A']);
  const result = buildWorkoutImport([[...header, 'Bloco'], ...rows], athletes);
  assert.ok(result.issues.some(issue => issue.includes('no máximo 4')));
  assert.equal(result.workouts.length, 0);
});
