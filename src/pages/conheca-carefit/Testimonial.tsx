import Icon from "./Icon";

import { TESTIMONIALS } from "@/lib/depoimentosCarefit";

export default function Testimonial() {
  return (
    <section className="section testimonials">
      <div className="container">
        <div style={{ maxWidth: 720, marginBottom: 32 }}>
          <span className="eyebrow-section">Quem já passou pela CareFit</span>
          <h2 className="section-title">
            O cuidado na voz de quem <em>corre com a gente</em>.
          </h2>
          <p className="section-lede">
            Corredores reais, contas reais. Toque no nome pra ir no Instagram
            de cada um.
          </p>
        </div>

        <div className="testimonials__rail">
          {TESTIMONIALS.map((t, i) => (
            <a
              key={i}
              className="t-card"
              href={`https://www.instagram.com/${t.ig}/`}
              target="_blank"
              rel="noreferrer"
              aria-label={`Abrir Instagram de ${t.name}`}
            >
              <div className="t-card__mark">&ldquo;</div>
              <blockquote className="t-card__quote">{t.quote}</blockquote>
              <div className="t-card__attr">
                <div className="t-card__avatar" aria-hidden="true">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="t-card__meta">
                  <div className="t-card__name">{t.name}</div>
                  <div className="t-card__ig">
                    <Icon name="arrowRight" size={12} stroke={2.4} />
                    @{t.ig}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
