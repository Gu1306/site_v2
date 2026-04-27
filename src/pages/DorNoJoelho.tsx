import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Shield, Activity, Heart, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

const causas = [
  "Fraqueza muscular em quadríceps e glúteos",
  "Desequilíbrios biomecânicos na corrida",
  "Aumento rápido de volume de treino",
  "Pisada pronada excessiva",
  "Falta de fortalecimento específico",
  "Corrida em superfícies irregulares ou inclinadas",
];

const sintomas = [
  "Dor na parte anterior do joelho, ao redor da patela",
  "Dor que piora ao subir ou descer escadas",
  "Dor após ficar sentado por longos períodos (sinal do cinema)",
  "Dor durante ou após a corrida, especialmente em subidas",
];

const tratamentos = [
  { title: "Fortalecimento de Quadríceps e Glúteos", desc: "Exercícios específicos para corrigir desequilíbrios musculares e melhorar a estabilidade do joelho." },
  { title: "Terapia Manual", desc: "Mobilização patelar, liberação miofascial e técnicas de tecidos moles para restaurar mobilidade." },
  { title: "Correção Biomecânica", desc: "Análise e ajuste da mecânica de corrida para reduzir a sobrecarga na articulação patelofemoral." },
  { title: "Controle de Carga", desc: "Ajuste progressivo do volume e intensidade de treino com critérios claros para cada fase." },
];

const prevencao = [
  "Fortalecimento regular de quadríceps e glúteos",
  "Exercícios de estabilidade do quadril e core",
  "Progressão gradual do volume de treino",
  "Avaliação biomecânica da corrida",
  "Alongamento da cadeia lateral e posterior",
  "Uso de calçados adequados",
];

const faqItems = [
  {
    question: "O que causa dor no joelho na corrida?",
    answer: "A dor no joelho pode estar relacionada à síndrome patelofemoral, desequilíbrios musculares, aumento rápido de carga de treino ou alterações biomecânicas da corrida.",
  },
  {
    question: "Posso correr com dor no joelho?",
    answer: "Em alguns casos é possível manter parte do treino com ajustes de volume e intensidade. A avaliação fisioterapêutica ajuda a determinar a progressão segura.",
  },
  {
    question: "Dor no joelho na corrida é grave?",
    answer: "Nem sempre. Muitas vezes é resultado de sobrecarga ou desequilíbrios musculares, mas deve ser avaliada para evitar agravamento.",
  },
  {
    question: "Fortalecer o quadríceps ajuda na dor do joelho?",
    answer: "Sim. O fortalecimento de quadríceps e glúteos melhora a estabilidade da articulação e reduz a sobrecarga patelofemoral.",
  },
  {
    question: "Joelheira ajuda na corrida?",
    answer: "Joelheiras podem auxiliar temporariamente, mas o tratamento deve focar na correção das causas da dor.",
  },
];

const DorNoJoelho = () => {
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20tratamento%20de%20dor%20no%20joelho%20na%20corrida.", "_blank");
  };
  const handleAgendar = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20dor%20no%20joelho.", "_blank");
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Dor no Joelho na Corrida (Joelho do Corredor): tratamento em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Fisioterapia esportiva especializada no tratamento de dor no joelho para corredores em Ribeirão Preto.
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary">O que Causa Dor no Joelho na Corrida?</h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              A dor no joelho é uma das queixas mais comuns entre corredores e pode estar associada à síndrome patelofemoral, conhecida como joelho do corredor. É uma das <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões mais frequentes na corrida</Link>.
            </p>
            <p>
              Na <strong className="text-foreground">CareFit Run Base</strong> avaliamos biomecânica, força muscular e carga de treino para identificar as causas e tratar o problema com <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline">fisioterapia esportiva especializada</Link>.
            </p>
            <p>
              Atendemos corredores de 5 km, 10 km, meia maratona, maratona e triatletas que desenvolvem dor no joelho durante ou após a corrida.
            </p>
            <p>
              O <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline">fortalecimento específico para corredores</Link> é fundamental para reduzir o risco de dor no joelho, e protocolos de <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline">recovery</Link> ajudam a acelerar a recuperação entre sessões de treino.
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Sintomas</h2>
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
            O tratamento na CareFit é integrado com <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline">fortalecimento</Link> e <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline">recovery</Link>.
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
            A CareFit Run Base é um centro especializado em fisioterapia esportiva para corredores em Ribeirão Preto, com experiência no tratamento de lesões causadas pela corrida.
          </p>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você está com dor no joelho e quer voltar a correr com segurança, nossa equipe pode ajudar.
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

export default DorNoJoelho;
