import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Target, Users, Play, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Servicos = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Nossos Serviços
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Cuidado integrado que vai além do tratamento. Performance construída com ciência, acolhimento e dedicação.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            
            {/* Recovery Service */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Content Side */}
              <div className="lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-earth rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary">
                      Recovery
                    </h2>
                    <p className="text-accent font-medium">
                      Recuperação ativa e regeneração
                    </p>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Banheiras de imersão, botas de compressão pneumática e liberação miofascial. Tecnologia avançada para acelerar sua recuperação e otimizar performance.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Banheiras de imersão com controle de temperatura</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Botas de compressão pneumática</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Liberação miofascial</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Protocolos personalizados de recuperação</span>
                  </li>
                </ul>
                
                <Button variant="hero" size="lg" onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}>
                  Agendar consulta
                </Button>
              </div>

              {/* Video/Image Side */}
              <div className="lg:w-1/2">
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative w-full h-80 bg-gradient-to-br from-accent to-earth flex items-center justify-center">
                      {/* Video placeholder */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                          <p className="text-lg font-medium">Vídeo explicativo</p>
                          <p className="text-sm opacity-80">Em breve</p>
                        </div>
                      </div>
                      {/* Future YouTube embed space */}
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                        recovery-video
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Fortalecimento Service */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              {/* Content Side */}
              <div className="lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary">
                      Fortalecimento
                    </h2>
                    <p className="text-accent font-medium">
                      Treino funcional especializado
                    </p>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Treinos funcionais específicos para corredores, focados na prevenção de lesões e melhoria da performance através do fortalecimento inteligente.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Avaliação presencial de mobilidade, força e alongamento</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Exercícios funcionais específicos para corrida</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Fortalecimento específico para corredores, de core, estabilidade e força</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Prevenção ativa de lesões comuns</span>
                  </li>
                </ul>
                
                <Button variant="hero" size="lg" onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}>
                  Agendar consulta
                </Button>
              </div>

              {/* Video/Image Side */}
              <div className="lg:w-1/2">
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative w-full h-80 bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                      {/* Video placeholder */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                          <p className="text-lg font-medium">Vídeo explicativo</p>
                          <p className="text-sm opacity-80">Em breve</p>
                        </div>
                      </div>
                      {/* Future YouTube embed space */}
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                        strength-video
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Nutrição Service */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Content Side */}
              <div className="lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-warm to-accent rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary">
                      Nutrição
                    </h2>
                    <p className="text-accent font-medium">
                      Alimentação conectada ao treino
                    </p>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Acompanhamento nutricional integrado ao seu ciclo de treinos, com estratégias personalizadas para cada fase da sua preparação e objetivos.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Plano nutricional personalizado</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Estratégias de hidratação e suplementação</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Nutrição periodizada conforme treinos</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Acompanhamento contínuo de resultados</span>
                  </li>
                </ul>
                
                <Button variant="hero" size="lg" onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}>
                  Agendar consulta
                </Button>
              </div>

              {/* Video/Image Side */}
              <div className="lg:w-1/2">
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative w-full h-80 bg-gradient-to-br from-warm to-accent flex items-center justify-center">
                      {/* Video placeholder */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                          <p className="text-lg font-medium">Vídeo explicativo</p>
                          <p className="text-sm opacity-80">Em breve</p>
                        </div>
                      </div>
                      {/* Future YouTube embed space */}
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                        nutrition-video
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Treinamento Mental Service */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              {/* Content Side */}
              <div className="lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-earth to-secondary rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary">
                      Treinamento Mental
                    </h2>
                    <p className="text-accent font-medium">
                      Mente preparada, performance elevada
                    </p>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Desenvolvimento de foco, consistência, autocuidado e capacidade de superação. Ferramentas mentais para potencializar sua performance na corrida e na vida.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Técnicas de visualização e foco</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Estratégias de controle de ansiedade</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Desenvolvimento de autoconfiança</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">Mindfulness aplicado ao esporte</span>
                  </li>
                </ul>
                
                <Button variant="hero" size="lg" onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}>
                  Agendar consulta
                </Button>
              </div>

              {/* Video/Image Side */}
              <div className="lg:w-1/2">
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="relative w-full h-80 bg-gradient-to-br from-earth to-secondary flex items-center justify-center">
                      {/* Video placeholder */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                          <p className="text-lg font-medium">Vídeo explicativo</p>
                          <p className="text-sm opacity-80">Em breve</p>
                        </div>
                      </div>
                      {/* Future YouTube embed space */}
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                        mental-video
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-warm to-accent">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para elevar sua performance?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Nosso time de fisioterapeutas, educadores físicos e nutricionistas estão prontos para guiar sua jornada de evolução como corredor.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}>
              Agende sua avaliação
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary" onClick={() => navigate('/jornada')}>
              Conhecer a jornada de 12 semanas
            </Button>
          </div>
        </div>
      </section>
    </div>;
};
export default Servicos;