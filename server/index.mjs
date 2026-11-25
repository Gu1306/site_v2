import http from 'node:http';
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import serveHandler from 'serve-handler';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { clickupClient, createService, dayOf, PublicError, PANEL_REVISIONS } from './fortalecimento.mjs';
import { montarEquipe, validarMes } from './equipe.mjs';
import { montarCarteira } from './carteira.mjs';
import { criarLeitorConversas, criarServicoConversas } from './conversas.mjs';
import { montarTexto } from './resumo.mjs';
import { criarLeitorAgenda } from './agenda.mjs';
import { criarServicoAvaliacao, criarUploader } from './avaliacao-forca.mjs';
import { criarServicoFechamento } from './fechamento.mjs';
import { criarLeitorConteudo, criarServicoConteudo } from './conteudo.mjs';
import { criarClienteAgenda, criarEnviadorWhatsapp, criarServicoApp, criarSessoes, LIMITES as LIMITES_APP } from './app-atleta.mjs';

/*
 * Preview de link por rota.
 *
 * O robô do WhatsApp (e o do Facebook, e o do LinkedIn) NÃO roda JavaScript:
 * ele lê o HTML cru que o servidor devolve. Como o site é uma SPA, toda rota
 * recebe o mesmo `index.html` — então o preview de qualquer link caía na imagem
 * e no título genéricos do site. O `useSeo` conserta a aba do navegador, mas
 * chega tarde demais para o robô, que já foi embora com o HTML original.
 *
 * As rotas abaixo circulam em mensagem para atleta, então ganham preview
 * próprio, reescrito na resposta. Para incluir outra rota, é só acrescentar
 * aqui — nada mais precisa mudar.
 */
/**
 * Páginas que saíram do ar (25/11/2026) e para onde o endereço antigo leva,
 * com 301. /historia era a cópia antiga da /nossa-historia, com a equipe de
 * 2024; nutrição não é mais serviço da CareFit; /jornada ("Ciclo Completo")
 * vendia o programa de 12 semanas a R$ 5.400, que deu lugar ao Ciclo e à
 * Temporada do /planos. /comunidade-carefit descrevia grupos de WhatsApp e
 * embaixadores que nunca existiram (decisão do Gustavo, 25/11/2026).
 */
const PAGINAS_MOVIDAS = {
  '/historia': '/nossa-historia',
  '/nutricao-para-corredores-ribeirao-preto': '/',
  '/jornada': '/planos',
  '/comunidade-carefit': '/',
};

const PREVIEWS = {
  '/ficha': {
    titulo: 'Ficha pré-aula — Fortalecimento CareFit',
    descricao: 'Dois minutos para o professor montar a sua ficha e decidir com qual treino você começa.',
    imagem: '/og-fortalecimento.jpg',
    alt: 'Área de fortalecimento da CareFit Run Base',
  },
  '/agendamento-fortalecimento': {
    titulo: 'Agendar aula de fortalecimento — CareFit Run Base',
    descricao: 'Escolha o dia e o horário da sua aula de fortalecimento para corredores, em Ribeirão Preto.',
    imagem: '/og-fortalecimento.jpg',
    alt: 'Área de fortalecimento da CareFit Run Base',
  },
  '/primeira-sessao': {
    titulo: 'Escolha seu atendimento | CareFit Run Base',
    descricao: 'Primeira Sessão Dupla por R$ 230 ou avaliação de reabilitação por R$ 180. Escolha seu atendimento e veja os horários.',
    imagem: '/og-image.jpg',
    alt: 'CareFit Run Base',
  },
  '/primeira-sessao?servico=dupla': {
    titulo: 'Agendar Primeira Sessão Dupla | CareFit Run Base',
    descricao: 'Dois encontros por R$ 230: primeira sessão de 80 minutos e retorno de 1h incluído em até 15 dias.',
    imagem: '/og-image.jpg',
    alt: 'CareFit Run Base',
  },
  '/primeira-sessao?servico=reabilitacao': {
    titulo: 'Agendar avaliação de reabilitação | CareFit Run Base',
    descricao: 'Avaliação de 80 minutos com fisioterapeuta por R$ 180. Escolha entre Igor e Lais e veja os horários disponíveis.',
    imagem: '/og-image.jpg',
    alt: 'CareFit Run Base',
  },
  '/conheca-a-carefit': {
    titulo: 'Primeira Sessão Dupla | CareFit Run Base',
    descricao: 'Entenda o que seu corpo precisa para seguir correndo. Dois encontros por R$ 230, com retorno incluído em até 15 dias.',
    imagem: '/og-image.jpg',
    alt: 'CareFit Run Base',
  },
  '/lp/fisioterapia-ribeirao-preto': {
    titulo: 'Avaliação de reabilitação em Ribeirão Preto | CareFit',
    descricao: 'A dor está limitando sua corrida? Avaliação de 80 minutos com fisioterapeuta e proposta de tratamento por R$ 180.',
    imagem: '/og-image.jpg',
    alt: 'CareFit Run Base',
  },
  '/links': {
    titulo: 'CareFit Run Base | Links',
    descricao: 'Agende, reserve yoga e fortalecimento, conheça o Ice Mind e fale com a CareFit Run Base, em Ribeirão Preto.',
    imagem: '/og-image.jpg',
    alt: 'CareFit Run Base',
  },
  '/app': {
    titulo: 'CareFit | Minhas aulas',
    descricao: 'Reserve e cancele suas aulas de fortalecimento e yoga na CareFit Run Base, direto pelo celular.',
    imagem: '/og-image.jpg',
    alt: 'CareFit Run Base',
  },
  '/agendamento-yoga': {
    titulo: 'Agendar aula de yoga — CareFit Run Base',
    descricao: 'Yoga às terças e quintas, das 6h às 7h, em Ribeirão Preto. Escolha o dia e reserve sua vaga.',
    imagem: '/og-fortalecimento.jpg',
    alt: 'CareFit Run Base',
  },
};

/** `dist/index.html` só muda em deploy, então lê uma vez e guarda. */
let htmlBase;
async function paginaBase() {
  if (htmlBase === undefined) htmlBase = await readFile(path.join('dist', 'index.html'), 'utf8').catch(() => null);
  return htmlBase;
}

const escapar = texto => String(texto).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function comPreview(html, preview, url) {
  const troca = (padrao, valor) => { html = html.replace(padrao, (_, prefixo) => prefixo + escapar(valor)); };
  const titulo = escapar(preview.titulo);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${titulo}</title>`);
  troca(/(<meta name="description" content=")[^"]*/, preview.descricao);
  troca(/(<meta property="og:title" content=")[^"]*/, preview.titulo);
  troca(/(<meta property="og:description" content=")[^"]*/, preview.descricao);
  troca(/(<meta property="og:url" content=")[^"]*/, url.href);
  troca(/(<meta property="og:image" content=")[^"]*/, new URL(preview.imagem, url).href);
  troca(/(<meta property="og:image:alt" content=")[^"]*/, preview.alt);
  troca(/(<meta name="twitter:title" content=")[^"]*/, preview.titulo);
  troca(/(<meta name="twitter:description" content=")[^"]*/, preview.descricao);
  troca(/(<meta name="twitter:image" content=")[^"]*/, new URL(preview.imagem, url).href);
  // O canonical do index.html aponta para a home; numa rota própria isso diz ao
  // Google que a página não existe por si.
  html = html.replace(/(<link rel="canonical" href=")[^"]*/, (_, p) => p + escapar(url.href));
  return html;
}

export function passwordHash(password, salt = randomBytes(16).toString('hex')) { return `${salt}:${scryptSync(password, salt, 32).toString('hex')}`; }
function equal(a, b) { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
export function createServer(env = process.env, service = createService(clickupClient(env.CLICKUP_API_TOKEN)), avaliacao = criarServicoAvaliacao(clickupClient(env.CLICKUP_API_TOKEN), criarUploader(env.CLICKUP_API_TOKEN)), fechamento = criarServicoFechamento(clickupClient(env.CLICKUP_API_TOKEN), () => Date.now(), criarLeitorAgenda(env)), conversas = criarServicoConversas(criarLeitorConversas(env)), conteudo = criarServicoConteudo(criarLeitorConteudo(env)), app = criarServicoApp({ fechamento, api: clickupClient(env.CLICKUP_API_TOKEN), agenda: criarClienteAgenda(env), whatsapp: criarEnviadorWhatsapp(env) })) {
  const origin = env.PORTAL_ORIGIN || 'http://localhost:8080';
  // Quem vê o financeiro. O login é o mesmo da equipe; o Lucas entra no fortalecimento
  // e não enxerga produção nem bônus. Sem a variável, só o Gustavo.
  const financeiro = new Set(String(env.PORTAL_FINANCEIRO_USERS ?? 'gustavo').split(',').map(u => u.trim().toLowerCase()).filter(Boolean));
  const secure = origin.startsWith('https://');
  const secret = env.PORTAL_SESSION_SECRET || '';
  let users = {}; try { users = JSON.parse(env.PORTAL_USERS_JSON || '{}'); } catch { /* fail closed */ }
  const ready = secret.length >= 32 && env.CLICKUP_API_TOKEN && users && typeof users === 'object' && Object.keys(users).length > 0 && Object.values(users).every(hash => typeof hash === 'string' && /^[a-f0-9]{32}:[a-f0-9]{64}$/.test(hash));
  const sign = x => createHmac('sha256', secret).update(x).digest('base64url');
  const cookie = (value, age) => `carefit_session=${value}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=${age}${secure ? '; Secure' : ''}`;
  const attempts = new Map();
  // Sessão do ATLETA (/app): outro cookie, outra assinatura. Nunca abre os painéis da equipe.
  const sessoesAtleta = criarSessoes(secret);
  const cookieAtleta = (value, age) => `carefit_atleta=${value}; HttpOnly; SameSite=Strict; Path=/api/app; Max-Age=${age}${secure ? '; Secure' : ''}`;
  const sessaoAtleta = req => sessoesAtleta.ler(/(?:^|;\s*)carefit_atleta=([^;]+)/.exec(req.headers.cookie || '')?.[1] || '');
  function session(req) {
    const raw = /(?:^|;\s*)carefit_session=([^;]+)/.exec(req.headers.cookie || '')?.[1] || '';
    const [payload, sig] = raw.split('.');
    if (!payload || !sig || !equal(sig, sign(payload))) return null;
    try { const data = JSON.parse(Buffer.from(payload, 'base64url')); return data.exp > Date.now() && Object.hasOwn(users, data.user) && data.version === sign(users[data.user]) ? data.user : null; } catch { return null; }
  }
  async function body(req, limite = 50000) {
    let size = 0; const chunks = [];
    for await (const chunk of req) { size += chunk.length; if (size > limite) throw new PublicError('Conteúdo muito grande.', 413); chunks.push(chunk); }
    try { return JSON.parse(Buffer.concat(chunks).toString()); } catch { throw new PublicError('Conteúdo inválido.'); }
  }
  return http.createServer(async (req, res) => {
    const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(data)); };
    try {
      const url = new URL(req.url, 'http://localhost');
      // Produto ainda indisponível; preservar o endereço sem oferecer contratação.
      if (url.pathname.replace(/\/+$/, '') === '/biomecanica-da-corrida-ribeirao-preto') {
        res.writeHead(302, { Location: '/servicos', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' });
        return res.end();
      }
      // Páginas que saíram do ar em vez de ficarem com conteúdo velho: o endereço
      // antigo (busca, link salvo) cai na página que vale hoje.
      const destinoPermanente = PAGINAS_MOVIDAS[url.pathname.replace(/\/+$/, '')];
      if (destinoPermanente) {
        res.writeHead(301, { Location: destinoPermanente + url.search });
        return res.end();
      }
      if (url.pathname === '/healthz') return send(200, { ok: true });

      /*
       * Resumo da operação em texto, para o n8n buscar e mandar no WhatsApp do
       * dono. Fica FORA de /api/gestao/ de propósito: não usa a sessão da
       * equipe, e sim um token próprio no cabeçalho `Authorization: Bearer`.
       *
       * Só devolve o texto que já vai para o WhatsApp — contagens, primeiros
       * nomes da fila e os avisos. Sem telefone, sem conversa, sem nada
       * clínico. Sem RESUMO_TOKEN configurado, a porta fica fechada (503).
       */
      if (url.pathname === '/api/resumo') {
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        if (req.method !== 'GET') return send(405, { error: 'Método não permitido.' });
        const esperado = String(env.RESUMO_TOKEN || '');
        if (esperado.length < 32) throw new PublicError('O resumo ainda não foi configurado.', 503);
        // Hash dos dois lados: compara em tempo constante sem vazar o tamanho.
        const recebido = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '')?.[1]?.trim() || '';
        const digerir = texto => createHash('sha256').update(texto).digest();
        if (!recebido || !timingSafeEqual(digerir(recebido), digerir(esperado))) throw new PublicError('Não autorizado.', 401);
        const hoje = dayOf(Date.now());
        const [{ atletas }, listas] = await Promise.all([fechamento.atletas(), fechamento.listas()]);
        let whatsapp = null;
        try { whatsapp = await conversas.fila(atletas); } catch { whatsapp = null; }
        const texto = montarTexto({ hoje, carteira: montarCarteira(atletas, hoje), whatsapp, equipe: montarEquipe(listas, hoje.slice(0, 7), hoje) });
        return send(200, { hoje, texto, whatsapp: Boolean(whatsapp) });
      }
      /*
       * App do atleta. Login por código no WhatsApp; o atleta só enxerga o que é dele.
       * `reserva` e `cancelar` são públicas de propósito: o link de cancelamento do
       * e-mail precisa funcionar sem login, e o token do link já é a autorização.
       */
      if (url.pathname.startsWith('/api/app/')) {
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.setHeader('X-Frame-Options', 'DENY');
        if (secret.length < 32 || !env.CLICKUP_API_TOKEN) throw new PublicError('O app ainda não foi configurado.', 503);
        if (req.method !== 'GET' && (req.headers.origin !== origin || !req.headers['content-type']?.startsWith('application/json'))) throw new PublicError('Reabra o app pelo endereço oficial.', 403);
        const rota = url.pathname.slice('/api/app/'.length);
        if (rota === 'codigo' && req.method === 'POST') return send(200, await app.pedirCodigo((await body(req)).telefone));
        if (rota === 'entrar' && req.method === 'POST') {
          const entrada = await body(req);
          const quem = await app.confirmarCodigo(entrada.telefone, entrada.codigo);
          res.setHeader('Set-Cookie', cookieAtleta(sessoesAtleta.emitir(quem.atletaId, quem.tel8), Math.floor(LIMITES_APP.sessaoMs / 1000)));
          return send(200, { ok: true });
        }
        if (rota === 'sair' && req.method === 'POST') { res.setHeader('Set-Cookie', cookieAtleta('', 0)); return send(200, { ok: true }); }
        if (rota === 'reserva' && req.method === 'GET') return send(200, await app.detalhe(url.searchParams.get('m') || '', url.searchParams.get('t') || ''));
        if (rota === 'cancelar' && req.method === 'POST') { const entrada = await body(req); return send(200, await app.cancelar(entrada.modalidade, entrada.token)); }
        if (rota === 'inicio' && req.method === 'GET') return send(200, await app.inicio(sessaoAtleta(req)));
        if (rota === 'reservar' && req.method === 'POST') return send(200, await app.reservar(sessaoAtleta(req), await body(req)));
        throw new PublicError('Página não encontrada.', 404);
      }
      const prefixo = ['/api/fortalecimento/', '/api/avaliacao-forca/', '/api/gestao/'].find(p => url.pathname.startsWith(p));
      if (prefixo) {
        res.setHeader('X-Frame-Options', 'DENY');
        if (!ready) throw new PublicError('O painel está aguardando a configuração de acesso da equipe.', 503);
        if (req.method !== 'GET' && (req.headers.origin !== origin || !req.headers['content-type']?.startsWith('application/json'))) throw new PublicError('Reabra o painel pelo endereço oficial.', 403);
        const route = url.pathname.slice(prefixo.length);
        if (route === 'login' && req.method === 'POST') {
          // Per-account limits also cover deployments behind a trusted reverse proxy.
          const input = await body(req); const user = String(input.user || '').toLowerCase();
          const key = Object.hasOwn(users, user) ? user : 'unknown'; const now = Date.now();
          for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
          const limit = attempts.get(key) || { count: 0, until: now + 15 * 60000 };
          if (limit.count >= 10) throw new PublicError('Muitas tentativas. Aguarde 15 minutos.', 429);
          limit.count++; attempts.set(key, limit);
          const hash = Object.hasOwn(users, user) ? users[user] : passwordHash('invalid-password', 'invalid');
          const salt = hash.split(':')[0];
          if (typeof input.password !== 'string' || input.password.length > 256 || !Object.hasOwn(users, user) || !equal(passwordHash(input.password, salt), hash)) throw new PublicError('Usuário ou senha incorretos.', 401);
          attempts.delete(key);
          const payload = Buffer.from(JSON.stringify({ user, exp: now + 12 * 3600000, version: sign(hash), nonce: randomBytes(12).toString('hex') })).toString('base64url');
          res.setHeader('Set-Cookie', cookie(`${payload}.${sign(payload)}`, 12 * 3600)); return send(200, { user });
        }
        const user = session(req); if (!user) throw new PublicError('Entre com seu acesso da equipe.', 401);
        if (route === 'session' && req.method === 'GET') return send(200, prefixo === '/api/gestao/' ? { user, financeiro: financeiro.has(user) } : { user });
        if (route === 'logout' && req.method === 'POST') { res.setHeader('Set-Cookie', cookie('', 0)); return send(200, { ok: true }); }
        if (prefixo === '/api/gestao/') {
          if (!financeiro.has(user)) throw new PublicError('Seu acesso não inclui o financeiro da CareFit.', 403);
          if (route === 'fechamento' && req.method === 'GET') return send(200, await fechamento.semana(url.searchParams.get('semana') || '', url.searchParams.get('atualizar') === '1'));
          if (route === 'campanha' && req.method === 'GET') return send(200, await fechamento.campanha(url.searchParams.get('atualizar') === '1'));
          if (route === 'operacao' && req.method === 'GET') {
            const forcar = url.searchParams.get('atualizar') === '1';
            const hoje = dayOf(Date.now());
            const { atletas, lidoEm } = await fechamento.atletas(forcar);
            // O WhatsApp é opcional: sem configuração ou fora do ar, a carteira sai do mesmo jeito.
            let whatsapp = null; let whatsappErro = null;
            try { whatsapp = await conversas.fila(atletas, forcar); }
            catch (e) { whatsappErro = e instanceof PublicError ? e.message : 'O WhatsApp não respondeu agora.'; }
            return send(200, { hoje, atualizadoEm: new Date(lidoEm).toISOString(), carteira: montarCarteira(atletas, hoje), whatsapp, whatsappErro });
          }
          if (route === 'conteudo' && req.method === 'GET') return send(200, await conteudo.painel(url.searchParams.get('atualizar') === '1'));
          if (route === 'equipe' && req.method === 'GET') {
            const hoje = dayOf(Date.now());
            const mes = validarMes(url.searchParams.get('mes') || '', hoje);
            const listas = await fechamento.listas(url.searchParams.get('atualizar') === '1');
            return send(200, montarEquipe(listas, mes, hoje, new Date(listas.lidoEm).toISOString()));
          }
          throw new PublicError('Página não encontrada.', 404);
        }
        if (prefixo === '/api/avaliacao-forca/') {
          if (route === 'atletas' && req.method === 'GET') return send(200, await avaliacao.atletas());
          const historico = /^atletas\/([a-zA-Z0-9_-]+)\/historico$/.exec(route);
          if (historico && req.method === 'GET') return send(200, await avaliacao.historicoDe(historico[1]));
          const registro = /^atletas\/([a-zA-Z0-9_-]+)\/avaliacoes$/.exec(route);
          // O Excel viaja em base64 dentro do JSON, por isso o limite maior aqui.
          if (registro && req.method === 'POST') return send(200, await avaliacao.salvar(registro[1], await body(req, 6000000), user));
          throw new PublicError('Página não encontrada.', 404);
        }
        if (route === 'agenda' && req.method === 'GET') return send(200, await service.agenda(url.searchParams.get('day') || ''));
        if (route === 'athletes' && req.method === 'GET') return send(200, await service.athletes());
        if (route === 'checkouts' && req.method === 'GET') return send(200, await service.checkouts());
        const athlete = /^athletes\/([a-zA-Z0-9_-]+)$/.exec(route);
        if (athlete && req.method === 'GET') return send(200, await service.athlete(athlete[1], PANEL_REVISIONS));
        const mutation = /^(athletes|classes)\/([a-zA-Z0-9_-]+)\/(workout|select|complete|checkout-generate|checkout-send)$/.exec(route);
        if (mutation && req.method === 'POST') {
          const input = await body(req);
          if (!/^[0-9a-f-]{36}$/.test(input.requestId || '')) throw new PublicError('Identificador da operação inválido.');
          const [, type, id, action] = mutation;
          if (type === 'athletes' && action === 'workout') return send(200, await service.saveWorkout(id, input, user));
          if (type === 'classes' && action === 'select') return send(200, await service.selectWorkout(id, input, user));
          if (type === 'classes' && action === 'complete') return send(200, await service.complete(id, input, user));
          if (type === 'classes' && action === 'checkout-generate') return send(200, await service.checkoutGenerate(id, input));
          if (type === 'classes' && action === 'checkout-send') return send(200, await service.checkoutSend(id, input));
        }
        throw new PublicError('Página não encontrada.', 404);
      }
      if (!['GET', 'HEAD'].includes(req.method)) return send(405, { error: 'Método não permitido.' });
      res.setHeader('X-Content-Type-Options', 'nosniff');
      // Área logada e link pessoal de cancelamento: fora da busca.
      if (url.pathname === '/app' || url.pathname === '/cancelar-aula') res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      if (url.pathname === '/painel-fortalecimento' || url.pathname === '/painel-avaliacao-forca' || url.pathname === '/gestao' || url.pathname.startsWith('/gestao/')) { res.setHeader('X-Robots-Tag', 'noindex, nofollow'); res.setHeader('X-Frame-Options', 'DENY'); }

      // A home é a do React (src/pages/Index.tsx), servida pelo index.html como
      // as demais rotas. A home estática anterior (jornada-home.html) segue no
      // repositório, fora do ar; o endereço antigo dela redireciona para cá.
      if (url.pathname === '/jornada-home.html') {
        res.writeHead(301, { Location: '/' + url.search });
        return res.end();
      }

      // Rotas que circulam em mensagem devolvem o index.html com o preview
      // reescrito (ver PREVIEWS no topo). Se o dist ainda não existe, segue o
      // fluxo normal em vez de derrubar a página.
      const servico = url.pathname === '/primeira-sessao' && ['dupla', 'reabilitacao'].includes(url.searchParams.get('servico')) ? url.searchParams.get('servico') : null;
      const preview = PREVIEWS[servico ? `${url.pathname}?servico=${servico}` : url.pathname];
      if (preview) {
        const base = await paginaBase();
        if (base) {
          const publico = new URL(url.pathname, `https://${req.headers.host || 'www.carefitrunbase.com.br'}`);
          if (servico) publico.searchParams.set('servico', servico);
          if (url.pathname.startsWith('/lp/')) res.setHeader('X-Robots-Tag', 'noindex');
          const html = comPreview(base, preview, publico);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
          return res.end(req.method === 'HEAD' ? undefined : html);
        }
      }
      // Same static engine previously used by `serve -s`, including range requests.
      await serveHandler(req, res, { public: 'dist', rewrites: [{ source: '**', destination: '/index.html' }], directoryListing: false, headers: [{ source: '**', headers: [{ key: 'Cache-Control', value: 'no-cache' }] }, { source: 'assets/**', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }] });
    } catch (e) { if (!res.headersSent) send(e instanceof PublicError ? e.status : 500, { error: e instanceof PublicError ? e.message : 'Não foi possível concluir. Atualize e tente novamente.', ...(e instanceof PublicError && e.codigo ? { codigo: e.codigo } : {}) }); else res.end(); }
  });
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) createServer().listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('CareFit server ready'));
