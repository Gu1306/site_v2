import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Heart, Activity, MessageCircle, MapPin, Users } from "lucide-react";
import Footer from "@/components/Footer";

const analiseItems = [
  "Padrão de pisada",
  "Alinhamento de joelho e quadril",
  "Estabilidade do core",
  "Mobilidade do tornozelo",
  "Cadência da corrida",
  "Absorção de impacto",
  "Controle neuromuscular",
];

const lesoesRelacionadas = [
  { nome: "Canelite", link: "/canelite-ribeirao-preto" },
  { nome: "Fascite plantar", link: "/fascite-plantar-ribeirao-preto" },
  { nome: "Dor no joelho", link: "/dor-no-joelho-corrida-ribeirao-preto" },
  { nome: "Tendinite do Aquiles", link: "/tendinite-aquiles-ribeirao-preto" },
  { nome: "Síndrome da banda iliotibial", link: "/banda-iliotibial-ribeirao-preto" },
];

const BiomecanicaCorrida = () => {
  const handleWhatsApp = () => {
    window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Biomecânica da Corrida em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Avaliação da mecânica de corrida para prevenir lesões e melhorar performance na CareFit Run Base.
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

      {/* O que é biomecânica */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              O que é biomecânica da corrida?
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              A biomecânica da corrida é o estudo dos movimentos do corpo durante a corrida.
            </p>
            <p>
              Ela analisa como articulações, músculos e tendões trabalham juntos para produzir movimento e absorver impacto.
            </p>
            <p>
              Alterações nesses padrões podem aumentar o risco de <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões</Link> e reduzir a eficiência da corrida.
            </p>
            <p>
              Na <strong className="text-foreground">CareFit Run Base</strong>, em Ribeirão Preto, realizamos avaliação biomecânica para identificar desequilíbrios e melhorar a mecânica de corrida.
            </p>
          </div>
        </div>
      </section>

      {/* O que analisamos */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              O que analisamos na biomecânica da corrida
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Durante a avaliação analisamos:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {analiseItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Essa análise permite identificar fatores de risco e melhorar a eficiência da corrida.
          </p>
        </div>
      </section>

      {/* Por que é importante */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-warm to-accent rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Por que a biomecânica é importante para corredores?
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Alterações biomecânicas podem contribuir para diversas <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões comuns na corrida</Link>, como:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {lesoesRelacionadas.map((lesao, index) => (
              <Link key={index} to={lesao.link} className="flex items-center gap-3 bg-muted p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Heart className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-accent hover:underline font-medium">{lesao.nome}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ecossistema */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-earth to-secondary rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Biomecânica integrada ao ecossistema CareFit
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Na CareFit Run Base a análise biomecânica faz parte de um sistema integrado de cuidado ao corredor que inclui:
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Fisioterapia esportiva</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Fortalecimento específico</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/recovery-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Recovery</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/nutricao-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Nutrição esportiva</Link>
            </div>
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
            Se você é corredor em Ribeirão Preto e quer entender melhor sua biomecânica de corrida, nossa equipe pode ajudar.
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

export default BiomecanicaCorrida;
