import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, Clock, Phone, Mail, Calendar } from "lucide-react";
const Contato = () => {
  return <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Estamos prontos para cuidar da sua jornada. Fale conosco e dê o primeiro passo na construção da sua base.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Online Booking Button */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary text-center">
                    Agendamento Online
                  </CardTitle>
                  <p className="text-muted-foreground text-center">
                    Agende sua consulta diretamente através do nosso sistema online.
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    variant="hero" 
                    size="lg"
                    className="w-full text-lg py-6"
                    onClick={() => window.open('https://calendar.google.com/calendar/u/0/appointments/AcZssZ12VGfInV4yCnUbwftPTOnh96at_-GR0021W_A=', '_blank')}
                  >
                    <Calendar className="w-6 h-6 mr-3" />
                    FAÇA SEU AGENDAMENTO ONLINE
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <Card className="border-l-4 border-accent">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-accent" />
                    Contato Direto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium text-primary">WhatsApp</p>
                      <p className="text-muted-foreground">(16) 99600-8849</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium text-primary">E-mail</p>
                      <p className="text-muted-foreground">gustavo@coutorosa.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-l-4 border-secondary">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-secondary" />
                    Nossa Localização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      <strong className="text-primary">Endereço:</strong><br />
                      <a 
                        href="https://maps.google.com/?q=Av.+Áurea+Aparecida+Bragheto+Machado,+241+-+City+Ribeirão,+Ribeirão+Preto+-+SP,+14021-460"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent transition-colors underline"
                      >
                        Av. Áurea Aparecida Bragheto Machado, 241<br />
                        City Ribeirão, Ribeirão Preto - SP, 14021-460
                      </a>
                    </p>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        📍 Clique no endereço acima para abrir no Google Maps
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card className="border-l-4 border-warm">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-3">
                    <Clock className="w-6 h-6 text-warm" />
                    Horário de Funcionamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Segunda a Sexta:</span>
                      <span className="font-medium text-primary">8h às 18:30h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sábados:</span>
                      <span className="font-medium text-primary">8h às 12h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domingos:</span>
                      <span className="font-medium text-primary">Fechado</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-primary">Atenção:</strong> Atendimentos mediante agendamento
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ/Quick Questions */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Respostas rápidas para dúvidas comuns
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Como funciona a avaliação inicial?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Uma sessão completa onde mapeamos sua condição física, histórico de corrida, objetivos e criamos seu plano personalizado.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Preciso ser corredor experiente?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Não! Atendemos desde iniciantes até ultramaratonistas. Cada jornada é personalizada para seu nível e objetivos.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Qual a duração da jornada?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nossa jornada principal é de 12 semanas, mas oferecemos também sessões avulsas e acompanhamentos contínuos.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-primary">
                  Aceitam planos de saúde?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Entre em contato para verificar convênios aceitos. Oferecemos também planos próprios de pagamento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sua jornada começa com uma conversa
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Estamos aqui para entender seus objetivos e mostrar como podemos ajudar você a construir uma base sólida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="warm" size="lg" onClick={() => window.open('https://api.whatsapp.com/send?phone=5516996008849', '_blank')}>
              <MessageCircle className="w-5 h-5" />
              WhatsApp agora
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Phone className="w-5 h-5" />
              Ligar diretamente
            </Button>
          </div>
        </div>
      </section>
    </div>;
};
export default Contato;