/**
 * Injeta as URLs dos posts publicados no public/sitemap.xml, entre os marcadores
 * BLOG:START e BLOG:END. Roda sozinho antes do build (script "prebuild"), então
 * quando o agente commita um .md novo o sitemap se atualiza sem ninguém lembrar.
 *
 * O resto do sitemap é curado à mão (prioridades pensadas) e não é tocado aqui.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const pastaPosts = join(raiz, "src", "content", "blog");
const caminhoSitemap = join(raiz, "public", "sitemap.xml");
const SITE = "https://www.carefitrunbase.com.br";

const INICIO = "<!-- BLOG:START -->";
const FIM = "<!-- BLOG:END -->";

function campo(frontmatter, chave) {
  const achado = new RegExp(`^${chave}:\\s*(.+)$`, "m").exec(frontmatter);
  return achado ? achado[1].trim().replace(/^["']|["']$/g, "") : "";
}

const posts = readdirSync(pastaPosts)
  .filter((arquivo) => arquivo.endsWith(".md") && !arquivo.startsWith("_"))
  .map((arquivo) => {
    const raw = readFileSync(join(pastaPosts, arquivo), "utf-8");
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1] ?? "";
    return {
      slug: campo(frontmatter, "slug") || arquivo.replace(/\.md$/, ""),
      data: campo(frontmatter, "data"),
      publicadoEm: campo(frontmatter, "publicadoEm"),
      status: campo(frontmatter, "status"),
    };
  })
  .filter((post) => post.status === "publicado")
  .sort((a, b) => {
    const ordemB = b.publicadoEm || `${b.data}T00:00:00`;
    const ordemA = a.publicadoEm || `${a.data}T00:00:00`;
    return ordemB.localeCompare(ordemA);
  });

const linhas = [
  `  <url><loc>${SITE}/blog</loc><lastmod>${posts[0]?.data ?? new Date().toISOString().slice(0, 10)}</lastmod><priority>0.9</priority></url>`,
  ...posts.map(
    (post) =>
      `  <url><loc>${SITE}/blog/${post.slug}</loc><lastmod>${post.data}</lastmod><priority>0.7</priority></url>`
  ),
];

let sitemap = readFileSync(caminhoSitemap, "utf-8");

const bloco = `${INICIO}\n${linhas.join("\n")}\n  ${FIM}`;

if (sitemap.includes(INICIO) && sitemap.includes(FIM)) {
  sitemap = sitemap.replace(new RegExp(`${INICIO}[\\s\\S]*?${FIM}`), bloco);
} else {
  sitemap = sitemap.replace("</urlset>", `  ${bloco}\n</urlset>`);
}

writeFileSync(caminhoSitemap, sitemap, "utf-8");
console.log(`sitemap: ${posts.length} post(s) do blog sincronizado(s).`);
