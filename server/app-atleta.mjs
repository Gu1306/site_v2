// App do atleta (/app): login por código no WhatsApp, saldo do fortalecimento,
// reserva e cancelamento de aula em turma (fortalecimento e yoga).
//
// Nada aqui é fonte de verdade. A reserva continua no Web App do Apps Script de cada
// modalidade (é lá que está a trava contra duas pessoas na última vaga) e o crédito
// continua nos cards do ClickUp. Este arquivo só junta as duas pontas para o atleta:
//
//   reservar  → o MESMO Web App da página pública, com nome/telefone/e-mail do CRM
//   cancelar  → escreve na coluna de cancelamento da planilha (pelo Web App) e, no
//               fortalecimento, marca o checkbox "Cancelou (devolver crédito)" do card.
//               O workflow n8n rD2Ef3yHKRQNDnKX devolve o crédito na varredura seguinte.
//               A ordem (planilha primeiro, checkbox depois) é a que evita a varredura
//               de reservas reagendar o mesmo card.
//
// Regra da casa para tudo que manda mensagem a atleta: prefira não enviar a enviar em
// laço. O código de acesso tem limite por número e um fusível diário; estourou, para.
import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { PublicError } from './fortalecimento.mjs';
import { CAMPOS as CAMPOS_SESSAO } from './fechamento.mjs';

export const MODALIDADES = {
  fortalecimento: {
    nome: 'Fortalecimento',
    url: 'https://script.google.com/macros/s/AKfycbxcap4um1pU8wOOE3MdmlUL4LKi083kmxS6f8zdjBW0YrgmTvhZ8B9L-B8C-u6H3-Q1/exec',
    env: 'AGENDA_FORTALECIMENTO_URL',
  },
  yoga: {
    nome: 'Yoga',
    url: 'https://script.google.com/macros/s/AKfycbwuLj030OziIIKcnlMngh6C3E7TsbN14f5OKYJ85FbOXNe7IUcfUcbNY2bWSc4nYZnACQ/exec',
    env: 'AGENDA_YOGA_URL',
  },
};

// Checkbox "Cancelou (devolver crédito)" da lista Fortalecimento em Grupo.
export const CAMPO_CANCELOU = 'aed9b184-ea71-4e50-8ff4-a5c946564c0a';

export const LIMITES = {
  codigoValeMs: 10 * 60000,
  tentativasPorCodigo: 5,
  pedidosPorHora: 3, // por número
  pedidosPorHoraIp: 10, // por endereço de origem: um script não varre a base de telefones
  enviosPorDia: 60, // fusível: de todos os números somados
  // O pedido de código responde no mínimo isto, exista o número ou não: quem mede o
  // tempo de resposta não descobre quem é cliente (o envio pelo WhatsApp demora ~1 s).
  respostaMinimaMs: 1500,
  sessaoMs: 60 * 86400000,
  // A varredura de reservas roda a cada 15 min; conferir depois dela pega a reserva
  // que ainda não tinha virado card `agendada` na hora do cancelamento.
  conferirDepoisMs: 16 * 60000,
};

const soDigitos = texto => String(texto || '').replace(/\D/g, '');
export const oito = telefone => { const d = soDigitos(telefone); return d.length >= 8 ? d.slice(-8) : ''; };
/** Número no formato que a Evolution e o E.164 esperam: 55 + DDD + número. */
export function comDdi(telefone) {
  const d = soDigitos(telefone);
  if (d.startsWith('55') && d.length >= 12 && d.length <= 13) return d;
  if (d.length === 10 || d.length === 11) return '55' + d;
  return '';
}
const igual = (a, b) => { const x = Buffer.from(String(a)); const y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };
const validarModalidade = m => { if (!Object.hasOwn(MODALIDADES, m)) throw new PublicError('Modalidade inválida.'); return m; };
/** Soma meses a um dia AAAA-MM-DD; dia 31 num mês curto cai no último dia do mês. */
export function somarMeses(iso, meses) {
  const [a, m, d] = iso.split('-').map(Number);
  const alvo = new Date(Date.UTC(a, m - 1 + meses, 1));
  const ultimo = new Date(Date.UTC(alvo.getUTCFullYear(), alvo.getUTCMonth() + 1, 0)).getUTCDate();
  alvo.setUTCDate(Math.min(d, ultimo));
  return alvo.toISOString().slice(0, 10);
}

// Pacote de fortalecimento: 6 aulas por mês (24 = 4 meses, 36 = 6 meses; decisão de 25/11/2026).
const AULAS_POR_MES = 6;
const AULA_USADA = new Set(['realizada', 'complete', 'faltou']);

/**
 * O que o atleta tem em aberto: pacote de fortalecimento e planos de sessão com saldo.
 * Função pura. Nada de dinheiro aqui (pagamento fica fora do app por decisão de 25/11/2026),
 * e plano com a data vencida aparece igual aos outros, sem aviso.
 */
export function montarEmAberto(atleta, listas, mensagens = new Map(), cedidas = new Map()) {
  const aulas = (listas.fortalecimento || []).filter(c => c.atletaId === atleta.id);
  const abertas = aulas.filter(c => c.status === 'em aberto');
  // O pacote em uso é o das aulas que ainda estão em aberto (cortesia antiga não conta).
  const contagem = new Map();
  for (const c of abertas) if (c.plano) contagem.set(c.plano, (contagem.get(c.plano) || 0) + 1);
  const plano = [...contagem].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const total = Number((plano || '').match(/^(\d+)\s+aulas?$/i)?.[1]) || null;
  const doPacote = plano ? aulas.filter(c => c.plano === plano) : aulas;
  const fortalecimento = {
    temPacote: aulas.length > 0,
    disponiveis: abertas.length,
    agendadas: aulas.filter(c => c.status === 'agendada').length,
    feitas: doPacote.filter(c => AULA_USADA.has(c.status)).length,
    // Datas das aulas já usadas do pacote, da mais recente para a mais antiga.
    usadas: doPacote.filter(c => AULA_USADA.has(c.status) && c.data).map(c => ({ data: c.data, faltou: c.status === 'faltou' })).sort((a, b) => b.data.localeCompare(a.data)),
    plano,
    validade: total && atleta.fortContratada && abertas.length > 0 ? somarMeses(atleta.fortContratada, total / AULAS_POR_MES) : null,
  };

  const grupos = new Map();
  for (const s of listas.sessoes || []) {
    if (s.atletaId !== atleta.id || s.statusPlano === 'Plano Finalizado' || s.status === 'cancelada') continue;
    const chave = [s.tipo, s.fimPlano || '', s.totalPlano || ''].join('|');
    const g = grupos.get(chave) || { plano: s.tipo, total: s.totalPlano || null, feitas: 0, restam: 0, validade: s.fimPlano || null, datas: [], mensagens: [], usadas: [] };
    if (s.status === 'realizada') {
      g.feitas += 1;
      if (s.data) {
        g.datas.push(s.data);
        // Sessão cedida: o atleta vê só "cedida para Fulana". A mensagem dessa sessão, se
        // houver, falaria da outra pessoa e não aparece.
        const cessao = cedidas.get(s.id);
        // Só a mensagem que o atleta já recebeu no WhatsApp (status Enviada).
        const texto = cessao ? null : mensagens.get(s.id);
        if (texto) g.mensagens.push({ data: s.data, texto });
        // Uma linha por sessão: duas no mesmo dia não trocam mensagem nem aviso entre si.
        g.usadas.push({ data: s.data, ...(texto ? { texto } : {}), ...(cessao ? { cedidaPara: cessao.para } : {}) });
      }
    }
    else g.restam += 1;
    grupos.set(chave, g);
  }
  const planos = [...grupos.values()].filter(g => g.restam > 0)
    .map(g => ({ ...g, total: g.total || g.feitas + g.restam, datas: g.datas.sort((a, b) => b.localeCompare(a)), mensagens: g.mensagens.sort((a, b) => b.data.localeCompare(a.data)), usadas: g.usadas.sort((a, b) => b.data.localeCompare(a.data)) }))
    .sort((a, b) => String(a.validade || '9999').localeCompare(String(b.validade || '9999')) || a.plano.localeCompare(b.plano));
  return { fortalecimento, planos };
}

// ---------------------------------------------------------------- Diário para a fisio
// Sugestão do João Galindo (26/11/2026): o atleta sente algo na semana, esquece na sessão.
// Cada anotação vira um COMENTÁRIO no card do atleta no CRM, legível para a fisio, e o
// app relê esses comentários para mostrar o histórico. A 1ª linha é a marca que separa
// as anotações do app dos outros comentários do card.
export const MARCA_DIARIO = '📝 DIÁRIO DO ATLETA (pelo app)';
export const MOMENTOS = ['Ao acordar', 'Durante o treino', 'Depois do treino', 'No dia a dia'];
export const LIMITES_DIARIO = { porDia: 20, texto: 1000, diasParaTras: 60 };
const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const brData = iso => iso.split('-').reverse().join('/');
const comDia = iso => `${DIAS[new Date(iso + 'T12:00:00Z').getUTCDay()]}, ${brData(iso)}`;

/** Valida o que veio do app. Devolve a anotação limpa ou lança PublicError. */
export function validarAnotacao(entrada, hojeIso) {
  const data = String(entrada?.data || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || Number.isNaN(Date.parse(data + 'T12:00:00Z'))) throw new PublicError('Escolha o dia em que você sentiu.');
  if (data > hojeIso) throw new PublicError('O dia não pode ser no futuro.');
  const limite = new Date(Date.parse(hojeIso + 'T12:00:00Z') - LIMITES_DIARIO.diasParaTras * 86400000).toISOString().slice(0, 10);
  if (data < limite) throw new PublicError(`Dá para anotar até ${LIMITES_DIARIO.diasParaTras} dias para trás.`);
  const hora = String(entrada?.hora || '');
  if (hora && !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) throw new PublicError('Hora inválida.');
  const momento = String(entrada?.momento || '');
  if (momento && !MOMENTOS.includes(momento)) throw new PublicError('Momento inválido.');
  let intensidade = entrada?.intensidade;
  if (intensidade === '' || intensidade === undefined) intensidade = null;
  if (intensidade !== null && !(Number.isInteger(intensidade) && intensidade >= 0 && intensidade <= 10)) throw new PublicError('A intensidade vai de 0 a 10.');
  // Texto livre: sem caracteres de controle (menos quebra de linha), sem linhas em branco em série.
  const texto = String(entrada?.texto || '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').replace(/\n{3,}/g, '\n\n').trim();
  if (texto.length < 3) throw new PublicError('Conte o que você sentiu.');
  if (texto.length > LIMITES_DIARIO.texto) throw new PublicError(`Use até ${LIMITES_DIARIO.texto} caracteres.`);
  return { data, hora, momento, intensidade, texto };
}

/** Texto do comentário no ClickUp: a fisio lê; o app relê com `lerAnotacao`. */
export function textoDoComentario(a, registradoEm) {
  const quando = [comDia(a.data) + (a.hora ? ` às ${a.hora}` : ''), a.momento].filter(Boolean).join(' · ');
  return [
    MARCA_DIARIO,
    `Quando: ${quando}`,
    `Intensidade: ${a.intensidade === null ? 'não informada' : a.intensidade + '/10'}`,
    `Anotado em: ${registradoEm}`,
    '',
    a.texto,
  ].join('\n');
}

/** Lê de volta um comentário escrito por `textoDoComentario`; outro comentário qualquer → null. */
export function lerAnotacao(comentario) {
  const linhas = String(comentario || '').replace(/\r\n?/g, '\n').split('\n');
  if (linhas[0]?.trim() !== MARCA_DIARIO) return null;
  const quando = /^Quando: \S+, (\d{2})\/(\d{2})\/(\d{4})(?: às (\d{2}:\d{2}))?(?: · (.+))?$/.exec(linhas[1] || '');
  const intensidade = /^Intensidade: (?:(\d{1,2})\/10|não informada)$/.exec(linhas[2] || '');
  if (!quando || !intensidade || !/^Anotado em: /.test(linhas[3] || '')) return null;
  return {
    data: `${quando[3]}-${quando[2]}-${quando[1]}`,
    hora: quando[4] || '',
    momento: MOMENTOS.includes(quando[5]) ? quando[5] : '',
    intensidade: intensidade[1] === undefined ? null : Number(intensidade[1]),
    texto: linhas.slice(5).join('\n').trim(),
  };
}

// A anotação também vai para a Evolução da PRÓXIMA sessão em aberto (pedido do Gustavo,
// 26/11/2026): a fisio abre o card da sessão e já encontra o que o atleta sentiu.
// Só ACRESCENTA no fim do campo; nunca apaga o que a fisio escreveu.
const STATUS_MARCADA = new Set(['agendada', 'remarcada']);

/**
 * Card da próxima sessão em aberto do atleta: primeiro a marcada (agendada/remarcada) de hoje
 * em diante, pela data; sem nenhuma marcada, a de menor número entre as que aguardam, no plano
 * que vence primeiro. Plano finalizado e sessão marcada no passado ficam de fora.
 */
export function proximaSessaoAberta(sessoes, atletaId, hojeIso) {
  const doAtleta = (sessoes || []).filter(s => s.atletaId === atletaId && s.statusPlano !== 'Plano Finalizado');
  const marcadas = doAtleta.filter(s => STATUS_MARCADA.has(s.status) && (!s.data || s.data >= hojeIso))
    .sort((a, b) => String(a.data || '9999').localeCompare(String(b.data || '9999')) || (a.numeroSessao || 99) - (b.numeroSessao || 99));
  if (marcadas.length) return marcadas[0];
  const aguardando = doAtleta.filter(s => s.status === 'aguardando')
    .sort((a, b) => String(a.fimPlano || '9999').localeCompare(String(b.fimPlano || '9999')) || (a.numeroSessao || 99) - (b.numeroSessao || 99));
  return aguardando[0] || null;
}

/** Bloco acrescentado na Evolução da sessão. */
export function blocoParaEvolucao(a, registradoEm) {
  const quando = [comDia(a.data) + (a.hora ? ` às ${a.hora}` : ''), a.momento, a.intensidade === null ? '' : `intensidade ${a.intensidade}/10`].filter(Boolean).join(' · ');
  return `📝 Anotação do atleta pelo app (${registradoEm})\nQuando: ${quando}\n${a.texto}`;
}

const validarToken =t => { if (typeof t !== 'string' || !/^[A-Za-z0-9_-]{20,40}$/.test(t)) throw new PublicError('Link de cancelamento inválido.'); return t; };

/** Erro de negócio vindo da agenda: carrega o código (`LOTADA`, `PASSADA`…) para a tela reagir. */
export class ErroAgenda extends PublicError {
  constructor(codigo, mensagem, status = 409) { super(mensagem, status); this.codigo = codigo; }
}

/** Cliente dos Web Apps do Apps Script. Todo pedido é POST: a chave nunca vai na URL. */
export function criarClienteAgenda(env = process.env, fetchFn = fetch) {
  const chave = String(env.AGENDA_CHAVE || '');
  const comChave = chave.length >= 32;
  const urlDe = m => String(env[MODALIDADES[m].env] || MODALIDADES[m].url);

  async function chamar(modalidade, corpo) {
    let resposta;
    try {
      // text/plain como na página pública: é o que o doPost do Apps Script lê sem preflight.
      resposta = await fetchFn(urlDe(modalidade), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(corpo), signal: AbortSignal.timeout(40000) });
    } catch { throw new PublicError('A agenda não respondeu agora. Tente de novo em instantes.', 503); }
    let json;
    try { json = JSON.parse(await resposta.text()); } catch { throw new PublicError('A agenda respondeu em um formato inesperado. Avise a CareFit.', 502); }
    if (json.ok) return json;
    // Web App antigo (sem as ações do app) ou chave diferente da do servidor.
    if (json.codigo === 'NAO_AUTORIZADO') throw new PublicError('A agenda ainda não liberou o app. Avise a CareFit.', 503);
    throw new ErroAgenda(String(json.codigo || 'ERRO'), String(json.mensagem || 'Não foi possível concluir.'));
  }
  const exigirChave = () => { if (!comChave) throw new PublicError('O app ainda não foi ligado à agenda. Avise a CareFit.', 503); };

  return {
    comChave,
    async minhas(modalidade, telefone) { exigirChave(); return (await chamar(modalidade, { acao: 'minhas', chave, telefone })).reservas || []; },
    async reservar(modalidade, pedido) { exigirChave(); return (await chamar(modalidade, { ...pedido, chave })).reserva; },
    async reserva(modalidade, token) { return (await chamar(modalidade, { acao: 'reserva', token })).reserva; },
    async cancelar(modalidade, token) { const r = await chamar(modalidade, { acao: 'cancelar', token }); return { reserva: r.reserva, jaCancelada: Boolean(r.jaCancelada) }; },
  };
}

/** Envio de texto pela Evolution. Só o código de acesso passa por aqui. */
export function criarEnviadorWhatsapp(env = process.env, fetchFn = fetch) {
  const base = String(env.EVOLUTION_BASE_URL || '').replace(/\/+$/, '');
  const instancia = env.EVOLUTION_INSTANCE;
  const chave = env.EVOLUTION_API_KEY;
  if (!base || !instancia || !chave || !/^https:\/\//.test(base)) return null;
  return {
    async enviar(numero, texto) {
      let resposta;
      try {
        resposta = await fetchFn(`${base}/message/sendText/${encodeURIComponent(instancia)}`, { method: 'POST', headers: { apikey: chave, 'Content-Type': 'application/json' }, body: JSON.stringify({ number: numero, text: texto }), signal: AbortSignal.timeout(20000) });
      } catch { throw new PublicError('Não consegui enviar o código agora. Tente de novo em instantes.', 503); }
      if (!resposta.ok) throw new PublicError('Não consegui enviar o código agora. Tente de novo em instantes.', 503);
    },
  };
}

/** Cookie de sessão do atleta: carga em base64url + HMAC. O servidor não guarda sessão. */
export function criarSessoes(segredo, agora = () => Date.now()) {
  const assinar = x => createHmac('sha256', segredo).update('atleta:' + x).digest('base64url');
  return {
    emitir(atletaId, tel8) {
      const carga = Buffer.from(JSON.stringify({ a: atletaId, t: tel8, exp: agora() + LIMITES.sessaoMs, n: randomBytes(9).toString('hex') })).toString('base64url');
      return `${carga}.${assinar(carga)}`;
    },
    ler(valor) {
      const [carga, assinatura] = String(valor || '').split('.');
      if (!carga || !assinatura || !igual(assinatura, assinar(carga))) return null;
      try {
        const dados = JSON.parse(Buffer.from(carga, 'base64url'));
        return dados.exp > agora() && typeof dados.a === 'string' && typeof dados.t === 'string' ? { atletaId: dados.a, tel8: dados.t } : null;
      } catch { return null; }
    },
  };
}

/**
 * `fechamento` é o serviço que já lê o ClickUp com cache (CRM e listas de aulas);
 * `api` é o cliente do ClickUp, usado só para marcar o checkbox de cancelamento.
 */
export function criarServicoApp({ fechamento, api, agenda, whatsapp, agora = () => Date.now(), sortear = () => randomInt(0, 1000000), agendar = (fn, ms) => { const t = setTimeout(fn, ms); t.unref?.(); }, dormir = ms => new Promise(r => setTimeout(r, ms)) }) {
  const anotacoes = new Map(); // atletaId → { dia, n, ultima: { texto, em } }
  const codigos = new Map(); // tel8 → { codigo, ate, tentativas, atletaId }
  const pedidos = new Map(); // tel8 → [instantes dos pedidos da última hora]
  const pedidosIp = new Map(); // ip → [instantes dos pedidos da última hora]
  /** Registra um pedido na janela de uma hora e diz se estourou o limite. */
  function contarPedido(mapa, chave, limite, instante) {
    const recentes = (mapa.get(chave) || []).filter(t => instante - t < 3600000);
    if (recentes.length >= limite) return false;
    recentes.push(instante); mapa.set(chave, recentes);
    for (const [k, v] of mapa) if (!v.some(t => instante - t < 3600000)) mapa.delete(k);
    return true;
  }
  let fusivel = { dia: '', envios: 0 };
  const diaDe = ms => new Date(ms - 3 * 3600000).toISOString().slice(0, 10); // dia de Brasília

  async function acharPorTelefone(tel8) {
    if (!tel8) return null;
    const { atletas } = await fechamento.atletas();
    const candidatos = atletas.filter(a => oito(a.telefone) === tel8);
    // Cadastro duplicado com o mesmo número: vale o que tem histórico de sessões.
    candidatos.sort((a, b) => (b.sessoes?.length || 0) - (a.sessoes?.length || 0));
    return candidatos[0] || null;
  }
  async function atletaDaSessao(sessao) {
    if (!sessao) throw new PublicError('Entre com o seu WhatsApp para continuar.', 401);
    const { atletas } = await fechamento.atletas();
    const atleta = atletas.find(a => a.id === sessao.atletaId);
    // Telefone trocado no cadastro derruba a sessão antiga: o número é a identidade.
    if (!atleta || oito(atleta.telefone) !== sessao.tel8) throw new PublicError('Entre de novo com o seu WhatsApp.', 401);
    return atleta;
  }

  /** Acrescenta a anotação na Evolução da próxima sessão em aberto do atleta. */
  async function anotarNaSessao(atleta, anotacao, registradoEm, hoje) {
    if (!fechamento.listas) return 'sem-sessao';
    const alvo = proximaSessaoAberta((await fechamento.listas()).sessoes, atleta.id, hoje);
    if (!alvo) return 'sem-sessao';
    // Relê o card na hora: o cache pode ter minutos, e a Evolução pode ter texto novo da fisio.
    const card = await api(`/task/${alvo.id}`);
    const campoDe = id => (card.custom_fields || []).find(f => f.id === id);
    const relacao = campoDe(CAMPOS_SESSAO.atleta)?.value;
    if (!Array.isArray(relacao) || relacao.length !== 1 || relacao[0]?.id !== atleta.id) return 'outro-atleta';
    if (!/aguardando|agendada|remarcada/i.test(String(card.status?.status || ''))) return 'fechou';
    const atual = String(campoDe(CAMPOS_SESSAO.evolucaoSessao)?.value || '');
    const novo = (atual.trim() ? atual.replace(/\s+$/, '') + '\n\n' : '') + blocoParaEvolucao(anotacao, registradoEm);
    await api(`/task/${alvo.id}/field/${CAMPOS_SESSAO.evolucaoSessao}`, 'POST', { value: novo });
    return 'anotada';
  }

  /** Marca "Cancelou (devolver crédito)" no card `agendada` do atleta naquele dia. */
  async function devolverCredito(reserva) {
    const { atletas } = await fechamento.atletas();
    let atleta = reserva.tel8 ? atletas.find(a => oito(a.telefone) === reserva.tel8) : null;
    if (!atleta && reserva.email) {
      const emails = await fechamento.emails();
      atleta = atletas.find(a => emails.get(a.id) === reserva.email) || null;
    }
    if (!atleta) return 'sem-cadastro';
    const dia = String(reserva.aulaId || '').slice(0, 10);
    const listas = await fechamento.listas(true);
    const cards = listas.fortalecimento.filter(c => c.atletaId === atleta.id && c.status === 'agendada' && c.data === dia);
    if (cards.length === 0) return 'sem-aula';
    // Duas aulas do mesmo atleta no mesmo dia: o card não guarda a hora aqui, então
    // não dá para saber qual é. Não mexe em nenhum; a equipe resolve pelo card.
    if (cards.length > 1) return 'ambiguo';
    await api(`/task/${cards[0].id}/field/${CAMPO_CANCELOU}`, 'POST', { value: true });
    return 'devolvido';
  }

  return {
    /** Sempre a mesma resposta, exista o número no cadastro ou não: não vira consulta de clientes. */
    async pedirCodigo(telefone, ip = '') {
      const digitos = soDigitos(telefone);
      const tel8 = oito(digitos);
      if (digitos.length < 10 || digitos.length > 13 || !tel8) throw new PublicError('Coloque o seu WhatsApp com DDD.');
      if (!whatsapp) throw new PublicError('O acesso pelo WhatsApp ainda não foi ligado. Avise a CareFit.', 503);
      const instante = agora();
      // O limite por origem vem ANTES do por número: um só endereço varrendo telefones
      // para no décimo, antes de gastar o fusível do dia (que trancaria o login de todos).
      if (ip && !contarPedido(pedidosIp, ip, LIMITES.pedidosPorHoraIp, instante)) throw new PublicError('Muitos pedidos de código deste aparelho. Aguarde uma hora ou fale com a CareFit.', 429);
      if (!contarPedido(pedidos, tel8, LIMITES.pedidosPorHora, instante)) throw new PublicError('Você já pediu o código algumas vezes. Aguarde uma hora ou fale com a CareFit.', 429);
      for (const [k, v] of codigos) if (v.ate < instante) codigos.delete(k);

      try {
        const atleta = await acharPorTelefone(tel8);
        const destino = atleta && comDdi(atleta.telefone);
        if (!destino) return { ok: true };

        const hoje = diaDe(instante);
        if (fusivel.dia !== hoje) fusivel = { dia: hoje, envios: 0 };
        if (fusivel.envios >= LIMITES.enviosPorDia) throw new PublicError('O acesso por código está pausado por hoje. Fale com a CareFit no WhatsApp.', 503);
        fusivel.envios += 1; // conta antes de enviar: falha de envio também gasta o fusível

        const codigo = String(sortear()).padStart(6, '0');
        codigos.set(tel8, { codigo, ate: instante + LIMITES.codigoValeMs, tentativas: 0, atletaId: atleta.id });
        try {
          // Vai para o número do CADASTRO, nunca para o que foi digitado.
          await whatsapp.enviar(destino, `CareFit: seu código de acesso é ${codigo}. Ele vale por 10 minutos. Se não foi você que pediu, é só ignorar esta mensagem.`);
        } catch (erro) { codigos.delete(tel8); throw erro; }
        return { ok: true };
      } finally {
        // Mesma duração mínima com ou sem envio: a resposta não denuncia quem é cliente.
        const falta = LIMITES.respostaMinimaMs - (agora() - instante);
        if (falta > 0) await dormir(falta);
      }
    },

    async confirmarCodigo(telefone, codigo) {
      const tel8 = oito(telefone);
      const guardado = codigos.get(tel8);
      const invalido = new PublicError('Código inválido ou vencido. Peça um novo.', 401);
      if (!guardado || guardado.ate < agora()) { codigos.delete(tel8); throw invalido; }
      guardado.tentativas += 1;
      if (guardado.tentativas > LIMITES.tentativasPorCodigo) { codigos.delete(tel8); throw invalido; }
      if (!/^\d{6}$/.test(String(codigo || '')) || !igual(codigo, guardado.codigo)) throw invalido;
      codigos.delete(tel8);
      return { atletaId: guardado.atletaId, tel8 };
    },

    async inicio(sessao) {
      const atleta = await atletaDaSessao(sessao);
      const listas = await fechamento.listas();
      // Fechamento antigo (ou de teste) sem o método: o app segue sem as mensagens.
      const mensagens = fechamento.mensagens ? await fechamento.mensagens() : new Map();
      const cedidas = fechamento.cedidas ? await fechamento.cedidas() : new Map();
      const emAberto = montarEmAberto(atleta, listas, mensagens, cedidas);
      // As reservas NÃO entram aqui: cada Web App do Apps Script leva de 2 a 5 s para
      // responder, e a tela inicial sai do ClickUp (cache). A tela pede `reservas` em seguida.
      return {
        primeiroNome: atleta.nome.split(/\s+/)[0],
        // Primeiro nome do profissional do cadastro: a tela destaca a agenda dele.
        fisio: atleta.fisio ? String(atleta.fisio).trim().split(/\s+/)[0] : null,
        fortalecimento: emAberto.fortalecimento,
        planos: emAberto.planos,
      };
    },

    /** Próximas aulas reservadas nas duas agendas (Apps Script), em paralelo. */
    async reservas(sessao) {
      const atleta = await atletaDaSessao(sessao);
      const avisos = [];
      const reservas = [];
      await Promise.all(Object.keys(MODALIDADES).map(async modalidade => {
        try {
          for (const r of await agenda.minhas(modalidade, atleta.telefone)) reservas.push({ modalidade, aulaId: r.aulaId, data: r.data, horaInicio: r.horaInicio, quando: r.quando, token: r.token });
        } catch { avisos.push(`Não consegui ler suas reservas de ${MODALIDADES[modalidade].nome.toLowerCase()} agora.`); }
      }));
      reservas.sort((a, b) => a.aulaId.localeCompare(b.aulaId));
      return { reservas, avisos: avisos.sort() };
    },

    async reservar(sessao, entrada) {
      const atleta = await atletaDaSessao(sessao);
      const modalidade = validarModalidade(entrada?.modalidade);
      const aulaId = String(entrada?.aulaId || '');
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(aulaId)) throw new PublicError('Escolha uma aula antes de confirmar.');
      const idempotencia = String(entrada?.idempotencia || '');
      if (!/^[A-Za-z0-9_-]{16,64}$/.test(idempotencia)) throw new PublicError('Identificador da reserva inválido. Atualize a página.');
      const telefone = comDdi(atleta.telefone);
      if (!telefone) throw new PublicError('Seu telefone no cadastro está incompleto. Fale com a CareFit.', 409);
      const email = (await fechamento.emails()).get(atleta.id) || '';
      const reserva = await agenda.reservar(modalidade, { aulaId, nome: atleta.nome, email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : '', telefone: '+' + telefone, idempotencia });
      return { modalidade, aulaId: reserva.aulaId, quando: reserva.quando, inicioISO: reserva.inicioISO, fimISO: reserva.fimISO, email: reserva.email || '', nome: atleta.nome, token: reserva.token || null };
    },

    /** Anotações do diário do atleta, lidas dos comentários do card dele no CRM. */
    async diario(sessao) {
      const atleta = await atletaDaSessao(sessao);
      const lidas = [];
      let pagina = (await api(`/task/${atleta.id}/comment`)).comments || [];
      // O ClickUp devolve 25 por vez, do mais novo para o mais antigo; 4 páginas bastam.
      for (let i = 0; i < 4 && pagina.length; i++) {
        for (const c of pagina) {
          const a = lerAnotacao(c.comment_text);
          if (a) lidas.push({ id: String(c.id), ...a, registradoEm: Number(c.date) || null });
        }
        if (pagina.length < 25) break;
        const ultimo = pagina[pagina.length - 1];
        pagina = (await api(`/task/${atleta.id}/comment?start=${encodeURIComponent(ultimo.date)}&start_id=${encodeURIComponent(ultimo.id)}`)).comments || [];
      }
      lidas.sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora) || (b.registradoEm || 0) - (a.registradoEm || 0));
      return { anotacoes: lidas.slice(0, 30) };
    },

    /** Grava uma anotação como comentário no card do atleta (sem notificar ninguém). */
    async anotar(sessao, entrada) {
      const atleta = await atletaDaSessao(sessao);
      const instante = agora();
      const hoje = diaDe(instante);
      const anotacao = validarAnotacao(entrada, hoje);
      const conta = anotacoes.get(atleta.id);
      const doDia = conta && conta.dia === hoje ? conta : { dia: hoje, n: 0, ultima: null };
      // Toque duplo / reenvio: o mesmo texto em menos de 2 minutos não vira outro comentário.
      if (doDia.ultima && doDia.ultima.texto === anotacao.texto && instante - doDia.ultima.em < 120000) return { ok: true, repetida: true };
      if (doDia.n >= LIMITES_DIARIO.porDia) throw new PublicError('Você já fez muitas anotações hoje. Conte o resto direto para a sua fisio.', 429);
      const registradoEm = new Date(instante - 3 * 3600000).toISOString().replace(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2}).*$/, '$3/$2/$1 $4');
      await api(`/task/${atleta.id}/comment`, 'POST', { comment_text: textoDoComentario(anotacao, registradoEm), notify_all: false });
      anotacoes.set(atleta.id, { dia: hoje, n: doDia.n + 1, ultima: { texto: anotacao.texto, em: instante } });
      // O comentário já garante a anotação; a cópia na sessão é bônus e não derruba o pedido.
      let copia;
      try { copia = await anotarNaSessao(atleta, anotacao, registradoEm, hoje); }
      catch (erro) { copia = 'falhou'; console.error('app-atleta: anotação sem cópia na sessão', erro?.message || erro); }
      return { ok: true, sessao: copia };
    },

    /** Público: quem tem o token (link do e-mail ou app aberto) vê a própria reserva. */
    async detalhe(modalidade, token) {
      const r = await agenda.reserva(validarModalidade(modalidade), validarToken(token));
      return { modalidade, aulaId: r.aulaId, quando: r.quando, cancelada: Boolean(r.cancelada), passada: Boolean(r.passada), primeiroNome: String(r.primeiroNome || '') };
    },

    /** Público, pelo mesmo motivo. Sem regra de antecedência (decisão de 25/11/2026). */
    async cancelar(modalidade, token) {
      validarModalidade(modalidade); validarToken(token);
      const { reserva, jaCancelada } = await agenda.cancelar(modalidade, token);
      let credito = null;
      if (modalidade === 'fortalecimento' && !jaCancelada) {
        try { credito = await devolverCredito(reserva); } catch { credito = 'falhou'; }
        if (credito === 'sem-aula' || credito === 'falhou') {
          // A reserva pode ainda não ter virado card, ou o ClickUp falhou agora. Confere
          // uma vez depois da próxima varredura — e só se continuar cancelada: quem
          // cancelou e reservou a MESMA aula de novo não pode perder a vaga nova.
          agendar(async () => {
            try {
              const atual = await agenda.reserva(modalidade, token);
              if (atual.cancelada) await devolverCredito(reserva);
            } catch (erro) { console.error('app-atleta: conferência do cancelamento falhou', erro?.message || erro); }
          }, LIMITES.conferirDepoisMs);
        }
        if (credito === 'ambiguo' || credito === 'falhou') console.error(`app-atleta: cancelamento de ${reserva.aulaId} sem baixa no ClickUp (${credito})`);
      }
      return { ok: true, jaCancelada, quando: reserva.quando, aulaId: reserva.aulaId, credito };
    },
  };
}
