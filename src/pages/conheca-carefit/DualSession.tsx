import { ReactNode } from "react";
import Icon from "./Icon";

interface Step {
  ic: string;
  text: ReactNode;
}

interface Session {
  n: string;
  badge: string;
  title: string;
  sub: string;
  steps: Step[];
  quote: string;
}

const SESSIONS: Session[] = [
  {
    n: "01",
    badge: "80 minutos",
    title: "Entender o atleta",
    sub: "A primeira abre a história.",
    steps: [
      { ic: "clock", text: "30 min para entender histórico, rotina, dores e objetivos." },
      { ic: "searchEye", text: "Leitura da anamnese atual: carga, fadiga, fatores de risco." },
      {
        ic: "syringe",
        text: "Protocolo escolhido de forma personalizada — gelo, ofurô, dry needling, liberação, postura, laser…",
      },
      {
        ic: "brain",
        text: (
          <>
            <strong>Explicação do porquê</strong> daquele protocolo faz sentido pro seu corpo.
          </>
        ),
      },
    ],
    quote: "Você entende o que foi avaliado e recebe orientação para o próximo passo.",
  },
  {
    n: "02",
    badge: "1h · incluída",
    title: "Retornar, ajustar e planejar",
    sub: "A segunda transforma em direção.",
    steps: [
      { ic: "calendarOK", text: "Retorno em até 15 dias após a primeira sessão." },
      { ic: "refresh", text: "Avaliação da resposta do seu corpo ao protocolo aplicado." },
      { ic: "route", text: "Ajuste fino do caminho proposto na primeira sessão." },
      {
        ic: "mountainPath",
        text: (
          <>
            <strong>Orientação dos próximos passos</strong> de recovery e tratamento — feito só pra você.
          </>
        ),
      },
    ],
    quote: "Você sai com um plano possível — e a decisão de continuar (ou não) na sua mão.",
  },
];

export default function DualSession() {
  return <section className="section dual" id="por-que-dupla">
    <div className="container">
      <span className="eyebrow-section">O que está incluído</span>
      <h2 className="section-title">Dois encontros. Um cuidado com <em>continuidade</em>.</h2>
      <p className="section-lede">No primeiro, entendemos sua história e iniciamos o cuidado. No retorno, avaliamos sua resposta e ajustamos os próximos passos.</p>
      <div className="dual__sessions">
        {SESSIONS.map((s) => <article className="dual__panel" key={s.n}>
          <div className="dual__panel-header">
            <div className="dual__panel-num">{s.n}</div>
            <div><div className="dual__panel-time">Sessão · {s.badge}</div><h3 className="dual__panel-title">{s.title}</h3></div>
          </div>
          <ol className="dual__steps">{s.steps.map((step, i) => <li className="dual__step" key={i}><span className="dual__step-marker" aria-hidden="true">{i + 1}</span><span>{step.text}</span></li>)}</ol>
          <p className="dual__panel-footer"><Icon name="check" size={14} /> {s.quote}</p>
        </article>)}
      </div>
      <p className="dual__included">R$ 230 pelos dois encontros. O retorno está incluído e acontece em até 15 dias.</p>
    </div>
  </section>;
}
