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

export const LISTAS = { sessoes: '901326724078', fortalecimento: '901328170178', yoga: '1400420000010694' };

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
};

// Bônus da Lívia (custos-fixos.md, regra confirmada em 08/11/2026):
// R$ 15 × (sessões de TODOS os profissionais no mês − 100).
export const BONUS = { limite: 100, porSessao: 15 };

const CACHE_MS = 2 * 60000;
const ATUALIZAR_MIN_MS = 60000; // o token é o mesmo das automações do n8n: não gastar o limite da API
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
  };
}

export function reduzirAula(t) {
  return {
    id: t.id, url: t.url || null, atleta: atletaDe(t), status: normalizar(t.status?.status),
    data: dataDe(campo(t, CAMPOS.dataAula)),
    valor: numero(campo(t, CAMPOS.valorAula)),
    plano: opcao(campo(t, CAMPOS.planoFortalecimento)),
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

export function criarServicoFechamento(api, agora = () => Date.now()) {
  let cache = null; let emCurso = null;
  let cacheOrigens = null; let emCursoOrigens = null;
  async function origens(forcar) {
    const idade = cacheOrigens ? agora() - cacheOrigens.lidoEm : Infinity;
    if (idade < CACHE_MS && !(forcar && idade >= ATUALIZAR_MIN_MS)) return cacheOrigens.valores;
    emCursoOrigens ||= (async () => {
      const atletas = await lerLista(api, '901326722390');
      cacheOrigens = { lidoEm: agora(), valores: new Map(atletas.map(t => [t.id, opcao(campo(t, CAMPOS.origemMarketing))])) };
      return cacheOrigens.valores;
    })().finally(() => { emCursoOrigens = null; });
    return emCursoOrigens;
  }
  async function dados(forcar) {
    const idade = cache ? agora() - cache.lidoEm : Infinity;
    if (idade < CACHE_MS && !(forcar && idade >= ATUALIZAR_MIN_MS)) return cache;
    emCurso ||= (async () => {
      const [sessoes, fortalecimento, yoga] = await Promise.all([LISTAS.sessoes, LISTAS.fortalecimento, LISTAS.yoga].map(id => lerLista(api, id)));
      cache = { lidoEm: agora(), sessoes: sessoes.map(reduzirSessao), fortalecimento: fortalecimento.map(reduzirAula), yoga: yoga.map(reduzirAula) };
      return cache;
    })().finally(() => { emCurso = null; });
    return emCurso;
  }
  return {
    async semana(texto, forcar = false) {
      const hoje = dayOf(agora());
      const pedida = texto || hoje;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(pedida) || Number.isNaN(Date.parse(pedida + 'T12:00:00Z'))) throw new PublicError('Semana inválida.');
      const segunda = segundaDe(pedida);
      if (segunda > segundaDe(hoje) || segunda < PRIMEIRA_SEMANA) throw new PublicError('Escolha uma semana entre 2024 e a semana atual.');
      const d = await dados(forcar);
      return montarFechamento(d, segunda, hoje, new Date(d.lidoEm).toISOString());
    },
    // Mesmo cache do fechamento: abrir a calculadora não gasta a API do ClickUp.
    async campanha(forcar = false) {
      const [d, fontes] = await Promise.all([dados(forcar), origens(forcar).catch(() => null)]);
      return montarCampanha({ ...d, origens: fontes }, dayOf(agora()), new Date(d.lidoEm).toISOString());
    },
  };
}
