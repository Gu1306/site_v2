// Leitura da agenda CAREFIT RUN BASE (Google Agenda, calendarId gustavo@carefitrunbase.com.br)
// com a conta de serviço do calendário. SOMENTE LEITURA (escopo calendar.readonly).
//
// Configuração: GOOGLE_CALENDAR_SA_JSON = conteúdo do JSON da conta de serviço. Sem a
// variável, o serviço devolve `null` e a página explica que a agenda não está ligada.
//
// Só a agenda da Lívia está compartilhada com a conta de serviço (15/10/2026). As agendas
// secundárias de Lais e Igor dão 404 até serem compartilhadas: entram em CALENDARIOS quando isso acontecer.
import { createSign } from 'node:crypto';
import { PublicError } from './fortalecimento.mjs';

export const CALENDARIOS = [{ id: 'gustavo@carefitrunbase.com.br', nome: 'CareFit Run Base (Lívia)' }];
const TZ = '-03:00';
const TOKEN_MS = 50 * 60000;

// "Fisio Lívia - Sessão Jornada Recovery (Juliana Vinha)" → fisio, tipo, atleta.
// Eventos sem nome entre parênteses (almoço, bloqueio, prova) não são reservas.
export function interpretarTitulo(summary) {
  const m = /^(?:Fisio\s+([^-]+?)\s*-\s*)?(.+?)\s*\(([^()]+)\)\s*$/.exec(String(summary || '').trim());
  if (!m) return null;
  const tipo = m[2].trim();
  if (!/sess[aã]o|avalia[cç][aã]o|primeira|recovery|fisioterapia/i.test(tipo)) return null;
  return { fisio: m[1] ? m[1].trim() : null, tipo, atleta: m[3].replace(/\s+/g, ' ').trim() };
}

function b64(o) { return Buffer.from(JSON.stringify(o)).toString('base64url'); }

export function criarLeitorAgenda(env = process.env, fetchFn = fetch, agora = () => Date.now()) {
  let conta = null;
  try { conta = env.GOOGLE_CALENDAR_SA_JSON ? JSON.parse(env.GOOGLE_CALENDAR_SA_JSON) : null; } catch { conta = null; }
  if (!conta?.client_email || !conta?.private_key) return null;

  let token = null;
  async function obterToken() {
    if (token && token.ate > agora()) return token.valor;
    const iat = Math.floor(agora() / 1000);
    const corpo = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({ iss: conta.client_email, scope: 'https://www.googleapis.com/auth/calendar.readonly', aud: 'https://oauth2.googleapis.com/token', iat, exp: iat + 3600 });
    const assinatura = createSign('RSA-SHA256').update(corpo).sign(conta.private_key, 'base64url');
    const r = await fetchFn('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${corpo}.${assinatura}` });
    const json = await r.json().catch(() => ({}));
    if (!r.ok || !json.access_token) throw new PublicError('A agenda não autorizou a leitura. Confira a conta de serviço.', 502);
    token = { valor: json.access_token, ate: agora() + TOKEN_MS };
    return token.valor;
  }

  /** Reservas da semana [segunda, segunda+7), já reduzidas: nunca sai e-mail nem descrição. */
  async function reservas(segunda, fim) {
    const bearer = await obterToken();
    const saida = [];
    for (const cal of CALENDARIOS) {
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?singleEvents=true&orderBy=startTime&maxResults=500&timeMin=${segunda}T00:00:00${TZ}&timeMax=${fim}T00:00:00${TZ}`;
      const r = await fetchFn(url, { headers: { Authorization: 'Bearer ' + bearer } });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) throw new PublicError(`A agenda ${cal.nome} não respondeu (${r.status}).`, 502);
      for (const e of json.items || []) {
        if (e.status === 'cancelled') continue;
        const lido = interpretarTitulo(e.summary);
        if (!lido) continue;
        const inicio = e.start?.dateTime || (e.start?.date ? e.start.date + 'T00:00:00' : null);
        if (!inicio) continue;
        saida.push({ id: e.id, agenda: cal.nome, data: inicio.slice(0, 10), hora: inicio.slice(11, 16), ...lido });
      }
    }
    return saida;
  }

  return { reservas };
}
