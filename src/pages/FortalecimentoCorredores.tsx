import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle, Heart, Activity, MessageCircle, MapPin, Users, Zap, Shield, Dumbbell } from "lucide-react";
import Footer from "@/components/Footer";

const beneficios = [
  "Redução do risco de lesões",
  "Melhora da estabilidade do quadril e joelho",
  "Maior eficiência biomecânica na corrida",
  "Melhora da economia de corrida",
  "Aumento da potência muscular",
  "Maior capacidade de suportar volume de treino",
];

const musculos = [
  "Glúteos (principal estabilizador da corrida)",
  "Quadríceps",
  "Panturrilha",
  "Músculos do core",
  "Musculatura estabilizadora do quadril",
];

const lesoesPrevenidas = [
  { nome: "Canelite", link: "/canelite-ribeirao-preto" },
  { nome: "Fascite plantar", link: "/fascite-plantar-ribeirao-preto" },
  { nome: "Tendinite do Aquiles", link: "/tendinite-aquiles-ribeirao-preto" },
  { nome: "Síndrome da banda iliotibial", link: "/banda-iliotibial-ribeirao-preto" },
  { nome: "Dor no joelho do corredor", link: "/dor-no-joelho-corrida-ribeirao-preto" },
];

const quandoComecar = [
  "No início da prática da corrida",
  "Durante preparação para provas",
  "Após recuperação de lesões",
  "Como estratégia preventiva",
];

const faqItems = [
  {
    question: "Corredor precisa fazer musculação?",
    answer: "Sim. O fortalecimento ajuda a prevenir lesões e melhora a eficiência da corrida.",
  },
  {
    question: "Quantas vezes por semana devo fortalecer?",
    answer: "A maioria dos corredores se beneficia de 2 sessões semanais de fortalecimento.",
  },
  {
    question: "Fortalecimento melhora o pace?",
    answer: "Sim. Ao melhorar estabilidade e eficiência biomecânica, o fortalecimento pode contribuir para melhorar desempenho.",
  },
];

const FortalecimentoCorredores = () => {
  const handleWhatsApp = () => {
    window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Fortalecimento para Corredores em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Treinamento de força específico para corrida na CareFit Run Base. Melhore performance, reduza lesões e construa uma base sólida para sua corrida.
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

      {/* Por que o fortalecimento é essencial */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Por que o fortalecimento é essencial para corredores?
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Muitos corredores acreditam que melhorar na corrida depende apenas de correr mais. No entanto, a ciência do esporte mostra que o fortalecimento muscular é um dos pilares mais importantes para prevenção de <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões</Link> e melhoria da performance.
            </p>
            <p>
              A corrida gera impacto repetitivo sobre músculos, tendões e articulações. Sem uma estrutura muscular preparada para absorver essas cargas, o risco de lesões aumenta significativamente.
            </p>
            <p>
              Na <strong className="text-foreground">CareFit Run Base</strong>, em Ribeirão Preto, desenvolvemos programas de fortalecimento específicos para corredores e triatletas, focados em melhorar estabilidade, força e eficiência biomecânica.
            </p>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Benefícios do fortalecimento para corredores
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            O treinamento de força adequado pode trazer diversos benefícios para quem corre:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {beneficios.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Corredores que realizam fortalecimento regularmente tendem a apresentar maior consistência nos treinos e menor incidência de lesões.
          </p>
        </div>
      </section>

      {/* Músculos importantes */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-warm to-accent rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Músculos mais importantes para a corrida
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Durante o fortalecimento para corredores, alguns grupos musculares recebem atenção especial. Entre eles estão:
          </p>
          <div className="space-y-4 mb-8">
            {musculos.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Esses músculos ajudam a controlar o impacto da corrida e estabilizar articulações como joelho, tornozelo e quadril.
          </p>
        </div>
      </section>

      {/* Prevenção de lesões */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Fortalecimento e prevenção de lesões
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            O fortalecimento é uma das principais estratégias para prevenir <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões comuns na corrida</Link>, como:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {lesoesPrevenidas.map((lesao, index) => (
              <Link key={index} to={lesao.link} className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Heart className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-accent hover:underline font-medium">{lesao.nome}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ecossistema */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-earth to-secondary rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Fortalecimento integrado ao ecossistema CareFit
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Na CareFit Run Base o fortalecimento não funciona isoladamente. Ele faz parte de um acompanhamento integrado que inclui:
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Fisioterapia esportiva para corredores</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/avaliacao-do-corredor-ribeirao-preto" className="text-accent hover:underline font-medium">Avaliação biomecânica do corredor</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Protocolos de recovery</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/nutricao-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Nutrição esportiva</Link>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Essa abordagem integrada permite tratar lesões, melhorar performance e construir uma base sólida para o treinamento.
          </p>
        </div>
      </section>

      {/* Para quem treina sério */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-warm to-accent rounded-full flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Fortalecimento para quem treina sério
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            O fortalecimento é especialmente importante para corredores que:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              "Treinam mais de 3 ou 4 vezes por semana",
              "Estão se preparando para provas",
              "Participam de maratonas ou triathlons",
              "Aumentaram recentemente o volume de treino",
              "Querem melhorar performance",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Esses atletas precisam de uma estrutura muscular capaz de suportar o impacto repetitivo da corrida.
          </p>
        </div>
      </section>

      {/* Quando começar */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Quando o corredor deve começar o fortalecimento?
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            O fortalecimento pode ser iniciado em diferentes momentos da jornada do corredor:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {quandoComecar.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-muted p-4 rounded-lg shadow-sm">
                <Activity className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Programas de fortalecimento bem estruturados ajudam o atleta a treinar com mais segurança e longevidade no esporte.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8">
            Perguntas Frequentes
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6 border-0 shadow-sm">
                <AccordionTrigger className="text-left text-foreground font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqItems.map((item) => ({
                  "@type": "Question",
                  name: item.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                  },
                })),
              }),
            }}
          />
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-accent to-earth">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <p className="text-white/90 text-lg mb-6">
            A CareFit Run Base é um centro especializado em fisioterapia esportiva para corredores em Ribeirão Preto, focado em performance, prevenção de lesões e longevidade no esporte.
          </p>
          <h2 className="text-4xl font-bold text-white mb-6">
            Agende sua Avaliação na CareFit Run Base
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você é corredor ou triatleta em Ribeirão Preto e quer melhorar sua corrida com fortalecimento específico, nossa equipe pode ajudar.
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

export default FortalecimentoCorredores;
