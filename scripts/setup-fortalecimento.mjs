// Run locally once. Writes secrets only to ignored .local files, never stdout.
import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { passwordHash } from '../server/index.mjs';
const filename = '.env.local';
if (existsSync(filename)) throw new Error('.env.local já existe. Preserve as credenciais existentes.');
if (!process.env.CLICKUP_API_TOKEN) throw new Error('Carregue CLICKUP_API_TOKEN no ambiente antes de executar.');
const credentials = { gustavo: randomBytes(18).toString('base64url'), lucas: randomBytes(18).toString('base64url') };
const users = Object.fromEntries(Object.entries(credentials).map(([name, password]) => [name, passwordHash(password)]));
writeFileSync(filename, [ 'PORT=3000', 'PORTAL_ORIGIN=http://localhost:3000', `CLICKUP_API_TOKEN=${process.env.CLICKUP_API_TOKEN}`, `PORTAL_SESSION_SECRET=${randomBytes(48).toString('hex')}`, `PORTAL_USERS_JSON='${JSON.stringify(users)}'`, '' ].join('\n'), { mode: 0o600, flag: 'wx' });
writeFileSync('acessos-fortalecimento.local', Object.entries(credentials).map(([name, password]) => `${name.toUpperCase()}_USUARIO=${name}\n${name.toUpperCase()}_SENHA=${password}`).join('\n') + '\n', { mode: 0o600, flag: 'wx' });
console.log('Acessos criados nos arquivos locais ignorados pelo Git. Nenhum segredo foi exibido.');
