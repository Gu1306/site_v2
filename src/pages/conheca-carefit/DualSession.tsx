import { ReactNode, useState } from "react";
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
    badge: "1:30",
    title: "Entender o atleta",
    sub: "A primeira abre a história.",
    steps: [
      { ic: "clock", text: "30 min para entender histórico, rotina, dores e objetivos." },
      { ic: "searchEye", text: "Leitura da anamnese atual: carga, fadiga, fatores de risco." },
      {
        ic: "syringe",
        text: "Protocolo escolhido de forma personalizada — gelo, ofuro, dry needling, liberação, postura, laser…",
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
    quote: "Você sai sabendo o que tem, por que tem, e o primeiro passo.",
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
            <strong>Desenho da próxima jornada</strong> de recovery e tratamento — feito só pra você.
          </>
        ),
      },
    ],
    quote: "Você sai com um plano possível — e a decisão de continuar (ou não) na sua mão.",
  },
];

export default function DualSession() {
  const [active, setActive] = useState(0);
  const s = SESSIONS[active];

  return (
    <section className="section dual" id="por-que-dupla">
      <div className="container">
        <div style={{ maxWidth: 720 }}>
          <span className="eyebrow-section">A lógica do método</span>
          <h2 className="section-title">
            Por que a primeira sessão é <em>dupla</em>.
          </h2>
          <p className="section-lede">
            A CareFit não cabe em uma sessão só. A primeira abre a história. A
            segunda transforma em direção.
          </p>
        </div>

        <div className="dual__inner">
          <div className="dual__tabs" role="tablist">
            {SESSIONS.map((sess, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                className={`dual__tab ${i === active ? "is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                <div className="dual__tab-meta">
                  Sessão {sess.n}
                  <span className="badge">{sess.badge}</span>
                </div>
                <h3 className="dual__tab-title">{sess.title}</h3>
                <div className="dual__tab-sub">{sess.sub}</div>
              </button>
            ))}

            <div
              style={{
                marginTop: 8,
                padding: "14px 16px",
                background: "color-mix(in srgb, var(--cf-laranja) 8%, transparent)",
                border: "1px solid color-mix(in srgb, var(--cf-laranja) 25%, transparent)",
                borderRadius: "var(--r-md)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                lineHeight: 1.45,
                color: "var(--cf-verde-floresta)",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "var(--cf-laranja)",
                  color: "var(--cf-off-white)",
                  display: "grid",
                  placeItems: "center",
                  marginTop: 1,
                }}
              >
                <Icon name="check" size={11} stroke={2.4} />
              </span>
              <span>
                <strong>As duas sessões já vêm juntas.</strong> Você só agenda uma vez.
              </span>
            </div>
          </div>

          <div className="dual__panel" key={active}>
            <div className="dual__panel-header">
              <div className="dual__panel-num">{s.n}</div>
              <div>
                <div className="dual__panel-time">Sessão · {s.badge}</div>
                <div className="dual__panel-title">{s.title}</div>
              </div>
            </div>

            <ol className="dual__steps">
              {s.steps.map((step, i) => (
                <li className="dual__step" key={i}>
                  <span className="dual__step-marker">{i + 1}</span>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>

            <div className="dual__panel-footer">
              <Icon
                name="check"
                size={14}
                stroke={2.4}
                style={{
                  color: "var(--cf-laranja)",
                  marginRight: 6,
                  verticalAlign: "middle",
                }}
              />
              {s.quote}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
