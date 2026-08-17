import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import espaco1 from "@/assets/espaco-1.jpg";
import espaco2 from "@/assets/espaco-2.jpg";
import espaco3 from "@/assets/espaco-3.jpg";
import espaco4 from "@/assets/espaco-4.jpg";
import espaco5 from "@/assets/espaco-5.jpg";
import espaco6 from "@/assets/espaco-6.jpg";
import espaco7 from "@/assets/espaco-7.jpg";
import espaco8 from "@/assets/espaco-8.jpg";
import espaco9 from "@/assets/espaco-9.jpg";
import espaco10 from "@/assets/espaco-10.jpg";

const Espaco = () => {
  const navigate = useNavigate();
  
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");
  };

  const espacos = [
    { img: espaco1, title: "Visão Geral", desc: "Espaço completo e integrado" },
    { img: espaco2, title: "Área de Treino", desc: "Equipamentos para fortalecimento" },
    { img: espaco3, title: "Recovery Zone", desc: "Cadeiras de recuperação" },
    { img: espaco4, title: "Área de Relaxamento", desc: "Ambiente acolhedor" },
    { img: espaco5, title: "Fortalecimento", desc: "Equipamentos de musculação" },
    { img: espaco6, title: "Fisioterapia", desc: "Macas para tratamento" },
    { img: espaco7, title: "Área de Cuidado", desc: "Espaço para atendimento" },
    { img: espaco8, title: "Crioterapia", desc: "Banheira de gelo" },
    { img: espaco9, title: "Recovery Pool", desc: "Área de imersão" },
    { img: espaco10, title: "Ice Bath", desc: "Recuperação muscular" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${espaco1})` }} />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-6">
            CareFit <span className="text-earth">Run Base</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-poppins opacity-90">
            Um espaço 100% preparado para a jornada do corredor. Onde ciência, cuidado e propósito se encontram.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-4">
              Conheça Nosso Espaço
            </h2>
            <p className="text-lg text-primary/80 max-w-2xl mx-auto font-poppins">
              Assista ao tour virtual e descubra cada detalhe do nosso centro de transformação
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="relative aspect-[9/16] bg-primary/10 rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.youtube.com/embed/xMb880cHHM0"
                title="Conheça o CareFit Run Base"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-4">
              Galeria do Espaço
            </h2>
            <p className="text-lg text-primary/80 max-w-2xl mx-auto font-poppins">
              Cada ambiente foi pensado para oferecer o melhor cuidado ao corredor
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {espacos.map((espaco, index) => (
              <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={espaco.img} 
                    alt={espaco.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-montserrat font-bold text-lg">{espaco.title}</h3>
                    <p className="font-poppins text-sm opacity-90">{espaco.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-4">
              O que você encontra aqui
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: "🏋️", title: "Fortalecimento", desc: "Equipamentos específicos para corredores" },
              { icon: "💆", title: "Fisioterapia", desc: "Atendimento preventivo e tratamento" },
              { icon: "🧊", title: "Crioterapia", desc: "Banheiras de gelo para recovery" },
              { icon: "🧘", title: "Recovery Zone", desc: "Área de relaxamento e recuperação" },
            ].map((item, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="font-montserrat font-bold text-primary mb-2">{item.title}</h3>
                  <p className="text-primary/70 font-poppins text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-6 text-earth" />
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
            Venha conhecer pessoalmente
          </h2>
          <p className="text-xl max-w-2xl mx-auto font-poppins opacity-90 mb-8">
            Agende uma visita e descubra como podemos transformar sua jornada como corredor
          </p>
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-montserrat font-semibold"
            onClick={handleWhatsApp}
          >
            Agendar Visita
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Espaco;
