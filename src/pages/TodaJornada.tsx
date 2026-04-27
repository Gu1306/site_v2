import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const TodaJornada = () => {
  const handleWhatsApp = () => {
    window.open("https://wa.me/5516981335949?text=Olá! Gostaria de começar minha Jornada Propósito", "_blank");
  };

  const valores = [
    {
      icon: "🕊️",
      titulo: "1. Toda jornada importa",
      texto: "Cada pessoa tem uma história, um ritmo, uma distância e um motivo. Não comparamos jornadas — celebramos cada passo dado com consciência."
    },
    {
      icon: "⚖️",
      titulo: "2. O cuidado vem antes da dor",
      texto: "Acreditamos que prevenir é cuidar com amor e ciência. Performance é consequência de constância, não de pressa."
    },
    {
      icon: "🫱‍🫲",
      titulo: "3. Respeito e parceria",
      texto: "A relação treinador–atleta é sagrada. Nós somos a base de suporte — corpo, mente e nutrição — para que o atleta realize seu sonho com seu treinador."
    },
    {
      icon: "🔬",
      titulo: "4. Ciência com propósito",
      texto: "Tudo o que fazemos é embasado em fisiologia, movimento e estudo, mas guiado por propósito e empatia. Cuidar é ciência com alma."
    },
    {
      icon: "🧠",
      titulo: "5. Transformação individual",
      texto: "Cada jornada é única e profundamente pessoal. O que transforma um, pode não tocar o outro — e está tudo bem. Respeitamos a singularidade de cada trajetória."
    },
    {
      icon: "🔁",
      titulo: "6. Constância acima da perfeição",
      texto: "Nem todos os ciclos serão perfeitos, e isso é humano. O progresso acontece quando fazemos o possível — com consciência e amor ao processo."
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-sand">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Toda jornada importa.
          </h1>
          <p className="text-xl text-primary max-w-3xl mx-auto">
            Cada pessoa tem seu ritmo, sua história e seu tempo. Aqui, celebramos o movimento.
          </p>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
            🌱 NOSSA MISSÃO
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-primary">
            <p>
              Ajudar cada pessoa a reconhecer, viver e fortalecer a sua jornada.
            </p>
            <p>
              Acreditamos que a corrida — e o movimento — são caminhos de autodesenvolvimento, saúde mental e transformação de vida.
            </p>
            <p>
              Não somos atletas profissionais, somos pessoas reais, com trabalho, família e limitações.
            </p>
            <p>
              Nossa missão é apoiar cada um a fazer o possível com propósito, respeitando o tempo e o contexto de cada jornada.
            </p>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-20 bg-sand">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
            💚 NOSSOS VALORES
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {valores.map((valor, index) => (
              <Card key={index} className="p-8 bg-background shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4 text-center">{valor.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  {valor.titulo}
                </h3>
                <p className="text-primary/90 leading-relaxed">
                  {valor.texto}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Visão de Mundo */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
            🌍 NOSSA VISÃO DE MUNDO
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-primary">
            <p>
              Ser o centro que fortalece as bases para que cada corredor realize seus sonhos.
            </p>
            <p>
              Acreditamos que o esporte é mais do que resultado — é um caminho de evolução pessoal, emocional e coletiva.
            </p>
            <p>
              Enquanto o treinador guia o sonho, nós construímos a base que o torna possível.
            </p>
            <p>
              A mente, o corpo e o propósito correm juntos — e é isso que transforma pessoas em versões mais inteiras de si mesmas.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-earth to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Cada passo importa. Cada história é única. Vamos construir a sua juntos.
          </p>
          <Button 
            onClick={handleWhatsApp}
            size="lg"
            className="bg-gold text-primary hover:bg-gold/90 font-bold text-lg px-8 py-6"
          >
            Comece sua Jornada Propósito
          </Button>
        </div>
      </section>
    </div>
  );
};

export default TodaJornada;
