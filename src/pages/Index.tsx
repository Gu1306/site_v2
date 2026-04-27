import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Heart, Zap, Target, Users, MapPin, Calendar, Star, Award, Clock, CheckCircle, Sparkles, Activity, Utensils, Dumbbell, Timer, Stethoscope, Shield, Microscope, TreeDeciduous, UserCheck, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import MapaMentalMetodologia from "@/components/MapaMentalMetodologia";
import MapaMentalJornada from "@/components/MapaMentalJornada";
import DashboardAtleta from "@/components/DashboardAtleta";
import espaco1 from "@/assets/espaco-1.jpg";
import espaco2 from "@/assets/espaco-2.jpg";
import espaco8 from "@/assets/espaco-8.jpg";
import heroRunners from "@/assets/hero-runners.jpg";

const Index = () => {
  const navigate = useNavigate();
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");
  };
  const pilares = [{
    icon: Heart,
    title: "Recovery",
    subtitle: "Recovery para corredores e atletas de endurance",
    description: "Recovery muscular com técnicas avançadas de recuperação e prevenção de lesões na corrida. Mantenha-se sempre em movimento com protocolos científicos.",
    produtos: "Presente em: Todos os produtos"
  }, {
    icon: Zap,
    title: "Fortalecimento",
    subtitle: "Fortalecimento específico para corredores",
    description: "Treinamento de força para corrida específico para corredores, focando nos grupos musculares essenciais para performance e prevenção de lesões.",
    produtos: "Presente em: Fortalecimento para Corredores, Jornada Propósito"
  }, {
    icon: Target,
    title: "Nutrição",
    subtitle: "Nutrição esportiva para corredores e triatletas",
    description: "Nutrição esportiva especializada para corredores, otimizando rendimento e acelerando a recuperação com acompanhamento individualizado.",
    produtos: "Presente em: Nutrição, Jornada Propósito"
  }, {
    icon: Users,
    title: "Mente",
    subtitle: "Treinamento mental para corredores e atletas de endurance",
    description: "Suporte psicológico e mental para desenvolver a mentalidade vencedora do corredor de alta performance.",
    produtos: "Presente em: Jornada Propósito"
  }];
  const numeros = [{
    numero: 167,
    suffix: "+",
    texto: "Corredores transformados",
    animated: true
  }, {
    numero: 29,
    suffix: "+",
    texto: "Maratonistas",
    animated: true
  }, {
    numero: 7,
    suffix: "+",
    texto: "Ultramaratonistas",
    animated: true
  }, {
    numero: 3,
    suffix: "",
    texto: "Anos de jornada",
    animated: false
  }];
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroRunners})`
      }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold mb-6 leading-tight">
            Corra com propósito. Evolua com ciência. <span className="text-earth">
Viva com equilíbrio.</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-4 max-w-4xl mx-auto leading-relaxed font-poppins font-medium text-white/95">
            A CareFit Run Base é um centro especializado em fisioterapia esportiva, recovery, fortalecimento e nutrição para corredores em Ribeirão Preto.
          </p>

          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed font-poppins font-light">
          </p>
          
          <div className="flex justify-center">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-montserrat font-semibold" onClick={() => navigate('/servicos')}>
              Descubra Sua Solução Ideal
            </Button>
          </div>
        </div>
      </section>

      {/* Pilares de Cuidado */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              Os 4 Pilares que Sustentam Todos os Nossos Produtos
            </h2>
            <p className="text-xl text-primary/80 max-w-3xl mx-auto font-poppins">
              Cada solução que oferecemos é construída sobre estes pilares fundamentais. Independentemente do produto escolhido, você recebe cuidado integrado em todas as dimensões.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pilares.map((pilar, index) => <Card key={index} className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <pilar.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">{pilar.title}</h3>
                  <p className="text-secondary font-montserrat font-semibold mb-4">{pilar.subtitle}</p>
                  <p className="text-primary/70 font-poppins leading-relaxed mb-3">{pilar.description}</p>
                  <p className="text-earth font-poppins text-sm font-medium">{pilar.produtos}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Mapa Mental da Metodologia */}
      <MapaMentalMetodologia />

      {/* Dashboard do Atleta */}
      <DashboardAtleta />

      {/* Mapa Mental da Jornada (case Ana Júlia) */}
      <MapaMentalJornada />

      {/* Nossas 6 Soluções */}
      <section className="py-20 bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              Nossas 6 Soluções Complementares para Cada Etapa da Sua Jornada
            </h2>
            <p className="text-xl text-primary/80 max-w-4xl mx-auto font-poppins">
              Na CareFit Run Base, entendemos que cada corredor tem necessidades únicas. Por isso, desenvolvemos um portfólio de produtos que trabalham juntos para sua transformação completa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Jornada Propósito */}
            <Card className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Jornada Propósito</h3>
                <p className="text-primary/70 font-poppins leading-relaxed mb-4 flex-1">
                  Uma imersão de 12 semanas para redefinir sua corrida. Transformação completa com metodologia exclusiva, acompanhamento integrado e suporte em todos os 4 pilares.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-secondary font-montserrat font-semibold text-sm">✓ Transformação completa e estruturada</p>
                  <p className="text-primary/60 font-poppins text-sm">Ideal para: Corredores que buscam mudança profunda e duradoura</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-montserrat font-semibold" onClick={handleWhatsApp}>
                  Iniciar Jornada Propósito
                </Button>
              </CardContent>
            </Card>

            {/* Reabilitação */}
            <Card className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Reabilitação</h3>
                <p className="text-primary/70 font-poppins leading-relaxed mb-4 flex-1">
                  Lesionado? Nossa equipe de fisioterapeutas especializados em corrida cria planos personalizados de reabilitação focados em sua recuperação rápida e segura, voltando a correr sem dor.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-secondary font-montserrat font-semibold text-sm">✓ Recuperação de lesões com especialistas</p>
                  <p className="text-primary/60 font-poppins text-sm">Ideal para: Corredores em processo de reabilitação</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-montserrat font-semibold" onClick={handleWhatsApp}>
                  Agendar Avaliação de Reabilitação
                </Button>
              </CardContent>
            </Card>

            {/* Jornada Recovery */}
            <Card className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Jornada Recovery</h3>
                <p className="text-primary/70 font-poppins leading-relaxed mb-4 flex-1">
                  Sessão de 60 minutos 100% acompanhado por nossos fisioterapeutas. Utilizamos todas as técnicas disponíveis: imersão no gelo, ofuro quente, exercícios terapêuticos, eletroterapia, dry needling, liberação miofascial, ventosas, ultrassom, laserterapia e eletroestimulação.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-secondary font-montserrat font-semibold text-sm">✓ Recuperação completa e personalizada</p>
                  <p className="text-primary/60 font-poppins text-sm">Ideal para: Corredores que buscam recuperação profunda e customizada</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-montserrat font-semibold" onClick={handleWhatsApp}>
                  Agendar Jornada Recovery
                </Button>
              </CardContent>
            </Card>

            {/* Fast Recovery */}
            <Card className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Timer className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Fast Recovery</h3>
                <p className="text-primary/70 font-poppins leading-relaxed mb-4 flex-1">
                  Protocolo padrão de 50 minutos: 10 min de imersão em água gelada (10-15°C), 10 min em ofuro quente (36°C), 15 min de liberação miofascial e 15 min de botinha de compressão. Máxima eficiência em mínimo tempo.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-secondary font-montserrat font-semibold text-sm">✓ Recuperação acelerada em 50 minutos</p>
                  <p className="text-primary/60 font-poppins text-sm">Ideal para: Corredores com agenda apertada que precisam de resultados rápidos</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-montserrat font-semibold" onClick={handleWhatsApp}>
                  Conhecer Fast Recovery
                </Button>
              </CardContent>
            </Card>

            {/* Nutrição para Corredores */}
            <Card className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Utensils className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Nutrição para Corredores</h3>
                <p className="text-primary/70 font-poppins leading-relaxed mb-4 flex-1">
                  Consultas com nutricionistas especializados em corrida. Plano nutricional personalizado com acompanhamento contínuo via bioimpedância a cada sessão, ajustando sua alimentação conforme sua evolução.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-secondary font-montserrat font-semibold text-sm">✓ Nutrição personalizada com acompanhamento contínuo</p>
                  <p className="text-primary/60 font-poppins text-sm">Ideal para: Corredores que querem otimizar rendimento através da alimentação</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-montserrat font-semibold" onClick={handleWhatsApp}>
                  Agendar Consulta Nutricional
                </Button>
              </CardContent>
            </Card>

            {/* Fortalecimento para Corredores */}
            <Card className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
              <CardContent className="p-8 flex flex-col flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-4">Fortalecimento para Corredores</h3>
                <p className="text-primary/70 font-poppins leading-relaxed mb-4 flex-1">
                  Programa com avaliação presencial completa, testes de evolução a cada 30 dias e planilhas de treino atualizadas semanalmente via app. Base sólida para corrida sem lesões e com mais performance.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-secondary font-montserrat font-semibold text-sm">✓ Fortalecimento com acompanhamento científico</p>
                  <p className="text-primary/60 font-poppins text-sm">Ideal para: Corredores que querem construir força funcional com resultados comprovados</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-montserrat font-semibold" onClick={handleWhatsApp}>
                  Iniciar Programa de Fortalecimento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lesões Comuns na Corrida */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              Lesões Comuns na Corrida
            </h2>
            <p className="text-xl text-primary/80 max-w-3xl mx-auto font-poppins">
              Corredores podem desenvolver lesões por sobrecarga, desequilíbrios musculares ou falta de recuperação adequada. Conheça as principais e saiba como preveni-las.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { nome: "Canelite", link: "/canelite-ribeirao-preto", desc: "Dor na região da canela causada por sobrecarga repetitiva durante a corrida." },
              { nome: "Fascite Plantar", link: "/fascite-plantar-ribeirao-preto", desc: "Inflamação na fáscia plantar que causa dor no calcanhar, comum em corredores." },
              { nome: "Dor no Joelho", link: "/dor-no-joelho-corrida-ribeirao-preto", desc: "Dor anterior no joelho frequente em corredores com desequilíbrio muscular." },
              { nome: "Tendinite do Aquiles", link: "/tendinite-aquiles-ribeirao-preto", desc: "Inflamação do tendão de Aquiles por aumento rápido de carga de treino." },
              { nome: "Síndrome da Banda Iliotibial", link: "/banda-iliotibial-ribeirao-preto", desc: "Dor lateral no joelho associada a fraqueza de glúteo e sobrecarga." },
            ].map((lesao, index) => (
              <Link key={index} to={lesao.link} className="group">
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-montserrat font-bold text-primary mb-2">{lesao.nome}</h3>
                    <p className="text-primary/70 font-poppins text-sm leading-relaxed">{lesao.desc}</p>
                    <span className="text-accent font-montserrat font-semibold text-sm mt-3 inline-block">Saiba mais →</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/lesoes-na-corrida">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-montserrat font-semibold">
                Ver todas as lesões na corrida
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Por que corredores escolhem a CareFit */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              Por que Corredores Escolhem a CareFit Run Base
            </h2>
            <p className="text-xl text-primary/80 max-w-3xl mx-auto font-poppins">
              Somos referência em fisioterapia esportiva e cuidado integrado para corredores em Ribeirão Preto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Target, title: "Centro especializado em corredores", desc: "Espaço 100% dedicado ao corredor, com equipamentos, protocolos e ambiente pensados exclusivamente para quem corre." },
              { icon: UserCheck, title: "Equipe formada por corredores", desc: "Nossos profissionais são corredores. Entendemos suas dores porque vivemos isso na pele, todos os dias." },
              { icon: Layers, title: "Abordagem integrada", desc: "Fisioterapia esportiva, fortalecimento para corredores, nutrição esportiva e recovery muscular trabalhando juntos em um único ecossistema." },
              { icon: Microscope, title: "Protocolos científicos", desc: "Métodos baseados em evidências científicas, com avaliações periódicas e acompanhamento contínuo de resultados." },
              { icon: TreeDeciduous, title: "Foco em longevidade esportiva", desc: "Nosso objetivo vai além da próxima prova. Trabalhamos para que você corra com saúde por muitos anos." },
            ].map((diff, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <diff.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-montserrat font-bold text-primary mb-3">{diff.title}</h3>
                  <p className="text-primary/70 font-poppins leading-relaxed">{diff.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Números de Impacto */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
              Histórias que inspiram
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto font-poppins">
              Mais de 100 jornadas transformadas
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {numeros.map((item, index) => <div key={index} className="text-center">
                {item.animated ? <AnimatedCounter end={item.numero} suffix={item.suffix} duration={2500} /> : <div className="text-5xl md:text-6xl font-montserrat font-bold text-earth mb-4">
                    {item.numero}
                  </div>}
                <p className="text-lg font-poppins opacity-90">{item.texto}</p>
              </div>)}
          </div>

          {/* Depoimentos de Atletas */}
          <div className="border-t border-white/20 pt-16">
            <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-12 text-center">
              Depoimentos de quem viveu a transformação
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Thais */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="aspect-video w-full mb-4 rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.youtube.com/embed/62WMUc35hbo"
                    title="Thais - Desafio Disney Wine & Dine"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h4 className="text-xl font-montserrat font-bold text-earth mb-2">Thais Vignini</h4>
                <p className="text-lg font-montserrat font-semibold mb-3">Desafio Disney Wine & Dine</p>
                <p className="text-white/80 font-poppins text-sm leading-relaxed">
                  A jornada de Thais Vignini rumo ao desafio Disney Wine & Dine, superando limites com o suporte da CAREFIT.
                </p>
              </div>

              {/* Talita */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="aspect-video w-full mb-4 rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.youtube.com/embed/lbfcs-QlmDE"
                    title="Talita - Meia Maratona de Lisboa 2025"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h4 className="text-xl font-montserrat font-bold text-earth mb-2">Talita Kriunas</h4>
                <p className="text-lg font-montserrat font-semibold mb-3">Meia Maratona de Lisboa 2025</p>
                <p className="text-white/80 font-poppins text-sm leading-relaxed">
                  Talita Kriunas conquistou as ruas de Lisboa na Meia Maratona 2025, uma jornada de preparação e superação.
                </p>
              </div>

              {/* Léo Andrade */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="aspect-video w-full mb-4 rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.youtube.com/embed/XF8N96nULVg"
                    title="Léo Andrade - Meia Maratona do Rio 2025"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h4 className="text-xl font-montserrat font-bold text-earth mb-2">Léo Andrade</h4>
                <p className="text-lg font-montserrat font-semibold mb-3">Meia Maratona do Rio 2025</p>
                <p className="text-white/80 font-poppins text-sm leading-relaxed">
                  Léo compartilha sua experiência na Meia Maratona do Rio 2025, transformando desafios em conquistas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-20 bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              Corredores cuidando de corredores
            </h2>
            <p className="text-xl text-primary/80 max-w-3xl mx-auto font-poppins">
              Nossa equipe é formada por corredores que entendem suas dores porque vivem isso na pele
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="aspect-[9/16] w-full max-w-[200px] mx-auto mb-6 rounded-xl overflow-hidden shadow-md">
                  <iframe
                    src="https://www.youtube.com/embed/NzhSs3Ej7i8"
                    title="Gustavo Rosa"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">Gustavo Rosa</h3>
                <p className="text-secondary font-montserrat font-semibold mb-4">Fundador e Head Coach</p>
                <p className="text-primary/70 font-poppins text-sm">Com mais de 20 Ultramaratonas e Maratonas. Criador da metodologia CareFit e especialista em transformação de corredores.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="aspect-[9/16] w-full max-w-[200px] mx-auto mb-6 rounded-xl overflow-hidden shadow-md">
                  <iframe
                    src="https://www.youtube.com/embed/APHus0GVmiQ"
                    title="Lívia Dias"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">Lívia Dias</h3>
                <p className="text-secondary font-montserrat font-semibold mb-4">Fisioterapeuta Esportiva & Agente de Performance</p>
                <p className="text-primary/70 font-poppins text-sm">Especialista em prevenção e recovery, corredora apaixonada que une ciência e sensibilidade no cuidado de cada atleta.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="aspect-[9/16] w-full max-w-[200px] mx-auto mb-6 rounded-xl overflow-hidden shadow-md">
                  <iframe
                    src="https://www.youtube.com/embed/GVK59sOcLa8"
                    title="Guilherme Coelho"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">Guilherme Coelho</h3>
                <p className="text-secondary font-montserrat font-semibold mb-4">Educador Físico</p>
                <p className="text-primary/70 font-poppins text-sm">Corredor dos rápidos e especialista em fortalecimento funcional para corredores, focado em construir a base que sustenta cada quilômetro da jornada.</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="aspect-[9/16] w-full max-w-[200px] mx-auto mb-6 rounded-xl overflow-hidden shadow-md">
                  <iframe
                    src="https://www.youtube.com/embed/LexNeth1JUg"
                    title="Arthur Angelotti"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">Arthur Angelotti</h3>
                <p className="text-secondary font-montserrat font-semibold mb-4">Nutricionista Esportivo</p>
                <p className="text-primary/70 font-poppins text-sm">Maratonista e especialista em nutrição para performance, desenvolvendo estratégias alimentares que transformam treinos em conquistas.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nosso Espaço Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              CareFit Run Base
            </h2>
            <p className="text-xl text-primary/80 max-w-3xl mx-auto font-poppins">
              Um espaço 100% preparado para a jornada do corredor
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <img src={espaco1} alt="Visão geral do espaço" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <img src={espaco2} alt="Área de treino" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
              <img src={espaco8} alt="Crioterapia" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-montserrat font-semibold"
              onClick={() => navigate("/espaco")}
            >
              Conheça Nosso Espaço
            </Button>
          </div>
        </div>
      </section>

      {/* Nossa Jornada de Crescimento */}
      <section className="py-20 bg-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">A Jornada que nos trouxe até aqui:</h2>
            <p className="text-xl text-primary/80 max-w-3xl mx-auto font-poppins">
          </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
          {[{
            ano: "2022",
            titulo: "O Despertar",
            descricao: "Gustavo percebe a fragmentação do cuidado e imagina uma solução integrada",
            icon: Star
          }, {
            ano: "2023",
            titulo: "Os Primeiros Passos",
            descricao: "Nasce a CareFit Recovery, o primeiro produto focado em recuperação",
            icon: CheckCircle
          }, {
            ano: "2024",
            titulo: "Crescimento e Validação",
            descricao: "Expandimos para 4 soluções complementares. Mais de 165 corredores transformados",
            icon: Award
          }, {
            ano: "2025",
            titulo: "O HUB DO CORREDOR",
            descricao: "Consolidamos como o ecossistema completo para o corredor. Espaço 100% preparado, equipe especializada, tudo integrado: nutrição, fortalecimento, recovery e trabalho da mente",
            icon: MapPin
          }].map((marco, index) => <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <marco.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-montserrat font-bold text-earth mb-2">{marco.ano}</div>
                  <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">{marco.titulo}</h3>
                  <p className="text-primary/70 font-poppins">{marco.descricao}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
            Você não precisa correr sozinho. Escolha Sua Solução Ideal
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto font-poppins opacity-90">
            Todo passo conta. Cuidar não é parar, é evoluir.<br />
            Quer você esteja começando, reabilitando, recuperando ou fortalecendo, temos a solução perfeita para você.<br />
            Sua jornada de transformação começa aqui.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-earth hover:bg-earth/90 text-white px-8 py-4 text-lg font-montserrat font-semibold"
              onClick={handleWhatsApp}
            >
              Fale com um Especialista
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>;
};
export default Index;