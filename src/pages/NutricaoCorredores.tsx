import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Shield, Activity, Heart, CheckCircle, MessageCircle, Zap, Users, Apple, Droplets, AlertTriangle } from "lucide-react";
import Footer from "@/components/Footer";

const audienceCards = [
  {
    title: "Corredores Iniciantes (5k/10k)",
    description: "Construa uma base nutricional sólida para sustentar os primeiros quilômetros com energia, disposição e sem desconforto gástrico.",
    icon: Activity,
  },
  {
    title: "Meia Maratona (21k)",
    description: "Estratégias de abastecimento durante a prova, periodização de carboidratos e hidratação para manter o ritmo nos 21k.",
    icon: Zap,
  },
  {
    title: "Maratona (42k)",
    description: "Planejamento nutricional completo: semanas antes, durante e pós-prova. Evite o temido 'muro dos 30k' com uma estratégia individualizada.",
    icon: Heart,
  },
  {
    title: "Triatletas",
    description: "Nutrição para três modalidades com demandas distintas. Transição entre natação, ciclismo e corrida exige planejamento específico.",
    icon: Users,
  },
  {
    title: "Corredores em Retorno de Lesão",
    description: "Nutrição como aliada da recuperação: anti-inflamatórios naturais, suporte à regeneração tecidual e manutenção da composição corporal.",
    icon: Shield,
  },
];

const cyclePhases = [
  {
    title: "Base",
    description: "Foco em construir reservas energéticas e garantir micronutrientes essenciais. Periodização mais flexível, com atenção à qualidade alimentar e à hidratação diária.",
  },
  {
    title: "Construção (volume/intensidade)",
    description: "Aumento estratégico de carboidratos para sustentar o volume de treino. Proteína distribuída ao longo do dia para recuperação muscular. Atenção redobrada à hidratação.",
  },
  {
    title: "Polimento (Taper)",
    description: "Redução do volume de treino sem reduzir a qualidade nutricional. Manutenção dos estoques de glicogênio e ajuste fino da composição das refeições pré-prova.",
  },
  {
    title: "Semana de Prova",
    description: "Supercompensação de carboidratos nos dias anteriores. Definição do plano de abastecimento para o dia da prova. Teste final de tolerância gástrica.",
  },
  {
    title: "Pós-Prova (Recovery)",
    description: "Reposição imediata de carboidratos e proteína. Alimentos anti-inflamatórios para acelerar a recuperação. Retorno gradual à rotina alimentar de treino.",
  },
];

const faqItems = [
  {
    question: "O que comer antes de correr?",
    answer: "A refeição pré-treino deve ser rica em carboidratos de fácil digestão, moderada em proteína e baixa em gordura e fibras. O ideal é comer de 1 a 3 horas antes, dependendo da intensidade. Exemplos: pão com geleia, banana com mel, ou mingau de aveia. A escolha é individual e deve ser testada em treinos.",
  },
  {
    question: "Preciso de gel em treinos longos?",
    answer: "Para treinos acima de 60–75 minutos, a reposição de carboidratos durante o exercício pode melhorar a performance e retardar a fadiga. Géis são uma opção prática, mas não a única — rapadura, banana e bebidas esportivas também funcionam. O mais importante é testar no treino, nunca na prova.",
  },
  {
    question: "Como evitar câimbras na corrida?",
    answer: "Câimbras são multifatoriais: fadiga muscular, desidratação, desequilíbrio eletrolítico e excesso de intensidade. Uma boa estratégia inclui hidratação com eletrólitos, treinamento adequado e nutrição equilibrada. Não existe solução mágica — o controle envolve vários fatores simultâneos.",
  },
  {
    question: "Dá para melhorar performance sem perder saúde?",
    answer: "Sim, e esse é o objetivo. Restrições calóricas extremas prejudicam a performance, a imunidade e a saúde óssea. A nutrição esportiva bem planejada otimiza composição corporal, energia e recuperação — sem comprometer a saúde do corredor.",
  },
  {
    question: "Como comer no pós-treino?",
    answer: "Após o treino, o corpo precisa repor glicogênio e iniciar a recuperação muscular. Combine carboidratos e proteína na proporção de 3:1 a 4:1 nas primeiras 2 horas. Exemplos: vitamina de frutas com whey, pão com ovo, ou arroz com frango e legumes.",
  },
  {
    question: "Qual o melhor suplemento para corredor?",
    answer: "Não existe um suplemento universal. As necessidades variam conforme o volume de treino, a alimentação e o objetivo. Os mais utilizados são: whey protein, creatina, cafeína e eletrólitos. Qualquer suplementação deve ser individualizada com acompanhamento profissional.",
  },
  {
    question: "Como ajustar nutrição em semanas de alto volume?",
    answer: "Semanas com maior volume exigem mais carboidratos, mais hidratação e atenção à recuperação. A periodização nutricional acompanha o plano de treino: dias de longão pedem mais energia, dias de descanso pedem qualidade sem excesso.",
  },
  {
    question: "Nutrição ajuda na prevenção de lesões?",
    answer: "Sim. A baixa disponibilidade energética (LEA) é um fator de risco importante para fraturas por estresse, lesões musculares e queda de imunidade. Uma nutrição adequada sustenta a saúde óssea, muscular e articular — reduzindo significativamente o risco de lesões.",
  },
  {
    question: "Preciso cortar carboidrato para emagrecer correndo?",
    answer: "Não. Carboidrato é o principal combustível da corrida. Cortá-lo prejudica a performance, a recuperação e aumenta o risco de lesões. O ajuste deve ser feito na quantidade e no timing — não na exclusão.",
  },
  {
    question: "A CareFit faz acompanhamento nutricional contínuo?",
    answer: "Sim. O acompanhamento é contínuo e integrado com fisioterapia, fortalecimento e recovery. Ajustamos o plano nutricional conforme as fases do treino, provas e objetivos do corredor.",
  },
];

const NutricaoCorredores = () => {
  const handleWhatsApp = () => {
    window.open(
      "https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20nutri%C3%A7%C3%A3o%20para%20corredores.",
      "_blank"
    );
  };

  const handleAgendar = () => {
    window.open(
      "https://api.whatsapp.com/send?phone=5516996008849&text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20nutricional%20para%20corrida.",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Nutrição para Corredores em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Coma para treinar melhor. Treine para correr mais forte. Nutrição aplicada à performance e à recuperação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={handleAgendar}
            >
              Agendar avaliação
            </Button>
            <Button
              variant="whatsapp"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Por que nutrição muda tudo */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Apple className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Por que nutrição muda tudo na corrida
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              A nutrição esportiva é um dos pilares da performance para corredores e triatletas. Na CareFit Run Base, em Ribeirão Preto, trabalhamos a nutrição aplicada à corrida para melhorar a <strong className="text-foreground">performance, acelerar a recuperação e reduzir o risco de lesões</strong>.
            </p>
            <p>
              Sem nutrição adequada, até o melhor plano de treino pode falhar. Com ela, cada sessão rende mais — e o corpo responde melhor.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-10">
            {[
              "Energia estável para treinos longos e intensos",
              "Recuperação muscular mais rápida entre sessões",
              "Fortalecimento do sistema imunológico",
              "Prevenção de lesões por baixa disponibilidade energética",
              "Composição corporal adequada sem restrição prejudicial",
              "Melhor adaptação ao treino e ganho de performance",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Para quem é */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Para Quem é
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Independentemente da distância ou nível, a nutrição faz diferença em cada fase da sua jornada como corredor.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {audienceCards.map((card, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mb-4">
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. O que você recebe na CareFit */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              O que Você Recebe na CareFit
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            Nosso acompanhamento nutricional é prático, individualizado e integrado à metodologia CareFit. Sem fórmulas genéricas — tudo adaptado à sua rotina e ao seu plano de treino.
          </p>
          <div className="space-y-4">
            {[
              "Avaliação completa de rotina alimentar e histórico de saúde",
              "Estratégia personalizada de carboidrato, proteína e hidratação",
              "Periodização nutricional alinhada às fases do ciclo de treino",
              "Ajustes específicos para treinos longos, intervalados e de alta intensidade",
              "Plano alimentar prático e aderente, com exemplos reais de refeições",
              "Suporte integrado com fisioterapia, fortalecimento e recovery (metodologia CareFit)",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Estratégias por fase do ciclo */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Estratégias por Fase do Ciclo de Treino
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A nutrição precisa acompanhar o que o treino exige. Cada fase do ciclo tem demandas diferentes — e a alimentação deve refletir isso.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cyclePhases.map((phase, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-3">{phase.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{phase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Nutrição na prova */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <Droplets className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Nutrição na Prova
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: "Carboidrato por Hora",
                desc: "A quantidade ideal varia de 30 a 90g/hora, dependendo da duração, intensidade e tolerância individual. Não existe número mágico — o plano deve ser testado em treino.",
              },
              {
                title: "Hidratação e Eletrólitos",
                desc: "Perdas de suor variam muito entre atletas. Reposição de sódio, potássio e magnésio deve ser planejada para evitar desidratação e hiponatremia.",
              },
              {
                title: "Testes em Treino Longo",
                desc: "Toda estratégia de prova deve ser simulada em treinos longos. Isso inclui tipo de gel, bebida, timing e volume — para evitar surpresas no dia D.",
              },
              {
                title: "Checklist: O que Levar",
                desc: "Géis ou carboidratos sólidos, bebida isotônica, cápsulas de sal (se necessário), relógio com alarme para lembretes de abastecimento.",
              },
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-foreground">
              <strong>Importante:</strong> cada atleta tem necessidades diferentes. As orientações acima são diretrizes gerais — recomenda-se avaliação individual para definir a estratégia ideal para sua prova.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Integração CareFit (diferencial) */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Integração CareFit: Nosso Diferencial
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-10">
            <p>
              Na CareFit Run Base, a nutrição não trabalha isolada. Ela faz parte de um ecossistema completo de cuidado ao corredor, integrado com todas as áreas que impactam sua performance e saúde.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-2">Fisioterapia Esportiva</h3>
                <p className="text-muted-foreground">
                  A nutrição adequada potencializa a recuperação de lesões e sustenta a saúde musculoesquelética durante o tratamento.
                </p>
                <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline text-sm mt-2 inline-block">
                  Saiba mais sobre fisioterapia →
                </Link>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-2">Fortalecimento para Corrida</h3>
                <p className="text-muted-foreground">
                  Proteína, timing e qualidade alimentar são fundamentais para ganho de força e prevenção de lesões no fortalecimento.
                </p>
                <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline text-sm mt-2 inline-block">
                  Saiba mais sobre fortalecimento →
                </Link>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-2">Recovery</h3>
                <p className="text-muted-foreground">
                  Nutrição pós-treino alinhada ao protocolo de recovery acelera a regeneração e prepara o corpo para o próximo estímulo.
                </p>
                <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline text-sm mt-2 inline-block">
                  Saiba mais sobre recovery →
                </Link>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-2">Retorno Pós-Lesão</h3>
                <p className="text-muted-foreground">
                  Ajustes nutricionais específicos para fases de imobilização, reabilitação e retorno gradual ao treino de corrida.
                </p>
                <Link to="/lesoes-na-corrida" className="text-accent hover:underline text-sm mt-2 inline-block">
                  Saiba mais sobre lesões na corrida →
                </Link>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={handleAgendar}
            >
              Agendar avaliação nutricional
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
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

      {/* 9. CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Quer correr melhor com uma estratégia nutricional para você?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Agende sua avaliação na CareFit Run Base e tenha um plano nutricional integrado ao seu treino de corrida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={handleAgendar}
            >
              Agendar avaliação
            </Button>
            <Button
              variant="whatsapp"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-6">
            Av. Áurea Aparecida Bragheto Machado, 241 — Ribeirão Preto, SP
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NutricaoCorredores;
