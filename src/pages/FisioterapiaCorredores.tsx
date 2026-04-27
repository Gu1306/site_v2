import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Shield, Activity, Heart, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";

import equipamentosFisio from "@/assets/equipamentos_fisio.jpg";

const lesoes = [
  {
    title: "Canelite (Síndrome do Estresse Tibial Medial)",
    link: "/canelite-ribeirao-preto",
    description: "Dor na região da canela causada por sobrecarga repetitiva. Comum em corredores que aumentam volume ou intensidade rapidamente. O tratamento inclui fortalecimento muscular, correção biomecânica e ajuste do plano de treino.",
    icon: AlertTriangle,
  },
  {
    title: "Fascite Plantar",
    link: "/fascite-plantar-ribeirao-preto",
    description: "Inflamação da fáscia plantar que causa dor intensa no calcanhar, especialmente nos primeiros passos da manhã. A fisioterapia atua com terapia manual, exercícios de alongamento e fortalecimento específicos.",
    icon: AlertTriangle,
  },
  {
    title: "Tendinite do Aquiles",
    link: "/tendinite-aquiles-ribeirao-preto",
    description: "Lesão no tendão de Aquiles por uso excessivo, gerando dor e rigidez na parte posterior do tornozelo. O tratamento envolve exercícios excêntricos, controle de carga e técnicas de terapia manual.",
    icon: AlertTriangle,
  },
  {
    title: "Dor no Joelho (Síndrome Patelofemoral)",
    link: "/dor-no-joelho-corrida-ribeirao-preto",
    description: "Dor na região anterior do joelho, frequente em corredores. Causada por desequilíbrios musculares e alterações biomecânicas. A reabilitação foca no fortalecimento de quadríceps, glúteos e estabilidade do quadril.",
    icon: AlertTriangle,
  },
];

const faqItems = [
  {
    question: "Quanto tempo leva para tratar uma lesão de corrida?",
    answer: "O tempo depende do tipo de lesão, do histórico do atleta e da fase da reabilitação. Lesões leves podem melhorar em algumas semanas, enquanto quadros mais complexos exigem acompanhamento mais prolongado.",
  },
  {
    question: "Posso continuar correndo durante o tratamento?",
    answer: "Em muitos casos é possível manter parte do treino com ajustes de carga e intensidade. A decisão é sempre baseada na avaliação do fisioterapeuta.",
  },
  {
    question: "Qual a diferença entre fisioterapia comum e fisioterapia para corredores?",
    answer: "A fisioterapia para corredores considera a biomecânica da corrida, o impacto repetitivo e as demandas específicas do esporte.",
  },
  {
    question: "Preciso estar lesionado para procurar fisioterapia?",
    answer: "Não. Muitos corredores buscam avaliação preventiva para melhorar mobilidade, força e biomecânica da corrida.",
  },
  {
    question: "A CareFit atende convênio?",
    answer: "A CareFit Run Base trabalha com atendimento especializado e individualizado. Para informações sobre valores e formas de atendimento, entre em contato diretamente com nossa equipe.",
  },
  {
    question: "Como funciona a primeira consulta?",
    answer: "Na primeira consulta realizamos uma avaliação completa que inclui histórico de treinos, análise funcional, mobilidade, força muscular e definição de um plano de tratamento personalizado.",
  },
];

const FisioterapiaCorredores = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Fisioterapia Esportiva para Corredores em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Centro especializado em tratamento, prevenção de lesões e performance para corrida. Atendimento multidisciplinar integrado ao seu treino.
          </p>
          <Button
            variant="hero"
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20de%20fisioterapia%20para%20corrida.', '_blank')}
          >
            Agendar avaliação
          </Button>
        </div>
      </section>

      {/* 1. Introdução */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Por que a fisioterapia é essencial para corredores?
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              A corrida é um dos esportes com maior índice de lesões por repetição. Estudos mostram que <strong className="text-foreground">até 79% dos corredores sofrem pelo menos uma lesão por ano</strong>. A maioria dessas lesões é causada por sobrecarga, desequilíbrios musculares e falta de acompanhamento especializado.
            </p>
            <p>
              A fisioterapia esportiva específica para corredores vai além do tratamento da dor. Ela atua na <strong className="text-foreground">prevenção de lesões, na correção biomecânica da corrida e na melhora da performance</strong>.
            </p>
            <p>
              Na <strong className="text-foreground">CareFit Run Base</strong>, em Ribeirão Preto, a fisioterapia está integrada a um ecossistema completo de cuidado ao corredor: <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline">fortalecimento</Link>, <Link to="/nutricao-para-corredores-ribeirao-preto" className="text-accent hover:underline">nutrição</Link>, <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline">recovery</Link> e treinamento mental. Isso garante resultados mais rápidos e duradouros.
            </p>
            <p>
              Atendemos corredores de 5 km, 10 km, meia maratona, maratona e também triatletas que buscam tratar lesões, melhorar a biomecânica da corrida e retornar aos treinos com segurança e performance.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Principais Lesões */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Principais Lesões na Corrida
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça as lesões mais comuns entre corredores e como a fisioterapia especializada pode tratá-las.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {lesoes.map((lesao, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <lesao.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-3">
                        <Link to={lesao.link} className="hover:text-accent transition-colors">
                          {lesao.title}
                        </Link>
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{lesao.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Como Funciona a Avaliação */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  Como Funciona a Avaliação na CareFit
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa avaliação é completa e específica para corredores. Vamos além da queixa principal para entender todo o contexto da sua corrida.
              </p>
              <ul className="space-y-4">
                {[
                  "Anamnese detalhada: histórico de treinos, provas e lesões",
                  "Avaliação postural e de mobilidade articular",
                  "Testes funcionais específicos para corrida",
                  "Análise de força muscular e estabilidade",
                  "Avaliação de calçado e pisada",
                  "Plano de tratamento personalizado e integrado",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={equipamentosFisio}
                  alt="Avaliação de fisioterapia para corredores na CareFit Run Base em Ribeirão Preto"
                  className="w-full h-80 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tratamento e Recuperação */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Tratamento e Recuperação
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Na CareFit, o tratamento de lesões vai além da sessão de fisioterapia. Trabalhamos de forma <strong className="text-foreground">integrada com fortalecimento, nutrição e recovery</strong> para acelerar sua recuperação e evitar recidivas.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {[
              { title: "Terapia Manual", desc: "Mobilização articular, liberação miofascial e técnicas de tecidos moles para restaurar mobilidade e reduzir dor." },
              { title: "Exercícios Terapêuticos", desc: "Protocolos de fortalecimento e alongamento específicos para cada lesão e fase da reabilitação." },
              { title: "Recovery Integrado", desc: "Banheiras de imersão, botas de compressão pneumática e crioterapia para potencializar a recuperação." },
              { title: "Retorno Gradual ao Treino", desc: "Progressão segura de volume e intensidade, com critérios claros para cada fase do retorno à corrida." },
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

      {/* 5. Prevenção de Lesões */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Prevenção de Lesões
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-10">
            <p>
              O melhor tratamento é a prevenção. Na CareFit, identificamos fatores de risco <strong className="text-foreground">antes que eles se tornem lesões</strong>. Nosso programa preventivo inclui:
            </p>
          </div>
          <div className="space-y-4">
            {[
              "Avaliação periódica de mobilidade, força e estabilidade",
              "Programa de fortalecimento preventivo personalizado",
              "Orientação sobre progressão segura de volume de treino",
              "Análise biomecânica da corrida",
              "Protocolos de recovery entre sessões de treino",
              "Integração com nutrição para saúde musculoesquelética",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Retorno Seguro à Corrida */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-earth rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Retorno Seguro à Corrida
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              O retorno à corrida após uma lesão exige <strong className="text-foreground">critérios claros e progressão controlada</strong>. Na CareFit, utilizamos um protocolo de retorno baseado em evidências que considera:
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { step: "1", title: "Fase de Proteção", desc: "Controle da dor e inflamação, manutenção do condicionamento com atividades de baixo impacto." },
              { step: "2", title: "Fase de Reabilitação", desc: "Recuperação de força, mobilidade e estabilidade. Exercícios progressivos e específicos." },
              { step: "3", title: "Retorno ao Treino", desc: "Reintrodução gradual da corrida com monitoramento de sintomas e ajuste contínuo do plano." },
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-md text-center">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-3">{item.title}</h3>
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
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Agende sua Avaliação na CareFit Run Base
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você é corredor ou triatleta em Ribeirão Preto e quer tratar uma lesão, prevenir problemas futuros ou melhorar sua performance na corrida, agende sua avaliação na CareFit Run Base.
          </p>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Nossa equipe especializada em fisioterapia esportiva para corredores está pronta para ajudar você a correr melhor e com mais segurança.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20de%20fisioterapia%20para%20corrida.', '_blank')}
            >
              Agendar avaliação
            </Button>
            <Button
              variant="whatsapp"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20de%20fisioterapia%20para%20corrida.', '_blank')}
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-6">
            Av. Áurea Aparecida Bragheto Machado, 241 — Ribeirão Preto, SP
          </p>
        </div>
      </section>
    </div>
  );
};

export default FisioterapiaCorredores;
