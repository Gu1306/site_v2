import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar } from "lucide-react";

const Agendar = () => {
  const [countdown, setCountdown] = useState(3);
  const googleCalendarUrl = "https://calendar.google.com/calendar/u/0/appointments/AcZssZ12VGfInV4yCnUbwftPTOnh96at_-GR0021W_A=";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = googleCalendarUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRedirect = () => {
    window.location.href = googleCalendarUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <Calendar className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Agendamento Online
          </h1>
          <p className="text-muted-foreground">
            Redirecionando para nosso sistema de agendamento...
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
            <span className="text-foreground font-medium">
              Redirecionando em {countdown}s
            </span>
          </div>
          
          <Button 
            onClick={handleManualRedirect}
            className="w-full"
            size="lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Agora
          </Button>
          
          <p className="text-sm text-muted-foreground mt-3">
            Clique no botão acima se não for redirecionado automaticamente
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Você será direcionado para nosso Google Calendar</p>
          <p>para escolher o melhor horário disponível</p>
        </div>
      </div>
    </div>
  );
};

export default Agendar;