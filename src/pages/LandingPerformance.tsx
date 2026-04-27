import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  Brain,
  Dumbbell,
  Snowflake,
  BarChart3,
  Check,
  X,
  Clock,
  Zap,
  Target,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import Footer from "@/components/Footer";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=5516996008849&text=Quero%20agendar%20minha%20sess%C3%A3o%20dupla%20na%20CareFit";

const LandingPerformance = () => {
  useEffect(() => {
    document.title = "CareFit Performance | Sessão Dupla por R$230 - Ribeirão Preto";
    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    meta.setAttribute(
      "content",
      "Pare de se machucar. Sessão Dupla CareFit por R$230: avaliação, recovery e direcionamento do seu ciclo de corrida em Ribeirão Preto."
    );
  }, []);

  const goWhats = () => window.open(WHATSAPP_URL, "_blank");

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent))_0%,transparent_50%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            CAREFIT PERFORMANCE — RIBEIRÃO PRETO
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-black text-primary-foreground leading-[1.05] mb-6">
            Você não se machuca por <span className="text-accent">azar.</span>
            <br />
            Você se machuca por <span className="text-accent">falta de estratégia.</span>
          </h1>

          <p className="text-lg md:text-2xl text-primary-foreground/85 max-w-3xl mx-auto mb-10 font-light">
            Se você corre, mas não controla carga, recovery e fortalecimento…
            <br className="hidden md:block" />
            é só questão de tempo até seu ciclo quebrar.
          </p>

          <div className="bg-accent text-accent-foreground inline-block px-6 py-4 rounded-xl mb-8 shadow-2xl">
            <div className="text-sm uppercase tracking-wider font-semibold opacity-90">
              🔥 Oferta de entrada
            </div>
            <div className="text-2xl md:text-3xl font-montserrat font-black">
              Primeira Sessão Dupla CareFit por R$230
            </div>
          </div>

          <div>
            <Button
              variant="hero"
              size="lg"
              onClick={goWhats}
              className="text-lg md:text-xl px-10 py-7 h-auto"
            >
              👉 Quero treinar sem me machucar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* BLOCO 2 - DOR */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-montserrat font-bold text-primary text-center mb-12">
            Se identifica com isso?
          </h2>
          <div className="space-y-4 mb-12">
            {[
              "Você treina bem… mas vive com dor",
              "Já teve que parar no meio do ciclo",
              "Faz recovery quando dá",
              "Não sabe se está exagerando ou fazendo pouco",
              "Depende da sorte pra chegar na prova inteiro",
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 bg-muted/50 border-l-4 border-accent rounded-r-lg"
              >
                <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-lg md:text-xl text-foreground font-medium">{t}</p>
              </div>
            ))}
          </div>
          <div className="text-center bg-primary text-primary-foreground p-8 md:p-10 rounded-2xl">
            <p className="text-2xl md:text-3xl font-montserrat font-bold">
              Isso não é falta de esforço.
              <br />
              <span className="text-accent">É falta de direção.</span>
            </p>
          </div>
        </div>
      </section>

      {/* BLOCO 3 - QUEBRA DE CRENÇA */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-montserrat font-black text-primary mb-10">
            Treinar mais <span className="text-accent">não resolve.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card className="p-8 text-left border-2 border-destructive/30">
              <X className="w-8 h-8 text-destructive mb-4" />
              <p className="text-xl font-semibold text-foreground">
                Mais volume sem controle
              </p>
              <p className="text-lg text-muted-foreground mt-1">= mais risco</p>
            </Card>
            <Card className="p-8 text-left border-2 border-destructive/30">
              <X className="w-8 h-8 text-destructive mb-4" />
              <p className="text-xl font-semibold text-foreground">
                Mais intensidade sem base
              </p>
              <p className="text-lg text-muted-foreground mt-1">= mais lesão</p>
            </Card>
          </div>
          <p className="text-2xl md:text-3xl font-montserrat font-bold text-primary leading-snug">
            👉 Performance não vem do treino.
            <br />
            <span className="text-accent">
              Vem da forma como você sustenta o treino.
            </span>
          </p>
        </div>
      </section>

      {/* BLOCO 4 - SOLUÇÃO */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold text-primary mb-6">
              É aqui que a <span className="text-accent">CareFit</span> entra
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Você não entra para fazer fisioterapia.
              <br />
              <span className="text-foreground font-semibold">
                Você entra em um sistema de performance.
              </span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: "Leitura do seu ciclo", emoji: "🧠" },
              { icon: Dumbbell, title: "Fortalecimento direcionado", emoji: "💪" },
              { icon: Snowflake, title: "Recovery aplicado no momento certo", emoji: "❄️" },
              { icon: BarChart3, title: "Integração com seu treino", emoji: "📊" },
            ].map((c, i) => (
              <Card
                key={i}
                className="p-6 text-center border-2 hover:border-accent transition-colors hover:shadow-lg"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                  <c.icon className="w-8 h-8 text-accent" />
                </div>
                <p className="font-montserrat font-bold text-lg text-primary">
                  {c.title}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCO 5 - JORNADA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-montserrat font-bold text-center mb-14">
            O que acontece quando você faz do <span className="text-accent">jeito certo</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { week: "Semana 1", text: "Dor + desequilíbrio + insegurança" },
              { week: "Semana 6", text: "Corpo respondendo ao aumento de carga" },
              { week: "Semana 10", text: "Pico de performance com controle" },
              { week: "Semana 12", text: "Prova entregue. Resultado real." },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-primary-foreground/5 border border-primary-foreground/20 rounded-xl p-6 hover:bg-primary-foreground/10 transition-colors"
              >
                <div className="text-accent font-montserrat font-black text-2xl mb-3">
                  {s.week}
                </div>
                <p className="text-primary-foreground/90 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-2xl md:text-3xl font-montserrat font-bold">
            Isso não é sorte.
            <br />
            <span className="text-accent">É processo bem conduzido.</span>
          </p>
        </div>
      </section>

      {/* BLOCO 6 - AUTORIDADE */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Target className="w-14 h-14 text-accent mx-auto mb-6" />
          <p className="text-2xl md:text-4xl font-montserrat font-bold text-primary leading-tight mb-8">
            Todos os atendimentos são <span className="text-accent">individuais</span>.
            <br />
            Um fisioterapeuta por atleta. Sempre.
          </p>
          <div className="space-y-2 text-lg md:text-xl text-muted-foreground mb-8">
            <p>Falamos com seu treinador.</p>
            <p>Falamos com sua nutricionista.</p>
            <p className="font-semibold text-foreground">Alinhamos tudo.</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-primary">
            👉 Você não fica mais sozinho no seu ciclo.
          </p>
        </div>
      </section>

      {/* BLOCO 7 - ANTES VS DEPOIS */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 border-2 border-destructive/40 bg-destructive/5">
              <h3 className="text-2xl font-montserrat font-black text-destructive mb-6">
                ANTES
              </h3>
              <ul className="space-y-4">
                {["Dor recorrente", "Treino sem estratégia", "Recovery aleatório"].map(
                  (t, i) => (
                    <li key={i} className="flex items-center gap-3 text-lg">
                      <X className="w-6 h-6 text-destructive flex-shrink-0" />
                      <span className="text-foreground">{t}</span>
                    </li>
                  )
                )}
              </ul>
            </Card>
            <Card className="p-8 border-2 border-accent bg-accent/5">
              <h3 className="text-2xl font-montserrat font-black text-accent mb-6">
                DEPOIS
              </h3>
              <ul className="space-y-4">
                {["Evolução consistente", "Corpo preparado", "Performance real"].map(
                  (t, i) => (
                    <li key={i} className="flex items-center gap-3 text-lg">
                      <Check className="w-6 h-6 text-accent flex-shrink-0" />
                      <span className="text-foreground font-medium">{t}</span>
                    </li>
                  )
                )}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* BLOCO 8 - PROVA SOCIAL */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-10 md:p-14 border-l-8 border-accent bg-muted/30">
            <p className="text-2xl md:text-3xl font-playfair italic text-foreground leading-relaxed text-center">
              “Achei que era só recovery…
              <br />
              <span className="text-accent font-semibold">
                mas foi o que me fez bater meu RP.”
              </span>
            </p>
          </Card>
        </div>
      </section>

      {/* BLOCO 9 - URGÊNCIA */}
      <section className="py-20 bg-gradient-to-br from-destructive/10 to-accent/10 border-y-4 border-accent">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Clock className="w-14 h-14 text-destructive mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-8">
            Se você está em ciclo agora…
          </h2>
          <div className="space-y-4 text-xl md:text-2xl text-foreground font-medium">
            <p>👉 cada semana errada aumenta o risco de lesão</p>
            <p>👉 cada decisão errada compromete sua prova</p>
          </div>
        </div>
      </section>

      {/* BLOCO 10 - OFERTA FINAL */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            Oferta de entrada
          </div>
          <h2 className="text-4xl md:text-6xl font-montserrat font-black mb-4">
            Primeira Sessão Dupla CareFit
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10">Inclui:</p>
          <div className="grid md:grid-cols-3 gap-4 mb-10 text-left">
            {[
              "Avaliação completa",
              "Recovery personalizado",
              "Direcionamento do seu ciclo",
            ].map((t, i) => (
              <div
                key={i}
                className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl p-5 flex items-center gap-3"
              >
                <Check className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="font-medium">{t}</span>
              </div>
            ))}
          </div>
          <div className="bg-accent text-accent-foreground inline-block px-8 py-5 rounded-2xl shadow-2xl mb-8">
            <div className="text-sm uppercase tracking-wider font-semibold opacity-90">
              🔥 Tudo isso por
            </div>
            <div className="text-4xl md:text-5xl font-montserrat font-black">R$230</div>
          </div>
          <div className="space-y-6">
            <p className="text-xl md:text-2xl text-primary-foreground/90 font-light">
              Você pode continuar fazendo sozinho…
              <br />
              <span className="italic opacity-70">e torcer pra dar certo.</span>
              <br />
              <br />
              Ou pode fazer com <span className="text-accent font-bold">estratégia.</span>
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={goWhats}
              className="text-lg md:text-2xl px-10 py-8 h-auto"
            >
              👉 Quero treinar sem me machucar
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* MOBILE FIXED CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-accent shadow-2xl border-t-2 border-accent-foreground/20">
        <button
          onClick={goWhats}
          className="w-full py-4 px-6 text-accent-foreground font-montserrat font-bold text-lg flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Agendar agora
        </button>
      </div>

      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPerformance;
