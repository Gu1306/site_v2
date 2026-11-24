// Conversas do WhatsApp da CareFit (/gestao/operacao) — SÓ LEITURA.
//
// Lê a Evolution API apenas pelo endpoint de busca (/chat/findMessages) e NUNCA
// chama nada que envie mensagem: não existe robô respondendo no número da
// CareFit, e esta tela só diz quem está esperando resposta.
//
// A Evolution devolve as mensagens mais recentes primeiro, então a leitura para
// assim que passa da janela pedida — não varre a base inteira (52 mil mensagens
// em nov/2026).
//
// O que sai daqui para o navegador: nome, os 4 últimos dígitos do telefone, há
// quanto tempo está parado e a última mensagem (cortada). O telefone completo só
// aparece dentro do link de abrir a conversa.
import { PublicError } from './fortalecimento.mjs';

export const REGRAS = {
  janelaDias: 21,      // só conversas em que o contato escreveu nos últimos 21 dias
  semRespostaHoras: 3, // contato falou por último há mais de 3 h
  esfriouDias: 3,      // CareFit falou por último e o contato sumiu há 3+ dias
  lerDias: 21,         // quanto histórico baixar da Evolution
  maxPaginas: 14,      // trava: 14 × 500 = 7.000 mensagens por leitura
  porPagina: 500,
};
const CACHE_MS = 5 * 60000;
const ATUALIZAR_MIN_MS = 60000;
const IGNORAR = new Set(['reactionMessage', 'secretEncryptedMessage', 'pinInChatMessage', 'associatedChildMessage', 'protocolMessage']);
const RÓTULOS = { audioMessage: '[áudio]', imageMessage: '[imagem]', videoMessage: '[vídeo]', documentMessage: '[documento]', stickerMessage: '[figurinha]', contactMessage: '[contato]', locationMessage: '[localização]' };
const DISPARO_MINIMO = 8; // mesmo texto longo para 8+ contatos = disparo, não conversa

/** DDD + 8 últimos dígitos: ignora o 55 e o nono dígito, que variam entre cadastros. */
export function chaveTelefone(tel) {
  const d = String(tel || '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
  return d.length >= 10 ? d.slice(0, 2) + d.slice(-8) : '';
}

const texto = m => (m.texto ? m.texto.replace(/\s+/g, ' ').trim() : RÓTULOS[m.tipo] || '');
const cortar = (s, n) => (Array.from(s).length > n ? Array.from(s).slice(0, n).join('') + '…' : s);

/** Converte um registro cru da Evolution no mínimo que esta tela usa. */
export function reduzirMensagem(x) {
  const jid = x.key?.remoteJid || '';
  if (jid.endsWith('@g.us') || jid.includes('broadcast') || jid.includes('newsletter')) return null; // grupos e listas fora
  const id = x.key?.id;
  if (!id) return null;
  const bruto = jid.endsWith('@lid') ? x.key?.remoteJidAlt || '' : jid;
  const tel = bruto.replace(/@.*/, '').replace(/\D/g, '');
  const msg = x.message || {};
  return {
    id, tel, nome: x.pushName || '',
    de: x.key?.fromMe ? 'carefit' : 'contato',
    ts: Number(x.messageTimestamp || 0),
    tipo: x.messageType || Object.keys(msg)[0] || '',
    texto: msg.conversation || msg.extendedTextMessage?.text || msg.imageMessage?.caption || msg.videoMessage?.caption || '',
  };
}

/**
 * Função pura: mensagens reduzidas + atletas do CRM → quem está esperando.
 * `atletas` é a lista do CRM já reduzida (nome, status, telefone, sessões).
 */
export function montarConversas(mensagens, atletas, agora) {
  const porTelefone = new Map();
  for (const a of atletas || []) {
    const k = chaveTelefone(a.telefone);
    // Cadastro duplicado: fica o que não é "novo lead".
    if (k && (!porTelefone.has(k) || /novo lead/i.test(porTelefone.get(k).status || ''))) porTelefone.set(k, a);
  }

  // Disparo em massa não é conversa: o mesmo texto longo mandado para muita gente.
  const disparos = new Map();
  for (const m of mensagens) {
    if (m.de !== 'carefit' || m.texto.length <= 40) continue;
    const k = m.texto.slice(0, 60);
    if (!disparos.has(k)) disparos.set(k, new Set());
    disparos.get(k).add(m.tel);
  }
  const ehDisparo = m => m.de === 'carefit' && m.texto.length > 40 && (disparos.get(m.texto.slice(0, 60))?.size || 0) >= DISPARO_MINIMO;

  const conversas = new Map();
  for (const m of mensagens) {
    const k = chaveTelefone(m.tel) || m.tel;
    if (!k) continue;
    if (!conversas.has(k)) conversas.set(k, []);
    conversas.get(k).push(m);
  }

  const fila = [];
  const resumo = { conversas: conversas.size, emDia: 0, semEntradaRecente: 0, semResposta: 0, esfriou: 0, comSessaoMarcada: 0 };
  for (const [k, todas] of conversas) {
    const uteis = todas.filter(m => !IGNORAR.has(m.tipo) && texto(m)).sort((a, b) => a.ts - b.ts);
    const ultimaDoContato = [...uteis].reverse().find(m => m.de === 'contato');
    if (!ultimaDoContato || agora - ultimaDoContato.ts * 1000 > REGRAS.janelaDias * 864e5) { resumo.semEntradaRecente++; continue; }
    const ultima = uteis.at(-1);
    const horas = (agora - ultima.ts * 1000) / 36e5;
    const atleta = porTelefone.get(k) || null;
    const proxima = (atleta?.sessoes || []).filter(s => s.data && s.data >= new Date(agora).toISOString().slice(0, 10) && s.status !== 'cancelada').sort((a, b) => a.data.localeCompare(b.data))[0] || null;
    const feitas = (atleta?.sessoes || []).filter(s => s.status === 'realizada' && s.data).sort((a, b) => b.data.localeCompare(a.data));

    let motivo = null;
    if (ultima.de === 'contato' && horas >= REGRAS.semRespostaHoras) motivo = 'sem_resposta';
    else if (ultima.de === 'carefit' && !ehDisparo(ultima) && horas >= REGRAS.esfriouDias * 24) {
      if (proxima) { resumo.comSessaoMarcada++; continue; } // já tem sessão marcada: não está frio
      motivo = 'esfriou';
    } else { resumo.emDia++; continue; }
    resumo[motivo === 'sem_resposta' ? 'semResposta' : 'esfriou']++;

    const telefone = ultimaDoContato.tel || ultima.tel || '';
    fila.push({
      motivo,
      nome: atleta?.nome || ultimaDoContato.nome || '(sem nome)',
      final: telefone.slice(-4),
      // Só este link carrega o número completo, e serve para abrir a conversa.
      link: telefone.length >= 10 ? `https://wa.me/${telefone.startsWith('55') ? telefone : '55' + telefone}` : null,
      noCrm: Boolean(atleta),
      status: atleta?.status || null,
      fisio: atleta?.fisio || null,
      ultimaSessao: feitas[0]?.data || null,
      proximaSessao: proxima?.data || null,
      horas: Math.round(horas),
      dias: Math.round(horas / 24 * 10) / 10,
      quem: ultima.de,
      previa: cortar(texto(ultima), 180),
      em: new Date(ultima.ts * 1000).toISOString(),
    });
  }
  // Primeiro quem está esperando resposta, e dentro de cada grupo quem espera há mais tempo.
  fila.sort((a, b) => (a.motivo === b.motivo ? b.horas - a.horas : a.motivo === 'sem_resposta' ? -1 : 1));
  return { regras: REGRAS, resumo, fila };
}

/** Cliente da Evolution restrito à busca de mensagens. */
export function criarLeitorConversas(env) {
  const base = String(env.EVOLUTION_BASE_URL || '').replace(/\/+$/, '');
  const instancia = env.EVOLUTION_INSTANCE;
  const chave = env.EVOLUTION_API_KEY;
  if (!base || !instancia || !chave) return null;
  if (!/^https:\/\//.test(base)) throw new Error('EVOLUTION_BASE_URL precisa ser https.');

  async function pagina(page) {
    const resposta = await fetch(`${base}/chat/findMessages/${encodeURIComponent(instancia)}`, {
      method: 'POST',
      headers: { apikey: chave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ where: {}, page, offset: REGRAS.porPagina }),
      signal: AbortSignal.timeout(30000),
    });
    if (!resposta.ok) throw new PublicError('O WhatsApp não respondeu agora. Tente de novo em instantes.', 503);
    const corpo = await resposta.json();
    return corpo.messages || corpo;
  }

  return {
    async mensagens(dias = REGRAS.lerDias) {
      const corte = Date.now() / 1000 - dias * 86400;
      const vistas = new Map();
      let paginas = 1;
      for (let page = 1; page <= Math.min(paginas, REGRAS.maxPaginas); page++) {
        const m = await pagina(page);
        paginas = m.pages || 1;
        const registros = m.records || [];
        let maisAntigaDaPagina = Infinity;
        for (const bruta of registros) {
          const x = reduzirMensagem(bruta);
          if (!x || !x.ts) continue;
          maisAntigaDaPagina = Math.min(maisAntigaDaPagina, x.ts);
          if (x.ts < corte || vistas.has(x.id)) continue;
          vistas.set(x.id, x);
        }
        // Página mais nova primeiro: quando toda a página já passou do corte, acabou.
        if (!registros.length || maisAntigaDaPagina < corte) break;
      }
      return [...vistas.values()].sort((a, b) => a.ts - b.ts);
    },
  };
}

/** Serviço com cache: abrir a página não relê o WhatsApp a cada clique. */
export function criarServicoConversas(leitor, agora = () => Date.now()) {
  let cache = null; let emCurso = null;
  return {
    disponivel: Boolean(leitor),
    async fila(atletas, forcar = false) {
      if (!leitor) throw new PublicError('WhatsApp não configurado no servidor (EVOLUTION_BASE_URL, EVOLUTION_INSTANCE, EVOLUTION_API_KEY).', 503);
      const idade = cache ? agora() - cache.lidoEm : Infinity;
      if (idade >= CACHE_MS || (forcar && idade >= ATUALIZAR_MIN_MS)) {
        emCurso ||= (async () => {
          const mensagens = await leitor.mensagens();
          cache = { lidoEm: agora(), mensagens };
          return cache;
        })().finally(() => { emCurso = null; });
        await emCurso;
      }
      return { ...montarConversas(cache.mensagens, atletas, agora()), atualizadoEm: new Date(cache.lidoEm).toISOString() };
    },
  };
}
