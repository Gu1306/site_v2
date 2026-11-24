// Carteira de atletas (/gestao/operacao) — SÓ LEITURA.
//
// Responde à pergunta do dono: "o que precisa de mim hoje?". Cruza o CRM com as
// sessões e separa quem está acabando o plano, quem sumiu, quem ficou com
// pagamento pendente e quem terminou o plano e não voltou.
//
// Decisões tomadas olhando a base real em 23/11/2026:
// - "Sessões que já fez / faltam para o fim do plano" estão VAZIOS no CRM (0 de
//   629 atletas), então o que falta é contado pelas sessões ainda sem baixa.
// - "Próxima prova - data" só tem 1 atleta preenchido: não vira bloco.
// - Status do card no CRM: "cliente ativo", "novo lead", "plano finalizado",
//   "inativo" (os emojis somem na normalização).
import { somarDias } from './fechamento.mjs';

export const ATIVO = 'cliente ativo';
export const FINALIZADO = 'plano finalizado';

export const LIMITES = {
  poucasSessoes: 2,     // restam 2 ou menos para acabar o plano
  planoTerminaEm: 21,   // dias até a data de término do plano
  sumidoDias: 30,       // ativo sem sessão realizada há mais de 30 dias
  finalizadoDias: 60,   // terminou o plano nos últimos 60 dias e não voltou
};

// O campo de moeda do ClickUp está em formato en-US: "1.040,00" digitado com
// vírgula vira 1040000. Nenhum plano da CareFit custa isso, então valor acima do
// teto não entra nas somas e é listado para corrigir — mesma trava do fechamento.
export const VALOR_MAXIMO_PLANO = 20000;
const centavos = v => Math.round(v * 100) / 100;
const valorPlanoDe = a => (a.valorPlano !== null && a.valorPlano > 0 && a.valorPlano <= VALOR_MAXIMO_PLANO ? a.valorPlano : null);
const ABERTA = s => s.status !== 'realizada' && s.status !== 'cancelada';
// Portas de entrada: quem está aqui ainda não comprou plano — a ação é vender, não renovar.
const ENTRADAS = new Set(['Primeira Sessão Dupla', 'Avaliação', 'Sessão Avulsa', 'AVALIAÇÃO DE FORÇA']);

/** Função pura: atletas do CRM (com sessões coladas) + hoje → o que precisa de atenção. */
export function montarCarteira(atletas, hoje) {
  const resumo = { total: atletas.length, ativos: 0, leads: 0, finalizados: 0, inativos: 0 };
  for (const a of atletas) {
    if (a.status === ATIVO) resumo.ativos++;
    else if (a.status === 'novo lead') resumo.leads++;
    else if (a.status === FINALIZADO) resumo.finalizados++;
    else resumo.inativos++;
  }

  const comSessoes = atletas.map(a => {
    const realizadas = a.sessoes.filter(s => s.status === 'realizada' && s.data).map(s => s.data).sort();
    const abertas = a.sessoes.filter(ABERTA);
    const futuras = abertas.filter(s => s.data && s.data >= hoje).map(s => s.data).sort();
    return { ...a, ultima: realizadas.at(-1) || a.ultimaSessao || null, feitas: realizadas.length, restam: abertas.length, proxima: futuras[0] || null };
  });

  const base = a => ({
    id: a.id, nome: a.nome, url: a.url, fisio: a.fisio, plano: a.plano,
    valorPlano: valorPlanoDe(a), valorSuspeito: a.valorPlano !== null && a.valorPlano > VALOR_MAXIMO_PLANO ? a.valorPlano : null,
    ultima: a.ultima, proxima: a.proxima, restam: a.restam, feitas: a.feitas, fimDoPlano: a.fimDoPlano,
    entrada: ENTRADAS.has(a.plano || ''),
  });
  const dias = (de, ate) => Math.round((Date.parse(ate + 'T12:00:00Z') - Date.parse(de + 'T12:00:00Z')) / 864e5);

  // 1) Renovação: ativo acabando o plano — por sessões que restam ou pela data de término.
  const limiteTermino = somarDias(hoje, LIMITES.planoTerminaEm);
  const aindaAtivo = somarDias(hoje, -LIMITES.sumidoDias);
  const renovacao = comSessoes
    // Quem parou há mais de 30 dias aparece em "sumidos": não repete aqui.
    .filter(a => a.status === ATIVO && (!a.ultima || a.ultima >= aindaAtivo))
    .map(a => {
      const terminaLogo = a.fimDoPlano && a.fimDoPlano <= limiteTermino;
      let motivo = null;
      if (a.restam === 0) motivo = 'sem_sessao_marcada';
      else if (a.restam <= LIMITES.poucasSessoes) motivo = 'ultimas_sessoes';
      else if (terminaLogo) motivo = 'plano_termina';
      if (!motivo) return null;
      return { ...base(a), motivo, diasAteFim: a.fimDoPlano ? dias(hoje, a.fimDoPlano) : null };
    })
    .filter(Boolean)
    .sort((x, y) => x.restam - y.restam || (x.ultima || '').localeCompare(y.ultima || ''));

  // 2) Sumidos: ativo sem sessão realizada há mais de 30 dias e sem nada marcado.
  const corte = somarDias(hoje, -LIMITES.sumidoDias);
  const sumidos = comSessoes
    .filter(a => a.status === ATIVO && !a.proxima && a.ultima && a.ultima < corte)
    .map(a => ({ ...base(a), diasParado: dias(a.ultima, hoje) }))
    .sort((x, y) => y.diasParado - x.diasParado);

  // 3) Pagamento pendente ou atrasado, em qualquer status.
  const pagamento = comSessoes
    .filter(a => /pendente|atrasado/i.test(a.pagamento || ''))
    .map(a => ({ ...base(a), pagamento: a.pagamento }))
    .sort((x, y) => (y.valorPlano || 0) - (x.valorPlano || 0));

  // 4) Terminou o plano há pouco e não voltou: a lista natural de reativação.
  const corteFim = somarDias(hoje, -LIMITES.finalizadoDias);
  const finalizados = comSessoes
    .filter(a => a.status === FINALIZADO && !a.proxima && a.ultima && a.ultima >= corteFim)
    .map(a => ({ ...base(a), diasParado: dias(a.ultima, hoje) }))
    .sort((x, y) => x.diasParado - y.diasParado);

  const somar = lista => centavos(lista.reduce((t, a) => t + (a.valorPlano || 0), 0));
  const suspeitos = comSessoes.filter(a => a.valorPlano !== null && a.valorPlano > VALOR_MAXIMO_PLANO)
    .map(a => ({ nome: a.nome, valor: a.valorPlano, plano: a.plano, url: a.url }));
  return {
    limites: LIMITES,
    resumo: {
      ...resumo,
      // Dinheiro que depende de uma conversa acontecer.
      emRisco: somar(renovacao) + somar(sumidos),
      aCobrar: somar(pagamento),
    },
    renovacao, sumidos, pagamento, finalizados,
    valoresSuspeitos: { quantidade: suspeitos.length, exemplos: suspeitos.slice(0, 3) },
  };
}
