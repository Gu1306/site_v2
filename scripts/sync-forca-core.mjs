// Fonte única: TS do painel. Artefato JS executável também no Node 20 da produção.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { createHash } from 'node:crypto';

const source = readFileSync(new URL('../src/lib/avaliacaoForca.ts', import.meta.url), 'utf8');
const hash = createHash('sha256').update(source.replace(/\r\n/g, '\n')).digest('hex');
const js = `// GERADO por scripts/sync-forca-core.mjs. Não editar. Fonte SHA256: ${hash}\n` + ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const targets = [new URL('../server/forca-core.mjs', import.meta.url)];
const vps = process.argv.indexOf('--vps');
if (vps >= 0) targets.push(process.argv[vps + 1]);
for (const target of targets) {
  if (process.argv.includes('--check')) {
    if (readFileSync(target, 'utf8').replace(/\r\n/g, '\n') !== js.replace(/\r\n/g, '\n')) throw new Error(`Cálculo divergente: ${target}`);
  } else writeFileSync(target, js);
  console.log(`Núcleo conferido: ${typeof target === 'string' ? target : fileURLToPath(target)}`);
}
