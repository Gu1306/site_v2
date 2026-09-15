import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, MessageCircle, MapPin, Gauge } from "lucide-react";
import Footer from "@/components/Footer";
import logoCareFit from "@/assets/logocarefitclub.png";

type Tom = "petrol" | "cobre" | "prata" | "ouro";

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

// Os degradês metálicos do topo de cada card não cabem no sistema de tokens
// (token é cor sólida), então vivem aqui, num lugar só. O texto de cada tom já
// vem escolhido para passar contraste sobre o próprio degradê — em especial o
// ouro, que leva petróleo e nunca branco.
const METAL: Record<Tom, { fundo: string; nome: string; label: string; brilho: string }> = {
  petrol: {
    fundo: "linear-gradient(135deg,#0B2F34 0%,#1A5A5E 42%,#2E7076 62%,#10393E 100%)",
    nome: "#DFEEEC",
    label: "#A9CAC8",
    brilho: "rgba(255,255,255,.18)",
  },
  cobre: {
    fundo: "linear-gradient(135deg,#47200F 0%,#9E4E2A 40%,#E2825C 62%,#6F3419 100%)",
    nome: "#FFE0CE",
    label: "#F7D2BF",
    brilho: "rgba(255,255,255,.20)",
  },
  prata: {
    fundo: "linear-gradient(135deg,#1F353A 0%,#5B787B 36%,#CFE0DF 60%,#3F5F63 100%)",
    nome: "#12282C",
    label: "#223E42",
    brilho: "rgba(255,255,255,.22)",
  },
  ouro: {
    fundo: "linear-gradient(135deg,#46320F 0%,#AF8330 30%,#F0CE85 55%,#A87C2C 76%,#55400F 100%)",
    nome: "#33240A",
    label: "#4A3510",
    brilho: "rgba(255,255,255,.24)",
  },
};

// Tinta do preço e dos vistos dentro do card, no claro.
const TINTA: Record<Tom, string> = {
  petrol: "#0E3C41",
  cobre: "#B4542F",
  prata: "#0E3C41",
  ouro: "#8A6A2A",
};

const BORDA: Record<Tom, string> = {
  petrol: "#ddd2c2",
  cobre: "#e6c5b3",
  prata: "#ccd8d7",
  ouro: "#D4A656",
};

const RODAPE: Record<Tom, string> = {
  petrol: "#F4EDE4",
  cobre: "#FBEFE8",
  prata: "#F1F5F4",
  ouro: "#FBF1DC",
};

const A_SESSAO: Linha[] = [
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
    tom: "cobre",
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
    tom: "prata",
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
    tom: "ouro",
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
    tom: "ouro",
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
    tom: "prata",
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
    tom: "ouro",
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
  {
    id: "recovery",
    rotulo: "Recovery",
    planos: recovery,
    colunas: "sm:grid-cols-2 lg:grid-cols-4",
    dica: "Quanto mais contínua a recuperação, menor a sessão",
  },
  {
    id: "forca",
    rotulo: "Fortalecimento",
    planos: fortalecimento,
    colunas: "sm:grid-cols-2 lg:max-w-4xl lg:mx-auto",
    dica: "Turma de 3 · 54 minutos · segunda, quarta e sexta",
  },
  {
    id: "combo",
    rotulo: "Recovery + Fortalecimento",
    planos: combinado,
    colunas: "sm:grid-cols-2 lg:max-w-4xl lg:mx-auto",
    dica: "Força e recuperação no mesmo contrato — o menor preço nos dois",
  },
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

const CardPlano = ({ plano }: { plano: Plano }) => {
  const metal = METAL[plano.tom];
  const tinta = TINTA[plano.tom];
  const destaque = plano.tom === "ouro";

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden bg-background"
      style={{
        border: `${destaque ? 2 : 1}px solid ${BORDA[plano.tom]}`,
        boxShadow: destaque ? "0 18px 44px -24px rgba(212,166,86,.95)" : undefined,
      }}
    >
      {/* topo metálico com o brilho diagonal */}
      <div className="relative overflow-hidden px-5 pt-4 pb-3.5" style={{ background: metal.fundo }}>
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            top: "-60%",
            left: "-28%",
            width: "48%",
            height: "220%",
            transform: "rotate(18deg)",
            background: `linear-gradient(90deg, transparent, ${metal.brilho}, transparent)`,
          }}
        />
        <div className="relative">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.18em]" style={{ color: metal.label }}>
            {plano.kicker}
          </p>
          <h3 className="font-shoulders text-[34px] font-extrabold uppercase leading-[0.9] mt-1" style={{ color: metal.nome }}>
            {plano.nome}
          </h3>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.06em] mt-1" style={{ color: metal.label }}>
            {plano.freq}
          </p>
        </div>
      </div>

      <p className="px-5 py-3 text-xs italic text-muted-foreground bg-muted/40 border-b border-border min-h-[46px] flex items-center">
        {plano.mote}
      </p>

      <div className="px-5 pt-4 pb-3.5 border-b border-border">
        <p className="font-shoulders text-[50px] font-extrabold leading-[0.9] tabular-nums" style={{ color: tinta }}>
          <span className="font-sans text-base font-bold align-super">R$ </span>
          {plano.preco}
        </p>
        {plano.notas.map((nota) => (
          <p key={nota} className="text-[10.5px] text-muted-foreground tabular-nums mt-0.5">
            {nota}
          </p>
        ))}
        {plano.selo && (
          <span
            className="inline-block mt-2.5 rounded-sm px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em]"
            style={{ background: "linear-gradient(100deg,#D4A656,#F0CE85)", color: "#33240A" }}
          >
            {plano.selo}
          </span>
        )}
      </div>

      <div className="px-5 pt-2.5 pb-3 flex-1">
        {plano.secoes.map((secao) => (
          <div key={secao.titulo}>
            <p className="text-[8.5px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground/70 pt-2.5 pb-1.5">
              {secao.titulo}
            </p>
            {secao.linhas.map((linha) => (
              <div
                key={linha.texto}
                className="grid grid-cols-[14px_1fr_auto] items-baseline gap-x-2 py-1.5 border-b border-border/50 last:border-0"
              >
                {linha.on ? (
                  <Check className="w-3.5 h-3.5 translate-y-0.5" strokeWidth={3.2} style={{ color: tinta }} aria-hidden="true" />
                ) : (
                  <X className="w-3.5 h-3.5 translate-y-0.5 text-muted-foreground/40" strokeWidth={3} aria-hidden="true" />
                )}
                <span className={`text-[11.5px] ${linha.on ? "text-foreground/75" : "text-muted-foreground/50"}`}>
                  {linha.texto}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.06em] whitespace-nowrap tabular-nums ${
                    linha.on ? "text-foreground" : "text-muted-foreground/50"
                  }`}
                >
                  {linha.valor}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        className="mx-3.5 mb-3.5 flex gap-3 rounded-md px-3 py-2.5"
        style={{ background: RODAPE[plano.tom], border: `1px solid ${BORDA[plano.tom]}` }}
      >
        {plano.callouts.map((callout) => (
          <div key={callout.label} className="flex-1 text-center">
            <p className="text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{callout.label}</p>
            <p className="font-shoulders text-[28px] font-extrabold leading-[1.05] tabular-nums" style={{ color: tinta }}>
              {callout.valor}
            </p>
            <p className="text-[9.5px] text-muted-foreground">{callout.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Escada = ({ titulo, passos }: { titulo: string; passos: { valor: string; quando: string }[] }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
    <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground w-20 shrink-0">
      {titulo}
    </span>
    {passos.map((passo, i) => {
      const ultimo = i === passos.length - 1;
      return (
        <div key={passo.quando} className="flex items-baseline gap-1.5">
          {i > 0 && (
            <span className="text-muted-foreground/40 mr-1.5" aria-hidden="true">
              ›
            </span>
          )}
          <b
            className="font-shoulders text-[26px] font-bold tabular-nums"
            style={{ color: ultimo ? "#8A6A2A" : "#0E3C41" }}
          >
            {passo.valor}
          </b>
          <i className={`not-italic text-[10px] ${ultimo ? "text-accent-foreground/70" : "text-muted-foreground"}`}>
            {passo.quando}
          </i>
        </div>
      );
    })}
  </div>
);

const Planos = () => {
  const [aba, setAba] = useState<string>("combo");
  const ativa = ABAS.find((a) => a.id === aba) ?? ABAS[2];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ─────────── faixa petróleo: a intensidade concentrada no topo ─────────── */}
      <section className="relative overflow-hidden pt-24 pb-28" style={{ background: "#0A2E33" }}>
        <svg
          viewBox="0 0 1280 300"
          preserveAspectRatio="none"
          className="absolute left-0 bottom-0 w-full h-[190px] opacity-45"
          aria-hidden="true"
        >
          <path d="M0 300 L300 110 L470 230 L760 30 L1000 180 L1280 55 L1280 300 Z" fill="#12494F" />
          <path d="M0 300 L220 190 L430 280 L720 140 L980 250 L1280 160 L1280 300 Z" fill="#1A5A5E" />
          <path d="M760 30 L800 78 L733 96 Z" fill="#D4A656" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img src={logoCareFit} alt="CareFit Run Base" className="w-14 h-14 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: "#A7BEBD" }}>
                  CareFit Run Base
                  <br />
                  Temporada 2026 · Ribeirão Preto
                </span>
              </div>
              <h1
                className="font-shoulders font-extrabold uppercase leading-[0.86] text-[64px] md:text-[86px] lg:text-[96px]"
                style={{ color: "#F4EDE4" }}
              >
                Construir
                <br />
                <span style={{ color: "#D4A656" }}>Reparar</span>{" "}
                <span style={{ color: "#E2825C" }}>Repetir</span>
              </h1>
            </div>
            <p className="max-w-[34ch] text-sm leading-relaxed lg:text-right lg:mb-3" style={{ color: "#A7BEBD" }}>
              Correr melhor não é escolher entre treinar forte e se recuperar —{" "}
              <span style={{ color: "#F4EDE4" }}>é fazer os dois no mesmo ciclo.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-lg"
              onClick={abrirWhatsApp}
            >
              Conversar sobre os planos
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={abrirWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* ─────────── abas montadas sobre a virada ─────────── */}
      <section className="relative -mt-10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            role="tablist"
            aria-label="Categorias de plano"
            className="flex flex-col sm:flex-row gap-1.5 bg-background rounded-xl p-1.5"
            style={{ boxShadow: "0 16px 42px -24px rgba(10,46,51,.7)" }}
          >
            {ABAS.map((item) => (
              <button
                key={item.id}
                id={`aba-${item.id}`}
                role="tab"
                type="button"
                aria-selected={aba === item.id}
                aria-controls={`painel-${item.id}`}
                onClick={() => setAba(item.id)}
                className={`flex-1 rounded-lg px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.16em] transition-colors ${
                  aba === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.rotulo}
              </button>
            ))}
          </div>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mt-4">
            {ativa.dica}
          </p>
        </div>
      </section>

      {/* ─────────── os planos ─────────── */}
      <section className="pt-7 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id={`painel-${ativa.id}`}
            role="tabpanel"
            aria-labelledby={`aba-${ativa.id}`}
            className={`grid gap-4 ${ativa.colunas}`}
          >
            {ativa.planos.map((plano) => (
              <CardPlano key={plano.nome} plano={plano} />
            ))}
          </div>

          {/* A avaliação de força só faz sentido ao lado dos planos de força */}
          {aba === "forca" && (
            <div className="mt-4 lg:max-w-4xl lg:mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-xl border border-border bg-background px-6 py-5">
              <div className="flex items-start gap-4">
                <Gauge className="w-7 h-7 text-secondary shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-secondary">
                    Antes de carregar, medir
                  </p>
                  <h3 className="font-shoulders text-3xl font-extrabold uppercase leading-none text-primary mt-1">
                    Avaliação de força
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
                    Define com qual carga você começa e o que retestar no fim do ciclo.
                  </p>
                </div>
              </div>
              <div className="flex gap-8 sm:text-right">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Sem plano</p>
                  <p className="font-shoulders text-3xl font-extrabold text-primary tabular-nums">R$ 250</p>
                </div>
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Com plano</p>
                  <p className="font-shoulders text-3xl font-extrabold tabular-nums" style={{ color: "#8A6A2A" }}>
                    R$ 200
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────── escada de preço ─────────── */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-background px-6 py-5 space-y-3">
            <Escada titulo="A aula" passos={escadaAula} />
            <div className="h-px bg-border" />
            <Escada titulo="A sessão" passos={escadaSessao} />
          </div>
        </div>
      </section>

      {/* ─────────── porta de entrada ─────────── */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl border-2 border-secondary bg-secondary/5 px-6 py-6">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-secondary">Nunca veio à base</p>
              <h2 className="font-shoulders text-[40px] font-extrabold uppercase leading-[0.9] text-secondary mt-1">
                Primeira sessão
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                Você passa pelo protocolo inteiro com a fisioterapeuta e sai com a leitura do seu corpo.{" "}
                <strong className="text-foreground font-semibold">A segunda sessão é por nossa conta.</strong>
              </p>
            </div>
            <div className="md:text-right shrink-0">
              <p className="font-shoulders text-[58px] font-extrabold leading-[0.88] text-secondary tabular-nums">
                <span className="font-sans text-[17px] font-bold align-super">R$ </span>230
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground tabular-nums">
                duas sessões · R$ 115 cada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── protocolo da sessão ─────────── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-shoulders text-4xl font-extrabold uppercase leading-none text-primary mb-2">
            O que entra em uma Sessão Jornada Recovery
          </h2>
          <p className="text-muted-foreground mb-6">
            Uma hora, oito recursos, conduzidos por fisioterapeuta que conhece o seu treino e a sua prova.
          </p>
          <div className="flex flex-wrap gap-2.5">
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

      {/* ─────────── reabilitação ─────────── */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-shoulders text-4xl font-extrabold uppercase leading-none text-primary mb-2">
            Reabilitação
          </h2>
          <p className="text-muted-foreground mb-6">Para quem chegou lesionado. Contratada à parte dos planos.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
            {reabilitacao.map((item) => (
              <div key={item.nome} className="rounded-xl border border-border bg-background px-6 py-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{item.nome}</p>
                <p className="font-shoulders text-[44px] font-extrabold leading-none text-primary mt-1.5 tabular-nums">
                  <span className="font-sans text-base font-bold align-super">R$ </span>
                  {item.preco}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── fechamento ─────────── */}
      <section className="py-20" style={{ background: "#0A2E33" }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-shoulders text-5xl md:text-6xl font-extrabold uppercase leading-[0.95] mb-6" style={{ color: "#F4EDE4" }}>
            Cuidar não é parar. <span style={{ color: "#D4A656" }}>É evoluir.</span>
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: "#A7BEBD" }}>
            Se você não sabe por onde começar, comece conversando. A gente olha sua semana de treino, sua próxima prova e o
            que o seu corpo está pedindo — e diz qual plano faz sentido.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-lg"
              onClick={abrirWhatsApp}
            >
              Falar com a CareFit
            </Button>
            <Button variant="whatsapp" size="lg" className="text-lg px-8 py-4" onClick={abrirWhatsApp}>
              <MessageCircle className="w-5 h-5" />
              (16) 99600-8849
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2" style={{ color: "#A7BEBD" }}>
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
