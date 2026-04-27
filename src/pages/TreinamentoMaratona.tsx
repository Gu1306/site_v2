import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Activity, MessageCircle, MapPin, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";

const desafios = [
  { nome: "Canelite", link: "/canelite-ribeirao-preto" },
  { nome: "Dor no joelho", link: "/dor-no-joelho-corrida-ribeirao-preto" },
  { nome: "Tendinite do Aquiles", link: "/tendinite-aquiles-ribeirao-preto" },
  { nome: "Fadiga muscular acumulada", link: "" },
];

const comoAjudamos = [
  { texto: "Avaliação do corredor", link: "/avaliacao-do-corredor-ribeirao-preto" },
  { texto: "Fisioterapia preventiva", link: "/fisioterapia-para-corredores-ribeirao-preto" },
  { texto: "Fortalecimento específico", link: "/fortalecimento-para-corredores-ribeirao-preto" },
  { texto: "Protocolos de recovery", link: "/recovery-para-corredores-ribeirao-preto" },
  { texto: "Orientação de retorno ao treino", link: "" },
];

const TreinamentoMaratona = () => {
  const handleWhatsApp = () => {
    window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Treinamento para Maratona em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Preparação segura para maratonas e meias maratonas com suporte especializado da CareFit Run Base.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              Agendar avaliação
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* O desafio */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              O desafio de treinar para maratona
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Treinar para maratona exige aumento progressivo de volume e intensidade.
            </p>
            <p>
              Sem acompanhamento adequado, esse aumento pode elevar o risco de <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões</Link>.
            </p>
            <p>
              Na <strong className="text-foreground">CareFit Run Base</strong> ajudamos corredores em Ribeirão Preto a se prepararem para maratonas e meias maratonas com suporte fisioterapêutico e treinamento complementar.
            </p>
          </div>
        </div>
      </section>

      {/* Principais desafios */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-warm to-accent rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Principais desafios na preparação para maratona
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Durante ciclos de treino para maratona é comum surgirem:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {desafios.map((item, index) =>
              item.link ? (
                <Link key={index} to={item.link} className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Heart className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-accent hover:underline font-medium">{item.nome}</span>
                </Link>
              ) : (
                <div key={index} className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-sm">
                  <Heart className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium">{item.nome}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Como a CareFit ajuda */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Como a CareFit ajuda corredores de maratona
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Nosso trabalho inclui:
          </p>
          <div className="space-y-4">
            {comoAjudamos.map((item, index) =>
              item.link ? (
                <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                  <Link to={item.link} className="text-accent hover:underline font-medium">{item.texto}</Link>
                </div>
              ) : (
                <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium">{item.texto}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-accent to-earth">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Agende sua Avaliação na CareFit Run Base
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você está se preparando para uma maratona ou meia maratona em Ribeirão Preto, nossa equipe pode ajudar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              Agendar avaliação
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <MapPin className="w-5 h-5" />
            <span>Av. Áurea Aparecida Bragheto Machado, 241 — Ribeirão Preto, SP</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TreinamentoMaratona;
