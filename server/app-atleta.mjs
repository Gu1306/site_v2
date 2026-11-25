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
  enviosPorDia: 60, // fusível: de todos os números somados
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
export function montarEmAberto(atleta, listas, mensagens = new Map()) {
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
    const g = grupos.get(chave) || { plano: s.tipo, total: s.totalPlano || null, feitas: 0, restam: 0, validade: s.fimPlano || null, datas: [], mensagens: [] };
    if (s.status === 'realizada') {
      g.feitas += 1;
      if (s.data) {
        g.datas.push(s.data);
        // Só a mensagem que o atleta já recebeu no WhatsApp (status Enviada).
        const texto = mensagens.get(s.id);
        if (texto) g.mensagens.push({ data: s.data, texto });
      }
    }
    else g.restam += 1;
    grupos.set(chave, g);
  }
  const planos = [...grupos.values()].filter(g => g.restam > 0)
    .map(g => ({ ...g, total: g.total || g.feitas + g.restam, datas: g.datas.sort((a, b) => b.localeCompare(a)), mensagens: g.mensagens.sort((a, b) => b.data.localeCompare(a.data)) }))
    .sort((a, b) => String(a.validade || '9999').localeCompare(String(b.validade || '9999')) || a.plano.localeCompare(b.plano));
  return { fortalecimento, planos };
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
export function criarServicoApp({ fechamento, api, agenda, whatsapp, agora = () => Date.now(), sortear = () => randomInt(0, 1000000), agendar = (fn, ms) => { const t = setTimeout(fn, ms); t.unref?.(); } }) {
  const codigos = new Map(); // tel8 → { codigo, ate, tentativas, atletaId }
  const pedidos = new Map(); // tel8 → [instantes dos pedidos da última hora]
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
    async pedirCodigo(telefone) {
      const digitos = soDigitos(telefone);
      const tel8 = oito(digitos);
      if (digitos.length < 10 || digitos.length > 13 || !tel8) throw new PublicError('Coloque o seu WhatsApp com DDD.');
      if (!whatsapp) throw new PublicError('O acesso pelo WhatsApp ainda não foi ligado. Avise a CareFit.', 503);
      const instante = agora();
      const recentes = (pedidos.get(tel8) || []).filter(t => instante - t < 3600000);
      if (recentes.length >= LIMITES.pedidosPorHora) throw new PublicError('Você já pediu o código algumas vezes. Aguarde uma hora ou fale com a CareFit.', 429);
      recentes.push(instante); pedidos.set(tel8, recentes);
      for (const [k, v] of pedidos) if (!v.some(t => instante - t < 3600000)) pedidos.delete(k);
      for (const [k, v] of codigos) if (v.ate < instante) codigos.delete(k);

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
      const emAberto = montarEmAberto(atleta, listas, mensagens);
      const avisos = [];
      const reservas = [];
      await Promise.all(Object.keys(MODALIDADES).map(async modalidade => {
        try {
          for (const r of await agenda.minhas(modalidade, atleta.telefone)) reservas.push({ modalidade, aulaId: r.aulaId, data: r.data, horaInicio: r.horaInicio, quando: r.quando, token: r.token });
        } catch { avisos.push(`Não consegui ler suas reservas de ${MODALIDADES[modalidade].nome.toLowerCase()} agora.`); }
      }));
      reservas.sort((a, b) => a.aulaId.localeCompare(b.aulaId));
      return {
        primeiroNome: atleta.nome.split(/\s+/)[0],
        // Primeiro nome do profissional do cadastro: a tela destaca a agenda dele.
        fisio: atleta.fisio ? String(atleta.fisio).trim().split(/\s+/)[0] : null,
        fortalecimento: emAberto.fortalecimento,
        planos: emAberto.planos,
        reservas,
        avisos: avisos.sort(),
      };
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
