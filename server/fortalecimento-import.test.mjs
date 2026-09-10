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
