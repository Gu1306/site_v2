import { RefObject } from "react";
import Icon from "./Icon";
import BookingCTA from "./BookingCTA";

const INCLUDES = [
  {
    title: "Sessão 1 de 80 minutos ",
    desc: "com avaliação + protocolo personalizado.",
  },
  {
    title: "Sessão 2 de 1h em até 15 dias ",
    desc: "incluída no investimento. Você não paga de novo.",
  },
  {
    title: "Orientação dos próximos passos ",
    desc: "se fizer sentido pro seu caso. Sem amarração.",
  },
];

interface Props {
  wappUrl: string;
  innerRef: RefObject<HTMLElement>;
}

export default function Pricing({ wappUrl, innerRef }: Props) {
  return (
    <section className="section" id="pricing" ref={innerRef}>
      <div className="container">
        <div className="pricing-card">
          <div>
            <span className="pricing-card__eyebrow">Porta de entrada</span>
            <h2 className="pricing-card__title">
              Primeira Sessão <em>Dupla</em> CareFit
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 15,
                lineHeight: 1.65,
                color: "color-mix(in srgb, var(--cf-off-white) 78%, transparent)",
                marginTop: 4,
                maxWidth: 460,
              }}
            >
              Tempo para entender sua história, cuidar de você e acompanhar a resposta
              do seu corpo no retorno. Os dois encontros estão incluídos no valor.
            </p>

            <ul className="pricing-card__includes">
              {INCLUDES.map((it) => (
                <li key={it.title}>
                  <span className="pricing-card__check">
                    <Icon name="check" size={13} stroke={2.6} />
                  </span>
                  <span>
                    <strong>{it.title}</strong>
                    {it.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pricing-card__right">
            <div className="pricing-card__price-label">Investimento</div>
            <div className="pricing-card__price">
              <span className="pricing-card__price-prefix">R$</span>230
            </div>
            <div className="pricing-card__price-sub">
              Pagamento à vista. Duas sessões incluídas.
              <br />
              Sem assinatura, sem amarração.
            </div>

            <div className="pricing-card__quote">
              Cuidar não é parar.
              <br />É evoluir com critério.
            </div>

            <BookingCTA className="btn btn--accent btn-xl btn-block" onde="preco" />
            <a className="hero__help" href={wappUrl} target="_blank" rel="noopener noreferrer">Tirar dúvidas pelo WhatsApp</a>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 16,
                fontFamily: "var(--font-body)",
                fontSize: 12.5,
                color: "color-mix(in srgb, var(--cf-off-white) 70%, transparent)",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <span>✓ Retorno incluído</span>
              <span>✓ Avaliação presencial</span>
              <span>✓ Ribeirão Preto · SP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
