import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Flag, Shield, Award, Heart, Users } from "lucide-react";
import CareFitLogo from "@/components/CareFitLogo";

const Manifesto = () => {
  const manifestoBlocks = [
    {
      icon: Heart,
      title: "Por que existimos",
      subtitle: "Cuidado antes da dor, da lesão, da dúvida",
      content: "Acreditamos que todo corredor merece uma base sólida. Existimos para transformar a forma como atletas se relacionam com seu corpo, oferecendo cuidado preventivo que vai além do tratamento - é preparação, é consciência, é longevidade na corrida.",
      color: "from-accent to-earth"
    },
    {
      icon: Shield,
      title: "No que acreditamos",
      subtitle: "Prevenção como estratégia, estrutura como diferencial",
      content: "A diferença entre correr e correr bem está na base. Acreditamos que performance nasce da prevenção, que força vem da recuperação adequada, e que cada atleta é único em sua jornada de evolução.",
      color: "from-secondary to-primary"
    },
    {
      icon: Award,
      title: "O que entregamos",
      subtitle: "Jornadas de 12 semanas, fisioterapeutas como agentes de performance",
      content: "Oferecemos muito mais que tratamento: desenvolvemos jornadas personalizadas onde fisioterapeutas se tornam seus parceiros de performance, integrando recovery, fortalecimento, nutrição e treinamento mental em um programa estruturado.",
      color: "from-warm to-accent"
    },
    {
      icon: Flag,
      title: "Como queremos ser lembrados",
      subtitle: "Como a base da corrida inteligente",
      content: "Queremos ser o lugar que transformou sua relação com a corrida. O espaço onde você descobriu que cuidar não é parar, mas sim a forma mais inteligente de seguir em frente, sempre.",
      color: "from-earth to-secondary"
    },
    {
      icon: Users,
      title: "Para quem fazemos",
      subtitle: "Dos 5K aos 42K, para quem corre com os pés e com a alma",
      content: "Para todo corredor que entende que a meta não é apenas cruzar a linha de chegada, mas chegar lá preparado, consciente e apaixonado. Para quem sabe que a verdadeira vitória está na jornada de autoconhecimento e cuidado.",
      color: "from-primary to-accent"
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <CareFitLogo size={40} className="mr-4" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Nosso Manifesto
            </h1>
            <CareFitLogo size={40} className="ml-4" />
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-4">
            Os valores e princípios que guiam cada passo da nossa jornada junto aos corredores
          </p>
          <div className="flex items-center justify-center text-white/80">
            <CareFitLogo size={20} className="mr-2" />
            <span className="text-sm font-medium">Seu desafio começa na base. A gente caminha junto até o topo.</span>
            <CareFitLogo size={20} className="ml-2" />
          </div>
        </div>
      </section>

      {/* Manifesto Blocks */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {manifestoBlocks.map((block, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12`}
              >
                <div className="lg:w-1/2">
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${block.color} rounded-full flex items-center justify-center`}>
                          <block.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-primary">
                            {block.title}
                          </CardTitle>
                          <p className="text-accent font-medium">
                            {block.subtitle}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {block.content}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:w-1/2 flex justify-center">
                  <div className={`w-80 h-80 bg-gradient-to-br ${block.color} rounded-full opacity-20 flex items-center justify-center`}>
                    <block.icon className="w-32 h-32 text-white/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-gradient-to-r from-warm to-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <blockquote className="text-3xl md:text-4xl font-bold text-white mb-8 italic">
            "Correr é mais que cruzar a linha de chegada — é começar com consciência."
          </blockquote>
          <p className="text-xl text-white/90 mb-8">
            A base está em recovery, fortalecimento, nutrição e mente treinada.
          </p>
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}
          >
            Inicie sua jornada
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Manifesto;