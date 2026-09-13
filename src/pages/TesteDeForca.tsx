import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle, Activity, MessageCircle, MapPin, Gauge, Scale, LineChart, ClipboardList, Info, Timer } from "lucide-react";
import Footer from "@/components/Footer";

const movimentos = [
  { nome: "Flexão de quadril", musculo: "Psoas e flexores do quadril", papel: "Eleva a coxa e conduz a passada à frente" },
  { nome: "Extensão de quadril", musculo: "Glúteo máximo e isquiotibiais", papel: "É o motor da propulsão na corrida" },
  { nome: "Abdução de quadril", musculo: "Glúteo médio e mínimo", papel: "Segura a pelve a cada apoio de uma perna só" },
  { nome: "Adução de quadril", musculo: "Adutores da coxa", papel: "Estabiliza o quadril e controla o desvio da perna" },
  { nome: "Extensão de joelho", musculo: "Quadríceps", papel: "Absorve o impacto a cada aterrissagem" },
  { nome: "Flexão de joelho", musculo: "Isquiotibiais", papel: "Desacelera a perna no fim do balanço" },
  { nome: "Flexão plantar", musculo: "Panturrilha (gastrocnêmio e sóleo)", papel: "Devolve energia na saída do pé do chão" },
];

const oQueResponde = [
  "Quanta força cada grupo muscular produz, em quilos, nos dois lados",
  "Se existe diferença entre o lado direito e o esquerdo, e de quanto",
  "Como está a relação entre músculos opostos do mesmo lado",
  "Dados para a equipe comparar com avaliações anteriores feitas na mesma montagem",
  "Onde vale concentrar o trabalho de fortalecimento nas próximas semanas",
];

const oQueNaoResponde = [
  "Não prevê se você vai se lesionar. Nenhum teste de força faz isso sozinho",
  "Não fecha diagnóstico. Quem interpreta é o fisioterapeuta, junto com o seu histórico",
  "Não mede técnica de corrida, mobilidade nem condicionamento cardiovascular",
  "Não substitui a avaliação clínica completa do corredor",
];

const paraQuem = [
  "Está em preparação para uma prova e quer saber onde está a base",
  "Voltou de lesão e quer comparar o lado afetado com o outro",
  "Faz fortalecimento e quer medir se está funcionando",
  "Sente dor ou cansaço sempre do mesmo lado",
  "Quer um ponto de partida objetivo antes de aumentar volume de treino",
];

const faqItems = [
  {
    question: "Quanto tempo dura o teste?",
    answer: "Cerca de 1 hora. São sete movimentos, testados nos dois lados, com três tentativas de cinco segundos em cada um e um minuto de descanso entre elas. Esse descanso não é tempo perdido: é o que impede que a fadiga da tentativa anterior reduza a força da seguinte.",
  },
  {
    question: "Dói? É seguro?",
    answer: "O teste é isométrico: você faz força contra uma resistência fixa, na posição orientada pela equipe. A adequação do teste é conferida individualmente. Avise sobre dor ou desconforto; a tentativa deve ser interrompida e reavaliada.",
  },
  {
    question: "Preciso estar lesionado para fazer?",
    answer: "Não. A avaliação também pode registrar um ponto de partida para corredores sem queixa, conforme seus objetivos e a orientação da equipe.",
  },
  {
    question: "Preciso me preparar de alguma forma?",
    answer: "Combine o preparo com a equipe e informe os treinos recentes, sintomas e condições que possam interferir na avaliação. Venha com roupa que permita as posições dos testes. Procure reproduzir o preparo nas reavaliações.",
  },
  {
    question: "De quanto em quanto tempo devo repetir?",
    answer: "O intervalo é definido com a equipe conforme seu objetivo e acompanhamento. Para comparar as medições, é necessário reproduzir protocolo, posição e condições da sessão; uma diferença numérica não comprova, sozinha, mudança real de força.",
  },
  {
    question: "O relatório serve para o meu treinador?",
    answer: "Serve, e é para isso que ele existe. O relatório traz os números de cada movimento e a comparação entre os lados. A equipe pode consultar o histórico e comparar sessões com montagens equivalentes; a comparação longitudinal ainda não aparece automaticamente no documento.",
  },
  {
    question: "Os números podem ser comparados com os de outro aparelho ou de outro lugar?",
    answer: "Não diretamente. O valor em quilos depende do aparelho, da posição do corpo e de onde a cinta é presa no membro. Por isso a CareFit repete sempre o mesmo protocolo: a comparação que vale é a sua com você mesmo, ao longo do tempo, e entre os seus dois lados.",
  },
];

const TesteDeForca = () => {
  const handleWhatsApp = () => {
    window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Teste de Força para Corredores em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Força que vira dado. Medimos a força dos seus dois lados com dinamômetro, em sete movimentos que sustentam a corrida, e entregamos um relatório que orienta o seu fortalecimento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              Agendar meu teste
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* O que é */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <Gauge className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              O que é o teste de força
            </h2>
          </div>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              É uma medição objetiva da sua força muscular, feita com um <strong className="text-foreground">dinamômetro</strong>: um sensor que registra exatamente quantos quilos de força você produz em cada movimento.
            </p>
            <p>
              Você faz força contra uma cinta fixa, sem que a articulação se mova. O sensor lê essa força centenas de vezes por segundo e registra o pico de cada tentativa. Repetimos três vezes em cada lado, e o resultado oficial é a média dessas três tentativas — não o melhor chute de um dia bom.
            </p>
            <p>
              A diferença entre isso e o teste de força feito na mão do fisioterapeuta é simples: aqui existe <strong className="text-foreground">um número</strong>. E número dá para comparar com o outro lado, com a avaliação de três meses atrás e com a de daqui a seis meses.
            </p>
          </div>
        </div>
      </section>

      {/* Os 7 movimentos */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Os sete movimentos avaliados
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Todos são de membros inferiores, e cada um tem uma função concreta dentro da passada:
          </p>
          <div className="space-y-4">
            {movimentos.map((item, index) => (
              <div key={index} className="bg-background p-5 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-foreground font-semibold text-lg">{item.nome}</h3>
                    <p className="text-sm text-accent mb-1">{item.musculo}</p>
                    <p className="text-muted-foreground">{item.papel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed mt-8">
            Cada um é testado nos dois lados, sempre na mesma posição e com o mesmo comando. É essa repetição rígida que permite comparar a sua avaliação de hoje com a do ano que vem.
          </p>
        </div>
      </section>

      {/* Como funciona a sessão */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-warm to-accent rounded-full flex items-center justify-center">
              <Timer className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Como funciona a sessão
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { titulo: "Preparação", texto: "Registramos peso, lado dominante e histórico recente de treino e de dor. Sem isso os números perdem contexto." },
              { titulo: "Posicionamento", texto: "Para cada movimento existe uma posição definida, com o corpo estabilizado por cintas. A estabilização não é conforto: é o que impede que você compense com o tronco e falseie o resultado." },
              { titulo: "Três tentativas", texto: "Cinco segundos de força crescente em cada uma, com um minuto de descanso entre elas. O comando é sempre o mesmo, dito da mesma forma." },
              { titulo: "Registro", texto: "As três tentativas ficam guardadas, inclusive a mais fraca. O resultado oficial é a média dos três picos; o maior pico entra como informação adicional." },
              { titulo: "Relatório", texto: "Você recebe o relatório com os números dos lados medidos e a comparação entre eles. As medições ficam registradas para acompanhamento pela equipe." },
            ].map((etapa, index) => (
              <div key={index} className="flex items-start gap-4 p-5 bg-muted rounded-lg">
                <ArrowRight className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-foreground font-semibold">{etapa.titulo}</h3>
                  <p className="text-muted-foreground">{etapa.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que responde / o que não responde */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              O que o teste responde
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {oQueResponde.map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-background p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-background border-l-4 border-accent p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-accent flex-shrink-0" />
              <h3 className="text-xl font-bold text-primary">E o que ele não responde</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Preferimos dizer isso antes, e não depois:
            </p>
            <ul className="space-y-3">
              {oQueNaoResponde.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-accent font-bold flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-4">
              Uma diferença entre os lados é uma informação, não um veredito. Ela ganha significado junto com o seu histórico de lesões, os seus sintomas e o que você consegue fazer correndo. Quem faz essa leitura é a nossa equipe de fisioterapia.
            </p>
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <LineChart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Para quem é
            </h2>
          </div>
          <div className="space-y-4 mb-8">
            {paraQuem.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            O teste conversa com o{" "}
            <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-accent hover:underline">fortalecimento para corredores</Link>{" "}
            e com a{" "}
            <Link to="/avaliacao-do-corredor-ribeirao-preto" className="text-accent hover:underline">avaliação do corredor</Link>: um mede, o outro trabalha em cima do que foi medido.
          </p>
        </div>
      </section>

      {/* Investimento */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-warm to-accent rounded-full flex items-center justify-center">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Investimento
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-background p-8 rounded-lg shadow-sm flex flex-col">
              <h3 className="text-foreground font-semibold text-lg mb-2">Avulso</h3>
              <p className="text-muted-foreground mb-4">Para quem ainda não tem plano ativo na CareFit.</p>
              <p className="text-4xl font-bold text-primary mt-auto">R$ 250</p>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-sm border-2 border-accent flex flex-col">
              <h3 className="text-foreground font-semibold text-lg mb-2">Com plano ativo</h3>
              <p className="text-muted-foreground mb-4">Para quem já está em acompanhamento na CareFit Run Base.</p>
              <p className="text-4xl font-bold text-accent mt-auto">R$ 190</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-6">
            O valor inclui a sessão completa de teste, o relatório e a devolutiva com o fisioterapeuta.
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
              <AccordionItem key={index} value={`item-${index}`} className="bg-muted/30 rounded-lg px-6 border-0 shadow-sm">
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
            A CareFit Run Base é um centro especializado em fisioterapia esportiva para corredores em Ribeirão Preto, focado em performance, prevenção de lesões e longevidade no esporte.
          </p>
          <h2 className="text-4xl font-bold text-white mb-6">
            Descubra onde está a sua base
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Uma hora de teste e você passa a ter um número para cada perna. É com ele que a gente decide o que treinar nas próximas semanas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              Agendar meu teste
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

export default TesteDeForca;
