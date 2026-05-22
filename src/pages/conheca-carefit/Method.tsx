import Icon from "./Icon";
import { useReveal } from "./hooks";

const METHOD_ITEMS = [
  {
    icon: "microscope",
    title: "Avaliação profunda do corredor",
    desc: "Histórico, biomecânica e contexto de treino — não só a dor que apareceu hoje.",
  },
  {
    icon: "activity",
    title: "Fisioterapia como agente de performance",
    desc: "Não esperamos a lesão. Tratamos para você correr mais, melhor e por mais tempo.",
  },
  {
    icon: "snowflake",
    title: "Recovery como inteligência de carga",
    desc: "Imersão, ofuro, liberação — protocolos escolhidos pelo que seu corpo pede agora.",
  },
  {
    icon: "clipboard",
    title: "Leitura de treino, sintomas e rotina",
    desc: "Cruzamos volume, intensidade e sinais do corpo para ajustar o caminho.",
  },
  {
    icon: "dumbbell",
    title: "Biomecânica, fortalecimento e controle motor",
    desc: "Força específica para corredor — estrutura que sustenta os quilômetros.",
  },
  {
    icon: "mountainPath",
    title: "Jornadas estruturadas para continuidade",
    desc: "Cuidar não é parar. É um plano que evolui com você, semana a semana.",
  },
];

export default function Method() {
  const ref = useReveal<HTMLElement>({ childSelector: ".method-row", stagger: 80 });
  return (
    <section className="section" ref={ref}>
      <div className="container">
        <div className="reveal is-in">
          <span className="eyebrow-section">O método</span>
          <h2 className="section-title">
            A CareFit é um <em>centro de transformação</em> do corredor.
          </h2>
          <p className="section-lede">
            A gente não olha só pra dor. Nem só pro treino. Nem só pro recovery.
            A gente olha pro atleta como sistema.
          </p>
        </div>

        <div className="method-list">
          {METHOD_ITEMS.map((it) => (
            <div className="method-row" key={it.title}>
              <div className="method-row__icon">
                <Icon name={it.icon} size={22} />
              </div>
              <div>
                <h3 className="method-row__title">{it.title}</h3>
                <p className="method-row__desc">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
