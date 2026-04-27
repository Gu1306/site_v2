import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Shield, Activity, Heart, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

const causas = [
  "Aumento súbito de volume ou intensidade de treino",
  "Biomecânica alterada (pé plano, pronação excessiva)",
  "Fraqueza muscular nos pés e panturrilha",
  "Calçados sem suporte adequado",
  "Corrida em superfícies muito duras",
  "Sobrepeso ou carga de treino excessiva",
];

const sintomas = [
  "Dor no calcanhar, especialmente nos primeiros passos da manhã",
  "Dor que piora após longos períodos em pé ou após corrida",
  "Sensação de rigidez na planta do pé",
  "Dor que pode aliviar durante a atividade e retornar após o repouso",
];

const tratamentos = [
  { title: "Terapia Manual", desc: "Liberação miofascial da fáscia plantar, panturrilha e musculatura intrínseca do pé." },
  { title: "Exercícios de Alongamento", desc: "Alongamentos específicos para fáscia plantar e cadeia posterior, com foco na flexibilidade do tornozelo." },
  { title: "Fortalecimento", desc: "Exercícios de fortalecimento dos músculos intrínsecos do pé e da panturrilha para suporte do arco plantar." },
  { title: "Controle de Carga", desc: "Ajuste progressivo do volume de treino e orientação sobre calçado e superfícies adequadas." },
];

const prevencao = [
  "Fortalecimento da musculatura intrínseca dos pés",
  "Alongamento regular da panturrilha e da fáscia plantar",
  "Progressão gradual do volume de treino",
  "Uso de calçados com suporte adequado",
  "Avaliação biomecânica periódica",
  "Integração com recovery entre sessões de treino",
];

const faqItems = [
  {
    question: "Quanto tempo demora para curar fascite plantar?",
    answer: "O tempo de recuperação varia conforme a gravidade da lesão e a carga de treino do corredor. Com fisioterapia adequada, muitos corredores apresentam melhora significativa em algumas semanas.",
  },
  {
    question: "Posso correr com fascite plantar?",
    answer: "Em alguns casos é possível manter parte do treino com redução de impacto e controle de carga. A avaliação fisioterapêutica ajuda a definir a progressão segura.",
  },
  {
    question: "Palmilha ajuda na fascite plantar?",
    answer: "Palmilhas podem auxiliar no suporte do arco plantar e na redistribuição de carga, mas devem ser avaliadas individualmente.",
  },
  {
    question: "Qual a diferença entre fascite plantar e esporão de calcâneo?",
    answer: "A fascite plantar é a inflamação da fáscia plantar, enquanto o esporão é uma calcificação no osso do calcâneo. Muitas vezes os dois podem coexistir.",
  },
];

const FascitePlantar = () => {
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20tratamento%20de%20fascite%20plantar.", "_blank");
  };
  const handleAgendar = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20fascite%20plantar.", "_blank");
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Fascite Plantar em Corredores: tratamento da dor no calcanhar em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Fisioterapia esportiva especializada no tratamento de fascite plantar para corredores em Ribeirão Preto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleAgendar}>Agendar avaliação</Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">O que é Fascite Plantar?</h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              A fascite plantar é uma inflamação na fáscia plantar, estrutura que sustenta o arco do pé. Ela é uma das principais causas de dor no calcanhar em corredores e está entre as <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões mais comuns na corrida</Link>.
            </p>
            <p>
              Na <strong className="text-foreground">CareFit Run Base</strong> tratamos fascite plantar com <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline">fisioterapia esportiva</Link> específica para corrida, focando na redução da dor e na recuperação funcional do atleta.
            </p>
            <p>
              Atendemos corredores de 5 km, 10 km, meia maratona, maratona e triatletas que desenvolvem dor no calcanhar durante ou após a corrida.
            </p>
            <p>
              O <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline">fortalecimento específico para corredores</Link> ajuda a reduzir o risco de recidiva, e protocolos de <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline">recovery</Link> aceleram a recuperação entre sessões de treino.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Principais Causas</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {causas.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-background rounded-lg">
                <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Sintomas da Fascite Plantar</h2>
          </div>
          <div className="space-y-4">
            {sintomas.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Tratamento Fisioterapêutico</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            O tratamento na CareFit Run Base é integrado com <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline">fortalecimento</Link> e <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline">recovery</Link>.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {tratamentos.map((item, i) => (
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

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Prevenção</h2>
          </div>
          <div className="space-y-4">
            {prevencao.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">Perguntas Frequentes</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg border-0 px-6">
                <AccordionTrigger className="text-left text-primary font-semibold hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Agende sua Avaliação na CareFit Run Base</h2>
          <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
            A CareFit Run Base é um centro especializado em fisioterapia esportiva para corredores em Ribeirão Preto, com foco no tratamento de lesões causadas pela corrida e no retorno seguro ao treino.
          </p>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você está com dor no calcanhar e suspeita de fascite plantar, nossa equipe pode ajudar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleAgendar}>Agendar avaliação</Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-6">Av. Áurea Aparecida Bragheto Machado, 241 — Ribeirão Preto, SP</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FascitePlantar;
