import test from 'node:test';
import assert from 'node:assert/strict';
import { manterCacheQuente } from './index.mjs';

function montar() {
  const chamadas = [];
  const respostas = [];
  const fechamento = { atletas: () => { chamadas.push(Date.now()); return respostas.shift() || Promise.resolve({ atletas: [] }); } };
  const agendados = [];
  const agendar = (fn, ms) => { agendados.push({ fn, ms }); return { unref() { agendados.at(-1).solto = true; } }; };
  return { chamadas, respostas, fechamento, agendados, agendar };
}

test('aquece ao subir e agenda a releitura a cada 10 min, sem segurar o processo', async () => {
  const m = montar();
  manterCacheQuente(m.fechamento, undefined, m.agendar);
  assert.equal(m.chamadas.length, 1, 'lê o CRM e as listas na hora');
  assert.equal(m.agendados.length, 1);
  assert.equal(m.agendados[0].ms, 10 * 60000);
  assert.equal(m.agendados[0].solto, true, 'o temporizador não impede o Node de encerrar');
  await m.agendados[0].fn();
  assert.equal(m.chamadas.length, 2, 'cada disparo relê');
});

test('ClickUp fora do ar no aquecimento vira só uma linha de log', async () => {
  const m = montar();
  m.respostas.push(Promise.reject(new Error('502')));
  const erros = [];
  const original = console.error;
  console.error = (...a) => erros.push(a.join(' '));
  try {
    manterCacheQuente(m.fechamento, 1000, m.agendar);
    await new Promise(r => setImmediate(r));
    assert.equal(erros.length, 1);
    assert.match(erros[0], /aquecimento do cache falhou 502/);
    await m.agendados[0].fn();
    assert.equal(m.chamadas.length, 2, 'o disparo seguinte tenta de novo');
  } finally { console.error = original; }
});
