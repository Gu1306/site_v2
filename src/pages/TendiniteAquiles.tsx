import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Shield, Activity, Heart, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

const causas = [
  "Aumento rápido de volume ou intensidade de treino",
  "Fraqueza muscular na panturrilha",
  "Falta de flexibilidade no tornozelo",
  "Calçados com drop inadequado",
  "Corrida em subidas excessivas",
  "Recuperação insuficiente entre treinos",
];

const sintomas = [
  "Dor e rigidez na parte posterior do tornozelo",
  "Dor que piora ao início da atividade e pode melhorar durante",
  "Espessamento ou inchaço no tendão de Aquiles",
  "Dor ao subir escadas ou em movimentos de dorsiflexão",
];

const tratamentos = [
  { title: "Exercícios Excêntricos", desc: "Protocolo de fortalecimento excêntrico da panturrilha, considerado padrão-ouro no tratamento da tendinopatia do Aquiles." },
  { title: "Terapia Manual", desc: "Liberação miofascial e mobilização de tecidos moles na região do tendão e musculatura adjacente." },
  { title: "Controle de Carga", desc: "Ajuste progressivo do volume e intensidade de treino para permitir adaptação tendínea." },
  { title: "Fortalecimento Funcional", desc: "Exercícios de fortalecimento integrados ao gesto da corrida para estabilidade e prevenção de recidiva." },
];

const prevencao = [
  "Fortalecimento regular da panturrilha (concêntrico e excêntrico)",
  "Progressão gradual do volume e intensidade de treino",
  "Alongamento da cadeia posterior",
  "Atenção ao drop do calçado de corrida",
  "Integração com recovery entre sessões",
  "Avaliação periódica da biomecânica da corrida",
];

const faqItems = [
  {
    question: "Quanto tempo leva para tratar tendinite do Aquiles?",
    answer: "O tempo de recuperação depende da gravidade da lesão e da carga de treino do corredor. Com fisioterapia adequada e controle de carga, muitos atletas apresentam melhora significativa em algumas semanas.",
  },
  {
    question: "Posso correr com tendinite do Aquiles?",
    answer: "Em alguns casos é possível manter parte do treino com redução de impacto e ajustes de volume. A avaliação fisioterapêutica ajuda a determinar a progressão segura.",
  },
  {
    question: "Tendinite do Aquiles pode virar ruptura?",
    answer: "Sim. Se a sobrecarga continuar sem tratamento adequado, a tendinopatia pode evoluir para ruptura parcial ou total do tendão.",
  },
  {
    question: "Exercício excêntrico realmente funciona?",
    answer: "Sim. Exercícios excêntricos para a panturrilha são considerados padrão-ouro no tratamento da tendinopatia do Aquiles.",
  },
];

const TendiniteAquiles = () => {
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20tratamento%20de%20tendinite%20do%20Aquiles.", "_blank");
  };
  const handleAgendar = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20tendinite%20do%20Aquiles.", "_blank");
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Tendinite do Aquiles em Corredores: tratamento da dor no tendão de Aquiles em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Fisioterapia esportiva especializada no tratamento de tendinite do Aquiles para corredores em Ribeirão Preto.
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary">O que é Tendinite do Aquiles?</h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              A tendinite do Aquiles é uma <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesão comum em corredores</Link> causada por sobrecarga repetitiva no tendão de Aquiles, o maior tendão do corpo humano.
            </p>
            <p>
              Na <strong className="text-foreground">CareFit Run Base</strong> realizamos tratamento com <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline">fisioterapia esportiva</Link> especializada para reduzir dor, restaurar função e permitir retorno progressivo à corrida.
            </p>
            <p>
              Atendemos corredores de 5 km, 10 km, meia maratona, maratona e triatletas que desenvolvem dor no tendão de Aquiles durante ou após a corrida.
            </p>
            <p>
              O <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline">fortalecimento específico para corredores</Link> é fundamental para reduzir o risco de sobrecarga no tendão, e protocolos de <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline">recovery</Link> ajudam a melhorar a recuperação entre sessões de treino.
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
            Se você está com dor no tendão de Aquiles, nossa equipe pode ajudar no seu tratamento e retorno à corrida.
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

export default TendiniteAquiles;
