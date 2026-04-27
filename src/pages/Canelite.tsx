import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Shield, Activity, Heart, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

const causas = [
  "Aumento rápido do volume ou intensidade de treino",
  "Corrida em superfícies muito duras",
  "Calçados inadequados ou desgastados",
  "Fraqueza muscular na panturrilha e no tibial posterior",
  "Alterações biomecânicas na pisada",
  "Falta de periodização no treino",
];

const sintomas = [
  "Dor na parte interna da canela durante ou após a corrida",
  "Sensibilidade ao toque na região da tíbia",
  "Dor que melhora com repouso e piora com atividade",
  "Inchaço leve na região da canela",
];

const tratamentos = [
  { title: "Terapia Manual", desc: "Liberação miofascial e mobilização de tecidos moles para reduzir tensão e dor na região." },
  { title: "Exercícios Terapêuticos", desc: "Fortalecimento do tibial posterior, panturrilha e musculatura estabilizadora do tornozelo." },
  { title: "Correção Biomecânica", desc: "Análise e ajuste da biomecânica de corrida para reduzir o impacto repetitivo na tíbia." },
  { title: "Controle de Carga", desc: "Ajuste progressivo do volume e intensidade de treino para permitir adaptação óssea e muscular." },
];

const prevencao = [
  "Fortalecimento específico da musculatura da perna",
  "Progressão gradual do volume de treino (regra dos 10%)",
  "Uso de calçados adequados ao tipo de pisada",
  "Alternância de superfícies de treino",
  "Integração com recovery entre sessões",
  "Avaliação biomecânica periódica",
];

const faqItems = [
  {
    question: "Quanto tempo leva para tratar canelite?",
    answer: "O tempo de recuperação depende da intensidade da lesão e da carga de treino do corredor. Em muitos casos, com fisioterapia adequada e controle de carga, a melhora ocorre em algumas semanas.",
  },
  {
    question: "Posso continuar correndo com canelite?",
    answer: "Em alguns casos é possível manter parte do treino com redução de impacto e ajustes de volume. A avaliação fisioterapêutica ajuda a definir a progressão segura.",
  },
  {
    question: "Canelite pode virar fratura por estresse?",
    answer: "Sim. Quando a sobrecarga continua sem tratamento adequado, a canelite pode evoluir para fratura por estresse da tíbia.",
  },
  {
    question: "O que fazer quando sentir dor na canela?",
    answer: "O ideal é reduzir temporariamente o volume de corrida e buscar avaliação especializada para identificar as causas da dor.",
  },
];

const Canelite = () => {
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20tratamento%20de%20canelite.", "_blank");
  };
  const handleAgendar = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20canelite.", "_blank");
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Canelite em Corredores: tratamento em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Fisioterapia esportiva especializada no tratamento de canelite para corredores em Ribeirão Preto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleAgendar}>Agendar avaliação</Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Introdução */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">O que é Canelite?</h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              A canelite, conhecida como síndrome do estresse tibial medial, é uma das <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões mais comuns entre corredores</Link>. Ela causa dor na região da canela e geralmente está associada ao aumento rápido do volume de treino ou impacto repetitivo.
            </p>
            <p>
              Na <strong className="text-foreground">CareFit Run Base</strong>, em Ribeirão Preto, tratamos corredores com <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline">fisioterapia esportiva especializada</Link> para reduzir a dor, corrigir fatores de risco e permitir um retorno seguro aos treinos.
            </p>
            <p>
              Atendemos corredores de 5 km, 10 km, meia maratona, maratona e triatletas que desenvolvem dor na canela durante ou após a corrida.
            </p>
            <p>
              O <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline">fortalecimento específico para corredores</Link> é um dos principais fatores na prevenção da canelite, assim como a integração com protocolos de <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline">recovery</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Causas */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Principais Causas da Canelite</h2>
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

      {/* Sintomas */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Sintomas da Canelite</h2>
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

      {/* Tratamento */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Tratamento Fisioterapêutico</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            O tratamento da canelite na CareFit Run Base é individualizado e integrado com <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline">fortalecimento</Link> e <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline">recovery</Link>.
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

      {/* Prevenção */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Como Prevenir a Canelite</h2>
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

      {/* FAQ */}
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

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Agende sua Avaliação na CareFit Run Base</h2>
          <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
            A CareFit Run Base é um centro especializado em fisioterapia esportiva para corredores em Ribeirão Preto, com experiência no tratamento de lesões causadas pela corrida.
          </p>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você está com dor na canela e quer voltar a correr com segurança, nossa equipe pode ajudar.
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

export default Canelite;
