import { useEffect } from "react";

const SITE = "https://www.carefitrunbase.com.br";

interface SeoOptions {
  titulo: string;
  descricao: string;
  caminho: string; // ex: "/blog/minha-pauta"
  imagem?: string;
  tipo?: "website" | "article";
  /** JSON-LD já montado (Article, BreadcrumbList…). */
  structuredData?: Record<string, unknown>;
  /** Rascunho não deve ser indexado enquanto não for publicado. */
  noindex?: boolean;
}

function setMeta(seletor: string, attr: "name" | "property", chave: string, valor: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(seletor);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, chave);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", valor);
}

/**
 * O site é uma SPA: cada rota precisa reescrever title/meta na mão, senão todas
 * herdam o do index.html. As páginas antigas fazem isso inline; do blog em diante
 * passa por aqui, que também cuida de canonical, Open Graph e JSON-LD.
 */
export function useSeo({
  titulo,
  descricao,
  caminho,
  imagem = `${SITE}/og-image.jpg`,
  tipo = "website",
  structuredData,
  noindex = false,
}: SeoOptions) {
  useEffect(() => {
    const url = `${SITE}${caminho}`;
    document.title = titulo;

    setMeta('meta[name="description"]', "name", "description", descricao);
    setMeta('meta[property="og:title"]', "property", "og:title", titulo);
    setMeta('meta[property="og:description"]', "property", "og:description", descricao);
    setMeta('meta[property="og:type"]', "property", "og:type", tipo);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", imagem);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    let robots: HTMLMetaElement | null = null;
    if (noindex) {
      robots = document.createElement("meta");
      robots.name = "robots";
      robots.content = "noindex";
      document.head.appendChild(robots);
    }

    let script: HTMLScriptElement | null = null;
    if (structuredData) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      script?.remove();
      robots?.remove();
    };
  }, [titulo, descricao, caminho, imagem, tipo, structuredData, noindex]);
}

export const SITE_URL = SITE;
