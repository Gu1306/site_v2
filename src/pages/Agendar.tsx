import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";

// Esta página era um redirect automático para um único link do Google Calendar.
// O atleta que já é da casa precisa marcar com o SEU fisioterapeuta, e não tinha
// como escolher — a queixa recorrente era não achar o link da própria agenda.
//
// A página de horários do Google só lista as agendas de UMA conta, então Lais e
// Igor nunca apareceriam junto com a Lívia por lá. Daí esta página: o endereço
// fixo que a gente divulga no perfil do WhatsApp, com as três Jornada Recovery
// lado a lado. Se entrar ou sair fisio, muda a lista abaixo e pronto.
//
// Só Jornada Recovery aqui de propósito: primeira sessão e avaliação são
// divulgadas na bio do Instagram, direto na agenda da Lívia.

const WHATSAPP_URL = "https://wa.me/5516996008849";

const FISIOS = [
  { nome: "Lívia", url: "https://calendar.app.google/J94MCG5wCeiCcmNu7" },
  { nome: "Lais", url: "https://calendar.app.google/tgvbpVkLSokd5ZwT9" },
  { nome: "Igor", url: "https://calendar.app.google/nAerGDU7JSxEH2EGA" },
];

const Agendar = () => {
  useSeo({
    titulo: "Agendar sessão | CareFit Run Base",
    descricao:
      "Agende sua Sessão Jornada Recovery na CareFit Run Base. Escolha seu fisioterapeuta e veja os horários disponíveis.",
    caminho: "/agendar",
  });

  return (
    <div className="min-h-screen pt-16">
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Calendar className="w-12 h-12 mx-auto text-white/90 mb-5" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Agende sua sessão
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            Sessão Jornada Recovery. Escolha o fisioterapeuta que acompanha
            você e veja os horários disponíveis.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {FISIOS.map((fisio) => (
              <div
                key={fisio.nome}
                className="bg-card border rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {fisio.nome.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-5">
                  {fisio.nome}
                </h3>
                <Button asChild className="w-full" size="lg">
                  <a href={fisio.url} target="_blank" rel="noopener noreferrer">
                    Ver horários
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-muted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground mb-6">
            Precisa remarcar ou ficou com alguma dúvida? A gente responde no
            WhatsApp.
          </p>
          <Button asChild variant="whatsapp" size="lg">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Agendar;
