// Texto do resumo diário da operação (scripts/resumo-diario.mjs).
//
// Módulo puro de propósito: recebe o que o painel já calculou e devolve a
// mensagem. Fica separado do script porque o script, ao ser carregado, lê o
// ClickUp e envia o WhatsApp — e um teste nunca deve disparar isso.

export const PAINEL = 'https://www.carefitrunbase.com.br/gestao/operacao';
const MAIS_ANTIGOS = 4;

const brl = v => 'R$ ' + Number(v || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
const ddmm = iso => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const plural = (n, um, muitos) => `${n} ${n === 1 ? um : muitos}`;

/** Função pura: os três blocos do painel viram o texto que chega no WhatsApp. */
export function montarTexto({ hoje, carteira, whatsapp, equipe }) {
  const dia = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', day: '2-digit', month: '2-digit' }).format(new Date(hoje + 'T12:00:00Z'));
  const linhas = [`*CareFit — ${dia}*`, ''];

  linhas.push('*WhatsApp*');
  if (!whatsapp) {
    linhas.push('• não consegui ler as conversas agora');
  } else {
    const esperando = whatsapp.fila.filter(c => c.motivo === 'sem_resposta');
    const antigos = esperando.filter(c => c.horas >= 24);
    linhas.push(esperando.length
      ? `• ${plural(esperando.length, 'pessoa esperando resposta', 'pessoas esperando resposta')}${antigos.length ? `, ${antigos.length} há mais de um dia` : ''}`
      : '• ninguém esperando resposta');
    if (whatsapp.resumo.esfriou) linhas.push(`• ${plural(whatsapp.resumo.esfriou, 'conversa esfriou', 'conversas esfriaram')}`);
    for (const c of esperando.slice(0, MAIS_ANTIGOS)) {
      linhas.push(`   ↳ ${c.nome} (${c.horas < 24 ? `${c.horas}h` : `${Math.round(c.horas / 24)}d`})`);
    }
  }

  linhas.push('', '*Carteira*');
  const entrada = carteira.renovacao.filter(p => p.entrada).length;
  linhas.push(`• ${plural(carteira.renovacao.length, 'atleta para renovar', 'atletas para renovar')}${entrada ? ` (${entrada} ainda sem plano depois da 1ª sessão)` : ''}`);
  if (carteira.sumidos.length) linhas.push(`• ${plural(carteira.sumidos.length, 'ativo sumido', 'ativos sumidos')} há mais de ${carteira.limites.sumidoDias} dias`);
  if (carteira.pagamento.length) linhas.push(`• ${brl(carteira.resumo.aCobrar)} a cobrar em ${plural(carteira.pagamento.length, 'plano', 'planos')}`);
  if (carteira.finalizados.length) {
    const n = carteira.finalizados.length;
    linhas.push(`• ${n} ${n === 1 ? 'atleta terminou o plano e não voltou' : 'atletas terminaram o plano e não voltaram'}`);
  }

  linhas.push('', '*Mês até aqui*');
  linhas.push(`• ${equipe.totais.atendimentos} atendimentos · ${brl(equipe.totais.producao)}`);
  if (equipe.totais.projecao.producao !== null) linhas.push(`• no ritmo atual fecha em ${brl(equipe.totais.projecao.producao)}`);
  linhas.push(`• comissão até aqui: ${brl(equipe.totais.aPagar)}`);
  if (equipe.bonus.faltam > 0) linhas.push(`• faltam ${equipe.bonus.faltam} sessões para o bônus`);

  if (carteira.valoresSuspeitos.quantidade) {
    linhas.push('', `⚠️ ${plural(carteira.valoresSuspeitos.quantidade, 'plano com valor', 'planos com valores')} fora do normal no ClickUp (vírgula faltando): ${carteira.valoresSuspeitos.exemplos.map(x => x.nome).join(', ')}`);
  }
  if (equipe.foraDoNormal.quantidade) {
    linhas.push(`⚠️ ${plural(equipe.foraDoNormal.quantidade, 'sessão com valor', 'sessões com valores')} acima de R$ 1.000: ${equipe.foraDoNormal.exemplos.map(x => x.atleta).join(', ')}`);
  }

  linhas.push('', PAINEL);
  return linhas.join('\n');
}
