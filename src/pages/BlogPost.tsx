import { Link, useParams, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Clock, MapPin, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { getPost, postsRelacionados, formatarData } from "@/lib/blog";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  useSeo({
    titulo: post ? `${post.titulo} | CareFit Run Base` : "Post não encontrado | CareFit Run Base",
    descricao: post?.descricao ?? "",
    caminho: `/blog/${slug ?? ""}`,
    tipo: "article",
    noindex: post?.status === "rascunho",
    structuredData: post
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.titulo,
          description: post.descricao,
          datePublished: post.data,
          author: { "@type": "Organization", name: post.autor },
          publisher: {
            "@type": "Organization",
            name: "CareFit Run Base",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
          },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        }
      : undefined,
  });

  if (!post) return <Navigate to="/blog" replace />;

  const relacionados = postsRelacionados(post);

  const handleWhatsApp = () => {
    window.open(
      "https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20cheguei%20pelo%20blog%20da%20CareFit.",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <article>
        <header className="pt-32 pb-12 md:pt-40 bg-primary text-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-poppins text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar para o blog
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Badge className="bg-secondary text-secondary-foreground">{post.categoria}</Badge>
              {post.local && (
                <span className="inline-flex items-center gap-1 text-sm text-earth font-montserrat font-semibold">
                  <MapPin className="h-4 w-4" /> Ribeirão Preto
                </span>
              )}
              {post.status === "rascunho" && (
                <Badge variant="destructive">rascunho — não indexado</Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-montserrat font-bold mb-6 leading-tight">
              {post.titulo}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/80 font-poppins text-sm">
              <span>{formatarData(post.data)}</span>
              <span>{post.autor}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" /> {post.minutosDeLeitura} min de leitura
              </span>
            </div>
          </div>
        </header>

        <div className="py-14">
          <div className="container mx-auto px-4 max-w-3xl">
            <div
              className="prose prose-lg max-w-none font-poppins
                prose-headings:font-montserrat prose-headings:text-primary prose-headings:font-bold
                prose-headings:tracking-tight prose-headings:scroll-mt-24
                prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-14 prose-h2:mb-4
                prose-h2:pt-8 prose-h2:border-t prose-h2:border-primary/10
                prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-3
                prose-p:text-primary/80 prose-p:leading-[1.75]
                [&>h2:first-child]:mt-0 [&>h2:first-child]:pt-0 [&>h2:first-child]:border-t-0
                [&>p:first-of-type]:text-xl [&>p:first-of-type]:leading-[1.65]
                [&>p:first-of-type]:text-primary
                prose-li:text-primary/80 prose-li:marker:text-accent prose-strong:text-primary
                prose-a:text-accent prose-a:font-medium prose-a:underline
                prose-a:decoration-accent/30 prose-a:underline-offset-4
                hover:prose-a:decoration-accent
                prose-blockquote:border-l-4 prose-blockquote:border-accent
                prose-blockquote:bg-warm/60 prose-blockquote:py-1 prose-blockquote:not-italic
                prose-blockquote:text-primary/80 prose-blockquote:font-medium
                prose-table:text-sm prose-th:text-primary prose-td:text-primary/80"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            {post.fontes.length > 0 && (
              <div className="mt-16 rounded-lg bg-warm/70 border border-primary/10 p-6 md:p-8">
                <h2 className="text-xs font-montserrat font-bold uppercase tracking-[0.18em] text-primary/60 mb-4">
                  Fontes
                </h2>
                <ul className="space-y-3">
                  {post.fontes.map((fonte) => (
                    <li key={fonte.url} className="text-sm font-poppins leading-snug">
                      <a
                        href={fonte.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary/80 underline decoration-accent/40 underline-offset-4
                          hover:text-primary hover:decoration-accent break-words"
                      >
                        {fonte.titulo}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 bg-warm">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-primary mb-4">
            Corre em Ribeirão e quer treinar sem se machucar?
          </h2>
          <p className="text-primary/75 font-poppins mb-8">
            A CareFit Run Base é a base do corredor da cidade: avaliação, fortalecimento e recovery
            no mesmo lugar.
          </p>
          <Button
            size="lg"
            onClick={handleWhatsApp}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 font-montserrat font-semibold"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Falar com a gente
          </Button>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl font-montserrat font-bold text-primary mb-8 text-center">
              Leia também
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relacionados.map((outro) => (
                <Link key={outro.slug} to={`/blog/${outro.slug}`} className="group">
                  <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <h3 className="text-base font-montserrat font-bold text-primary mb-2 leading-snug">
                        {outro.titulo}
                      </h3>
                      <p className="text-sm text-primary/70 font-poppins leading-relaxed flex-1">
                        {outro.descricao}
                      </p>
                      <span className="text-accent font-montserrat font-semibold text-sm mt-4 inline-flex items-center gap-1">
                        Ler <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;
