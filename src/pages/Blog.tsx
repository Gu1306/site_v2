import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, BookOpen } from "lucide-react";
import Footer from "@/components/Footer";
import { posts, formatarData } from "@/lib/blog";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

const Blog = () => {
  useSeo({
    titulo: "Blog do corredor de Ribeirão Preto | CareFit Run Base",
    descricao:
      "Provas, treino, lesões e a vida de quem corre em Ribeirão Preto. Conteúdo da CareFit Run Base, atualizado toda semana.",
    caminho: "/blog",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Blog da CareFit Run Base",
      url: `${SITE_URL}/blog`,
      publisher: { "@type": "Organization", name: "CareFit Run Base" },
    },
  });

  const [destaque, ...demais] = posts;

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-14 md:pt-40 md:pb-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm px-4 py-2">
            Blog
          </Badge>
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-6 leading-tight">
            A corrida de Ribeirão Preto,<br />
            <span className="text-earth">contada por quem cuida dela</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-poppins font-light">
            Provas da cidade, treino, lesões e bastidores da base. Publicado toda semana.
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <BookOpen className="h-10 w-10 text-secondary mx-auto mb-4" />
            <p className="text-lg text-primary/70 font-poppins">
              Os primeiros posts estão a caminho.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Destaque */}
          <section className="py-16 bg-warm">
            <div className="container mx-auto px-4">
              <Link to={`/blog/${destaque.slug}`} className="group block max-w-5xl mx-auto">
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
                  <CardContent className="p-8 md:p-12">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge className="bg-secondary text-secondary-foreground">{destaque.categoria}</Badge>
                      {destaque.local && (
                        <span className="inline-flex items-center gap-1 text-sm text-accent font-montserrat font-semibold">
                          <MapPin className="h-4 w-4" /> Ribeirão Preto
                        </span>
                      )}
                      <span className="text-sm text-primary/60 font-poppins">
                        {formatarData(destaque.data)}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-montserrat font-bold text-primary mb-4 leading-tight">
                      {destaque.titulo}
                    </h2>
                    <p className="text-base md:text-lg text-primary/75 font-poppins leading-relaxed mb-6">
                      {destaque.descricao}
                    </p>
                    <span className="text-accent font-montserrat font-semibold inline-flex items-center gap-2">
                      Ler agora
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Demais posts */}
          {demais.length > 0 && (
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {demais.map((post) => (
                    <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                      <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">{post.categoria}</Badge>
                            {post.local && <MapPin className="h-4 w-4 text-accent" />}
                          </div>
                          <h3 className="text-lg font-montserrat font-bold text-primary mb-2 leading-snug">
                            {post.titulo}
                          </h3>
                          <p className="text-sm text-primary/70 font-poppins leading-relaxed flex-1">
                            {post.descricao}
                          </p>
                          <div className="flex items-center justify-between mt-5 text-xs text-primary/60 font-poppins">
                            <span>{formatarData(post.data)}</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {post.minutosDeLeitura} min
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Ponte para os guias */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-primary mb-4">
            Procurando conteúdo sobre uma dor específica?
          </h2>
          <p className="text-primary/75 font-poppins mb-8">
            Os guias de lesões, recovery e performance ficam reunidos na área de conteúdo.
          </p>
          <Link to="/comunidade">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 font-montserrat font-semibold">
              Ver os guias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
