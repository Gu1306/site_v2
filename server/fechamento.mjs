// Fechamento semanal da CareFit (segunda a domingo, fuso de Brasília).
//
// SOMENTE LEITURA: nada aqui escreve no ClickUp. O servidor lê as três listas,
// guarda uma versão enxuta em memória e devolve ao navegador só os números já
// agregados e, nas pendências, o nome do atleta e o link do card. Contato,
// evolução clínica e textos livres nunca saem daqui.
//
// O filtro de campo personalizado da API do ClickUp IGNORA campo de data (testado
// em 09/11/2026: devolveu a lista inteira). Por isso a leitura é da lista toda,
// em páginas paralelas, e o recorte por data é feito aqui.
import { PublicError, dayOf } from './fortalecimento.mjs';

export const LISTAS = { sessoes: '901326724078', fortalecimento: '901328170178', yoga: '1400420000010694', crm: '901326722390' };

// Ids, nunca nomes: nome de campo é rótulo editável na interface.
export const CAMPOS = {
  atleta: 'cd972548-ceb9-40eb-b27c-93ff60ee070b',
  origemMarketing: 'aeada942-1e12-4b60-ba80-0099e7822383',
  dataSessao: '073be12f-0b3e-4beb-9d86-aaf4ca3e063d',
  profissional: '903ded9e-f36a-40c3-b322-44ede2541916', // "Físio Carefit Que Atende"
  plano: 'bc2c64de-8673-4b35-ba24-05252ed0a2a5',
  valorSessao: '1351ae18-5d3c-483d-b9b5-e27e2915801e',
  dataAula: '55b91b8a-b0b3-458c-af17-d49aaf71fa15', // mesmo id no fortalecimento e na yoga
  valorAula: 'e5acfaf5-f7b1-4165-b5e6-4c6ca82502cc',
  planoFortalecimento: '6c591b5d-c6af-4888-ad30-d561a396fe0f',
  pagamento: 'a8b91e00-d9ed-44d7-9758-58d48d944254', // "Forma de pagamento": PIX, cartão, À Pagar (exceção), Cortesia
  statusPlano: '675f74e9-c4ee-47f1-92ff-01f1c2b56158', // Ativo / Plano Finalizado
  fimPlano: 'b0519a77-8347-41be-84e2-3f67d5b5c3d4',
  numeroSessao: '72994cb9-7687-4476-994c-1c7e89616dce',
  totalPlano: '2cf5b213-c034-43a3-a2dc-2285d8354ffb',
  mensagemAtleta: '1184bcab-8622-48b4-8a15-7823bc62a3e5', // "Mensagem sugerida ao atleta" (check-in pós-sessão)
  statusEnvio: '260046ba-486b-4ecd-9f95-46fc2ad783e3', // "Status envio WhatsApp"
  evolucaoSessao: 'c0bd14e1-8db4-44e3-8841-fc776ce83f27', // "Evolução" (texto clínico: só a 1ª linha é lida, para cessão)
};

const CONECTORES = new Set(['da', 'de', 'do', 'das', 'dos', 'e']);
const PARENTESCO = /^(?:(?:a|o|à|ao|sua|seu)\s+)*(?:esposa|esposo|marido|mulher|namorada|namorado|noiva|noivo|filha|filho|irmã|irma|irmão|irmao|mãe|mae|pai|amiga|amigo|sogra|sogro|cunhada|cunhado|prima|primo|colega|tia|tio|sobrinha|sobrinho|enteada|enteado|neta|neto)\b[\s,]*/i;
/**
 * Sessão do plano cedida a outra pessoa, do jeito que a equipe escreve na 1ª linha da Evolução:
 * "ANA JÚLIA FERNANDES USOU A SESSÃO DELE NO DIA 15/10/2026" ou "cedeu sessão para a esposa monica".
 * Devolve só o nome curto de quem usou ({ para: 'Ana Júlia' }; '' se não der para ler o nome).
 * Nunca o resto do texto: é a avaliação clínica de OUTRA pessoa.
 */
export function cessaoDaEvolucao(texto) {
  const linha = String(texto || '').split(/\r?\n/).map(l => l.trim()).find(Boolean)?.replace(/\s+/g, ' ') || '';
  const usou = /^(.+?)\s+us(?:ou|ará|ara)\s+(?:a\s+)?sess[aã]o\s+(?:dele|dela)\b/i.exec(linha);
  const cedeu = /\bced(?:eu|ida|ido)\s+(?:a\s+|sua\s+)?sess[aã]o\s+(?:para|pra|à|ao)\s+(.+)$/i.exec(linha)
    || /\bsess[aã]o\s+cedida\s+(?:para|pra|à|ao)\s+(.+)$/i.exec(linha);
  if (!usou && !cedeu) return null;
  // Antes de "usou" tem de vir um nome, não uma frase ("Paciente comentou que a amiga usou...").
  if (usou && usou[1].split(' ').filter(p => !CONECTORES.has(p.toLowerCase())).length > 4) return { para: '' };
  const bruto = usou ? usou[1] : cedeu[1].replace(PARENTESCO, '');
  const palavras = bruto.split(/\s+(?:no|na|em|dia|que|pois|porque)\s+|[\d.,;:()/–—-]/i)[0].split(' ').filter(p => /^[\p{L}']+$/u.test(p));
  const curto = [];
  for (const p of palavras) { curto.push(p); if (curto.filter(x => !CONECTORES.has(x.toLowerCase())).length === 2) break; }
  while (curto.length && CONECTORES.has(curto[curto.length - 1].toLowerCase())) curto.pop();
  const para = curto.map(p => { const m = p.toLocaleLowerCase('pt-BR'); return CONECTORES.has(m) ? m : m.charAt(0).toLocaleUpperCase('pt-BR') + m.slice(1); }).join(' ');
  return { para };
}

// Campos da lista CRM ATLETAS (901326722390), usados pela carteira e pelas conversas.
export const CAMPOS_CRM = {
  telefone: '59ed9201-7a00-4bbc-a138-2561a4d6637a',
  email: '6ab6ed02-6bc3-41fa-a74f-f93c996ee318',
  origemMarketing: 'aeada942-1e12-4b60-ba80-0099e7822383',
  origemLead: '4f2c2832-268b-4798-9ca7-a448437000ea',
  profissional: '9ccf870b-dbd7-4784-8f78-ca32991b2bb0',
  plano: '501c67e8-5630-4e9d-9e1d-df8483670c06',
  statusPagamento: '4efb95a1-29ea-4688-917f-59125ba01971',
  valorPlano: 'd8bc7425-496c-4132-9679-92f047eb7d94',
  feitasDoPlano: '7e5cdc8c-6f0d-46bd-be35-0c0443c6db3b',
  faltamDoPlano: '3ddf0a37-9592-442d-a933-389fe441541f',
  fimDoPlano: '58e267c2-eb53-4741-83a2-370e1009dc33',
  fortContratada: '842d843b-10bf-4470-bd3b-df2b68e1624f', // "Data Contratada Fort. em Grupo"
  ultimaSessao: '5b445b7c-a461-498d-b72e-53b895b2565a',
  primeiraSessao: '90511117-f22d-4b61-bffc-1c2190fce652',
  provaNome: '58a65e2e-7783-479d-9ec5-811e0fb99ffb',
  provaData: '9d31d957-b245-4ad0-bc98-25c1ea58a0bc',
};

// Bônus da Lívia (custos-fixos.md, regra confirmada em 08/11/2026):
// R$ 15 × (sessões de TODOS os profissionais no mês − 100).
export const BONUS = { limite: 100, porSessao: 15 };

const CACHE_MS = 2 * 60000;
const ATUALIZAR_MIN_MS = 60000; // o token é o mesmo das automações do n8n: não gastar o limite da API
const ESTALE_MAX_MS = 15 * 60000; // até aqui o cache vencido é servido na hora e renovado por trás
const SEMANAS_HISTORICO = 8;
const PRIMEIRA_SEMANA = '2024-01-01';

const normalizar = texto => String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const campo = (task, id) => (task.custom_fields || []).find(f => f.id === id);
const numero = c => { const n = Number(c?.value); return Number.isFinite(n) ? n : 0; };
const dataDe = c => (c?.value ? dayOf(c.value) : null);
// O nome do card é "Atleta — Sessão 3/4 — Mensal" / "Atleta — Aula 10/24".
const atletaDe = task => String(task.name || '').split(' — ')[0].trim() || 'Sem nome';

/** Dropdown antigo do ClickUp volta como orderindex (número); o novo, como id da opção. */
export function opcao(c) {
  if (!c || c.value === undefined || c.value === null || c.value === '') return null;
  const opcoes = c.type_config?.options || [];
  const achada = typeof c.value === 'number' ? opcoes.find(o => o.orderindex === c.value) : opcoes.find(o => o.id === c.value);
  return achada?.name ?? null;
}

export function reduzirSessao(t) {
  const relacionados = campo(t, CAMPOS.atleta)?.value;
  return {
    id: t.id, url: t.url || null, atleta: atletaDe(t), status: normalizar(t.status?.status),
    atletaId: Array.isArray(relacionados) && relacionados.length === 1 ? relacionados[0]?.id || null : null,
    data: dataDe(campo(t, CAMPOS.dataSessao)),
    profissional: opcao(campo(t, CAMPOS.profissional)) || 'Sem profissional',
    tipo: opcao(campo(t, CAMPOS.plano)) || 'Sem plano',
    valor: numero(campo(t, CAMPOS.valorSessao)),
    pagamento: opcao(campo(t, CAMPOS.pagamento)),
    statusPlano: opcao(campo(t, CAMPOS.statusPlano)),
    fimPlano: dataDe(campo(t, CAMPOS.fimPlano)),
    numeroSessao: numero(campo(t, CAMPOS.numeroSessao)) || null,
    totalPlano: numero(campo(t, CAMPOS.totalPlano)) || null,
  };
}

// Relacao da aula com o card do atleta no CRM (campo "Nome"). Nome nunca e chave:
// e por este id que o app do atleta acha as aulas de cada um.
export const RELACAO_AULA_ATLETA = 'be0b6e78-1c02-4036-9a55-58a5604749ed';

export function reduzirAula(t) {
  const relacionados = campo(t, RELACAO_AULA_ATLETA)?.value;
  return {
    id: t.id, url: t.url || null, atleta: atletaDe(t), status: normalizar(t.status?.status),
    atletaId: Array.isArray(relacionados) && relacionados.length === 1 ? relacionados[0]?.id || null : null,
    data: dataDe(campo(t, CAMPOS.dataAula)),
    valor: numero(campo(t, CAMPOS.valorAula)),
    plano: opcao(campo(t, CAMPOS.planoFortalecimento)),
  };
}

/**
 * Atleta do CRM, reduzido ao que a carteira e as conversas usam. Telefone fica
 * aqui porque é a chave para casar com o WhatsApp; nada clínico é lido.
 */
export function reduzirAtleta(t) {
  const numeroOuNulo = id => { const n = Number(campo(t, id)?.value); return Number.isFinite(n) ? n : null; };
  return {
    id: t.id, url: t.url || null, nome: String(t.name || '').trim() || 'Sem nome',
    status: normalizar(t.status?.status),
    statusOriginal: t.status?.status || '',
    telefone: String(campo(t, CAMPOS_CRM.telefone)?.value || ''),
    fisio: opcao(campo(t, CAMPOS_CRM.profissional)),
    plano: opcao(campo(t, CAMPOS_CRM.plano)),
    origem: opcao(campo(t, CAMPOS_CRM.origemMarketing)) || opcao(campo(t, CAMPOS_CRM.origemLead)),
    pagamento: opcao(campo(t, CAMPOS_CRM.statusPagamento)),
    valorPlano: numeroOuNulo(CAMPOS_CRM.valorPlano),
    feitasDoPlano: numeroOuNulo(CAMPOS_CRM.feitasDoPlano),
    faltamDoPlano: numeroOuNulo(CAMPOS_CRM.faltamDoPlano),
    fimDoPlano: dataDe(campo(t, CAMPOS_CRM.fimDoPlano)),
    fortContratada: dataDe(campo(t, CAMPOS_CRM.fortContratada)),
    ultimaSessao: dataDe(campo(t, CAMPOS_CRM.ultimaSessao)),
    primeiraSessao: dataDe(campo(t, CAMPOS_CRM.primeiraSessao)),
    prova: { nome: String(campo(t, CAMPOS_CRM.provaNome)?.value || '').trim() || null, data: dataDe(campo(t, CAMPOS_CRM.provaData)) },
    sessoes: [],
  };
}

export function somarDias(iso, dias) { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + dias); return d.toISOString().slice(0, 10); }
export function segundaDe(iso) { const d = new Date(iso + 'T12:00:00Z'); return somarDias(iso, -((d.getUTCDay() + 6) % 7)); }

// Status de quem já saiu da fila. O resto, com data passada, é pendência de baixa.
const SESSAO_FINAL = new Set(['realizada', 'cancelada']);
const AULA_FINAL = new Set(['realizada', 'faltou', 'complete']);
const centavos = v => Math.round(v * 100) / 100;

function agrupar(itens, chave) {
  const mapa = new Map();
  for (const item of itens) {
    const k = chave(item); const g = mapa.get(k) || { nome: k, quantidade: 0, producao: 0, cortesias: 0 };
    g.quantidade += 1; g.producao += item.valor; if (item.valor === 0) g.cortesias += 1;
    mapa.set(k, g);
  }
  return [...mapa.values()].map(g => ({ ...g, producao: centavos(g.producao) })).sort((a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome));
}

const pendencia = item => ({ data: item.data, atleta: item.atleta, status: item.status, url: item.url, ...(item.profissional ? { profissional: item.profissional, tipo: item.tipo } : {}) });
const porData = (a, b) => a.data.localeCompare(b.data) || a.atleta.localeCompare(b.atleta);

function resumoAulas(aulas, dentro, hoje) {
  const semana = aulas.filter(a => dentro(a.data));
  const realizadas = semana.filter(a => a.status === 'realizada');
  const faltas = semana.filter(a => a.status === 'faltou');
  const abertas = semana.filter(a => !AULA_FINAL.has(a.status));
  return {
    realizadas: realizadas.length,
    faltas: faltas.length,
    alunos: new Set(realizadas.map(a => a.atleta)).size,
    cortesias: realizadas.filter(a => a.valor === 0).length,
    // Falta em turma queima crédito do pacote, então entra na produção.
    producao: centavos([...realizadas, ...faltas].reduce((s, a) => s + a.valor, 0)),
    pendentes: abertas.filter(a => a.data <= hoje).map(pendencia).sort(porData),
    porVir: abertas.filter(a => a.data > hoje).length,
  };
}

function totaisDaSemana(dados, segunda) {
  const fim = somarDias(segunda, 6); const dentro = d => d && d >= segunda && d <= fim;
  const sessoes = dados.sessoes.filter(s => s.status === 'realizada' && dentro(s.data));
  const fort = dados.fortalecimento.filter(a => dentro(a.data));
  const yoga = dados.yoga.filter(a => dentro(a.data));
  const contar = (lista, st) => lista.filter(a => a.status === st).length;
  const credito = lista => lista.filter(a => a.status === 'realizada' || a.status === 'faltou').reduce((s, a) => s + a.valor, 0);
  const r = {
    segunda, sessoes: sessoes.length, fortalecimento: contar(fort, 'realizada'), yoga: contar(yoga, 'realizada'),
    producao: centavos(sessoes.reduce((s, x) => s + x.valor, 0) + credito(fort) + credito(yoga)),
  };
  r.atendimentos = r.sessoes + r.fortalecimento + r.yoga;
  return r;
}

/** Função pura: recebe as listas já reduzidas e devolve o fechamento da semana. */
export function montarFechamento(dados, segunda, hoje, atualizadoEm = null) {
  const fim = somarDias(segunda, 6);
  const dentro = d => Boolean(d) && d >= segunda && d <= fim;

  const daSemana = dados.sessoes.filter(s => dentro(s.data));
  const realizadas = daSemana.filter(s => s.status === 'realizada');
  const abertas = daSemana.filter(s => !SESSAO_FINAL.has(s.status));
  const producaoSessoes = centavos(realizadas.reduce((s, x) => s + x.valor, 0));
  const pagas = realizadas.filter(s => s.valor > 0);

  const profissionais = agrupar(realizadas, s => s.profissional);
  const tipos = agrupar(realizadas, s => s.tipo);
  const matriz = profissionais.map(p => ({
    profissional: p.nome,
    porTipo: Object.fromEntries(tipos.map(t => [t.nome, realizadas.filter(s => s.profissional === p.nome && s.tipo === t.nome).length])),
  }));

  const fortalecimento = resumoAulas(dados.fortalecimento, dentro, hoje);
  const yoga = resumoAulas(dados.yoga, dentro, hoje);

  const dias = Array.from({ length: 7 }, (_, i) => somarDias(segunda, i));
  const porDia = dias.map(dia => ({
    data: dia,
    sessoes: realizadas.filter(s => s.data === dia).length,
    fortalecimento: dados.fortalecimento.filter(a => a.data === dia && a.status === 'realizada').length,
    yoga: dados.yoga.filter(a => a.data === dia && a.status === 'realizada').length,
    // Quem veio no dia (nome + profissional), para conferir com a agenda de reservas.
    atletas: [
      ...realizadas.filter(s => s.data === dia).map(s => ({ nome: s.atleta, onde: s.profissional })),
      ...dados.fortalecimento.filter(a => a.data === dia && a.status === 'realizada').map(a => ({ nome: a.atleta, onde: 'Fortalecimento' })),
      ...dados.yoga.filter(a => a.data === dia && a.status === 'realizada').map(a => ({ nome: a.atleta, onde: 'Yoga' })),
    ].sort((a, b) => a.nome.localeCompare(b.nome)),
  }));

  const historico = Array.from({ length: SEMANAS_HISTORICO }, (_, i) => totaisDaSemana(dados, somarDias(segunda, -7 * (SEMANAS_HISTORICO - 1 - i))));
  const atual = historico.at(-1);
  const anterior = historico.at(-2);

  // Mês do domingo que fecha a semana, contado até esse domingo.
  const mes = fim.slice(0, 7);
  const noMes = dados.sessoes.filter(s => s.status === 'realizada' && s.data && s.data.startsWith(mes) && s.data <= fim).length;

  const semData = [
    ...dados.sessoes.filter(s => s.status === 'realizada' && !s.data).map(s => ({ ...pendencia(s), lista: 'Sessões' })),
    ...dados.fortalecimento.filter(a => a.status === 'realizada' && !a.data).map(a => ({ ...pendencia(a), lista: 'Fortalecimento' })),
    ...dados.yoga.filter(a => a.status === 'realizada' && !a.data).map(a => ({ ...pendencia(a), lista: 'Yoga' })),
  ];

  return {
    semana: { inicio: segunda, fim, encerrada: fim < hoje, hoje },
    atualizadoEm,
    total: { atendimentos: atual.atendimentos, producao: atual.producao },
    anterior: { segunda: anterior.segunda, atendimentos: anterior.atendimentos, sessoes: anterior.sessoes, fortalecimento: anterior.fortalecimento, yoga: anterior.yoga, producao: anterior.producao },
    sessoes: {
      realizadas: realizadas.length,
      atletas: new Set(realizadas.map(s => s.atleta)).size,
      producao: producaoSessoes,
      cortesias: realizadas.length - pagas.length,
      ticketMedio: pagas.length ? centavos(pagas.reduce((s, x) => s + x.valor, 0) / pagas.length) : null,
      porProfissional: profissionais,
      porTipo: tipos,
      matriz,
      pendentes: abertas.filter(s => s.data <= hoje).map(pendencia).sort(porData),
      porVir: abertas.filter(s => s.data > hoje).length,
      canceladas: daSemana.filter(s => s.status === 'cancelada').length,
    },
    fortalecimento,
    yoga,
    porDia,
    historico,
    mes: { referencia: mes, ate: fim, sessoes: noMes, bonusLivia: BONUS.porSessao * Math.max(0, noMes - BONUS.limite), faltamParaBonus: Math.max(0, BONUS.limite + 1 - noMes) },
    semData,
  };
}

// ---------------------------------------------------------------------------
// Calculadora de campanha (/gestao/campanha). As duas portas de entrada e o que
// aconteceu depois com quem passou por elas: a taxa de quem continua e a receita
// que essa pessoa deixou deixam de ser palpite e passam a vir das sessões.
export const ENTRADAS = { fisio: 'Avaliação', recovery: 'Primeira Sessão Dupla' };
const TIPOS_ENTRADA = new Set(Object.values(ENTRADAS));
// Nenhuma sessão custa isso. Em 09/11/2026 havia 12 cards de Semestral com
// 190000 (R$ 1.900,00 digitado sem vírgula?): fora da conta e listados na página.
export const VALOR_MAXIMO_SESSAO = 1000;
const DECISAO_DIAS = 30; // quem entrou há menos de 30 dias ainda está decidindo
const JANELA_DIAS = 365;
const SEMANAS_NOVOS = 8;
export const INICIO_JORNADA = '2026-11-11';

const mediana = ordenados => {
  if (!ordenados.length) return null;
  const meio = Math.floor(ordenados.length / 2);
  return ordenados.length % 2 ? ordenados[meio] : (ordenados[meio - 1] + ordenados[meio]) / 2;
};

/** Função pura: quem entrou pela avaliação ou pela 1ª sessão dupla e continuou. */
export function montarCampanha(dados, hoje, atualizadoEm = null) {
  const vivas = dados.sessoes.filter(s => s.status !== 'cancelada');
  const porAtleta = new Map();
  for (const s of vivas) { const chave = s.atletaId ? `id:${s.atletaId}` : `nome:${s.atleta}`; const lista = porAtleta.get(chave) || []; lista.push(s); porAtleta.set(chave, lista); }

  const de = somarDias(hoje, -JANELA_DIAS); const ate = somarDias(hoje, -DECISAO_DIAS);
  const coortes = { fisio: [], recovery: [] };
  const estreias = []; // { data, porta } da 1ª sessão realizada de cada atleta
  for (const lista of porAtleta.values()) {
    const realizadas = lista.filter(s => s.status === 'realizada' && s.data).sort((a, b) => a.data.localeCompare(b.data));
    if (!realizadas.length) continue;
    const primeira = realizadas[0];
    const porta = Object.keys(ENTRADAS).find(k => ENTRADAS[k] === primeira.tipo) || null;
    estreias.push({ data: primeira.data, porta, atletaId: primeira.atletaId });
    if (!porta || primeira.data < de || primeira.data > ate) continue;
    // Continuou = tem sessão de outro tipo, paga, depois da entrada (inclusive plano já
    // vendido e ainda sem data). A 2ª sessão da dupla é a própria entrada: não conta.
    const depois = lista.filter(s => !TIPOS_ENTRADA.has(s.tipo) && s.valor > 0 && s.valor <= VALOR_MAXIMO_SESSAO && (!s.data || s.data >= primeira.data));
    coortes[porta].push({ continuou: depois.length > 0, receita: depois.reduce((t, s) => t + s.valor, 0) });
  }
  const resumo = (lista, tipo) => {
    const ficaram = lista.filter(x => x.continuou);
    const receita = mediana(ficaram.map(x => x.receita).sort((a, b) => a - b));
    return { tipo, atletas: lista.length, continuaram: ficaram.length, taxa: lista.length ? ficaram.length / lista.length : null, receitaMediana: receita === null ? null : centavos(receita) };
  };

  const ultima = segundaDe(hoje);
  const novosPorSemana = Array.from({ length: SEMANAS_NOVOS }, (_, i) => {
    const segunda = somarDias(ultima, -7 * (SEMANAS_NOVOS - 1 - i)); const fim = somarDias(segunda, 6);
    const daSemana = estreias.filter(e => e.data >= segunda && e.data <= fim);
    const origens = dados.origens ? daSemana.reduce((acc, e) => { const origem = (e.atletaId && dados.origens.get(e.atletaId)) || 'Não informada'; acc[origem] = (acc[origem] || 0) + 1; return acc; }, {}) : null;
    return { segunda, novos: daSemana.length, fisio: daSemana.filter(e => e.porta === 'fisio').length, recovery: daSemana.filter(e => e.porta === 'recovery').length, origens, encerrada: fim < hoje };
  });

  // Períodos de calendário com início limitado ao primeiro dia da jornada.
  const novosJornada = estreias.filter(e => e.data >= INICIO_JORNADA && e.data <= hoje);
  const resumirPeriodo = (inicio, fim, chave) => {
    const de = inicio < INICIO_JORNADA ? INICIO_JORNADA : inicio;
    const daFaixa = novosJornada.filter(e => e.data >= de && e.data <= fim);
    const origens = dados.origens ? daFaixa.reduce((acc, e) => { const origem = (e.atletaId && dados.origens.get(e.atletaId)) || 'Não informada'; acc[origem] = (acc[origem] || 0) + 1; return acc; }, {}) : null;
    return { chave, de, ate: fim, novos: daFaixa.length, fisio: daFaixa.filter(e => e.porta === 'fisio').length, recovery: daFaixa.filter(e => e.porta === 'recovery').length, origens, encerrada: fim < hoje };
  };
  const semanas = [];
  for (let dia = segundaDe(INICIO_JORNADA); dia <= hoje; dia = somarDias(dia, 7)) semanas.push(resumirPeriodo(dia, somarDias(dia, 6), dia));
  const meses = [];
  for (let mes = INICIO_JORNADA.slice(0, 7); mes <= hoje.slice(0, 7);) {
    const [ano, numero] = mes.split('-').map(Number);
    const proximo = new Date(Date.UTC(ano, numero, 1)).toISOString().slice(0, 7);
    meses.push(resumirPeriodo(`${mes}-01`, somarDias(`${proximo}-01`, -1), mes));
    mes = proximo;
  }

  const fora = vivas.filter(s => s.valor > VALOR_MAXIMO_SESSAO);
  return {
    atualizadoEm,
    janela: { de, ate },
    entradas: { fisio: resumo(coortes.fisio, ENTRADAS.fisio), recovery: resumo(coortes.recovery, ENTRADAS.recovery) },
    novosPorSemana,
    jornada: { inicio: INICIO_JORNADA, semanas, meses },
    foraDoNormal: { quantidade: fora.length, exemplos: fora.slice(0, 3).map(s => ({ valor: s.valor, tipo: s.tipo, url: s.url })) },
  };
}

// ---------------------------------------------------------------------------
// Observações da semana: (1) descasamento entre a agenda (Google) e o ClickUp e
// (2) quem fez a 2ª sessão da Primeira Sessão Dupla e se continuou.
const nomeChave = n => normalizar(n).split(' ').filter(t => t.length > 1 && !['de', 'da', 'do', 'dos', 'das'].includes(t));
/** Mesmo atleta? Primeiro nome igual e (último nome igual ou um nome contido no outro). */
export function mesmoNome(a, b) {
  const x = nomeChave(a), y = nomeChave(b);
  if (!x.length || !y.length || x[0] !== y[0]) return false;
  if (x.length === 1 || y.length === 1) return true;
  if (x.at(-1) === y.at(-1)) return true;
  const [curto, longo] = x.length <= y.length ? [x, y] : [y, x];
  return curto.every(t => longo.includes(t));
}
const DUPLA_SEMANAS = 4;

export function montarObservacoes(dados, reservas, segunda, hoje) {
  const fim = somarDias(segunda, 6);
  const dentro = d => Boolean(d) && d >= segunda && d <= fim;
  const cards = [
    ...dados.sessoes.filter(s => dentro(s.data) && s.status !== 'cancelada').map(s => ({ ...s, lista: 'Sessões', onde: s.profissional })),
    ...dados.fortalecimento.filter(a => dentro(a.data) && a.status !== 'cancelada').map(a => ({ ...a, lista: 'Fortalecimento', onde: 'Fortalecimento' })),
    ...dados.yoga.filter(a => dentro(a.data) && a.status !== 'cancelada').map(a => ({ ...a, lista: 'Yoga', onde: 'Yoga' })),
  ];
  const resumoCard = c => ({ data: c.data, atleta: c.atleta, lista: c.lista, onde: c.onde, tipo: c.tipo || null, status: c.status, url: c.url });
  const resumoReserva = r => ({ data: r.data, hora: r.hora, atleta: r.atleta, tipo: r.tipo, fisio: r.fisio });

  let agenda = null;
  if (reservas) {
    const daSemana = reservas.filter(r => dentro(r.data) && r.data <= hoje);
    const usados = new Set();
    const semCard = []; const dataDiferente = [];
    for (const r of daSemana) {
      const mesmoDia = cards.find(c => !usados.has(c) && c.data === r.data && mesmoNome(c.atleta, r.atleta));
      if (mesmoDia) { usados.add(mesmoDia); continue; }
      const outroDia = cards.find(c => !usados.has(c) && mesmoNome(c.atleta, r.atleta));
      if (outroDia) { usados.add(outroDia); dataDiferente.push({ reserva: resumoReserva(r), card: resumoCard(outroDia) }); continue; }
      semCard.push(resumoReserva(r));
    }
    // Card de sessão (lista Sessões) já passado e sem reserva na agenda. Turma e yoga não
    // passam pela agenda de reservas, então não entram aqui.
    const semReserva = cards.filter(c => c.lista === 'Sessões' && c.data <= hoje && !usados.has(c) && !daSemana.some(r => r.data === c.data && mesmoNome(c.atleta, r.atleta))).map(resumoCard);
    agenda = { reservas: daSemana.length, casadas: usados.size, semCard, dataDiferente, semReserva };
  }

  // 2ª sessão da dupla: por atleta, as sessões "Primeira Sessão Dupla" realizadas em ordem.
  const porAtleta = new Map();
  for (const s of dados.sessoes) { const chave = s.atletaId ? `id:${s.atletaId}` : `nome:${s.atleta}`; (porAtleta.get(chave) || porAtleta.set(chave, []).get(chave)).push(s); }
  const de = somarDias(segunda, -7 * (DUPLA_SEMANAS - 1));
  const duplas = [];
  for (const lista of porAtleta.values()) {
    const entradas = lista.filter(s => s.tipo === ENTRADAS.recovery && s.status === 'realizada' && s.data).sort((a, b) => a.data.localeCompare(b.data));
    if (entradas.length < 2) continue;
    const segundaSessao = entradas[1];
    if (segundaSessao.data < de || segundaSessao.data > fim) continue;
    const depois = lista.filter(s => !TIPOS_ENTRADA.has(s.tipo) && s.status !== 'cancelada' && s.valor > 0 && s.valor <= VALOR_MAXIMO_SESSAO && (!s.data || s.data >= segundaSessao.data));
    duplas.push({ atleta: segundaSessao.atleta, profissional: segundaSessao.profissional, primeira: entradas[0].data, segunda: segundaSessao.data, naSemana: dentro(segundaSessao.data), continuou: depois.length > 0, plano: depois[0]?.tipo || null, url: segundaSessao.url });
  }
  duplas.sort((a, b) => b.segunda.localeCompare(a.segunda) || a.atleta.localeCompare(b.atleta));
  return { agenda, duplas: { semanas: DUPLA_SEMANAS, de, lista: duplas } };
}

async function lerLista(api, lista) {
  const tarefas = [];
  // Quatro páginas por vez: 12 páginas de sessões saem em ~3 s, contra ~11 s em sequência.
  for (let base = 0; base < 60; base += 4) {
    const paginas = await Promise.all([0, 1, 2, 3].map(i => api(`/list/${lista}/task?include_closed=true&subtasks=false&page=${base + i}`)));
    for (const p of paginas) tarefas.push(...(p.tasks || []));
    if (paginas.some(p => p.last_page || (p.tasks || []).length < 100)) return tarefas.filter(t => !t.parent);
  }
  throw new PublicError('A lista excedeu o limite de consulta. Contate o suporte.', 503);
}

export function criarServicoFechamento(api, agora = () => Date.now(), leitorAgenda = null) {
  /**
   * Cache com renovação por trás. Dentro de CACHE_MS devolve o guardado. Vencido há
   * menos de ESTALE_MAX_MS, devolve o guardado NA HORA e relê o ClickUp em segundo
   * plano (quem abre o app depois de um tempo parado não espera os 3–5 s da leitura).
   * Mais velho que isso, ou com `forcar` (botão Atualizar), espera a leitura nova.
   */
  function comCache(ler, nome) {
    let cache = null; let emCurso = null;
    return async forcar => {
      const idade = cache ? agora() - cache.lidoEm : Infinity;
      if (idade < CACHE_MS && !(forcar && idade >= ATUALIZAR_MIN_MS)) return cache;
      emCurso ||= ler().then(d => { cache = d; return d; }).finally(() => { emCurso = null; });
      if (cache && !forcar && idade < ESTALE_MAX_MS) {
        emCurso.catch(e => console.error(`fechamento: renovação do cache ${nome} falhou`, e?.message || e));
        return cache;
      }
      return emCurso;
    };
  }
  // Uma leitura só do CRM serve a calculadora (origens), a carteira e as conversas.
  const crm = comCache(async () => {
    const tarefas = await lerLista(api, LISTAS.crm);
    const atletas = tarefas.map(reduzirAtleta);
    // O e-mail fica FORA do atleta reduzido de proposito: a carteira devolve o atleta
    // inteiro para a tela da equipe, e o e-mail so interessa ao app do atleta.
    const emails = new Map(tarefas.map(t => [t.id, String(campo(t, CAMPOS_CRM.email)?.value || '').trim().toLowerCase()]));
    return { lidoEm: agora(), atletas, emails, origens: new Map(tarefas.map(t => [t.id, opcao(campo(t, CAMPOS.origemMarketing))])) };
  }, 'CRM');
  const origens = async forcar => (await crm(forcar)).origens;
  const dados = comCache(async () => {
    const [sessoes, fortalecimento, yoga] = await Promise.all([LISTAS.sessoes, LISTAS.fortalecimento, LISTAS.yoga].map(id => lerLista(api, id)));
    // A mensagem pós-sessão é texto clínico: fica FORA da sessão reduzida (que as telas da
    // gestão recebem inteira) e só entra aqui quando o status diz que ela foi ENVIADA.
    const mensagens = new Map();
    for (const t of sessoes) {
      const texto = String(campo(t, CAMPOS.mensagemAtleta)?.value || '').trim();
      if (texto && opcao(campo(t, CAMPOS.statusEnvio)) === 'Enviada') mensagens.set(t.id, texto);
    }
    // Sessão cedida: guarda só o nome curto de quem usou, nunca a Evolução.
    const cedidas = new Map();
    for (const t of sessoes) {
      const cessao = cessaoDaEvolucao(campo(t, CAMPOS.evolucaoSessao)?.value);
      if (cessao) cedidas.set(t.id, cessao);
    }
    return { lidoEm: agora(), sessoes: sessoes.map(reduzirSessao), fortalecimento: fortalecimento.map(reduzirAula), yoga: yoga.map(reduzirAula), mensagens, cedidas };
}, 'listas');
  return {
    async semana(texto, forcar = false) {
      const hoje = dayOf(agora());
      const pedida = texto || hoje;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(pedida) || Number.isNaN(Date.parse(pedida + 'T12:00:00Z'))) throw new PublicError('Semana inválida.');
      const segunda = segundaDe(pedida);
      if (segunda > segundaDe(hoje) || segunda < PRIMEIRA_SEMANA) throw new PublicError('Escolha uma semana entre 2024 e a semana atual.');
      const d = await dados(forcar);
      const fechamento = montarFechamento(d, segunda, hoje, new Date(d.lidoEm).toISOString());
      // A agenda é opcional: sem configuração ou fora do ar, o fechamento sai do mesmo jeito.
      let reservas = null; let agendaErro = leitorAgenda ? null : 'Agenda não configurada no servidor (GOOGLE_CALENDAR_SA_JSON).';
      if (leitorAgenda) { try { reservas = await leitorAgenda.reservas(segunda, somarDias(segunda, 7)); } catch (e) { agendaErro = e instanceof PublicError ? e.message : 'A agenda não respondeu.'; } }
      const observacoes = montarObservacoes(d, reservas, segunda, hoje);
      if (agendaErro) observacoes.agendaErro = agendaErro;
      return { ...fechamento, observacoes };
    },
    /**
     * Cache cru das três listas já reduzidas, para outras visões montarem sobre
     * ele (equipe/comissões) sem gastar a API do ClickUp de novo.
     */
    async listas(forcar = false) { return dados(forcar); },
    /** Atletas do CRM com as sessões de cada um coladas (carteira e conversas). */
    async atletas(forcar = false) {
      const [registro, d] = await Promise.all([crm(forcar), dados(forcar)]);
      const porId = new Map(registro.atletas.map(a => [a.id, { ...a, sessoes: [] }]));
      for (const s of d.sessoes) {
        const alvo = s.atletaId && porId.get(s.atletaId);
        if (alvo) alvo.sessoes.push({ data: s.data, status: s.status, tipo: s.tipo, valor: s.valor });
      }
      return { lidoEm: Math.min(registro.lidoEm, d.lidoEm), atletas: [...porId.values()] };
    },
    /** E-mail de cada atleta do CRM (id do card → e-mail), para o app do atleta. */
    async emails(forcar = false) { return (await crm(forcar)).emails; },
    /** Mensagens pós-sessão já enviadas (id da sessão → texto), só para o app do atleta. */
    async mensagens(forcar = false) { return (await dados(forcar)).mensagens; },
    /** Sessões cedidas a outra pessoa (id da sessão → { para }), só para o app do atleta. */
    async cedidas(forcar = false) { return (await dados(forcar)).cedidas || new Map(); },
    // Mesmo cache do fechamento: abrir a calculadora não gasta a API do ClickUp.
    async campanha(forcar = false) {
      const [d, fontes] = await Promise.all([dados(forcar), origens(forcar).catch(() => null)]);
      return montarCampanha({ ...d, origens: fontes }, dayOf(agora()), new Date(d.lidoEm).toISOString());
    },
  };
}
