import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, MessageCircle, MapPin, Gauge } from "lucide-react";
import Footer from "@/components/Footer";
import CareFitLogo from "@/components/CareFitLogo";

type Tom = "petrol" | "terracota" | "dourado";

type Linha = { texto: string; valor: string; on: boolean };

type Plano = {
  kicker: string;
  nome: string;
  freq: string;
  mote: string;
  preco: string;
  notas: string[];
  selo?: string;
  secoes: { titulo: string; linhas: Linha[] }[];
  callouts: { label: string; valor: string; sub: string }[];
  tom: Tom;
};

// O topo colorido de cada card carrega o tom da marca. O dourado é o
// destaque de cada aba e leva texto petróleo — branco sobre dourado não
// passa contraste.
const TOPO: Record<Tom, string> = {
  petrol: "bg-primary text-white",
  terracota: "bg-secondary text-white",
  dourado: "bg-accent text-accent-foreground",
};

const MOLDURA: Record<Tom, string> = {
  petrol: "border-border",
  terracota: "border-secondary/40",
  dourado: "border-accent border-2 shadow-lg",
};

const MARCA: Record<Tom, string> = {
  petrol: "text-primary",
  terracota: "text-secondary",
  dourado: "text-primary",
};

const A_SESSAO = [
  { texto: "Protocolo completo de 1 hora", valor: "8 recursos", on: true },
  { texto: "Fisioterapeuta acompanhando", valor: "incluso", on: true },
];

const recovery: Plano[] = [
  {
    kicker: "1 sessão",
    nome: "Avulsa",
    freq: "Sem compromisso de continuidade",
    mote: "Para o dia em que o corpo pede.",
    preco: "230",
    notas: ["R$ 230 a sessão"],
    tom: "petrol",
    secoes: [
      { titulo: "A sessão", linhas: A_SESSAO },
      {
        titulo: "O plano",
        linhas: [
          { texto: "Sessões contratadas", valor: "1", on: true },
          { texto: "Ritmo", valor: "quando precisar", on: true },
        ],
      },
    ],
    callouts: [{ label: "A sessão sai por", valor: "R$ 230", sub: "1 sessão" }],
  },
  {
    kicker: "2 sessões",
    nome: "Quinzenal",
    freq: "Intervalo de 15 dias",
    mote: "O primeiro passo para virar rotina.",
    preco: "430",
    notas: ["R$ 215 a sessão"],
    tom: "terracota",
    secoes: [
      { titulo: "A sessão", linhas: A_SESSAO },
      {
        titulo: "O plano",
        linhas: [
          { texto: "Sessões contratadas", valor: "2", on: true },
          { texto: "Ritmo", valor: "a cada 15 dias", on: true },
        ],
      },
    ],
    callouts: [{ label: "A sessão sai por", valor: "R$ 215", sub: "2 sessões" }],
  },
  {
    kicker: "4 sessões",
    nome: "Mensal",
    freq: "1× por semana",
    mote: "Recuperação semanal, do jeito que o treino pede.",
    preco: "800",
    notas: ["R$ 200 a sessão"],
    tom: "petrol",
    secoes: [
      { titulo: "A sessão", linhas: A_SESSAO },
      {
        titulo: "O plano",
        linhas: [
          { texto: "Sessões contratadas", valor: "4", on: true },
          { texto: "Ritmo", valor: "1× por semana", on: true },
        ],
      },
    ],
    callouts: [{ label: "A sessão sai por", valor: "R$ 200", sub: "4 sessões" }],
  },
  {
    kicker: "12 sessões",
    nome: "Semestral",
    freq: "Para realizar em 6 meses",
    mote: "A temporada inteira com o corpo assistido.",
    preco: "2.280",
    notas: ["R$ 190 a sessão"],
    selo: "Menor preço por sessão",
    tom: "dourado",
    secoes: [
      { titulo: "A sessão", linhas: A_SESSAO },
      {
        titulo: "O plano",
        linhas: [
          { texto: "Sessões contratadas", valor: "12", on: true },
          { texto: "Ritmo", valor: "em 6 meses", on: true },
        ],
      },
    ],
    callouts: [{ label: "A sessão sai por", valor: "R$ 190", sub: "12 sessões" }],
  },
];

const fortalecimento: Plano[] = [
  {
    kicker: "24 aulas · 4 meses",
    nome: "Só fortalecer",
    freq: "Turma de 3 · 54 min · seg, qua e sex",
    mote: "O primeiro ciclo de força da sua corrida.",
    preco: "1.920",
    notas: ["4× de R$ 480", "R$ 80 a aula"],
    tom: "petrol",
    secoes: [
      {
        titulo: "O que inclui",
        linhas: [
          { texto: "Aulas de fortalecimento em turma de 3", valor: "24 aulas", on: true },
          { texto: "Ficha individual e mobilidade", valor: "incluso", on: true },
          { texto: "Duração do ciclo", valor: "4 meses", on: true },
          { texto: "Plano de recovery ativo", valor: "—", on: false },
          { texto: "Desconto na avaliação de força", valor: "—", on: false },
        ],
      },
    ],
    callouts: [{ label: "A aula sai por", valor: "R$ 80", sub: "24 aulas" }],
  },
  {
    kicker: "24 aulas · 4 meses",
    nome: "Com plano de recovery",
    freq: "Turma de 3 · 54 min · seg, qua e sex",
    mote: "Quem já recupera na base começa mais perto.",
    preco: "1.800",
    notas: ["4× de R$ 450", "R$ 75 a aula"],
    selo: "R$ 120 a menos",
    tom: "dourado",
    secoes: [
      {
        titulo: "O que inclui",
        linhas: [
          { texto: "Aulas de fortalecimento em turma de 3", valor: "24 aulas", on: true },
          { texto: "Ficha individual e mobilidade", valor: "incluso", on: true },
          { texto: "Duração do ciclo", valor: "4 meses", on: true },
          { texto: "Plano de recovery ativo", valor: "pré-requisito", on: true },
          { texto: "Desconto na avaliação de força", valor: "R$ 200", on: true },
        ],
      },
    ],
    callouts: [{ label: "A aula sai por", valor: "R$ 75", sub: "24 aulas" }],
  },
];

const combinado: Plano[] = [
  {
    kicker: "4 meses · meia temporada",
    nome: "Ciclo",
    freq: "24 aulas + 8 sessões de recovery",
    mote: "Para sentir os dois juntos antes de assinar seis meses.",
    preco: "3.240",
    notas: ["4× de R$ 810", "R$ 70 a aula · R$ 195 a sessão"],
    tom: "terracota",
    secoes: [
      {
        titulo: "Treino e recuperação",
        linhas: [
          { texto: "Aulas de fortalecimento em turma de 3", valor: "24 aulas", on: true },
          { texto: "Sessão Jornada Recovery de 1 hora", valor: "8 sessões", on: true },
          { texto: "Ficha individual e mobilidade", valor: "incluso", on: true },
        ],
      },
      {
        titulo: "Acompanhamento",
        linhas: [
          { texto: "Teste de força na entrada e reteste no fim", valor: "—", on: false },
          { texto: "Revisão do programa a cada 8 aulas", valor: "—", on: false },
          { texto: "Prioridade na reserva de horário", valor: "—", on: false },
          { texto: "Acompanhamento semanal pelo Strava", valor: "—", on: false },
          { texto: "Recovery na semana da sua prova-alvo", valor: "—", on: false },
          { texto: "Retrospecto da Jornada ao final", valor: "—", on: false },
        ],
      },
    ],
    callouts: [
      { label: "A aula", valor: "R$ 70", sub: "24 aulas" },
      { label: "A sessão", valor: "R$ 195", sub: "8 sessões" },
    ],
  },
  {
    kicker: "6 meses · temporada inteira",
    nome: "Temporada",
    freq: "30 aulas + 12 sessões de recovery",
    mote: "O único plano que acompanha um ciclo de treino do começo ao fim.",
    preco: "4.230",
    notas: ["6× de R$ 705", "R$ 65 a aula · R$ 190 a sessão"],
    selo: "Economia de R$ 700",
    tom: "dourado",
    secoes: [
      {
        titulo: "Treino e recuperação",
        linhas: [
          { texto: "Aulas de fortalecimento em turma de 3", valor: "30 aulas", on: true },
          { texto: "Sessão Jornada Recovery de 1 hora", valor: "12 sessões", on: true },
          { texto: "Ficha individual e mobilidade", valor: "incluso", on: true },
        ],
      },
      {
        titulo: "Acompanhamento",
        linhas: [
          { texto: "Teste de força na entrada e reteste no fim", valor: "R$ 400", on: true },
          { texto: "Revisão do programa a cada 8 aulas", valor: "4 revisões", on: true },
          { texto: "Prioridade na reserva de horário", valor: "incluso", on: true },
          { texto: "Acompanhamento semanal pelo Strava", valor: "incluso", on: true },
          { texto: "Recovery na semana da sua prova-alvo", valor: "garantido", on: true },
          { texto: "Retrospecto da Jornada ao final", valor: "exclusivo", on: true },
        ],
      },
    ],
    callouts: [
      { label: "A aula", valor: "R$ 65", sub: "30 aulas" },
      { label: "A sessão", valor: "R$ 190", sub: "12 sessões" },
    ],
  },
];

const ABAS = [
  { id: "recovery", rotulo: "Recovery", planos: recovery, colunas: "lg:grid-cols-4", dica: "Quanto mais contínua a recuperação, menor a sessão" },
  { id: "forca", rotulo: "Fortalecimento", planos: fortalecimento, colunas: "lg:grid-cols-2 lg:max-w-4xl lg:mx-auto", dica: "Turma de 3 · 54 minutos · segunda, quarta e sexta" },
  { id: "combo", rotulo: "Recovery + Fortalecimento", planos: combinado, colunas: "lg:grid-cols-2 lg:max-w-4xl lg:mx-auto", dica: "Força e recuperação no mesmo contrato — o menor preço nos dois" },
] as const;

const protocolo = [
  "Acompanhamento com fisioterapeuta",
  "Bioimpedância",
  "Banheira de gelo",
  "Ofurô",
  "Bota de compressão",
  "Liberação miofascial manual",
  "Eletroestimulação",
  "Dry needling",
];

const escadaAula = [
  { valor: "R$ 80", quando: "só fortalecer" },
  { valor: "R$ 75", quando: "com plano de recovery" },
  { valor: "R$ 70", quando: "no Ciclo" },
  { valor: "R$ 65", quando: "na Temporada" },
];

const escadaSessao = [
  { valor: "R$ 230", quando: "avulsa" },
  { valor: "R$ 215", quando: "quinzenal" },
  { valor: "R$ 200", quando: "mensal" },
  { valor: "R$ 195", quando: "no Ciclo" },
  { valor: "R$ 190", quando: "semestral e na Temporada" },
];

const reabilitacao = [
  {
    nome: "Avaliação de reabilitação",
    preco: "180",
    texto: "Avaliação da lesão e proposta de tratamento, com fisioterapeuta.",
  },
  {
    nome: "Sessão de fisioterapia",
    preco: "130",
    texto: "Para quem já passou pela avaliação e está em tratamento.",
  },
];

const abrirWhatsApp = () =>
  window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");

const CardPlano = ({ plano }: { plano: Plano }) => (
  <div className={`flex flex-col rounded-xl overflow-hidden bg-background border ${MOLDURA[plano.tom]}`}>
    <div className={`px-6 py-5 ${TOPO[plano.tom]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">{plano.kicker}</p>
      <h3 className="text-2xl font-bold mt-1">{plano.nome}</h3>
      <p className="text-xs mt-1 opacity-80">{plano.freq}</p>
    </div>

    <p className="px-6 py-4 text-sm italic text-muted-foreground bg-muted/40 border-b border-border min-h-[64px] flex items-center">
      {plano.mote}
    </p>

    <div className="px-6 pt-5 pb-4 border-b border-border">
      <p className={`text-4xl font-bold ${MARCA[plano.tom]} tabular-nums`}>
        <span className="text-lg align-super font-semibold">R$ </span>
        {plano.preco}
      </p>
      {plano.notas.map((nota) => (
        <p key={nota} className="text-sm text-muted-foreground tabular-nums">{nota}</p>
      ))}
      {plano.selo && (
        <span className="inline-block mt-3 rounded bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
          {plano.selo}
        </span>
      )}
    </div>

    <div className="px-6 py-4 flex-1">
      {plano.secoes.map((secao) => (
        <div key={secao.titulo}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 pt-3 pb-2">
            {secao.titulo}
          </p>
          {secao.linhas.map((linha) => (
            <div key={linha.texto} className="flex items-baseline gap-2 py-1.5 border-b border-border/60 last:border-0">
              {linha.on ? (
                <Check className={`w-4 h-4 shrink-0 translate-y-0.5 ${MARCA[plano.tom]}`} aria-hidden="true" />
              ) : (
                <X className="w-4 h-4 shrink-0 translate-y-0.5 text-muted-foreground/40" aria-hidden="true" />
              )}
              <span className={`text-sm flex-1 ${linha.on ? "text-foreground/80" : "text-muted-foreground/50"}`}>
                {linha.texto}
              </span>
              <span className={`text-[11px] font-semibold uppercase whitespace-nowrap tabular-nums ${linha.on ? "text-foreground" : "text-muted-foreground/50"}`}>
                {linha.valor}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>

    <div className="mx-6 mb-6 flex gap-4 rounded-lg bg-muted/60 px-4 py-3">
      {plano.callouts.map((callout) => (
        <div key={callout.label} className="flex-1 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{callout.label}</p>
          <p className={`text-2xl font-bold ${MARCA[plano.tom]} tabular-nums`}>{callout.valor}</p>
          <p className="text-[11px] text-muted-foreground">{callout.sub}</p>
        </div>
      ))}
    </div>
  </div>
);

const Escada = ({ titulo, passos }: { titulo: string; passos: { valor: string; quando: string }[] }) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground w-24 shrink-0">
      {titulo}
    </span>
    {passos.map((passo, i) => (
      <div key={passo.quando} className="flex items-baseline gap-2">
        {i > 0 && <span className="text-muted-foreground/40 mr-1" aria-hidden="true">›</span>}
        <span className={`text-lg font-bold tabular-nums ${i === passos.length - 1 ? "text-accent" : "text-primary"}`}>
          {passo.valor}
        </span>
        <span className="text-xs text-muted-foreground">{passo.quando}</span>
      </div>
    ))}
  </div>
);

const Planos = () => {
  const [aba, setAba] = useState<string>("combo");
  const ativa = ABAS.find((a) => a.id === aba) ?? ABAS[2];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <CareFitLogo size={72} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Planos CareFit Run Base
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Correr melhor não é escolher entre treinar forte e se recuperar — é fazer os dois no mesmo ciclo. Escolha por onde a sua temporada começa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" onClick={abrirWhatsApp}>
              Conversar sobre os planos
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={abrirWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Abas + planos */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div role="tablist" aria-label="Categorias de plano" className="flex flex-wrap justify-center gap-2 mb-4">
            {ABAS.map((item) => (
              <button
                key={item.id}
                id={`aba-${item.id}`}
                role="tab"
                type="button"
                aria-selected={aba === item.id}
                aria-controls={`painel-${item.id}`}
                onClick={() => setAba(item.id)}
                className={`rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-colors ${
                  aba === item.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-muted text-muted-foreground hover:text-primary"
                }`}
              >
                {item.rotulo}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mb-10">{ativa.dica}</p>

          <div
            id={`painel-${ativa.id}`}
            role="tabpanel"
            aria-labelledby={`aba-${ativa.id}`}
            className={`grid gap-6 sm:grid-cols-2 ${ativa.colunas}`}
          >
            {ativa.planos.map((plano) => (
              <CardPlano key={plano.nome} plano={plano} />
            ))}
          </div>

          {/* A avaliação de força só faz sentido ao lado dos planos de força */}
          {aba === "forca" && (
            <div className="mt-6 lg:max-w-4xl lg:mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-xl border border-border bg-muted/40 px-6 py-5">
              <div className="flex items-start gap-4">
                <Gauge className="w-7 h-7 text-secondary shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">Antes de carregar, medir</p>
                  <h3 className="text-xl font-bold text-primary mt-1">Avaliação de força</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    Define com qual carga você começa e o que retestar no fim do ciclo.
                  </p>
                </div>
              </div>
              <div className="flex gap-8 sm:text-right">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Sem plano</p>
                  <p className="text-2xl font-bold text-primary tabular-nums">R$ 250</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Com plano</p>
                  <p className="text-2xl font-bold text-accent tabular-nums">R$ 200</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Porta de entrada */}
      <section className="pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl border-2 border-secondary bg-secondary/5 px-6 py-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">Nunca veio à base</p>
              <h2 className="text-2xl font-bold text-primary mt-1">Primeira sessão</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Você passa pelo protocolo inteiro com a fisioterapeuta e sai com a leitura do seu corpo.{" "}
                <strong className="text-foreground font-semibold">A segunda sessão é por nossa conta.</strong>
              </p>
            </div>
            <div className="md:text-right shrink-0">
              <p className="text-4xl font-bold text-secondary tabular-nums">
                <span className="text-lg align-super font-semibold">R$ </span>230
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground tabular-nums">
                duas sessões · R$ 115 cada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Protocolo da sessão */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-2">O que entra em uma Sessão Jornada Recovery</h2>
          <p className="text-muted-foreground mb-8">Uma hora, oito recursos, conduzidos por fisioterapeuta que conhece o seu treino e a sua prova.</p>
          <div className="flex flex-wrap gap-3">
            {protocolo.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground/80"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Escada de preço */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Quanto mais longo o ciclo, menor o preço</h2>
          <p className="text-muted-foreground mb-8">A mesma regra vale para a aula de fortalecimento e para a sessão de recovery.</p>
          <div className="rounded-xl border border-border bg-muted/30 px-6 py-6 space-y-4">
            <Escada titulo="A aula" passos={escadaAula} />
            <Escada titulo="A sessão" passos={escadaSessao} />
          </div>
        </div>
      </section>

      {/* Reabilitação */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Reabilitação</h2>
          <p className="text-muted-foreground mb-8">Para quem chegou lesionado. Contratada à parte dos planos.</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
            {reabilitacao.map((item) => (
              <div key={item.nome} className="rounded-xl border border-border bg-background px-6 py-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{item.nome}</p>
                <p className="text-3xl font-bold text-primary mt-2 tabular-nums">
                  <span className="text-base align-super font-semibold">R$ </span>
                  {item.preco}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-gradient-to-r from-accent to-earth">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary mb-6">Cuidar não é parar. É evoluir.</h2>
          <p className="text-xl text-primary/80 mb-8 max-w-2xl mx-auto">
            Se você não sabe por onde começar, comece conversando. A gente olha sua semana de treino, sua próxima prova e o que o seu corpo está pedindo — e diz qual plano faz sentido.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="default" size="lg" className="text-lg px-8 py-4" onClick={abrirWhatsApp}>
              Falar com a CareFit
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={abrirWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              (16) 99600-8849
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-primary/80">
            <MapPin className="w-5 h-5" />
            <span>Av. Áurea Aparecida Bragheto Machado, 241 — Ribeirão Preto, SP</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Planos;
