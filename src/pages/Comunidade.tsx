import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Play, Activity, BookOpen, Instagram, MessageSquare, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import { episodes, ytThumb, ytWatch } from "@/data/episodes";
import maratonaGrupo from "@/assets/maratona_grupo.jpg";

const guiasLesoes = [
  { nome: "Lesões na corrida: o panorama completo", href: "/lesoes-na-corrida", desc: "As lesões mais comuns em corredores, por que acontecem e o que fazer em cada caso." },
  { nome: "Canelite", href: "/canelite-ribeirao-preto", desc: "Dor na canela por sobrecarga repetitiva: causas, sinais de alerta e tratamento." },
  { nome: "Fascite plantar", href: "/fascite-plantar-ribeirao-preto", desc: "Dor no calcanhar ao levantar da cama? Entenda a fáscia plantar e como tratá-la." },
  { nome: "Tendinite do Aquiles", href: "/tendinite-aquiles-ribeirao-preto", desc: "O tendão mais forte do corpo também é o que mais sofre com aumento rápido de carga." },
  { nome: "Dor no joelho", href: "/dor-no-joelho-corrida-ribeirao-preto", desc: "A queixa nº 1 do corredor. Quase nunca o problema está no joelho." },
  { nome: "Banda iliotibial", href: "/banda-iliotibial-ribeirao-preto", desc: "Dor lateral no joelho, ligada a fraqueza de glúteo e volume de treino." },
  { nome: "Fratura por estresse", href: "/fratura-por-estresse-ribeirao-preto", desc: "A lesão que exige parar. Como reconhecer cedo e evitar meses fora." },
  { nome: "Prevenção de lesões", href: "/prevencao-de-lesoes-na-corrida-ribeirao-preto", desc: "O que realmente reduz risco de lesão — e o que é mito na corrida." },
];

const guiasPerformance = [
  { nome: "Fisioterapia para corredores", href: "/fisioterapia-para-corredores-ribeirao-preto", desc: "Como funciona a fisioterapia esportiva pensada para quem corre." },
  { nome: "Avaliação do corredor", href: "/avaliacao-do-corredor-ribeirao-preto", desc: "O que medimos antes de montar qualquer plano — e por quê." },
  { nome: "Fortalecimento para corredores", href: "/fortalecimento-para-corredores-ribeirao-preto", desc: "Força não é hipertrofia. É o que sustenta cada quilômetro." },
  { nome: "Recovery para corredores", href: "/recovery-corredores-ribeirao-preto", desc: "Gelo, calor, compressão, liberação: o que cada técnica faz de verdade." },
  { nome: "Biomecânica da corrida", href: "/biomecanica-da-corrida-ribeirao-preto", desc: "Cadência, pisada, tronco: o que muda a economia de corrida." },
  { nome: "Treinamento para maratona", href: "/treinamento-para-maratona-ribeirao-preto", desc: "Do volume à recuperação: como chegar inteiro nos 42 km." },
];

const Comunidade = () => {
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");
  };

  const handleInstagram = () => {
    window.open("https://instagram.com/carefitrunbase", "_blank");
  };

  useEffect(() => {
    document.title = "Conteúdo para corredores — guias, lesões e CareFit Cast | CareFit Run Base";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Guias sobre lesões na corrida, recovery, fortalecimento e performance, além dos episódios do CareFit Cast. Conteúdo da CareFit Run Base, em Ribeirão Preto."
      );
    }
  }, []);

  const ultimosEpisodios = episodes.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${maratonaGrupo})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <Badge className="mb-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm px-4 py-2">
            Conteúdo CareFit
          </Badge>
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-6 leading-tight">
            Tudo que a gente aprendeu<br />
            <span className="text-earth">correndo com você</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-poppins font-light">
            Guias sobre lesões, recovery e performance escritos pela nossa equipe, mais os episódios
            do CareFit Cast. Conhecimento aberto para qualquer corredor — cliente ou não.
          </p>
        </div>
      </section>

      {/* CareFit Cast */}
      <section className="py-20 bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Mic className="h-10 w-10 text-secondary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-4">
              CareFit Cast
            </h2>
            <p className="text-lg text-primary/80 max-w-3xl mx-auto font-poppins">
              Conversas com atletas, treinadores e assessorias sobre treino, mentalidade e as histórias
              por trás de cada linha de chegada.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {ultimosEpisodios.map((ep) => (
              <Card key={ep.youtubeId} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
                <a
                  href={ytWatch(ep.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-video overflow-hidden group"
                >
                  <img
                    src={ytThumb(ep.youtubeId)}
                    alt={ep.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </a>
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-montserrat font-bold text-primary mb-2 line-clamp-2">
                    {ep.title}
                  </h3>
                  <p className="text-sm text-secondary font-montserrat font-semibold mb-3">
                    {ep.guest}
                  </p>
                  <p className="text-sm text-primary/70 font-poppins leading-relaxed line-clamp-3 flex-1">
                    {ep.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/carefit-cast">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-montserrat font-semibold">
                Ver todos os {episodes.length} episódios
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Guias de lesões */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Activity className="h-10 w-10 text-accent mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-4">
              Guias de lesões na corrida
            </h2>
            <p className="text-lg text-primary/80 max-w-3xl mx-auto font-poppins">
              O que dói, por que dói e o que fazer. Escrito para corredor entender, não para impressionar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {guiasLesoes.map((guia) => (
              <Link key={guia.href} to={guia.href} className="group">
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-lg font-montserrat font-bold text-primary mb-2">{guia.nome}</h3>
                    <p className="text-sm text-primary/70 font-poppins leading-relaxed flex-1">{guia.desc}</p>
                    <span className="text-accent font-montserrat font-semibold text-sm mt-4 inline-flex items-center gap-1">
                      Ler guia <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guias de performance */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <BookOpen className="h-10 w-10 text-secondary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-4">
              Guias de treino, recovery e performance
            </h2>
            <p className="text-lg text-primary/80 max-w-3xl mx-auto font-poppins">
              Como a gente pensa cada peça do cuidado ao corredor — e como você pode aplicar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {guiasPerformance.map((guia) => (
              <Link key={guia.href} to={guia.href} className="group">
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-lg font-montserrat font-bold text-primary mb-2">{guia.nome}</h3>
                    <p className="text-sm text-primary/70 font-poppins leading-relaxed flex-1">{guia.desc}</p>
                    <span className="text-secondary font-montserrat font-semibold text-sm mt-4 inline-flex items-center gap-1">
                      Ler guia <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comunidade / CTA */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-primary text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6">
            O dia a dia acontece no Instagram
          </h2>
          <p className="text-lg mb-4 font-poppins opacity-90">
            É lá que a gente publica bastidor de treino, prova, recovery e a rotina real da base.
            Se você quer conversar com a equipe, o WhatsApp está sempre aberto.
          </p>
          <p className="text-base mb-8 font-poppins opacity-75">
            Prefere conhecer a comunidade de perto?{" "}
            <Link to="/comunidade-carefit" className="underline hover:text-earth transition-colors">
              Veja como funciona a Comunidade CareFit
            </Link>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-montserrat font-semibold"
              onClick={handleInstagram}
            >
              <Instagram className="mr-2 h-5 w-5" />
              Seguir no Instagram
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-montserrat font-semibold"
              onClick={handleWhatsApp}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Conversar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Comunidade;
