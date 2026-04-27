import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Shield, Activity, Heart, CheckCircle, AlertTriangle, MessageCircle, MapPin, ExternalLink, BookOpen } from "lucide-react";
import Footer from "@/components/Footer";
import salaFisioterapia from "@/assets/sala-fisioterapia.jpg";

const lesoes = [
  {
    title: "Dor no Joelho na Corrida (Síndrome Patelofemoral)",
    description: "A dor patelofemoral é a lesão mais prevalente entre corredores, podendo afetar até 16,7% dos atletas.",
    link: "/dor-no-joelho-corrida-ribeirao-preto",
  },
  {
    title: "Canelite (Síndrome do Estresse Tibial Medial)",
    description: "A canelite representa cerca de 9% das lesões em corredores e é caracterizada por dor na região interna da tíbia.",
    link: "/canelite-ribeirao-preto",
  },
  {
    title: "Fascite Plantar",
    description: "Responsável por aproximadamente 7,9% das lesões em corredores, causando dor no calcanhar devido à inflamação da fáscia plantar.",
    link: "/fascite-plantar-ribeirao-preto",
  },
  {
    title: "Tendinite do Aquiles",
    description: "A tendinopatia do Aquiles pode representar até 15% das lesões em corredores recreacionais.",
    link: "/tendinite-aquiles-ribeirao-preto",
  },
  {
    title: "Síndrome da Banda Iliotibial",
    description: "Lesão comum caracterizada por dor na lateral do joelho causada pelo atrito da banda iliotibial.",
    link: "/banda-iliotibial-ribeirao-preto",
  },
  {
    title: "Fratura por Estresse",
    description: "Lesão óssea causada por sobrecarga repetitiva, representando o estágio mais grave das lesões por impacto da corrida.",
    link: "/fratura-por-estresse-ribeirao-preto",
  },
];

const faqItems = [
  {
    question: "Quais são as lesões mais comuns na corrida?",
    answer: "As lesões mais comuns incluem síndrome patelofemoral (joelho do corredor), canelite, fascite plantar, tendinopatia do Aquiles e síndrome da banda iliotibial.",
  },
  {
    question: "É possível continuar correndo com dor?",
    answer: "Depende da intensidade da dor e da lesão. Em alguns casos é possível manter parte do treino com ajustes de carga e intensidade. A avaliação fisioterapêutica ajuda a definir a progressão segura.",
  },
  {
    question: "Como evitar lesões na corrida?",
    answer: "Fortalecimento específico, controle de carga de treino, recuperação adequada e avaliação biomecânica são fundamentais para a prevenção de lesões na corrida.",
  },
];

const referencias = [
  {
    nome: "British Journal of Sports Medicine",
    url: "https://bjsm.bmj.com",
  },
  {
    nome: "Journal of Sport and Health Science",
    url: "https://www.journals.elsevier.com/journal-of-sport-and-health-science",
  },
  {
    nome: "StatPearls",
    url: "https://www.ncbi.nlm.nih.gov/books",
  },
  {
    nome: "Muscles Ligaments and Tendons Journal",
    url: "https://www.mltj.online",
  },
];

const LesoesNaCorrida = () => {
  const handleWhatsApp = () => {
    window.open(
      "https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20tratamento%20de%20les%C3%B5es%20na%20corrida.",
      "_blank"
    );
  };

  const handleAgendar = () => {
    window.open(
      "https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20les%C3%A3o%20na%20corrida.",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img src={salaFisioterapia} alt="Sala de fisioterapia CareFit Run Base em Ribeirão Preto" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/85" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Lesões na Corrida: causas, prevenção e tratamento para corredores em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Conheça as principais lesões na corrida, suas causas e como tratar. Centro especializado em fisioterapia para corredores em Ribeirão Preto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleAgendar}>
              Agendar avaliação
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Seção 1 — Por que corredores se lesionam? */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Por que corredores se lesionam?
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              A corrida é um dos esportes mais populares do mundo, mas também está entre aqueles com maior incidência de lesões por sobrecarga.
            </p>
            <p>
              Estudos científicos mostram que entre <strong className="text-foreground">60% e 80% dos corredores</strong> apresentam algum tipo de lesão ao longo do ano, sendo a maioria causada por erros de treinamento.
            </p>
            <p>
              A principal causa identificada pela literatura científica é o <strong className="text-foreground">aumento rápido da carga de treino</strong>, quando o volume ou intensidade aumentam mais rápido do que a capacidade de adaptação do corpo.
            </p>
            <p>
              Uma pesquisa com mais de 5.000 corredores publicada no{" "}
              <a href="https://bjsm.bmj.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline inline-flex items-center gap-1">
                British Journal of Sports Medicine <ExternalLink className="w-3 h-3" />
              </a>{" "}
              demonstrou que o risco de lesão aumenta significativamente quando um corredor ultrapassa em mais de 10% a maior distância que correu em uma única sessão nos últimos 30 dias.
            </p>
            <p>
              Músculos, tendões e ossos precisam de tempo para se adaptar ao impacto repetitivo da corrida. Quando essa adaptação é insuficiente, surgem as lesões por sobrecarga.
            </p>
            <p>
              Na <strong className="text-foreground">CareFit Run Base</strong>, em Ribeirão Preto, nossa abordagem de <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline">fisioterapia esportiva</Link> é focada em identificar e corrigir as principais causas das lesões, que frequentemente incluem:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {[
              "Aumento rápido do volume ou intensidade do treino",
              "Falta de fortalecimento específico para corrida",
              "Recuperação insuficiente entre sessões de treino",
              "Desequilíbrios na biomecânica da corrida",
              "Uso de calçados inadequados",
              "Periodização de treinos inadequada",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mt-8">
            Atendemos corredores de 5 km, 10 km, meia maratona, maratona e triatletas que buscam tratar lesões e melhorar sua performance com segurança.
          </p>
        </div>
      </section>

      {/* Seção 2 — Principais Lesões na Corrida */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Principais Lesões na Corrida
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              As lesões na corrida seguem padrões que foram extensivamente estudados na literatura científica. Revisões sistemáticas mostram que algumas lesões aparecem com maior frequência entre corredores.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lesoes.map((lesao, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    <Link to={lesao.link} className="hover:text-accent transition-colors">
                      {lesao.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{lesao.description}</p>
                  <Link to={lesao.link}>
                    <Button variant="outline" size="sm" className="w-full">
                      Saiba mais <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seção 3 — Como Prevenir Lesões na Corrida */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Como Prevenir Lesões na Corrida
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            A prevenção de lesões na corrida envolve uma abordagem integrada que combina diferentes estratégias:
          </p>
          <div className="space-y-4 mb-10">
            {[
              "Fortalecimento específico para corredores",
              "Controle de carga de treino",
              "Recuperação adequada entre sessões",
              "Avaliação biomecânica da corrida",
              "Planejamento progressivo de treinos",
              "Fisioterapia preventiva",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="block p-6 bg-muted rounded-lg text-center hover:shadow-md transition-shadow">
              <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
              <span className="text-accent font-medium">Fortalecimento para Corredores →</span>
            </Link>
            <Link to="/recovery-corredores-ribeirao-preto" className="block p-6 bg-muted rounded-lg text-center hover:shadow-md transition-shadow">
              <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
              <span className="text-accent font-medium">Recovery para Corredores →</span>
            </Link>
            <Link to="/avaliacao-do-corredor-ribeirao-preto" className="block p-6 bg-muted rounded-lg text-center hover:shadow-md transition-shadow">
              <Activity className="w-8 h-8 text-accent mx-auto mb-2" />
              <span className="text-accent font-medium">Avaliação do Corredor →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção 4 — Tratamento na CareFit */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Tratamento de Lesões na CareFit Run Base
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            A <strong className="text-foreground">CareFit Run Base é um centro especializado em fisioterapia esportiva para corredores em Ribeirão Preto</strong>. Nosso tratamento é integrado e individualizado, combinando diferentes abordagens para garantir o melhor resultado.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Avaliação Específica para Corrida", desc: "Análise completa da biomecânica, força, mobilidade e histórico do corredor." },
              { title: "Terapia Manual", desc: "Mobilização articular, liberação miofascial e técnicas de tecidos moles." },
              { title: "Exercícios Terapêuticos", desc: "Protocolos de reabilitação específicos para cada lesão e fase do tratamento." },
              { title: "Fortalecimento Funcional", desc: "Exercícios direcionados para corrigir desequilíbrios e prevenir recidivas." },
              { title: "Protocolos de Recovery", desc: "Banheiras de imersão, botas de compressão e crioterapia para acelerar a recuperação." },
              { title: "Retorno Progressivo à Corrida", desc: "Progressão segura de volume e intensidade com critérios claros para cada fase." },
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            Perguntas Frequentes
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-muted rounded-lg border-0 px-6">
                <AccordionTrigger className="text-left text-primary font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* JSON-LD FAQ */}
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
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Agende sua Avaliação na CareFit Run Base
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você é corredor ou triatleta em Ribeirão Preto e está lidando com dor ou lesão na corrida, nossa equipe especializada pode ajudar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleAgendar}>
              Agendar avaliação
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/70">
            <MapPin className="w-5 h-5" />
            <span>Av. Áurea Aparecida Bragheto Machado, 241 — Ribeirão Preto, SP</span>
          </div>
        </div>
      </section>

      {/* Referências Científicas */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-earth to-secondary rounded-full flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Referências Científicas
            </h2>
          </div>
          <div className="space-y-4">
            {referencias.map((ref, index) => (
              <a
                key={index}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow group"
              >
                <ExternalLink className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground group-hover:text-accent transition-colors font-medium">{ref.nome}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LesoesNaCorrida;
