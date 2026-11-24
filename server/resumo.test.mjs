import test from 'node:test';
import assert from 'node:assert/strict';
import { montarTexto, PAINEL } from './resumo.mjs';

const CARTEIRA = {
  limites: { poucasSessoes: 2, planoTerminaEm: 21, sumidoDias: 30, finalizadoDias: 60 },
  resumo: { total: 10, ativos: 5, leads: 2, finalizados: 2, inativos: 1, emRisco: 1200, aCobrar: 430 },
  renovacao: [{ nome: 'Ana', entrada: true }, { nome: 'Bia', entrada: false }],
  sumidos: [{ nome: 'Caio' }],
  pagamento: [{ nome: 'Dani' }],
  finalizados: [{ nome: 'Edu' }, { nome: 'Fê' }],
  valoresSuspeitos: { quantidade: 0, exemplos: [] },
};
const EQUIPE = {
  totais: { atendimentos: 105, producao: 13931.5, aPagar: 6052.05, projecao: { producao: 18171.52, atendimentos: 136 } },
  bonus: { faltam: 9 },
  foraDoNormal: { quantidade: 0, exemplos: [] },
};
const WHATSAPP = {
  resumo: { esfriou: 2 },
  fila: [
    { motivo: 'sem_resposta', nome: 'Rafael', horas: 30 },
    { motivo: 'sem_resposta', nome: 'Angela', horas: 5 },
    { motivo: 'esfriou', nome: 'João', horas: 96 },
  ],
};
const texto = (extra = {}) => montarTexto({ hoje: '2026-11-24', carteira: CARTEIRA, whatsapp: WHATSAPP, equipe: EQUIPE, ...extra });

test('o resumo abre com o dia e traz os três blocos', () => {
  const t = texto();
  assert.match(t, /^\*CareFit — terça-feira, 24\/11\*/);
  assert.match(t, /\*WhatsApp\*/);
  assert.match(t, /\*Carteira\*/);
  assert.match(t, /\*Mês até aqui\*/);
  assert.ok(t.endsWith(PAINEL));
});

test('conta quem espera resposta e destaca quem espera há mais de um dia', () => {
  const t = texto();
  assert.match(t, /2 pessoas esperando resposta, 1 há mais de um dia/);
  assert.match(t, /2 conversas esfriaram/);
  assert.match(t, /↳ Rafael \(1d\)/);
  assert.match(t, /↳ Angela \(5h\)/);
  assert.ok(!t.includes('João'), 'quem esfriou não entra na lista de espera');
});

test('singular e plural saem certos', () => {
  const um = montarTexto({
    hoje: '2026-11-24',
    carteira: { ...CARTEIRA, renovacao: [{ nome: 'Ana', entrada: false }], sumidos: [], pagamento: [], finalizados: [{ nome: 'Edu' }] },
    whatsapp: { resumo: { esfriou: 1 }, fila: [{ motivo: 'sem_resposta', nome: 'Rafael', horas: 4 }] },
    equipe: EQUIPE,
  });
  assert.match(um, /1 pessoa esperando resposta\n/);
  assert.match(um, /1 conversa esfriou/);
  assert.match(um, /1 atleta para renovar/);
  assert.match(um, /1 atleta terminou o plano e não voltou/);
  assert.match(texto(), /2 atletas terminaram o plano e não voltaram/);
});

test('caixa limpa é dita com todas as letras', () => {
  const t = montarTexto({ hoje: '2026-11-24', carteira: CARTEIRA, equipe: EQUIPE, whatsapp: { resumo: { esfriou: 0 }, fila: [] } });
  assert.match(t, /ninguém esperando resposta/);
  assert.ok(!t.includes('esfriou'));
});

test('WhatsApp fora do ar não derruba o resumo', () => {
  const t = texto({ whatsapp: null });
  assert.match(t, /não consegui ler as conversas agora/);
  assert.match(t, /29 atendimentos|105 atendimentos/);
});

test('valores errados no ClickUp viram aviso com os nomes', () => {
  const t = texto({
    carteira: { ...CARTEIRA, valoresSuspeitos: { quantidade: 2, exemplos: [{ nome: 'Andre Lavez' }, { nome: 'Cinthia Nardi' }] } },
    equipe: { ...EQUIPE, foraDoNormal: { quantidade: 1, exemplos: [{ atleta: 'Marjorie Vian' }] } },
  });
  assert.match(t, /⚠️ 2 planos com valores fora do normal.*Andre Lavez, Cinthia Nardi/);
  assert.match(t, /⚠️ 1 sessão com valor acima de R\$ 1\.000: Marjorie Vian/);
});

test('mês fechado não promete projeção', () => {
  const t = texto({ equipe: { ...EQUIPE, totais: { ...EQUIPE.totais, projecao: { producao: null, atendimentos: null } } } });
  assert.ok(!t.includes('no ritmo atual'));
});
