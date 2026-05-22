import { useState } from "react";
import Icon from "./Icon";

const PROFILES = [
  {
    icon: "loop",
    title: "Corredor que quer entender por que o corpo trava no ciclo",
    desc: "Toda temporada a mesma dor volta? Vamos achar o padrão.",
  },
  {
    icon: "flag",
    title: "Atleta de endurance preparando uma prova importante",
    desc: "Maratona, ultra ou trail — performance com estrutura sólida.",
  },
  {
    icon: "bandage",
    title: "Quem tentou recovery por conta e não vê resultado",
    desc: "Banho de gelo, foam roller, alongamento. Sem método, vira ritual vazio.",
  },
  {
    icon: "target",
    title: "Quem já procurou fisioterapia e quer algo mais estratégico",
    desc: "Você não quer dez sessões iguais. Quer um caminho.",
  },
];

export default function Audience() {
  const [selected, setSelected] = useState<number[]>([0]);

  const toggle = (i: number) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const count = selected.length;

  return (
    <section className="section" id="pra-quem-e">
      <div className="container">
        <div style={{ maxWidth: 720 }}>
          <span className="eyebrow-section">Pra quem é</span>
          <h2 className="section-title">
            Pra quem é a <em>Sessão Dupla</em>.
          </h2>
          <p className="section-lede">
            Marque o que combina com você. Quanto mais marcadores, mais a Sessão
            Dupla foi feita pro seu momento.
          </p>
        </div>

        <div className="audience__grid">
          {PROFILES.map((p, i) => (
            <button
              key={i}
              className={`aud-card ${selected.includes(i) ? "is-selected" : ""}`}
              onClick={() => toggle(i)}
              type="button"
            >
              <span className="aud-check">
                <Icon name="check" size={12} stroke={2.6} />
              </span>
              <span className="aud-card__icon">
                <Icon name={p.icon} size={22} />
              </span>
              <h3 className="aud-card__title">{p.title}</h3>
              <p className="aud-card__desc">{p.desc}</p>
            </button>
          ))}
        </div>

        <div className="audience__match">
          {count === 0 && (
            <>Marque pelo menos um para ver se a Sessão Dupla combina com você.</>
          )}
          {count === 1 && (
            <>
              <span className="audience__match-num">1 motivo</span> · já é razão
              de sobra para conversar com a gente.
            </>
          )}
          {count === 2 && (
            <>
              <span className="audience__match-num">2 motivos</span> · a Sessão
              Dupla foi desenhada pro seu cenário.
            </>
          )}
          {count === 3 && (
            <>
              <span className="audience__match-num">3 motivos</span> · você
              precisa de método, não de mais uma sessão avulsa.
            </>
          )}
          {count === 4 && (
            <>
              <span className="audience__match-num">Match total</span> · essa
              jornada foi escrita pra alguém exatamente como você.
            </>
          )}
        </div>
      </div>
    </section>
  );
}
