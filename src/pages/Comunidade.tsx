import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Heart, MessageSquare, Instagram, MapPin, Clock, Trophy } from "lucide-react";

const Comunidade = () => {
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");
  };

  const eventos = [
    {
      titulo: "Workshop: Nutrição para Corredores",
      data: "15 de Dezembro, 2024",
      horario: "9h às 12h",
      local: "CareFit RunBase",
      vagas: "15 vagas",
      status: "Inscrições Abertas"
    },
    {
      titulo: "Corrida da Comunidade CareFit",
      data: "22 de Dezembro, 2024", 
      horario: "6h30",
      local: "Parque Curupira",
      vagas: "Ilimitado",
      status: "Em Breve"
    },
    {
      titulo: "Palestra: Mindset do Corredor",
      data: "5 de Janeiro, 2025",
      horario: "19h às 21h",
      local: "CareFit RunBase",
      vagas: "20 vagas",
      status: "Em Breve"
    }
  ];

  const parcerias = [
    {
      nome: "Team Ribeirão Running",
      tipo: "Assessoria Esportiva",
      descricao: "Parceria para treinos específicos e preparação para provas"
    },
    {
      nome: "Ribeirão Runners",
      tipo: "Grupo de Corrida",
      descricao: "Encontros semanais e participação em eventos regionais"
    },
    {
      nome: "Maratona de Ribeirão Preto",
      tipo: "Evento Oficial",
      descricao: "Apoio técnico e suporte aos participantes"
    },
    {
      nome: "Ultra Trail Ribeirão",
      tipo: "Prova de Trail",
      descricao: "Preparação específica para corridas de montanha"
    }
  ];

  const depoimentos = [
    {
      nome: "Maria Silva",
      evento: "Maratona de São Paulo 2024",
      texto: "A preparação na CareFit foi fundamental. Terminei minha primeira maratona sem dor e com um sorriso no rosto!",
      tempo: "4h15min"
    },
    {
      nome: "João Santos",
      evento: "Ultra Trail 50k",
      texto: "O fortalecimento e recovery fizeram toda diferença. Consegui completar meu primeiro ultra sem lesões.",
      tempo: "5h30min"
    },
    {
      nome: "Ana Costa",
      evento: "Meia Maratona RP",
      texto: "Não apenas melhorei meu tempo, mas descobri o prazer de correr sem dor. A CareFit mudou minha relação com a corrida.",
      tempo: "1h45min"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/src/assets/maratona_grupo.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <Badge className="mb-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm px-4 py-2">
            Juntos Somos Mais Fortes
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6 leading-tight">
            A comunidade que<br />
            <span className="text-earth">te acolhe</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed font-poppins font-light">
            Mais que um centro de tratamento, somos o HUB da comunidade de corredores<br />
            de Ribeirão Preto. Aqui você encontra apoio, motivação e amizades para a vida toda.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-montserrat font-semibold"
              onClick={handleWhatsApp}
            >
              Faça Parte da Comunidade
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-montserrat font-semibold"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Siga no Instagram
            </Button>
          </div>
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="py-20 bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              Próximos Eventos
            </h2>
            <p className="text-xl text-primary/80 max-w-3xl mx-auto font-poppins">
              Workshops, corridas e encontros para fortalecer nossa comunidade
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {eventos.map((evento, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      className={`${evento.status === 'Inscrições Abertas' 
                        ? 'bg-secondary text-secondary-foreground' 
                        : 'bg-earth text-earth-foreground'
                      }`}
                    >
                      {evento.status}
                    </Badge>
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-montserrat font-bold text-primary mb-4">{evento.titulo}</h3>
                  
                  <div className="space-y-2 text-primary/70 font-poppins">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{evento.data}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{evento.horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{evento.local}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{evento.vagas}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleWhatsApp}
                  >
                    Inscrever-se
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Parcerias */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              Nossas Parcerias
            </h2>
            <p className="text-xl text-primary/80 max-w-3xl mx-auto font-poppins">
              Conectados com os principais grupos e eventos de corrida da região
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {parcerias.map((parceria, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-montserrat font-bold text-primary mb-2">{parceria.nome}</h3>
                      <Badge className="mb-3 bg-earth text-earth-foreground">{parceria.tipo}</Badge>
                      <p className="text-primary/70 font-poppins">{parceria.descricao}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Histórias de Sucesso */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
              Histórias da Nossa Comunidade
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto font-poppins">
              Conquistas reais de pessoas reais que fazem parte da família CareFit
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {depoimentos.map((depoimento, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur border-0 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-earth rounded-full flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-montserrat font-semibold">{depoimento.nome}</h4>
                      <p className="text-sm opacity-80">{depoimento.evento}</p>
                    </div>
                  </div>
                  
                  <p className="font-poppins italic mb-4 leading-relaxed">"{depoimento.texto}"</p>
                  
                  <div className="text-center">
                    <Badge className="bg-earth text-earth-foreground font-montserrat font-bold">
                      Tempo: {depoimento.tempo}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feed do Instagram Simulado */}
      <section className="py-20 bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              Acompanhe Nossa Jornada
            </h2>
            <p className="text-xl text-primary/80 max-w-3xl mx-auto font-poppins">
              Siga @carefitrunbase no Instagram e veja o dia a dia da nossa comunidade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary via-secondary to-earth flex items-center justify-center">
                  <Instagram className="h-12 w-12 text-white" />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-primary/70 font-poppins">Post do Instagram #{index}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-montserrat font-semibold"
              onClick={() => window.open("https://instagram.com/carefitrunbase", "_blank")}
            >
              <Instagram className="mr-2 h-5 w-5" />
              Seguir no Instagram
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
            Pronto para fazer parte da família?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto font-poppins opacity-90">
            Você não precisa correr sozinho. Nossa comunidade te acolhe,<br />
            te motiva e celebra cada conquista junto com você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-montserrat font-semibold"
              onClick={handleWhatsApp}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Conversar no WhatsApp
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-montserrat font-semibold"
              onClick={() => window.open("https://instagram.com/carefitrunbase", "_blank")}
            >
              <Instagram className="mr-2 h-5 w-5" />
              Seguir no Instagram
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Comunidade;