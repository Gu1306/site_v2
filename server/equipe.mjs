// Equipe e comissões (/gestao/equipe).
//
// SOMENTE LEITURA: usa o mesmo cache do fechamento (listas Sessões, Fortalecimento
// e Yoga do ClickUp) e devolve, por profissional, quanto produziu no mês, quanto
// recebe por atendimento e quanto tem de comissão pela regra registrada. Nada
// aqui escreve no ClickUp e nenhum dado clínico sai do servidor.
//
// As regras de comissão são DADO, não código espalhado: cada profissional tem
// uma linha em REGRAS. Regra que o Gustavo ainda não confirmou fica como
// `aConfirmar` e a tela mostra "regra a confirmar" em vez de um número
// inventado — dinheiro de pessoa real não se estima.
import { BONUS, VALOR_MAXIMO_SESSAO, somarDias } from './fechamento.mjs';
import { PublicError } from './fortalecimento.mjs';

const moeda = v => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * tipo 'percentual': (produção − desconto%) ÷ divisor. Regra do Gustavo de
 *   30/10/2026 para Lais e Igor: produção − 18%, dividido por 2.
 * tipo 'fixo': valor mensal fechado; `bonus: true` soma o bônus por volume
 *   (R$ 15 × sessões de TODOS os profissionais acima de 100 no mês).
 * tipo 'aConfirmar': aparece na tela com produção e atendimentos, sem comissão.
 */
export const REGRAS = {
  'Lívia Dias': {
    tipo: 'fixo', fixo: 4000, bonus: true, vinculo: 'Sócia · valor fixo mensal',
    descricao: 'R$ 4.000 fixos no mês + bônus de R$ 15 por sessão acima de 100 (contando todos os profissionais).',
    nota: 'O fixo já está na tabela de custos fixos do DRE: não é um pagamento a mais.',
  },
  'Lais Faria': {
    tipo: 'percentual', desconto: 0.18, divisor: 2, vinculo: 'Fisioterapeuta comissionada',
    descricao: 'Produção menos 18%, dividido por 2.',
    nota: 'Cortesia que você decidiu pagar entra pelo valor do plano, não por R$ 0.',
  },
  'Igor': {
    tipo: 'percentual', desconto: 0.18, divisor: 2, vinculo: 'Fisioterapeuta comissionado',
    descricao: 'Produção menos 18%, dividido por 2.',
  },
  // Lucas é PROFISSIONAL DE EDUCAÇÃO FÍSICA, não fisioterapeuta: o rótulo do campo
  // "Físio Carefit Que Atende" é interno e não serve de vínculo aqui.
  'Lucas Pereira': {
    tipo: 'percentual', desconto: 0.18, divisor: 2, vinculo: 'Profissional de educação física · comissionado',
    descricao: 'Produção menos 18%, dividido por 2.',
    nota: 'As aulas de fortalecimento em turma não têm profissional no card do ClickUp, então não entram nesta conta — só as sessões individuais.',
  },
  'Lilian Vidal': {
    tipo: 'percentual', desconto: 0.18, divisor: 2, vinculo: 'Não faz mais parte da equipe',
    foraDaEquipe: true,
    descricao: 'Produção menos 18%, dividido por 2.',
    nota: 'Saiu da equipe: só aparece nos meses em que atendeu.',
  },
};

const MESES_HISTORICO = 6;
const PRIMEIRO_MES = '2024-01';
const centavos = v => Math.round(v * 100) / 100;

export function diasDoMes(mes) {
  const [ano, numero] = mes.split('-').map(Number);
  const primeiroDoSeguinte = new Date(Date.UTC(ano, numero, 1)).toISOString().slice(0, 10);
  return { de: `${mes}-01`, ate: somarDias(primeiroDoSeguinte, -1) };
}

export function mesAnterior(mes, quantos = 1) {
  const [ano, numero] = mes.split('-').map(Number);
  return new Date(Date.UTC(ano, numero - 1 - quantos, 1)).toISOString().slice(0, 7);
}

/** Valor que entra em produção. Sessão acima do teto é erro de digitação, não receita. */
const valorValido = s => (s.valor > 0 && s.valor <= VALOR_MAXIMO_SESSAO ? s.valor : 0);

export function calcularComissao(regra, producao, bonusSessoes) {
  if (!regra || regra.tipo === 'aConfirmar') return { valor: null, formula: null, confirmada: false, fixo: null, bonus: null };
  if (regra.tipo === 'percentual') {
    const valor = centavos((producao * (1 - regra.desconto)) / regra.divisor);
    return {
      valor, confirmada: true, fixo: null, bonus: null,
      formula: `(${moeda(producao)} − ${Math.round(regra.desconto * 100)}%) ÷ ${regra.divisor} = ${moeda(valor)}`,
    };
  }
  const acima = Math.max(0, bonusSessoes - BONUS.limite);
  const bonus = regra.bonus ? BONUS.porSessao * acima : 0;
  const valor = centavos(regra.fixo + bonus);
  return {
    valor, confirmada: true, fixo: regra.fixo, bonus: centavos(bonus),
    formula: regra.bonus
      ? `${moeda(regra.fixo)} + R$ ${BONUS.porSessao} × ${acima} sessões acima de ${BONUS.limite} = ${moeda(valor)}`
      : moeda(regra.fixo),
  };
}

function agruparTipos(sessoes) {
  const mapa = new Map();
  for (const s of sessoes) {
    const g = mapa.get(s.tipo) || { nome: s.tipo, quantidade: 0, producao: 0 };
    g.quantidade += 1; g.producao += valorValido(s);
    mapa.set(s.tipo, g);
  }
  return [...mapa.values()].map(g => ({ ...g, producao: centavos(g.producao) }))
    .sort((a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome));
}

function totaisDoMes(dados, mes) {
  const no = d => Boolean(d) && d.startsWith(mes);
  const sessoes = dados.sessoes.filter(s => s.status === 'realizada' && no(s.data));
  // Falta em turma queima crédito do pacote, então conta como produção.
  const credito = lista => lista.filter(a => no(a.data) && (a.status === 'realizada' || a.status === 'faltou'));
  const fort = credito(dados.fortalecimento);
  const yoga = credito(dados.yoga);
  const porProfissional = {};
  for (const s of sessoes) porProfissional[s.profissional] = centavos((porProfissional[s.profissional] || 0) + valorValido(s));
  return {
    mes, sessoes: sessoes.length, fortalecimento: fort.length, yoga: yoga.length,
    atendimentos: sessoes.length + fort.length + yoga.length,
    producao: centavos(
      sessoes.reduce((t, s) => t + valorValido(s), 0)
      + fort.reduce((t, a) => t + a.valor, 0)
      + yoga.reduce((t, a) => t + a.valor, 0),
    ),
    porProfissional,
  };
}

/** Função pura: recebe as listas já reduzidas e devolve a equipe do mês. */
export function montarEquipe(dados, mes, hoje, atualizadoEm = null) {
  const { de, ate } = diasDoMes(mes);
  const emCurso = ate >= hoje;
  const limite = emCurso ? hoje : ate;
  const no = d => Boolean(d) && d >= de && d <= limite;

  const realizadas = dados.sessoes.filter(s => s.status === 'realizada' && no(s.data));
  // O bônus da Lívia conta as sessões de todos os profissionais no mês.
  const bonusSessoes = realizadas.length;

  // Quem saiu da equipe só aparece nos meses em que atendeu.
  const atenderam = new Set(realizadas.map(s => s.profissional));
  const nomes = [...new Set([...Object.keys(REGRAS), ...atenderam])]
    .filter(nome => !REGRAS[nome]?.foraDaEquipe || atenderam.has(nome));
  const profissionais = nomes.map(nome => {
    const minhas = realizadas.filter(s => s.profissional === nome);
    const pagas = minhas.filter(s => valorValido(s) > 0);
    const producao = centavos(minhas.reduce((t, s) => t + valorValido(s), 0));
    const regra = REGRAS[nome] || null;
    const comissao = calcularComissao(regra, producao, bonusSessoes);
    return {
      nome, vinculo: regra?.vinculo || (nome === 'Sem profissional' ? 'Card sem fisio preenchido no ClickUp' : 'Não cadastrado aqui'),
      foraDaEquipe: Boolean(regra?.foraDaEquipe),
      atendimentos: minhas.length,
      atletas: new Set(minhas.map(s => s.atleta)).size,
      producao,
      cortesias: minhas.length - pagas.length,
      // "Recebimento por atendimento": o que a CareFit recebe, em média, por sessão desta pessoa.
      porAtendimento: pagas.length ? centavos(producao / pagas.length) : null,
      porTipo: agruparTipos(minhas),
      regra: regra ? { tipo: regra.tipo, descricao: regra.descricao, nota: regra.nota || null } : null,
      comissao,
      custoPorAtendimento: comissao.valor !== null && minhas.length ? centavos(comissao.valor / minhas.length) : null,
      // Demonstrativo do mês: é o que hoje vira PNG no WhatsApp no fechamento.
      lista: minhas
        .map(s => ({ data: s.data, atleta: s.atleta, tipo: s.tipo, valor: valorValido(s), pagamento: s.pagamento, url: s.url }))
        .sort((a, b) => a.data.localeCompare(b.data) || a.atleta.localeCompare(b.atleta)),
    };
  }).sort((a, b) => b.atendimentos - a.atendimentos || b.producao - a.producao || a.nome.localeCompare(b.nome));

  const turma = (lista, rotulo) => {
    const feitas = lista.filter(a => no(a.data) && (a.status === 'realizada' || a.status === 'faltou'));
    return {
      rotulo,
      aulas: feitas.filter(a => a.status === 'realizada').length,
      faltas: feitas.filter(a => a.status === 'faltou').length,
      alunos: new Set(feitas.map(a => a.atleta)).size,
      producao: centavos(feitas.reduce((t, a) => t + a.valor, 0)),
    };
  };
  const fortalecimento = turma(dados.fortalecimento, 'Fortalecimento em turma');
  const yoga = turma(dados.yoga, 'Yoga em turma');

  const producaoSessoes = centavos(realizadas.reduce((t, s) => t + valorValido(s), 0));
  const producao = centavos(producaoSessoes + fortalecimento.producao + yoga.producao);
  const atendimentos = realizadas.length + fortalecimento.aulas + fortalecimento.faltas + yoga.aulas + yoga.faltas;
  const aPagar = centavos(profissionais.filter(p => p.comissao.valor !== null).reduce((t, p) => t + p.comissao.valor, 0));

  // Projeção pelo ritmo do mês: só faz sentido com o mês aberto.
  const diasCorridos = Number(limite.slice(8));
  const diasNoMes = Number(ate.slice(8));
  const projetar = v => (emCurso && diasCorridos > 0 ? centavos((v / diasCorridos) * diasNoMes) : null);

  // Como o dinheiro entrou: cartão tem taxa e "À Pagar (exceção)" ainda não entrou.
  const formas = new Map();
  for (const s of realizadas) {
    const forma = s.pagamento || 'Sem forma registrada';
    const g = formas.get(forma) || { forma, quantidade: 0, valor: 0 };
    g.quantidade += 1; g.valor += valorValido(s);
    formas.set(forma, g);
  }
  const aReceber = realizadas
    .filter(s => s.pagamento === 'À Pagar (exceção)')
    .map(s => ({ data: s.data, atleta: s.atleta, tipo: s.tipo, valor: valorValido(s), profissional: s.profissional, url: s.url }))
    .sort((a, b) => a.data.localeCompare(b.data));

  const historico = Array.from({ length: MESES_HISTORICO }, (_, i) => totaisDoMes(dados, mesAnterior(mes, MESES_HISTORICO - 1 - i)));
  const fora = dados.sessoes.filter(s => s.status !== 'cancelada' && s.valor > VALOR_MAXIMO_SESSAO && no(s.data));

  return {
    atualizadoEm,
    mes: { referencia: mes, de, ate, limite, emCurso, diasCorridos, diasNoMes, hoje },
    totais: {
      atendimentos, sessoes: realizadas.length, producao, producaoSessoes,
      atletas: new Set(realizadas.map(s => s.atleta)).size,
      porAtendimento: atendimentos ? centavos(producao / atendimentos) : null,
      aPagar,
      aConfirmar: profissionais.filter(p => p.comissao.valor === null && p.atendimentos > 0).length,
      // Quanto da produção vai para quem atende (só o que tem regra confirmada).
      pesoDaEquipe: producao > 0 ? aPagar / producao : null,
      projecao: { producao: projetar(producao), atendimentos: projetar(atendimentos) },
    },
    profissionais,
    fortalecimento,
    yoga,
    bonus: {
      de: 'Lívia Dias', sessoes: bonusSessoes, limite: BONUS.limite, porSessao: BONUS.porSessao,
      valor: BONUS.porSessao * Math.max(0, bonusSessoes - BONUS.limite),
      faltam: Math.max(0, BONUS.limite + 1 - bonusSessoes),
    },
    recebimento: {
      formas: [...formas.values()].map(f => ({ ...f, valor: centavos(f.valor) })).sort((a, b) => b.valor - a.valor),
      aReceber,
      total: centavos(aReceber.reduce((t, s) => t + s.valor, 0)),
    },
    historico,
    foraDoNormal: { quantidade: fora.length, exemplos: fora.slice(0, 3).map(s => ({ valor: s.valor, atleta: s.atleta, tipo: s.tipo, url: s.url })) },
  };
}

export function validarMes(texto, hoje) {
  const mes = texto || hoje.slice(0, 7);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mes)) throw new PublicError('Mês inválido.');
  if (mes > hoje.slice(0, 7) || mes < PRIMEIRO_MES) throw new PublicError('Escolha um mês entre 2024 e o mês atual.');
  return mes;
}
