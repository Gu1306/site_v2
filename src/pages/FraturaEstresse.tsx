import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Shield, Activity, Heart, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

const causas = [
  "Aumento rápido e excessivo do volume de treino",
  "Baixa disponibilidade energética (deficiência calórica)",
  "Falta de fortalecimento ósseo e muscular",
  "Biomecânica alterada da corrida",
  "Deficiência de vitamina D ou cálcio",
  "Corrida excessiva em superfícies duras",
];

const sintomas = [
  "Dor localizada que piora com a atividade e melhora com repouso",
  "Dor que começa sutil e se torna progressivamente mais intensa",
  "Sensibilidade ao toque em um ponto específico do osso",
  "Inchaço leve na região afetada",
];

const tratamentos = [
  { title: "Diagnóstico e Avaliação", desc: "Avaliação clínica detalhada com encaminhamento para exames de imagem quando necessário." },
  { title: "Controle de Carga", desc: "Período de repouso relativo com atividades de baixo impacto para manter condicionamento sem sobrecarregar o osso." },
  { title: "Reabilitação Progressiva", desc: "Programa gradual de retorno à atividade com fortalecimento muscular e ósseo." },
  { title: "Retorno à Corrida", desc: "Protocolo de retorno progressivo com monitoramento de sintomas e critérios claros para cada fase." },
];

const prevencao = [
  "Progressão gradual do volume de treino",
  "Nutrição adequada com atenção ao cálcio e vitamina D",
  "Disponibilidade energética suficiente (não treinar em déficit calórico extremo)",
  "Fortalecimento muscular específico para corrida",
  "Alternância de superfícies de treino",
  "Avaliação periódica de fatores de risco",
];

const faqItems = [
  {
    question: "Quanto tempo leva para recuperar de uma fratura por estresse?",
    answer: "O tempo de recuperação depende do osso afetado e da gravidade da lesão. Em muitos casos o retorno à corrida pode ocorrer após algumas semanas ou meses de reabilitação adequada.",
  },
  {
    question: "Posso correr com fratura por estresse?",
    answer: "Na maioria dos casos é necessário interromper temporariamente a corrida para permitir a consolidação óssea e evitar agravamento da lesão.",
  },
  {
    question: "Quais ossos são mais afetados em corredores?",
    answer: "Os ossos mais afetados são tíbia, metatarsos, fêmur e calcâneo, devido ao impacto repetitivo da corrida.",
  },
  {
    question: "Como diferenciar fratura por estresse de canelite?",
    answer: "A canelite causa dor difusa na canela, enquanto a fratura por estresse costuma apresentar dor localizada em um ponto específico do osso.",
  },
];

const FraturaEstresse = () => {
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20tratamento%20de%20fratura%20por%20estresse.", "_blank");
  };
  const handleAgendar = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20fratura%20por%20estresse.", "_blank");
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="relative py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Fratura por Estresse em Corredores: tratamento e reabilitação em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Tratamento e reabilitação de fratura por estresse para corredores em Ribeirão Preto.
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary">O que é Fratura por Estresse?</h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              A fratura por estresse está entre as <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões mais graves relacionadas à sobrecarga na corrida</Link>, ocorrendo principalmente em corredores que aumentam o volume de treino rapidamente.
            </p>
            <p>
              O tratamento envolve diagnóstico adequado, controle de carga e reabilitação progressiva. Na <strong className="text-foreground">CareFit Run Base</strong> auxiliamos corredores no processo de recuperação e retorno seguro à corrida com <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline">fisioterapia esportiva especializada</Link>. Atendemos corredores de 5 km, 10 km, meia maratona, maratona e triatletas que desenvolvem fraturas por estresse devido ao aumento de carga de treino.
            </p>
            <p>
              O <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline">fortalecimento específico para corredores</Link> ajuda a reduzir o risco de lesões ósseas por sobrecarga. A <Link to="/nutricao-para-corredores-ribeirao-preto" className="text-accent hover:underline">nutrição adequada</Link> é essencial para saúde óssea e prevenção de fraturas por estresse.
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Causas</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Tratamento</h2>
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

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            A CareFit Run Base é um centro especializado em fisioterapia esportiva para corredores em Ribeirão Preto, com experiência no tratamento de lesões causadas pela corrida.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Agende sua Avaliação na CareFit Run Base</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você suspeita de fratura por estresse, nossa equipe de fisioterapia esportiva em Ribeirão Preto pode ajudar no diagnóstico e reabilitação.
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

export default FraturaEstresse;
