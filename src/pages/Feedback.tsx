import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, Loader2, Star } from "lucide-react";
import logoCareFit from "@/assets/carefit-logo.png";

/* =========================================================================
 *  CONFIGURAR ANTES DE PUBLICAR
 *  - N8N_WEBHOOK_URL: endpoint do fluxo n8n que recebe o feedback (POST).
 *    Base do n8n já é https://n8n.carefitrunbase.com.br — confirme o path
 *    exato do webhook criado no fluxo de feedback.
 *  - GOOGLE_REVIEW_URL: link direto de avaliação no Google (abre a caixa de
 *    estrelas). Formato típico: https://g.page/r/XXXXXXXX/review
 * ========================================================================= */
const N8N_WEBHOOK_URL = "https://n8n.carefitrunbase.com.br/webhook/carefit-feedback";
const GOOGLE_REVIEW_URL = "https://g.page/r/CfIfJAC5di2EEBM/review";

interface Option {
  emoji: string;
  label: string;
  /** peso de positividade: 2 ótimo, 1 bom, 0 neutro, -1 negativo */
  score: number;
}

interface Question {
  key: "experiencia_geral" | "ajuda_objetivo" | "recomendaria";
  title: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    key: "experiencia_geral",
    title: "Como foi sua experiência geral com a CareFit?",
    options: [
      { emoji: "😍", label: "Excelente", score: 2 },
      { emoji: "🙂", label: "Boa", score: 1 },
      { emoji: "😐", label: "Neutra", score: 0 },
      { emoji: "😕", label: "Ruim", score: -1 },
    ],
  },
  {
    key: "ajuda_objetivo",
    title: "O acompanhamento te ajudou a alcançar seu objetivo?",
    options: [
      { emoji: "🚀", label: "Ajudou muito", score: 2 },
      { emoji: "👍", label: "Ajudou", score: 1 },
      { emoji: "😐", label: "Mais ou menos", score: 0 },
      { emoji: "👎", label: "Não ajudou", score: -1 },
    ],
  },
  {
    key: "recomendaria",
    title: "Você recomendaria a CareFit para outro corredor?",
    options: [
      { emoji: "💚", label: "Com certeza", score: 2 },
      { emoji: "🙂", label: "Provavelmente", score: 1 },
      { emoji: "🤔", label: "Talvez", score: 0 },
      { emoji: "🚫", label: "Não", score: -1 },
    ],
  },
];

// Passo do comentário fica logo após as perguntas de múltipla escolha.
const COMMENT_STEP = QUESTIONS.length;
const TOTAL_STEPS = QUESTIONS.length + 1;

type Answers = Partial<Record<Question["key"], string>>;
type Scores = Partial<Record<Question["key"], number>>;
type Phase = "form" | "sending" | "done";

const Feedback = () => {
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [scores, setScores] = useState<Scores>({});
  const [comentario, setComentario] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [positive, setPositive] = useState(false);

  // Dados vindos da URL — nunca exibidos, só enviados no payload.
  const urlData = useMemo(
    () => ({
      task_id: searchParams.get("task_id") || "",
      phone: searchParams.get("phone") || "",
      token: searchParams.get("token") || "",
      plan: searchParams.get("plan") || "",
    }),
    [searchParams]
  );

  // noindex, nofollow — página é de acesso privado por link.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const isFeedbackPositive = (s: Scores): boolean => {
    const exp = s.experiencia_geral ?? 0;
    const rec = s.recomendaria ?? 0;
    const aju = s.ajuda_objetivo ?? 0;
    // Só mandamos para o Google quem realmente teve uma boa experiência.
    return exp >= 1 && rec >= 1 && aju >= 0;
  };

  const handleSelect = (question: Question, option: Option) => {
    setAnswers((prev) => ({ ...prev, [question.key]: `${option.emoji} ${option.label}` }));
    setScores((prev) => ({ ...prev, [question.key]: option.score }));
    // Avança sozinho após um leve feedback visual.
    window.setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), 220);
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const buildPayload = () => ({
    source: "carefit_feedback_site",
    submitted_at: new Date().toISOString(),
    task_id: urlData.task_id,
    phone: urlData.phone,
    token: urlData.token,
    plan: urlData.plan,
    answers: {
      experiencia_geral: answers.experiencia_geral || "",
      ajuda_objetivo: answers.ajuda_objetivo || "",
      recomendaria: answers.recomendaria || "",
      comentario: comentario.trim(),
    },
    meta: {
      user_agent: navigator.userAgent,
      page_url: window.location.href,
    },
  });

  const handleSubmit = async () => {
    const good = isFeedbackPositive(scores);
    setPositive(good);
    setPhase("sending");

    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
        // Garante o envio mesmo se a página for redirecionada logo em seguida.
        keepalive: true,
      });
    } catch (error) {
      // Não bloqueamos o usuário por falha de rede — o feedback já foi coletado.
      console.error("Falha ao enviar feedback:", error);
    }

    if (good) {
      // Feedback positivo → encaminha para avaliação no Google.
      window.setTimeout(() => {
        window.location.href = GOOGLE_REVIEW_URL;
      }, 1400);
    }
    setPhase("done");
  };

  const progress = Math.round(((step + (phase === "done" ? 1 : 0)) / TOTAL_STEPS) * 100);

  /* -------------------------------------------------------------- Tela final */
  if (phase === "done") {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md text-center text-primary-foreground">
          {positive ? (
            <>
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-accent" fill="currentColor" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">Que alegria ter você com a gente! 💚</h1>
              <p className="text-primary-foreground/80 mb-8">
                Estamos te levando para deixar sua avaliação no Google. Isso ajuda demais outros
                corredores a conhecerem a CareFit.
              </p>
              <a href={GOOGLE_REVIEW_URL}>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full h-14 text-base font-semibold">
                  Avaliar no Google
                </Button>
              </a>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3">Obrigado pelo seu feedback! 🙏</h1>
              <p className="text-primary-foreground/80">
                Sua opinião é muito importante e vai nos ajudar a melhorar a experiência dos próximos
                corredores que passarem pela CareFit.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------- Envio (loading) */
  const sending = phase === "sending";

  /* ------------------------------------------------------------------ Formulário */
  return (
    <div className="min-h-screen bg-primary flex flex-col px-5 py-6">
      {/* Topo: voltar + progresso */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4 h-10">
          {step > 0 && !sending ? (
            <button
              onClick={goBack}
              aria-label="Voltar"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-2 -ml-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <span className="w-6 h-6" />
          )}
          <div className="flex-1 h-2 rounded-full bg-primary-foreground/15 overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <img src={logoCareFit} alt="CareFit Run Base" className="h-8 w-auto mx-auto mb-8 opacity-90" />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-md">
          {sending ? (
            <div className="flex flex-col items-center justify-center pt-16 text-primary-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-accent" />
              <p className="text-primary-foreground/80">Enviando seu feedback...</p>
            </div>
          ) : step < QUESTIONS.length ? (
            <div key={QUESTIONS[step].key} className="animate-fade-in">
              <p className="text-center text-primary-foreground/60 text-sm mb-2">
                Pergunta {step + 1} de {QUESTIONS.length}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground text-center mb-8 leading-snug">
                {QUESTIONS[step].title}
              </h1>
              <div className="space-y-3">
                {QUESTIONS[step].options.map((option) => {
                  const selected = answers[QUESTIONS[step].key] === `${option.emoji} ${option.label}`;
                  return (
                    <button
                      key={option.label}
                      onClick={() => handleSelect(QUESTIONS[step], option)}
                      className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left text-lg font-medium transition-all active:scale-[0.98] border-2 ${
                        selected
                          ? "bg-accent border-accent text-accent-foreground"
                          : "bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/30"
                      }`}
                    >
                      <span className="text-3xl leading-none">{option.emoji}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Passo do comentário (opcional) */
            <div className="animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground text-center mb-3 leading-snug">
                Quer deixar um comentário? ✍️
              </h1>
              <p className="text-center text-primary-foreground/60 text-sm mb-6">
                Opcional — pode falar com sinceridade.
              </p>
              <Textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escreva aqui..."
                rows={5}
                className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded-2xl text-base mb-6 focus-visible:ring-accent"
              />
              <Button
                onClick={handleSubmit}
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full h-14 text-base font-semibold"
              >
                Enviar feedback
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
