import http from 'node:http';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import serveHandler from 'serve-handler';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { clickupClient, createService, PublicError } from './fortalecimento.mjs';
import { criarServicoAvaliacao, criarUploader } from './avaliacao-forca.mjs';

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
export function createServer(env = process.env, service = createService(clickupClient(env.CLICKUP_API_TOKEN)), avaliacao = criarServicoAvaliacao(clickupClient(env.CLICKUP_API_TOKEN), criarUploader(env.CLICKUP_API_TOKEN))) {
  const origin = env.PORTAL_ORIGIN || 'http://localhost:8080';
  const secure = origin.startsWith('https://');
  const secret = env.PORTAL_SESSION_SECRET || '';
  let users = {}; try { users = JSON.parse(env.PORTAL_USERS_JSON || '{}'); } catch { /* fail closed */ }
  const ready = secret.length >= 32 && env.CLICKUP_API_TOKEN && users && typeof users === 'object' && Object.keys(users).length > 0 && Object.values(users).every(hash => typeof hash === 'string' && /^[a-f0-9]{32}:[a-f0-9]{64}$/.test(hash));
  const sign = x => createHmac('sha256', secret).update(x).digest('base64url');
  const cookie = (value, age) => `carefit_session=${value}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=${age}${secure ? '; Secure' : ''}`;
  const attempts = new Map();
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
      if (url.pathname === '/healthz') return send(200, { ok: true });
      const prefixo = ['/api/fortalecimento/', '/api/avaliacao-forca/'].find(p => url.pathname.startsWith(p));
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
        if (route === 'session' && req.method === 'GET') return send(200, { user });
        if (route === 'logout' && req.method === 'POST') { res.setHeader('Set-Cookie', cookie('', 0)); return send(200, { ok: true }); }
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
        const athlete = /^athletes\/([a-zA-Z0-9_-]+)$/.exec(route);
        if (athlete && req.method === 'GET') return send(200, await service.athlete(athlete[1]));
        const mutation = /^(athletes|classes)\/([a-zA-Z0-9_-]+)\/(workout|select|complete)$/.exec(route);
        if (mutation && req.method === 'POST') {
          const input = await body(req);
          if (!/^[0-9a-f-]{36}$/.test(input.requestId || '')) throw new PublicError('Identificador da operação inválido.');
          const [, type, id, action] = mutation;
          if (type === 'athletes' && action === 'workout') return send(200, await service.saveWorkout(id, input, user));
          if (type === 'classes' && action === 'select') return send(200, await service.selectWorkout(id, input, user));
          if (type === 'classes' && action === 'complete') return send(200, await service.complete(id, input, user));
        }
        throw new PublicError('Página não encontrada.', 404);
      }
      if (!['GET', 'HEAD'].includes(req.method)) return send(405, { error: 'Método não permitido.' });
      res.setHeader('X-Content-Type-Options', 'nosniff');
      if (url.pathname === '/painel-fortalecimento' || url.pathname === '/painel-avaliacao-forca') { res.setHeader('X-Robots-Tag', 'noindex, nofollow'); res.setHeader('X-Frame-Options', 'DENY'); }

      // Rotas que circulam em mensagem devolvem o index.html com o preview
      // reescrito (ver PREVIEWS no topo). Se o dist ainda não existe, segue o
      // fluxo normal em vez de derrubar a página.
      const preview = PREVIEWS[url.pathname];
      if (preview) {
        const base = await paginaBase();
        if (base) {
          const publico = new URL(url.pathname, `https://${req.headers.host || 'www.carefitrunbase.com.br'}`);
          const html = comPreview(base, preview, publico);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
          return res.end(req.method === 'HEAD' ? undefined : html);
        }
      }
      // Same static engine previously used by `serve -s`, including range requests.
      await serveHandler(req, res, { public: 'dist', rewrites: [{ source: '**', destination: '/index.html' }], directoryListing: false, headers: [{ source: '**', headers: [{ key: 'Cache-Control', value: 'no-cache' }] }, { source: 'assets/**', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }] });
    } catch (e) { if (!res.headersSent) send(e instanceof PublicError ? e.status : 500, { error: e instanceof PublicError ? e.message : 'Não foi possível concluir. Atualize e tente novamente.' }); else res.end(); }
  });
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) createServer().listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('CareFit server ready'));
