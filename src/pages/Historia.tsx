import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Heart, Users, Target, MapPin, Clock } from "lucide-react";
const Historia = () => {
  const equipe = [{
    nome: "Gustavo",
    papel: "Fundador & Ultramaratonista",
    descricao: "A paixão pela corrida de longa distância e a experiência como ultramaratonista deram origem ao conceito da CareFit Run Base. Gustavo entendeu na prática que performance nasce do cuidado preventivo.",
    especialidade: "Visão estratégica e experiência em ultramaratona",
    icon: Award,
    color: "from-accent to-earth"
  }, {
    nome: "Livia",
    papel: "Fisioterapeuta e Agente da Performance",
    descricao: "Responsável por ampliar o conceito original, Livia trouxe a dimensão científica e o olhar humanizado que transforma tratamento em jornada de autoconhecimento.",
    especialidade: "Desenvolvimento de protocolos e experiência do cliente",
    icon: Heart,
    color: "from-secondary to-primary"
  }, {
    nome: "Educador Físico",
    papel: "Especialista em Performance",
    descricao: "Desenvolvendo protocolos de fortalecimento e condicionamento específicos para corredores, integrando ciência e prática esportiva.",
    especialidade: "Condicionamento físico e preparação esportiva",
    icon: Target,
    color: "from-warm to-accent"
  }, {
    nome: "Nutricionista",
    papel: "Especialista em Nutrição Esportiva",
    descricao: "Criando planos nutricionais personalizados que potencializam performance e aceleram a recuperação dos atletas.",
    especialidade: "Nutrição esportiva e metabolismo",
    icon: Users,
    color: "from-primary to-secondary"
  }, {
    nome: "Fisioterapeuta",
    papel: "Líder de Reabilitação",
    descricao: "Especializado em reabilitação e tratamento específico para corredores, focando na recuperação completa e retorno seguro aos treinos.",
    especialidade: "Reabilitação e fisioterapia esportiva",
    icon: Heart,
    color: "from-earth to-warm"
  }];
  const timeline = [{
    ano: "2022",
    emoji: "🏁",
    titulo: "O Despertar",
    descricao: "Gustavo percebe que o cuidado com o corredor é fragmentado. Das longas distâncias e dores veio a pergunta que mudaria tudo: \"Por que esperar a dor chegar?\""
  }, {
    ano: "2023",
    emoji: "🧩",
    titulo: "Os Primeiros Passos",
    descricao: "Nasce a CareFit Recovery, com um novo olhar sobre o cuidado. Gustavo e Lívia unem ciência e propósito para transformar o recovery em parceiro da performance."
  }, {
    ano: "2024",
    emoji: "💪",
    titulo: "Crescimento e Validação",
    descricao: "Chegam Guilherme e Arthur, completando o time. Força, nutrição e fisioterapia integradas tornam a CareFit referência em prevenção e performance."
  }, {
    ano: "2025",
    emoji: "🏃‍♀️",
    titulo: "O Hub do Corredor",
    descricao: "Surge a CareFit Run Base, um espaço 100% preparado para a jornada do atleta. O sonho se torna real: um centro de transformação que une ciência, cuidado e propósito."
  }];
  return <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Nossa História
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            A jornada que nos trouxe até aqui: da paixão pela corrida ao conceito revolucionário de cuidado preventivo.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-6">
                🏃‍♂️ Do Asfalto à Revolução no Cuidado
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Tudo começou com uma pergunta simples: <strong className="text-accent">"Por que esperar a dor chegar?"</strong>
                </p>
                <p>
                  Gustavo, maratonista e ultramaratonista apaixonado, conhecia intimamente os desafios do corpo em longas distâncias.
                  Cada quilômetro percorrido era uma lição sobre limites, recuperação e a importância de uma base sólida.
                </p>
                <p>
                  Em 2020, nasceu a CareFit Recovery, com uma proposta diferente: cuidar antes de precisar tratar.
                  Não era apenas mais uma clínica — era o início de um conceito revolucionário no cuidado com o atleta.
                </p>
                <p>
                  Com a chegada da Lívia, fisioterapeuta especializada em corrida, o projeto ganhou dimensões científicas e humanas que transformaram completamente a experiência do atleta.
                  Os fisioterapeutas deixaram de ser apenas profissionais de tratamento para se tornarem parceiros de performance.
                </p>
                <p>
                  A soma do conhecimento de Gustavo — com mais de 20 maratonas e ultramaratonas no currículo, vivência em inúmeros ciclos de preparação e a criação do mapa mental como ferramenta de acompanhamento — com a visão da Lívia, que através da fisioterapia desenvolveu metodologias de prevenção de lesões, redução da fadiga e compreensão profunda da corrida, estruturou a base única que hoje sustenta a CareFit Run Base.
                </p>
                <p>
                  Mas a história não parou aí.
                </p>
                <p>
                  Com a entrada do educador físico esportivo Guilherme Coelho, a CareFit ganhou uma nova dimensão na preparação de força. Corredor e personal trainer experiente, Guilherme trouxe sua vivência prática e técnica para dentro da metodologia CareFit, criando programas específicos de fortalecimento voltados para a corrida, com o objetivo de melhorar a economia de energia, aumentar a potência e prevenir lesões.
                  Cada treino é pensado para que o corpo do atleta não apenas suporte os quilômetros — mas responda com eficiência a cada passo.
                </p>
                <p>
                  Logo depois, a chegada do nutricionista Arthur Angelotti completou o ecossistema. Também maratonista, Arthur entende que alimentação é o combustível do corredor.
                  Mais do que prescrever dietas, ele traduz a nutrição em performance real, integrando estratégias de energia, recuperação e longevidade esportiva à rotina de cada atleta.
                  Com ele, o cuidado se tornou completo — corpo, mente e nutrição trabalhando em sintonia para sustentar o propósito de correr com equilíbrio e constância.
                </p>
                <p>
                  Hoje, Gustavo, Lívia, Guilherme e Arthur formam o coração da CareFit Run Base.
                  Um time de especialistas que vive o que ensina — corredores, profissionais e visionários que transformaram o simples ato de correr em um movimento de autocuidado, performance e propósito.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-accent to-earth rounded-full opacity-20 flex items-center justify-center">
                <Award className="w-32 h-32 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              Nosso Time de Líderes
            </h2>
            <p className="text-xl text-primary/80 max-w-3xl mx-auto font-poppins">
              As mentes visionárias por trás da transformação no cuidado esportivo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl font-montserrat font-bold text-white">GR</span>
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">Gustavo Rosa</h3>
                <p className="text-secondary font-montserrat font-semibold mb-4">Fundador e Head Coach</p>
                <p className="text-primary/70 font-poppins">Com mais de 20 Ultramaratonas e Maratonas. Criador da metodologia CareFit e especialista em transformação de corredores.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl font-montserrat font-bold text-white">LD</span>
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">Lívia Dias</h3>
                <p className="text-secondary font-montserrat font-semibold mb-4">Fisioterapeuta Esportiva & Agente de Performance</p>
                <p className="text-primary/70 font-poppins">Especialista em prevenção e recovery, corredora apaixonada que une ciência e sensibilidade no cuidado de cada atleta.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl font-montserrat font-bold text-white">GC</span>
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">Guilherme Coelho</h3>
                <p className="text-secondary font-montserrat font-semibold mb-4">Educador Físico</p>
                <p className="text-primary/70 font-poppins">Corredor dos rápidos e especialista em fortalecimento funcional para corredores, focado em construir a base que sustenta cada quilômetro da jornada.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl font-montserrat font-bold text-white">AA</span>
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">Arthur Angelotti</h3>
                <p className="text-secondary font-montserrat font-semibold mb-4">Nutricionista Esportivo</p>
                <p className="text-primary/70 font-poppins">Maratonista e especialista em nutrição para performance, desenvolvendo estratégias alimentares que transformam treinos em conquistas.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Nossa Evolução
            </h2>
            <p className="text-xl text-muted-foreground">
              Marcos importantes na construção da CareFit Run Base
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-accent to-primary h-full"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => <div key={index} className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center flex-shrink-0 z-10">
                    <span className="text-3xl">
                      {item.emoji}
                    </span>
                  </div>
                  <Card className="flex-1 border-l-4 border-accent">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-accent">
                          {item.ano}
                        </span>
                        <CardTitle className="text-xl text-primary">
                          {item.titulo}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {item.descricao}
                      </p>
                    </CardContent>
                  </Card>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Values & Mission */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              O que nos move todos os dias
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <Users className="w-12 h-12 text-accent mb-4" />
                <CardTitle className="text-2xl">Nossa Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  Transformar a relação dos corredores com o cuidado, provando que prevenção é a estratégia 
                  mais inteligente para uma performance duradoura e consciente.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <Heart className="w-12 h-12 text-accent mb-4" />
                <CardTitle className="text-2xl">Nossa Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  Ser reconhecida como a base fundamental de todo corredor que entende que cuidar não é parar, 
                  mas sim a forma mais inteligente de seguir em frente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <MapPin className="w-12 h-12 text-accent mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-4">
                Nossa Base
              </h3>
              <p className="text-muted-foreground mb-4">
                Um espaço especialmente pensado para acolher corredores em todas as fases de sua jornada.
              </p>
              <div className="bg-muted rounded-lg p-6">
                <p className="font-medium text-primary">Av. Áurea Aparecida Bragheto Machado, 241</p>
                <p className="text-muted-foreground">City Ribeirão, Ribeirão Preto - SP, 14021-460</p>
              </div>
            </div>

            <div>
              <Clock className="w-12 h-12 text-accent mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-4">
                Horário de Funcionamento
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Segunda a Sexta:</span>
                  <span className="font-medium">8h às 18:30h</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados:</span>
                  <span className="font-medium">8h às 12h</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos:</span>
                  <span className="font-medium">Fechado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-3xl font-bold text-primary mb-6">
              Faça parte da nossa história
            </h3>
            <p className="text-xl text-muted-foreground mb-8">
              Estamos prontos para cuidar da sua jornada e fazer você parte desta comunidade especial.
            </p>
            <Button variant="hero" size="lg" onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}>
              Comece sua jornada conosco
            </Button>
          </div>
        </div>
      </section>
    </div>;
};
export default Historia;