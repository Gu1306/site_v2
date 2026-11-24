// Painel de conteúdo da central: o que sai nas próximas duas semanas e o que já saiu.
//
// Três fontes, todas SOMENTE LEITURA, cada uma opcional:
//   POSTIZ_API_KEY  → Instagram (agendado/rascunho/publicado). Desde 19/11/2026 todo o
//                     Instagram vive no Postiz; POSTIZ_API_URL só muda em teste.
//   BUFFER_API_KEY  → Facebook e TikTok (o Instagram saiu do Buffer: ver fb/tt abaixo).
//   N8N_BASE_URL + N8N_API_KEY → feed real do Instagram, pela Graph API, com o token guardado
//                     na Data Table de config do n8n (o mesmo do robô e do Radar).
//
// O feed manda: o Gustavo posta muito pelo celular, fora do Postiz e do Buffer, e sem ele o
// painel diria que um post "não saiu" quando já está no ar.
//
// Faltando uma fonte, o painel sai com as outras e diz qual não respondeu — como a carteira
// faz com o WhatsApp. Sem nenhuma, a página explica que o conteúdo não está ligado.
import { PublicError } from './fortalecimento.mjs';

const POSTIZ_PADRAO = 'https://postiz.carefitrunbase.com.br/api/public/v1';
const BUFFER_ORG = '6ade1cac0175c1c9489d9093';
const BUFFER_API = 'https://api.buffer.com';
const DIAS = 14;
const TZ_MIN = -180; // Brasília, sem horário de verão

const ESTADO_POSTIZ = { QUEUE: 'agendado', DRAFT: 'rascunho', PUBLISHED: 'publicado', ERROR: 'erro' };

/** Instante em minutos de Brasília, no formato que serve de chave para juntar as redes. */
export function chaveHorario(iso) {
  const t = new Date(new Date(iso).getTime() + TZ_MIN * 60000);
  return t.toISOString().slice(0, 16);
}

/** Primeira linha do texto, cortada sem partir palavra. */
export function titulo(texto, limite = 95) {
  const t = String(texto || '').trim().split('\n')[0].trim();
  if (t.length <= limite) return t;
  return t.slice(0, limite - 3).replace(/\s+\S*$/, '') + '…';
}

/**
 * Cruza as três fontes num calendário só. Função pura: recebe o que já foi lido.
 * `agora` e as datas são ISO; devolve os posts ordenados por horário.
 */
export function montarConteudo({ postiz = [], buffer = [], feed = [], agora, inicio, fim }) {
  const itens = new Map();
  const item = (iso) => {
    const k = chaveHorario(iso);
    if (!itens.has(k)) itens.set(k, { quando: iso, chave: k, texto: '', formato: '', ig: null, fb: null, tt: null, link: null });
    return itens.get(k);
  };
  const dentro = (iso) => iso >= inicio && iso <= fim;

  for (const p of postiz) {
    if (!dentro(p.publishDate)) continue;
    const i = item(p.publishDate);
    i.texto = p.content || i.texto;
    i.ig = { estado: ESTADO_POSTIZ[p.state] || String(p.state || '').toLowerCase(), onde: p.state === 'DRAFT' ? 'Postiz, falta liberar' : 'Postiz' };
  }
  for (const n of buffer) {
    if (!dentro(n.dueAt)) continue;
    const i = item(n.dueAt);
    if (!i.texto) i.texto = n.text || '';
    if (!i.formato) {
      const video = (n.assets || []).some(a => String(a?.mimeType || '').startsWith('video'));
      i.formato = video ? 'Reels' : ((n.assets || []).length > 1 ? `carrossel · ${n.assets.length}` : 'post');
    }
    const estado = { estado: n.status === 'sent' ? 'publicado' : 'agendado', onde: 'Buffer' };
    const campo = { instagram: 'ig', facebook: 'fb', tiktok: 'tt' }[n.channelService];
    if (campo) i[campo] = estado;
  }
  // O feed manda: o que está no Instagram está publicado, venha de onde vier. Um post feito
  // pelo celular quase nunca cai no minuto agendado, então vale a janela de 30 min.
  for (const f of feed) {
    if (!dentro(f.quando)) continue;
    const alvo = new Date(f.quando).getTime();
    const perto = [...itens.values()].find(i => Math.abs(new Date(i.quando).getTime() - alvo) <= 30 * 60000);
    const i = perto || item(f.quando);
    if (!i.texto) i.texto = f.texto || '';
    if (!i.formato) i.formato = f.tipo || '';
    i.ig = { estado: 'publicado', onde: `${f.curtidas} curtidas · ${f.comentarios} coment.` };
    i.link = f.link || null;
  }

  const lista = [...itens.values()].sort((a, b) => a.chave.localeCompare(b.chave));
  for (const i of lista) {
    const futuro = i.quando > agora;
    for (const c of ['ig', 'fb', 'tt']) {
      if (!i[c]) i[c] = { estado: futuro ? 'não vai' : 'não saiu', onde: futuro ? 'sem agendamento' : '' };
    }
    i.titulo = titulo(i.texto);
    i.passado = !futuro;
  }
  return lista;
}

/** Resumo e alertas que o cabeçalho da página mostra. */
export function resumir(lista, agora) {
  const vivos = ['publicado', 'agendado'];
  const completos = lista.filter(i => ['ig', 'fb', 'tt'].every(c => vivos.includes(i[c].estado))).length;
  const semEspelho = lista.filter(i => i.quando > agora && ['fb', 'tt'].some(c => i[c].estado === 'não vai'));
  const rascunhos = lista.filter(i => i.ig.estado === 'rascunho');
  return {
    total: lista.length,
    completos,
    semEspelho: semEspelho.map(i => ({ quando: i.quando, titulo: titulo(i.texto, 46) })),
    rascunhos: rascunhos.map(i => ({ quando: i.quando, titulo: titulo(i.texto, 46) })),
  };
}

export function criarLeitorConteudo(env = process.env, fetchFn = fetch) {
  const postizChave = env.POSTIZ_API_KEY || '';
  const postizUrl = (env.POSTIZ_API_URL || POSTIZ_PADRAO).replace(/\/$/, '');
  const bufferChave = env.BUFFER_API_KEY || '';
  const n8nUrl = (env.N8N_BASE_URL || '').replace(/\/$/, '');
  const n8nChave = env.N8N_API_KEY || '';

  async function json(url, opcoes, qual) {
    const r = await fetchFn(url, { ...opcoes, signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new PublicError(`${qual} respondeu ${r.status}.`, 502);
    return r.json();
  }

  return {
    configurado: Boolean(postizChave || bufferChave),
    temPostiz: Boolean(postizChave),
    temBuffer: Boolean(bufferChave),
    temFeed: Boolean(n8nUrl && n8nChave),

    async postiz(inicio, fim) {
      if (!postizChave) return null;
      const u = `${postizUrl}/posts?startDate=${encodeURIComponent(inicio)}&endDate=${encodeURIComponent(fim)}`;
      const d = await json(u, { headers: { Authorization: postizChave } }, 'O Postiz');
      return Array.isArray(d) ? d : (d.posts || []);
    },

    async buffer(inicio, fim) {
      if (!bufferChave) return null;
      const q = `query($o: OrganizationId!, $s: [PostStatus!]) { posts(input: {organizationId: $o, filter: {status: $s}}, first: 100) {
        edges { node { id dueAt status channelService text externalLink assets { mimeType } } } } }`;
      const saida = [];
      for (const status of [['scheduled'], ['sent']]) {
        const d = await json(BUFFER_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + bufferChave },
          body: JSON.stringify({ query: q, variables: { o: BUFFER_ORG, s: status } }),
        }, 'O Buffer');
        if (d.errors) throw new PublicError('O Buffer recusou a consulta.', 502);
        for (const e of d.data?.posts?.edges || []) {
          const n = e.node;
          if (String(n.externalLink || '').includes('/stories/')) continue; // story não é feed
          if (n.dueAt >= inicio && n.dueAt <= fim) saida.push(n);
        }
      }
      return saida;
    },

    async feed(inicio) {
      if (!n8nUrl || !n8nChave) return null;
      const linhas = await json(`${n8nUrl}/api/v1/data-tables/6hKEI6aADTIAAf4B/rows?limit=50`,
        { headers: { 'X-N8N-API-KEY': n8nChave } }, 'O n8n');
      const cfg = Object.fromEntries((linhas.data || []).map(x => [x.config_key, x.value]));
      if (!cfg.access_token || !cfg.ig_user_id) throw new PublicError('O n8n não tem o token do Instagram.', 502);
      const campos = 'media_product_type,media_type,permalink,timestamp,like_count,comments_count,caption';
      const d = await json(`https://graph.facebook.com/v25.0/${cfg.ig_user_id}/media?fields=${campos}&limit=50`,
        { headers: { Authorization: 'Bearer ' + cfg.access_token } }, 'O Instagram');
      return (d.data || [])
        .filter(p => p.timestamp >= inicio && p.media_product_type !== 'STORY')
        .map(p => ({
          quando: new Date(p.timestamp).toISOString(),
          tipo: p.media_product_type === 'REELS' ? 'Reels' : (p.media_type === 'CAROUSEL_ALBUM' ? 'carrossel' : 'post'),
          curtidas: p.like_count ?? 0,
          comentarios: p.comments_count ?? 0,
          texto: p.caption || '',
          link: p.permalink || null,
        }));
    },
  };
}

export function criarServicoConteudo(leitor = criarLeitorConteudo(), agora = () => Date.now()) {
  let cache = null;
  const VALIDADE = 5 * 60000;

  return {
    async painel(forcar = false) {
      if (!leitor?.configurado) throw new PublicError('O painel de conteúdo ainda não está ligado: falta a chave do Postiz ou do Buffer.', 503);
      if (!forcar && cache && agora() - cache.em < VALIDADE) return cache.dados;

      const hoje = new Date(agora() + TZ_MIN * 60000);
      const inicioBrt = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate()));
      const inicio = new Date(inicioBrt.getTime() - TZ_MIN * 60000).toISOString();
      const fim = new Date(inicioBrt.getTime() - TZ_MIN * 60000 + (DIAS + 1) * 86400000 - 60000).toISOString();

      // Uma fonte sem chave devolve null sem erro; sem este aviso o painel simplesmente não
      // mostraria aquela rede, e quem olha acharia que não há nada agendado.
      const falhas = [];
      if (!leitor.temPostiz) falhas.push('Instagram (Postiz): a chave não está configurada, então nenhum post do Instagram aparece aqui.');
      if (!leitor.temBuffer) falhas.push('Facebook e TikTok (Buffer): a chave não está configurada, então as duas redes aparecem sempre como "não vai".');
      if (!leitor.temFeed) falhas.push('Feed do Instagram: o n8n não está configurado, então um post feito pelo celular aparece como "não saiu".');

      const tentar = async (qual, fn) => {
        try { return await fn(); }
        catch (e) { falhas.push(`${qual}: ${e instanceof PublicError ? e.message : 'não respondeu agora.'}`); return null; }
      };
      const [postiz, buffer, feed] = await Promise.all([
        tentar('Instagram (Postiz)', () => leitor.postiz(inicio, fim)),
        tentar('Facebook e TikTok (Buffer)', () => leitor.buffer(inicio, fim)),
        tentar('Feed do Instagram', () => leitor.feed(inicio)),
      ]);

      const agoraIso = new Date(agora()).toISOString();
      const lista = montarConteudo({ postiz: postiz || [], buffer: buffer || [], feed: feed || [], agora: agoraIso, inicio, fim });
      const dados = {
        atualizadoEm: agoraIso, inicio, fim, dias: DIAS + 1,
        posts: lista, resumo: resumir(lista, agoraIso),
        fontes: { postiz: postiz !== null, buffer: buffer !== null, feed: feed !== null },
        avisos: falhas,
      };
      cache = { em: agora(), dados };
      return dados;
    },
  };
}
