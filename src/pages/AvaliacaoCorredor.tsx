import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle, Heart, Activity, MessageCircle, MapPin, Users, ClipboardCheck, Search, Trophy, Calendar } from "lucide-react";
import Footer from "@/components/Footer";
import { OFERTAS, ORIENTACOES, agendamentoCarefit, whatsappOferta } from "@/lib/ofertasCarefit";

// Esta página é a da avaliação de reabilitação: nome, duração e preço vêm de ofertasCarefit.ts.
const AVALIACAO = OFERTAS.reabilitacao;
const DUPLA = OFERTAS.dupla;
const AGENDAR = agendamentoCarefit("reabilitacao");
const O_QUE_LEVAR = ORIENTACOES.find((item) => item.q === "O que preciso levar?")?.a;

const avaliacaoInclui = [
  "Anamnese completa sobre histórico de treinos e provas",
  "Análise do histórico de lesões",
  "Avaliação postural",
  "Testes de mobilidade articular",
  "Testes de força muscular específicos para corrida",
  "Exercícios funcionais",
  "Testes de estabilidade e controle motor",
  "Manipulação manual e avaliação clínica da região dolorosa",
];

const fatoresRisco = [
  "Fraqueza muscular em glúteos e quadríceps",
  "Rigidez na panturrilha ou tornozelo",
  "Alterações na biomecânica da corrida",
  "Aumento rápido de volume de treino",
  "Recuperação insuficiente entre sessões",
];

const lesoesComuns = [
  { nome: "Canelite", link: "/canelite-ribeirao-preto" },
  { nome: "Fascite plantar", link: "/fascite-plantar-ribeirao-preto" },
  { nome: "Tendinite do Aquiles", link: "/tendinite-aquiles-ribeirao-preto" },
  { nome: "Dor no joelho do corredor", link: "/dor-no-joelho-corrida-ribeirao-preto" },
  { nome: "Síndrome da banda iliotibial", link: "/banda-iliotibial-ribeirao-preto" },
  { nome: "Fraturas por estresse", link: "/fratura-por-estresse-ribeirao-preto" },
];

const indicacoes = [
  "Estão com dor durante a corrida",
  "Sofreram alguma lesão recente",
  "Querem voltar a correr depois de parar por uma lesão",
  "Sentem que uma dor está mudando o jeito de correr",
];

const faqItems = [
  {
    question: "Quanto tempo dura a avaliação?",
    answer: `São ${AVALIACAO.duracao}.`,
  },
  {
    question: "Quanto custa?",
    answer: `A ${AVALIACAO.nome.toLowerCase()} custa ${AVALIACAO.valor}. Os valores das sessões de tratamento estão na página de planos.`,
  },
  {
    question: "Preciso estar com dor para fazer a avaliação?",
    answer: `Esta avaliação é para quem está com dor ou lesão que limita a corrida. Sem dor, o caminho é a ${DUPLA.nome}, que também começa por uma avaliação.`,
  },
  {
    question: "A avaliação inclui tratamento?",
    answer: "Ela termina com a proposta de tratamento para o seu caso. O tratamento segue em sessões de fisioterapia, agendadas depois da avaliação.",
  },
  ...(O_QUE_LEVAR ? [{ question: "O que preciso levar?", answer: O_QUE_LEVAR }] : []),
];

const AvaliacaoCorredor = () => {
  const handleWhatsApp = () => {
    window.open(whatsappOferta("reabilitacao"), "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Avaliação do Corredor em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Para corredores e triatletas com dor ou lesão que limita a corrida. Entenda as causas e saia com a proposta de tratamento para o seu caso.
          </p>
          <p className="text-lg text-white/80 mb-8">
            {AVALIACAO.nome}: {AVALIACAO.duracao}, {AVALIACAO.valor}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="hero" size="lg" className="text-lg px-8 py-4">
              <Link to={AGENDAR}>Agendar avaliação</Link>
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Seção 1 — Introdução */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              A avaliação do corredor é o primeiro passo para entender por que dores e <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões</Link> aparecem na corrida.
            </p>
            <p>
              Na CareFit Run Base, em Ribeirão Preto, realizamos uma avaliação completa que analisa não apenas a dor atual do atleta, mas todo o contexto da corrida: histórico de treinos, biomecânica, força muscular, mobilidade e padrões de movimento.
            </p>
            <p>
              Nosso objetivo é <strong className="text-foreground">identificar a causa real do problema</strong>, não apenas tratar os sintomas.
            </p>
            <p>
              Essa abordagem permite tratar lesões com mais eficiência e também prevenir que elas voltem a acontecer.
            </p>
          </div>
        </div>
      </section>

      {/* Seção 2 — Como funciona */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <ClipboardCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Como funciona a avaliação do corredor na CareFit
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-8">
            <p>
              A avaliação é feita por um <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline">fisioterapeuta da equipe</Link>. {AVALIACAO.resumo}
            </p>
            <p>
              Durante esse período, o corredor passa por uma série de testes clínicos e funcionais que ajudam a identificar fatores de risco para lesões.
            </p>
            <p>A avaliação inclui:</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {avaliacaoInclui.map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-background p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mt-8">
            Essa análise detalhada permite entender como o corpo do corredor está respondendo às cargas de treino.
          </p>
        </div>
      </section>

      {/* Seção 3 — Por que é importante */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <Search className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Por que todo corredor deveria fazer uma avaliação?
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-8">
            <p>
              Muitas lesões na corrida não aparecem de forma repentina. Elas são resultado de desequilíbrios que se acumulam ao longo do tempo.
            </p>
            <p>Entre os fatores mais comuns identificados na avaliação estão:</p>
          </div>
          <div className="space-y-4 mb-8">
            {fatoresRisco.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Quando esses fatores não são identificados, o corredor continua treinando e a dor tende a piorar.
            </p>
            <p>
              A avaliação permite corrigir esses pontos antes que eles se tornem uma lesão mais grave.
            </p>
          </div>
        </div>
      </section>

      {/* Seção 4 — Lesões comuns */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-warm to-accent rounded-full flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Lesões mais comuns identificadas na avaliação
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Na CareFit Run Base atendemos corredores com diferentes tipos de <Link to="/lesoes-na-corrida" className="text-accent hover:underline">lesões relacionadas à corrida</Link>. Entre as mais comuns estão:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {lesoesComuns.map((lesao, index) => (
              <Link key={index} to={lesao.link} className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Heart className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-accent hover:underline font-medium">{lesao.nome}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seção 5 — Experiência */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Experiência no tratamento de corredores
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Na CareFit Run Base já atendemos <strong className="text-foreground">mais de 395 corredores</strong>.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">Nosso trabalho combina:</p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Fisioterapia esportiva especializada</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Fortalecimento específico para corrida</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Protocolos de recovery</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-foreground font-medium">Orientação de retorno progressivo ao treino</span>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Essa abordagem integrada permite tratar lesões com segurança e reduzir o risco de recidiva.
          </p>
        </div>
      </section>

      {/* Seção 6 — Ecossistema */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-earth to-secondary rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Avaliação integrada ao ecossistema CareFit
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Na CareFit Run Base a avaliação não funciona isoladamente. Ela faz parte de um sistema integrado que inclui:
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Fisioterapia esportiva para corredores</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Fortalecimento específico para corrida</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/recovery-corredores-ribeirao-preto" className="text-accent hover:underline font-medium">Protocolos de recovery</Link>
            </div>
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
              <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
              <Link to="/teste-de-forca-ribeirao-preto" className="text-accent hover:underline font-medium">Teste de força</Link>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Essa integração permite olhar para o atleta de forma completa e estruturar um plano de evolução seguro.
          </p>
        </div>
      </section>

      {/* Seção 7 — Para quem é indicada */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Quando o corredor deve fazer uma avaliação?
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            A avaliação é indicada para corredores que:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {indicacoes.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-muted p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mt-8">
            Sem dor, e querendo cuidar da recuperação e da performance? Comece pela{" "}
            <Link to={DUPLA.pagina} className="text-accent hover:underline font-medium">{DUPLA.nome}</Link>, que também começa por uma avaliação.
          </p>
        </div>
      </section>

      {/* Seção 8 — FAQ */}
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
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <p className="text-white/90 text-lg mb-6">
            A CareFit Run Base é um centro especializado em fisioterapia esportiva para corredores em Ribeirão Preto, focado em performance, prevenção de lesões e longevidade no esporte.
          </p>
          <h2 className="text-4xl font-bold text-white mb-6">
            Agende sua Avaliação na CareFit Run Base
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você é corredor ou triatleta em Ribeirão Preto e quer entender melhor seu corpo e sua corrida, nossa equipe pode ajudar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild variant="hero" size="lg" className="text-lg px-8 py-4">
              <Link to={AGENDAR}>Agendar avaliação</Link>
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

export default AvaliacaoCorredor;
