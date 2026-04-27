import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle, Heart, Activity, MessageCircle, MapPin, Users, Shield, ClipboardCheck, Hand, Dumbbell, RotateCcw } from "lucide-react";
import Footer from "@/components/Footer";

const lesoesComuns = [
  { nome: "Tendinite do ombro em nadadores", link: "" },
  { nome: "Dor lombar associada ao ciclismo", link: "" },
  { nome: "Síndrome da banda iliotibial", link: "/banda-iliotibial-ribeirao-preto" },
  { nome: "Dor no joelho na corrida", link: "/dor-no-joelho-corrida-ribeirao-preto" },
  { nome: "Tendinite do Aquiles", link: "/tendinite-aquiles-ribeirao-preto" },
  { nome: "Fascite plantar", link: "/fascite-plantar-ribeirao-preto" },
];

const avaliacaoInclui = [
  "Histórico de treinos e provas",
  "Volume semanal de cada modalidade",
  "Biomecânica da corrida",
  "Mobilidade articular",
  "Força muscular",
  "Padrões de movimento",
  "Possíveis compensações musculares entre as modalidades",
];

const prevencao = [
  "Fortalecimento específico para corrida e ciclismo",
  "Exercícios de estabilidade do core",
  "Avaliação periódica de mobilidade",
  "Controle de carga de treino",
  "Estratégias de recovery entre sessões",
];

const faqItems = [
  {
    question: "Triatletas precisam de fisioterapia preventiva?",
    answer: "Sim. A fisioterapia preventiva ajuda a identificar desequilíbrios musculares antes que eles se tornem lesões.",
  },
  {
    question: "Posso continuar treinando durante o tratamento?",
    answer: "Depende da lesão e da intensidade da dor. Em muitos casos é possível adaptar o treinamento.",
  },
  {
    question: "A fisioterapia melhora a performance no triathlon?",
    answer: "Sim. Corrigir padrões de movimento e melhorar estabilidade muscular pode melhorar eficiência e reduzir risco de lesões.",
  },
];

const FisioterapiaTriatletas = () => {
  const handleWhatsApp = () => {
    window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Fisioterapia para Triatletas em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Tratamento e prevenção de lesões para triatletas na CareFit Run Base. Fisioterapia esportiva especializada em natação, ciclismo e corrida.
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

      {/* Fisioterapia especializada para triathlon */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Fisioterapia especializada para triathlon
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              O triathlon é um esporte que combina natação, ciclismo e corrida, exigindo grande capacidade física e resistência do atleta.
            </p>
            <p>
              A combinação dessas três modalidades gera cargas diferentes sobre o corpo, o que pode aumentar o risco de <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões</Link> se o treinamento não estiver bem equilibrado.
            </p>
            <p>
              Na <strong className="text-foreground">CareFit Run Base</strong>, em Ribeirão Preto, oferecemos <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline">fisioterapia esportiva</Link> especializada para triatletas, focada em tratar lesões, corrigir desequilíbrios musculares e melhorar a eficiência do movimento.
            </p>
            <p>
              Nosso objetivo é permitir que o atleta continue treinando com segurança e evolua na performance.
            </p>
          </div>
        </div>
      </section>

      {/* Lesões mais comuns */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-warm to-accent rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Lesões mais comuns em triatletas
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Triatletas podem desenvolver lesões específicas relacionadas a cada modalidade do esporte. Entre as mais comuns estão:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {lesoesComuns.map((lesao, index) =>
              lesao.link ? (
                <Link key={index} to={lesao.link} className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Heart className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-accent hover:underline font-medium">{lesao.nome}</span>
                </Link>
              ) : (
                <div key={index} className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-sm">
                  <Heart className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium">{lesao.nome}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Avaliação */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <ClipboardCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Como funciona a avaliação para triatletas
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-8">
            <p>
              A <Link to="/avaliacao-do-corredor-ribeirao-preto" className="text-accent hover:underline">avaliação</Link> realizada na CareFit Run Base é completa e considera as demandas específicas do triathlon.
            </p>
            <p>Durante a consulta analisamos:</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {avaliacaoInclui.map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-muted p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Essa análise permite identificar fatores de risco e desenvolver um plano de tratamento personalizado.
          </p>
        </div>
      </section>

      {/* Tratamento */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Hand className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Tratamento fisioterapêutico para triatletas
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            O tratamento na CareFit Run Base é integrado e pode incluir:
          </p>
          <div className="space-y-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-3">Terapia manual</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mobilizações articulares, liberação miofascial e técnicas de tecidos moles para reduzir dor e restaurar mobilidade.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-3">Exercícios terapêuticos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Protocolos de fortalecimento e reabilitação específicos para cada lesão.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-3">Correção biomecânica</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Análise de padrões de movimento e ajustes na mecânica de corrida e postura.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-3">Controle de carga de treino</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Orientação para retorno progressivo às três modalidades do triathlon.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prevenção */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Prevenção de lesões no triathlon
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            A prevenção de lesões é fundamental para triatletas que treinam frequentemente e acumulam alto volume de treino. Entre as estratégias utilizadas estão:
          </p>
          <div className="space-y-4 mb-8">
            {prevencao.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="block p-5 bg-muted rounded-lg text-center hover:shadow-md transition-shadow">
              <Dumbbell className="w-8 h-8 text-accent mx-auto mb-2" />
              <span className="text-accent font-medium">Fortalecimento para Corredores →</span>
            </Link>
            <Link to="/recovery-para-corredores-ribeirao-preto" className="block p-5 bg-muted rounded-lg text-center hover:shadow-md transition-shadow">
              <RotateCcw className="w-8 h-8 text-accent mx-auto mb-2" />
              <span className="text-accent font-medium">Recovery para Corredores →</span>
            </Link>
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
              Fisioterapia integrada ao ecossistema CareFit
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Na CareFit Run Base a fisioterapia faz parte de um sistema integrado de cuidado ao atleta. Nosso trabalho combina:
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
              <Link to="/recovery-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Protocolos de recovery</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/nutricao-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Nutrição esportiva</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/avaliacao-do-corredor-ribeirao-preto" className="text-accent hover:underline font-medium">Avaliação do atleta</Link>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Essa abordagem permite tratar lesões com mais eficiência e melhorar a performance do atleta.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8">
            Perguntas Frequentes
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-muted rounded-lg px-6 border-0 shadow-sm">
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
            A CareFit Run Base é um centro especializado em fisioterapia esportiva para corredores e triatletas em Ribeirão Preto, focado em performance, prevenção de lesões e longevidade no esporte.
          </p>
          <h2 className="text-4xl font-bold text-white mb-6">
            Agende sua Avaliação na CareFit Run Base
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você é triatleta em Ribeirão Preto e está lidando com dor, lesão ou quer melhorar sua performance, nossa equipe pode ajudar.
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

export default FisioterapiaTriatletas;
