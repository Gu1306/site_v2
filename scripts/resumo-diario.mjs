// Resumo diário da operação da CareFit, no WhatsApp do Gustavo.
//
// Lê o que o painel /gestao mostra (ClickUp + Evolution, só leitura) e manda um
// resumo curto para UM número fixo — o dono. Este é o único lugar do projeto que
// ENVIA mensagem, e ele só sabe falar com `RESUMO_DESTINO`: não responde atleta,
// não dispara lista, não lê destinatário de lugar nenhum.
//
// Uso:
//   node scripts/resumo-diario.mjs --teste    → monta e imprime, não envia
//   node scripts/resumo-diario.mjs            → monta e envia
//
// Variáveis: CLICKUP_API_TOKEN, EVOLUTION_BASE_URL, EVOLUTION_INSTANCE,
// EVOLUTION_API_KEY e RESUMO_DESTINO (o número, só dígitos, com 55).
import { readFileSync } from 'node:fs';
import { clickupClient, dayOf } from '../server/fortalecimento.mjs';
import { criarServicoFechamento } from '../server/fechamento.mjs';
import { montarCarteira } from '../server/carteira.mjs';
import { montarEquipe } from '../server/equipe.mjs';
import { criarLeitorConversas, criarServicoConversas } from '../server/conversas.mjs';
import { montarTexto } from '../server/resumo.mjs';

const TESTE = process.argv.includes('--teste');

/**
 * Lê um arquivo .env por cima do ambiente. A variável de usuário do Windows
 * `EVOLUTION_API_KEY` ficou velha na troca de chave de out/2026 e dá 401, então
 * o arquivo tem que ganhar do ambiente — não o contrário.
 */
function carregarEnv(caminhos) {
  const env = { ...process.env };
  for (const caminho of caminhos) {
    let texto;
    try { texto = readFileSync(caminho, 'utf8').replace(/^\uFEFF/, ''); } catch { continue; }
    for (const linha of texto.split(/\r?\n/)) {
      if (!linha.includes('=') || linha.trimStart().startsWith('#')) continue;
      const corte = linha.indexOf('=');
      env[linha.slice(0, corte).trim()] = linha.slice(corte + 1).trim();
    }
  }
  return env;
}

/** Único ponto de envio do projeto, e só para o número configurado. */
async function enviar(env, texto) {
  const destino = String(env.RESUMO_DESTINO || '').replace(/\D/g, '');
  if (!/^55\d{10,11}$/.test(destino)) throw new Error('RESUMO_DESTINO precisa ser um número brasileiro com 55, só dígitos.');
  const base = String(env.EVOLUTION_BASE_URL || '').replace(/\/+$/, '');
  const resposta = await fetch(`${base}/message/sendText/${encodeURIComponent(env.EVOLUTION_INSTANCE)}`, {
    method: 'POST',
    headers: { apikey: env.EVOLUTION_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ number: destino, text: texto }),
    signal: AbortSignal.timeout(30000),
  });
  const corpo = await resposta.text();
  if (!resposta.ok) throw new Error(`Evolution ${resposta.status}: ${corpo.slice(0, 300)}`);
  return corpo.slice(0, 200);
}

const env = carregarEnv(['.env.local', '.env', 'C:/Projetos/carefit-clickup-automacoes/.env']);
const servico = criarServicoFechamento(clickupClient(env.CLICKUP_API_TOKEN));
const conversas = criarServicoConversas(criarLeitorConversas(env));
const hoje = dayOf(Date.now());

const [{ atletas }, listas] = await Promise.all([servico.atletas(), servico.listas()]);
let whatsapp = null;
try { whatsapp = await conversas.fila(atletas); }
catch (e) { console.error('WhatsApp não lido:', e.message); }

const texto = montarTexto({
  hoje,
  carteira: montarCarteira(atletas, hoje),
  whatsapp,
  equipe: montarEquipe(listas, hoje.slice(0, 7), hoje),
});

console.log('\n' + texto + '\n');
if (TESTE) { console.log('(--teste: nada foi enviado)'); process.exit(0); }
console.log('enviado:', await enviar(env, texto));
