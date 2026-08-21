import { marked } from "marked";

/**
 * O blog é feito de arquivos Markdown em `src/content/blog/`.
 * Nada de CMS, nada de banco: publicar um post é commitar um `.md` e dar push —
 * o Railway rebuilda e o post entra no ar. É isso que permite ao agente publicar
 * sozinho. O formato está documentado em `src/content/blog/_COMO-ESCREVER.md`.
 */

export type PostStatus = "publicado" | "rascunho";

export interface PostMeta {
  slug: string;
  titulo: string;
  descricao: string;
  data: string; // AAAA-MM-DD
  publicadoEm?: string; // ISO 8601; desempata posts do mesmo dia
  autor: string;
  categoria: string;
  tags: string[];
  local: boolean; // pauta ancorada em Ribeirão Preto e região
  status: PostStatus;
  capa?: string;
  fontes: { titulo: string; url: string }[];
}

export interface Post extends PostMeta {
  corpo: string; // markdown cru
  html: string;
  minutosDeLeitura: number;
}

/**
 * Parser de frontmatter enxuto. Cobre o que o formato do blog usa — string,
 * booleano, lista inline `[a, b]` e lista em bloco com `-` — e nada além disso.
 * Uma lib completa de YAML traria Buffer/polyfill para o bundle do browser sem
 * ganho real: o frontmatter é escrito por nós (ou pelo agente), num molde fixo.
 */
function parseFrontmatter(raw: string): { dados: Record<string, unknown>; corpo: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { dados: {}, corpo: raw };

  const [, bloco, corpo] = match;
  const dados: Record<string, unknown> = {};
  const linhas = bloco.split(/\r?\n/);

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    if (!linha.trim() || linha.trimStart().startsWith("#")) continue;

    const par = /^([A-Za-zÀ-ú_][\w-]*):\s*(.*)$/.exec(linha);
    if (!par) continue;

    const [, chave, valorBruto] = par;
    const valor = valorBruto.trim();

    // Lista em bloco: a chave vem vazia e os itens seguem indentados com "-".
    if (valor === "") {
      const itens: string[] = [];
      while (i + 1 < linhas.length && /^\s+-\s+/.test(linhas[i + 1])) {
        itens.push(linhas[++i].replace(/^\s+-\s+/, "").trim());
      }
      dados[chave] = itens;
      continue;
    }

    if (valor === "true" || valor === "false") {
      dados[chave] = valor === "true";
      continue;
    }

    // Lista inline: [a, b, c]
    if (valor.startsWith("[") && valor.endsWith("]")) {
      dados[chave] = valor
        .slice(1, -1)
        .split(",")
        .map((item) => despir(item))
        .filter(Boolean);
      continue;
    }

    dados[chave] = despir(valor);
  }

  return { dados, corpo: corpo ?? "" };
}

function despir(valor: string): string {
  return valor.trim().replace(/^["']|["']$/g, "");
}

/**
 * Fontes são escritas como `Título | https://url` — uma por linha — para manter
 * o frontmatter legível e fácil de gerar por agente.
 */
function parseFontes(valor: unknown): { titulo: string; url: string }[] {
  if (!Array.isArray(valor)) return [];
  return valor
    .map((item) => {
      const texto = String(item);
      const corte = texto.lastIndexOf("|");
      if (corte === -1) return { titulo: texto.trim(), url: texto.trim() };
      return { titulo: texto.slice(0, corte).trim(), url: texto.slice(corte + 1).trim() };
    })
    .filter((fonte) => fonte.url.startsWith("http"));
}

marked.setOptions({ gfm: true, breaks: false });

const arquivos = import.meta.glob("../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function slugDoCaminho(caminho: string): string {
  return caminho.split("/").pop()!.replace(/\.md$/, "");
}

const todos: Post[] = Object.entries(arquivos)
  // `_` no início é convenção de arquivo de apoio (ex: _COMO-ESCREVER.md).
  .filter(([caminho]) => !slugDoCaminho(caminho).startsWith("_"))
  .map(([caminho, raw]) => {
    const { dados, corpo } = parseFrontmatter(raw);
    const palavras = corpo.trim().split(/\s+/).length;

    return {
      slug: (dados.slug as string) || slugDoCaminho(caminho),
      titulo: (dados.titulo as string) || "Sem título",
      descricao: (dados.descricao as string) || "",
      data: (dados.data as string) || "1970-01-01",
      publicadoEm: dados.publicadoEm as string | undefined,
      autor: (dados.autor as string) || "Equipe CareFit",
      categoria: (dados.categoria as string) || "Geral",
      tags: (dados.tags as string[]) || [],
      local: dados.local === true,
      status: (dados.status as PostStatus) || "rascunho",
      capa: dados.capa as string | undefined,
      fontes: parseFontes(dados.fontes),
      corpo,
      html: marked.parse(corpo) as string,
      // 200 palavras/minuto, arredondado pra cima: ninguém lê "0 min".
      minutosDeLeitura: Math.max(1, Math.round(palavras / 200)),
    };
  })
  .sort((a, b) => {
    const ordemB = b.publicadoEm || `${b.data}T00:00:00`;
    const ordemA = a.publicadoEm || `${a.data}T00:00:00`;
    return ordemB.localeCompare(ordemA);
  });

/** Só o que está publicado. Rascunho fica fora da listagem e do sitemap. */
export const posts: Post[] = todos.filter((post) => post.status === "publicado");

export function getPost(slug: string): Post | undefined {
  // Rascunho continua acessível pela URL direta — é assim que se revisa antes de publicar.
  return todos.find((post) => post.slug === slug);
}

export function postsRelacionados(post: Post, quantidade = 3): Post[] {
  return posts
    .filter((outro) => outro.slug !== post.slug)
    .map((outro) => ({
      outro,
      peso:
        (outro.categoria === post.categoria ? 2 : 0) +
        outro.tags.filter((tag) => post.tags.includes(tag)).length +
        (outro.local && post.local ? 1 : 0),
    }))
    .sort((a, b) => {
      const ordemB = b.outro.publicadoEm || `${b.outro.data}T00:00:00`;
      const ordemA = a.outro.publicadoEm || `${a.outro.data}T00:00:00`;
      return b.peso - a.peso || ordemB.localeCompare(ordemA);
    })
    .slice(0, quantidade)
    .map(({ outro }) => outro);
}

export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-").map(Number);
  return new Date(ano, (mes ?? 1) - 1, dia ?? 1).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
