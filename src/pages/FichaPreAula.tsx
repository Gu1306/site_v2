import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import logoCareFit from "@/assets/carefit-logo.png";

/* =========================================================================
 *  Ficha pré-aula do Fortalecimento — link PÚBLICO, sem token.
 *
 *  O n8n casa o respondente com o CRM por e-mail ou pelos últimos 8 dígitos
 *  do telefone. Se não achar, cria o card com nome, telefone e e-mail.
 *  Nome NUNCA é chave de casamento — homônimo e grafia diferente criariam
 *  duplicata ou casariam errado.
 *
 *  Os aceites (privacidade, saúde, termo) NÃO estão aqui de propósito:
 *  desde 05/09/2026 são colhidos em via física assinada. Colher o mesmo
 *  consentimento em dois lugares, em duas versões, enfraquece os dois.
 * ========================================================================= */
const N8N_WEBHOOK_URL = "https://n8n.carefitrunbase.com.br/webhook/carefit-ficha-pre-aula";

type Tipo = "unica" | "multi" | "texto" | "data";

interface Pergunta {
  key: string;
  titulo: string;
  ajuda?: string;
  tipo: Tipo;
  opcoes?: string[];
  /** Atalho que dispensa a digitação, para perguntas de texto. */
  negativa?: string;
  /** Em perguntas de múltipla escolha, abre um campo aberto abaixo das opções. */
  campoLivre?: string;
  opcional?: boolean;
  /** Só aparece se a resposta da pergunta `key` estiver entre estes valores. */
  dependeDe?: { key: string; valores: string[] };
}

const PERGUNTAS: Pergunta[] = [
  {
    key: "modalidades",
    titulo: "O que você treina hoje?",
    ajuda: "Pode marcar mais de uma.",
    tipo: "multi",
    opcoes: ["Corrida de rua", "Trail / montanha", "Triatlo", "Estou voltando a treinar", "Ainda não corro"],
  },
  {
    key: "volume_semanal",
    titulo: "Quantos km por semana você corre hoje, mais ou menos?",
    tipo: "unica",
    opcoes: ["Até 20 km", "20 a 40 km", "40 a 60 km", "Mais de 60 km", "Não estou correndo agora"],
  },
  {
    key: "dias_fortes",
    titulo: "Quais dias da semana são seus treinos fortes?",
    ajuda: "Intervalado, tiro, longão. É para o fortalecimento entrar sem atrapalhar a sua corrida.",
    tipo: "multi",
    opcoes: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom", "Não tenho dia fixo"],
  },
  {
    key: "proxima_prova",
    titulo: "Qual sua próxima prova?",
    tipo: "texto",
    negativa: "Ainda não tenho prova marcada",
    opcional: true,
  },
  {
    key: "data_prova",
    titulo: "Quando é a prova?",
    ajuda: "Se ainda não sabe a data, pode pular.",
    tipo: "data",
    opcional: true,
    dependeDe: { key: "proxima_prova", valores: ["__PREENCHIDO__"] },
  },
  {
    key: "experiencia_forca",
    titulo: "Você já treinou força de forma regular?",
    tipo: "unica",
    opcoes: [
      "Nunca treinei",
      "Já treinei, mas parei há mais de 6 meses",
      "Treino hoje, 1 ou 2 vezes por semana",
      "Treino hoje, 3 vezes ou mais",
    ],
  },
  {
    key: "exercicios",
    titulo: "Quais destes exercícios você já fez com orientação?",
    tipo: "multi",
    opcoes: [
      "Agachamento com barra",
      "Levantamento terra ou stiff",
      "Elevação pélvica",
      "Supino ou remada com halteres",
      "Saltos / pliometria",
      "Nenhum destes",
    ],
  },
  {
    key: "corpo_hoje",
    titulo: "Como está seu corpo hoje?",
    tipo: "unica",
    opcoes: [
      "Sem dor",
      "Com um incômodo, mas treinando normal",
      "Com dor que atrapalha o treino",
      "Em tratamento com fisioterapeuta agora",
    ],
  },
  {
    key: "detalhe_dor",
    titulo: "Conta pra gente: o quê, e desde quando?",
    ajuda: "Uma linha basta.",
    tipo: "texto",
    opcional: true,
    dependeDe: {
      key: "corpo_hoje",
      valores: [
        "Com um incômodo, mas treinando normal",
        "Com dor que atrapalha o treino",
        "Em tratamento com fisioterapeuta agora",
      ],
    },
  },
  {
    key: "condicoes",
    titulo: "Você tem alguma destas condições?",
    ajuda: "Pode marcar mais de uma.",
    tipo: "multi",
    opcoes: [
      "Diabetes",
      "Hipertensão",
      "Doença cardíaca",
      "Doença renal",
      "Asma ou outra doença respiratória",
      "Osteoporose",
      "Artrite ou artrose",
      "Estou gestante",
      "Uso medicação contínua",
      "Nenhuma delas",
    ],
  },
  {
    key: "lesao_vida",
    titulo: "Alguma vez você teve uma lesão que te tirou do esporte?",
    ajuda: "O que foi, quando, e se ainda incomoda.",
    tipo: "texto",
    negativa: "Nunca tive",
  },
  {
    key: "cirurgia",
    titulo: "Você já fez alguma cirurgia?",
    ajuda: "Qual e há quanto tempo.",
    tipo: "texto",
    negativa: "Nunca fiz",
  },
  {
    key: "expectativa",
    titulo: "O que você espera do Fortalecimento na CareFit?",
    ajuda: "Marque o que combina com você — e, se quiser, escreve com as suas palavras.",
    tipo: "multi",
    opcoes: [
      "Busco um fortalecimento específico para corredores",
      "Quero treinar com orientação",
      "Não quero me machucar de novo",
      "Quero melhorar meu tempo nas provas",
      "Quero aguentar mais treino sem sentir dor",
      "Nunca treinei força e não sei por onde começar",
    ],
    campoLivre: "Quer contar com as suas palavras? (opcional)",
  },
];

interface Identificacao {
  nome: string;
  whatsapp: string;
  email: string;
  nascimento: string;
}

type Respostas = Record<string, string | string[]>;
type Fase = "form" | "enviando" | "pronto";

const FichaPreAula = () => {
  const [passo, setPasso] = useState(0); // 0 = identificação
  const [id, setId] = useState<Identificacao>({ nome: "", whatsapp: "", email: "", nascimento: "" });
  const [respostas, setRespostas] = useState<Respostas>({});
  const [rascunho, setRascunho] = useState("");
  const [fase, setFase] = useState<Fase>("form");

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Perguntas condicionais somem da fila quando não se aplicam.
  const visiveis = useMemo(
    () =>
      PERGUNTAS.filter((p) => {
        if (!p.dependeDe) return true;
        const resp = respostas[p.dependeDe.key];
        if (p.dependeDe.valores[0] === "__PREENCHIDO__") {
          return typeof resp === "string" && resp.trim() !== "" && resp !== "Ainda não tenho prova marcada";
        }
        return typeof resp === "string" && p.dependeDe.valores.includes(resp);
      }),
    [respostas]
  );

  const total = visiveis.length + 1;
  const atual = passo > 0 ? visiveis[passo - 1] : null;

  const idOk =
    id.nome.trim().length > 2 &&
    id.whatsapp.replace(/\D/g, "").length >= 10 &&
    /\S+@\S+\.\S+/.test(id.email);

  const avancar = () => {
    setRascunho("");
    setPasso((p) => Math.min(p + 1, total));
  };

  const voltar = () => {
    setRascunho("");
    setPasso((p) => Math.max(p - 1, 0));
  };

  const responder = (key: string, valor: string | string[], auto = false) => {
    setRespostas((prev) => ({ ...prev, [key]: valor }));
    if (auto) window.setTimeout(avancar, 200);
  };

  const alternar = (key: string, opcao: string) => {
    setRespostas((prev) => {
      const atuais = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      const tem = atuais.includes(opcao);
      return { ...prev, [key]: tem ? atuais.filter((o) => o !== opcao) : [...atuais, opcao] };
    });
  };

  const enviar = async () => {
    setFase("enviando");
    const payload = {
      source: "carefit_ficha_pre_aula_site",
      submitted_at: new Date().toISOString(),
      atleta: {
        nome: id.nome.trim(),
        whatsapp: id.whatsapp.trim(),
        email: id.email.trim().toLowerCase(),
        nascimento: id.nascimento,
      },
      respostas,
      meta: { user_agent: navigator.userAgent, page_url: window.location.href },
    };

    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (error) {
      // Não travamos o atleta por falha de rede — ele já respondeu tudo.
      console.error("Falha ao enviar a ficha:", error);
    }
    setFase("pronto");
  };

  const progresso = Math.round(((passo + (fase === "pronto" ? 1 : 0)) / total) * 100);

  /* ------------------------------------------------------------- Tela final */
  if (fase === "pronto") {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md text-center text-primary-foreground">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Recebemos, obrigado! 💚</h1>
          <p className="text-primary-foreground/80">
            O treinador vai ler tudo antes da sua aula — é assim que a gente decide com qual carga
            você começa e o que evitar. Qualquer coisa, chama no WhatsApp (16) 99600-8849.
          </p>
        </div>
      </div>
    );
  }

  const enviando = fase === "enviando";

  return (
    <div className="min-h-screen bg-primary flex flex-col px-5 py-6">
      {/* Topo: voltar + progresso */}
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4 h-10">
          {passo > 0 && !enviando ? (
            <button
              onClick={voltar}
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
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
        <img src={logoCareFit} alt="CareFit Run Base" className="h-8 w-auto mx-auto mb-8 opacity-90" />
      </div>

      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-md">
          {enviando ? (
            <div className="flex flex-col items-center justify-center pt-16 text-primary-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-accent" />
              <p className="text-primary-foreground/80">Enviando sua ficha...</p>
            </div>
          ) : passo === 0 ? (
            /* ------------------------------------------------ Identificação */
            <div className="animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground text-center mb-3 leading-snug">
                Antes da sua primeira aula
              </h1>
              <p className="text-center text-primary-foreground/70 text-sm mb-8">
                São 2 minutos. O que você responder aqui vira a sua ficha na sala — a turma é em
                grupo, mas o treino é seu.
              </p>

              <div className="space-y-4">
                {[
                  { k: "nome" as const, l: "Nome completo", t: "text", ph: "Como está no seu documento" },
                  { k: "whatsapp" as const, l: "WhatsApp com DDD", t: "tel", ph: "16999998888" },
                  { k: "email" as const, l: "E-mail", t: "email", ph: "voce@email.com" },
                  { k: "nascimento" as const, l: "Data de nascimento", t: "date", ph: "" },
                ].map((campo) => (
                  <div key={campo.k}>
                    <label className="block text-primary-foreground/70 text-xs uppercase tracking-wider mb-2">
                      {campo.l}
                    </label>
                    <Input
                      type={campo.t}
                      inputMode={campo.k === "whatsapp" ? "numeric" : undefined}
                      value={id[campo.k]}
                      placeholder={campo.ph}
                      onChange={(e) => setId((prev) => ({ ...prev, [campo.k]: e.target.value }))}
                      className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 rounded-xl h-13 text-base focus-visible:ring-accent"
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={avancar}
                disabled={!idOk}
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full h-14 text-base font-semibold mt-8 disabled:opacity-40"
              >
                Começar
              </Button>
            </div>
          ) : atual ? (
            /* --------------------------------------------------- Perguntas */
            <div key={atual.key} className="animate-fade-in">
              <p className="text-center text-primary-foreground/60 text-sm mb-2">
                {passo} de {visiveis.length}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground text-center mb-3 leading-snug">
                {atual.titulo}
              </h1>
              {atual.ajuda && (
                <p className="text-center text-primary-foreground/60 text-sm mb-6">{atual.ajuda}</p>
              )}

              {/* Escolha única — toca e avança */}
              {atual.tipo === "unica" && (
                <div className="space-y-3 mt-6">
                  {atual.opcoes!.map((op) => {
                    const sel = respostas[atual.key] === op;
                    return (
                      <button
                        key={op}
                        onClick={() => responder(atual.key, op, true)}
                        className={`w-full rounded-2xl px-5 py-4 text-left text-base font-medium transition-all active:scale-[0.98] border-2 ${
                          sel
                            ? "bg-accent border-accent text-accent-foreground"
                            : "bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/30"
                        }`}
                      >
                        {op}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Múltipla escolha */}
              {atual.tipo === "multi" && (
                <>
                  <div className="space-y-2.5 mt-6">
                    {atual.opcoes!.map((op) => {
                      const sel = Array.isArray(respostas[atual.key]) && (respostas[atual.key] as string[]).includes(op);
                      return (
                        <button
                          key={op}
                          onClick={() => alternar(atual.key, op)}
                          className={`w-full flex items-center gap-3 rounded-2xl px-5 py-3.5 text-left text-base font-medium transition-all active:scale-[0.98] border-2 ${
                            sel
                              ? "bg-accent border-accent text-accent-foreground"
                              : "bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/10"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded border-2 flex-none ${
                              sel ? "bg-accent-foreground/20 border-accent-foreground" : "border-primary-foreground/40"
                            }`}
                          />
                          {op}
                        </button>
                      );
                    })}
                  </div>
                  {atual.campoLivre && (
                    <div className="mt-5">
                      <label className="block text-primary-foreground/60 text-sm mb-2">
                        {atual.campoLivre}
                      </label>
                      <Textarea
                        value={rascunho}
                        onChange={(e) => setRascunho(e.target.value)}
                        placeholder="Escreva aqui..."
                        rows={3}
                        className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 rounded-2xl text-base focus-visible:ring-accent"
                      />
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      if (atual.campoLivre) responder(`${atual.key}_outro`, rascunho.trim());
                      avancar();
                    }}
                    disabled={
                      (!Array.isArray(respostas[atual.key]) || (respostas[atual.key] as string[]).length === 0) &&
                      !(atual.campoLivre && rascunho.trim() !== "")
                    }
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 w-full h-14 text-base font-semibold mt-6 disabled:opacity-40"
                  >
                    Continuar
                  </Button>
                </>
              )}

              {/* Texto livre, com atalho de negativa */}
              {atual.tipo === "texto" && (
                <div className="mt-6">
                  <Textarea
                    value={rascunho}
                    onChange={(e) => setRascunho(e.target.value)}
                    placeholder="Escreva aqui..."
                    rows={4}
                    className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 rounded-2xl text-base focus-visible:ring-accent"
                  />
                  <Button
                    onClick={() => {
                      responder(atual.key, rascunho.trim());
                      avancar();
                    }}
                    disabled={!atual.opcional && !atual.negativa && rascunho.trim() === ""}
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 w-full h-14 text-base font-semibold mt-4 disabled:opacity-40"
                  >
                    Continuar
                  </Button>
                  {atual.negativa && (
                    <button
                      onClick={() => {
                        responder(atual.key, atual.negativa!);
                        avancar();
                      }}
                      className="w-full mt-3 rounded-2xl px-5 py-3.5 text-base font-medium border-2 border-primary-foreground/25 text-primary-foreground/90 hover:bg-primary-foreground/10 transition-all active:scale-[0.98]"
                    >
                      {atual.negativa}
                    </button>
                  )}
                  {atual.opcional && !atual.negativa && (
                    <button
                      onClick={() => {
                        responder(atual.key, "");
                        avancar();
                      }}
                      className="w-full mt-3 text-primary-foreground/50 text-sm hover:text-primary-foreground/80 transition-colors py-2"
                    >
                      Pular
                    </button>
                  )}
                </div>
              )}

              {/* Data */}
              {atual.tipo === "data" && (
                <div className="mt-6">
                  <Input
                    type="date"
                    value={(respostas[atual.key] as string) || ""}
                    onChange={(e) => responder(atual.key, e.target.value)}
                    className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground rounded-xl h-14 text-base focus-visible:ring-accent"
                  />
                  <Button
                    onClick={avancar}
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 w-full h-14 text-base font-semibold mt-4"
                  >
                    Continuar
                  </Button>
                  <button
                    onClick={() => {
                      responder(atual.key, "");
                      avancar();
                    }}
                    className="w-full mt-3 text-primary-foreground/50 text-sm hover:text-primary-foreground/80 transition-colors py-2"
                  >
                    Ainda não sei a data
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ------------------------------------------------------ Revisão */
            <div className="animate-fade-in text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3 leading-snug">
                Tudo respondido 💪
              </h1>
              <p className="text-primary-foreground/70 text-sm mb-8">
                É só confirmar que a gente já prepara a sua ficha.
              </p>
              <Button
                onClick={enviar}
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full h-14 text-base font-semibold"
              >
                Enviar minha ficha
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FichaPreAula;
