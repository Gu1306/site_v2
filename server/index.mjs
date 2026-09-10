import http from 'node:http';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import serveHandler from 'serve-handler';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { clickupClient, createService, PublicError } from './fortalecimento.mjs';

export function passwordHash(password, salt = randomBytes(16).toString('hex')) { return `${salt}:${scryptSync(password, salt, 32).toString('hex')}`; }
function equal(a, b) { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
export function createServer(env = process.env, service = createService(clickupClient(env.CLICKUP_API_TOKEN))) {
  const origin = env.PORTAL_ORIGIN || 'http://localhost:8080';
  const secure = origin.startsWith('https://');
  const secret = env.PORTAL_SESSION_SECRET || '';
  let users = {}; try { users = JSON.parse(env.PORTAL_USERS_JSON || '{}'); } catch { /* fail closed */ }
  const ready = secret.length >= 32 && env.CLICKUP_API_TOKEN && users && typeof users === 'object' && Object.keys(users).length > 0 && Object.values(users).every(hash => typeof hash === 'string' && /^[a-f0-9]{32}:[a-f0-9]{64}$/.test(hash));
  const sign = x => createHmac('sha256', secret).update(x).digest('base64url');
  const cookie = (value, age) => `carefit_session=${value}; HttpOnly; SameSite=Strict; Path=/api/fortalecimento; Max-Age=${age}${secure ? '; Secure' : ''}`;
  const attempts = new Map();
  function session(req) {
    const raw = /(?:^|;\s*)carefit_session=([^;]+)/.exec(req.headers.cookie || '')?.[1] || '';
    const [payload, sig] = raw.split('.');
    if (!payload || !sig || !equal(sig, sign(payload))) return null;
    try { const data = JSON.parse(Buffer.from(payload, 'base64url')); return data.exp > Date.now() && Object.hasOwn(users, data.user) && data.version === sign(users[data.user]) ? data.user : null; } catch { return null; }
  }
  async function body(req) {
    let size = 0; const chunks = [];
    for await (const chunk of req) { size += chunk.length; if (size > 50000) throw new PublicError('Conteúdo muito grande.', 413); chunks.push(chunk); }
    try { return JSON.parse(Buffer.concat(chunks).toString()); } catch { throw new PublicError('Conteúdo inválido.'); }
  }
  return http.createServer(async (req, res) => {
    const send = (status, data) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(data)); };
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/healthz') return send(200, { ok: true });
      if (url.pathname.startsWith('/api/fortalecimento/')) {
        res.setHeader('X-Frame-Options', 'DENY');
        if (!ready) throw new PublicError('O painel está aguardando a configuração de acesso da equipe.', 503);
        if (req.method !== 'GET' && (req.headers.origin !== origin || !req.headers['content-type']?.startsWith('application/json'))) throw new PublicError('Reabra o painel pelo endereço oficial.', 403);
        const route = url.pathname.slice('/api/fortalecimento/'.length);
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
      if (url.pathname === '/painel-fortalecimento') { res.setHeader('X-Robots-Tag', 'noindex, nofollow'); res.setHeader('X-Frame-Options', 'DENY'); }
      // Same static engine previously used by `serve -s`, including range requests.
      await serveHandler(req, res, { public: 'dist', rewrites: [{ source: '**', destination: '/index.html' }], directoryListing: false, headers: [{ source: '**', headers: [{ key: 'Cache-Control', value: 'no-cache' }] }, { source: 'assets/**', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }] });
    } catch (e) { if (!res.headersSent) send(e instanceof PublicError ? e.status : 500, { error: e instanceof PublicError ? e.message : 'Não foi possível concluir. Atualize e tente novamente.' }); else res.end(); }
  });
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) createServer().listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('CareFit server ready'));
