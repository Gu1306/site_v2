import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Activity, MessageCircle, MapPin, AlertTriangle, Dumbbell, TrendingUp, Eye, Heart, Stethoscope } from "lucide-react";
import Footer from "@/components/Footer";


const PrevencaoLesoes = () => {
  const handleWhatsApp = () => {
    window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank');
  };

  const handleAgendar = () => {
    window.open('https://api.whatsapp.com/send?phone=5516996008849&text=Olá! Gostaria de agendar uma avaliação.', '_blank');
  };

  const lesoes = [
    { nome: "Canelite (síndrome do estresse tibial medial)", link: "/canelite-ribeirao-preto" },
    { nome: "Fascite plantar", link: "/fascite-plantar-ribeirao-preto" },
    { nome: "Tendinite do Aquiles", link: "/tendinite-aquiles-ribeirao-preto" },
    { nome: "Síndrome da banda iliotibial", link: "/banda-iliotibial-ribeirao-preto" },
    { nome: "Dor no joelho do corredor (síndrome patelofemoral)", link: "/dor-no-joelho-corrida-ribeirao-preto" },
    { nome: "Fraturas por estresse", link: "/fratura-por-estresse-ribeirao-preto" },
  ];

  const servicosFinais = [
    "Fisioterapia esportiva para corredores",
    "Fortalecimento específico para corrida",
    "Protocolos de recovery",
    "Avaliação biomecânica",
    "Orientação para retorno seguro após lesões",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* SEO meta tags set via index.html or route-level config */}

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Prevenção de Lesões na Corrida em Ribeirão Preto
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">
            Estratégias baseadas em ciência para correr com mais segurança, reduzir o risco de lesões e evoluir de forma consistente na corrida.
          </p>
          <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
            Na CareFit Run Base, em Ribeirão Preto, ajudamos corredores e triatletas a prevenir lesões através de uma abordagem integrada que combina fisioterapia esportiva, fortalecimento específico, recovery e acompanhamento especializado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleAgendar}>
              Agendar avaliação
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Seção 1 - Por que corredores se lesionam */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-warm to-accent rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Por que corredores se lesionam?
            </h2>
          </div>

          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed mb-8">
            <p>
              A corrida é um esporte extremamente acessível e eficiente para a saúde, mas também apresenta uma incidência relativamente alta de lesões por sobrecarga.
            </p>
            <p>
              Estudos mostram que entre 60% e 80% dos corredores apresentam algum tipo de lesão ao longo do ano, principalmente associada a erros no treinamento.
            </p>
            <p>Entre os fatores mais comuns estão:</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              "Aumento rápido do volume de treino",
              "Falta de fortalecimento muscular específico",
              "Recuperação insuficiente entre sessões",
              "Alterações na biomecânica da corrida",
              "Excesso de intensidade ou treinos mal periodizados",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-muted p-4 rounded-lg shadow-sm">
                <Activity className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Na CareFit Run Base trabalhamos para identificar esses fatores precocemente e corrigir os desequilíbrios antes que se transformem em lesões.
          </p>
        </div>
      </section>

      {/* Seção 2 - Lesões mais comuns */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Lesões mais comuns em corredores
            </h2>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Entre as lesões mais frequentes associadas à corrida estão:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {lesoes.map((lesao, index) => (
              <Link
                key={index}
                to={lesao.link}
                className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-accent/30"
              >
                <Activity className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-accent hover:underline font-medium">{lesao.nome}</span>
              </Link>
            ))}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Essas condições geralmente surgem quando o corpo não consegue se adaptar às cargas repetitivas da corrida.
          </p>
        </div>
      </section>

      {/* Seção 3 - Estratégias para prevenir lesões */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Estratégias para prevenir lesões na corrida
            </h2>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            A prevenção de lesões depende de uma abordagem multidimensional. Algumas das estratégias mais importantes incluem:
          </p>

          {/* Fortalecimento */}
          <div className="mb-10 p-6 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Dumbbell className="w-6 h-6 text-accent" />
              <h3 className="text-2xl font-semibold text-primary">Fortalecimento muscular específico</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-3">
              O treinamento de força para corredores ajuda a melhorar a estabilidade de articulações como quadril, joelho e tornozelo, reduzindo o risco de sobrecarga.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Glúteos, panturrilhas, quadríceps e core são fundamentais para absorver o impacto da corrida.
            </p>
            <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
              → Fortalecimento para corredores
            </Link>
          </div>

          {/* Progressão */}
          <div className="mb-10 p-6 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
              <h3 className="text-2xl font-semibold text-primary">Progressão gradual do volume de treino</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-3">
              Aumentos abruptos de volume ou intensidade são uma das principais causas de lesões.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              O ideal é que o volume de treino aumente gradualmente, permitindo adaptação muscular e óssea.
            </p>
          </div>

          {/* Avaliação biomecânica */}
          <div className="mb-10 p-6 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-accent" />
              <h3 className="text-2xl font-semibold text-primary">Avaliação biomecânica da corrida</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-3">
              Alterações na mecânica da corrida podem aumentar a carga em determinadas estruturas do corpo.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Uma avaliação especializada permite identificar padrões de movimento que podem contribuir para lesões.
            </p>
            <Link to="/avaliacao-do-corredor-ribeirao-preto" className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
              → Avaliação do corredor
            </Link>
          </div>

          {/* Recovery */}
          <div className="mb-10 p-6 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-accent" />
              <h3 className="text-2xl font-semibold text-primary">Recuperação adequada entre treinos</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-3">
              O recovery é uma parte essencial do treinamento. Sem recuperação adequada, o corpo acumula fadiga e aumenta o risco de lesões.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-3">
              Protocolos de recovery ajudam a:
            </p>
            <ul className="list-disc list-inside text-lg text-muted-foreground leading-relaxed mb-4 space-y-1 ml-2">
              <li>Reduzir dor muscular</li>
              <li>Melhorar circulação</li>
              <li>Acelerar recuperação</li>
            </ul>
            <Link to="/recovery-para-corredores-ribeirao-preto" className="inline-flex items-center gap-2 text-accent hover:underline font-medium">
              → Recovery para corredores
            </Link>
          </div>

          {/* Fisioterapia */}
          <div className="mb-10 p-6 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Stethoscope className="w-6 h-6 text-accent" />
              <h3 className="text-2xl font-semibold text-primary">Acompanhamento fisioterapêutico</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-3">
              A fisioterapia esportiva preventiva permite identificar desequilíbrios musculares e alterações de mobilidade antes que se transformem em lesões.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Na CareFit Run Base utilizamos avaliação clínica, testes funcionais e análise de movimento para orientar o corredor.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Final - Prevenção na CareFit */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Prevenção de lesões na CareFit Run Base
            </h2>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-3">
            A CareFit Run Base é um centro especializado no cuidado de corredores em Ribeirão Preto.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Nosso trabalho integra diferentes áreas para ajudar o atleta a correr com segurança e evoluir no esporte:
          </p>

          <div className="space-y-3 mb-6">
            {servicosFinais.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-background p-4 rounded-lg shadow-sm">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-foreground font-medium">{item}</span>
              </div>
            ))}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Essa abordagem integrada permite reduzir significativamente o risco de lesões e melhorar a consistência no treinamento.
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-accent to-earth">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Agende sua Avaliação na CareFit Run Base
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Se você é corredor ou triatleta em Ribeirão Preto e quer prevenir lesões na corrida, nossa equipe pode ajudar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={handleAgendar}>
              Agendar avaliação
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

export default PrevencaoLesoes;