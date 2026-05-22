const FOOTER_COLS = [
  {
    title: "Para Corredores",
    items: [
      "Fisioterapia para Corredores",
      "Reabilitação para Corredores",
      "Recovery",
      "Avaliação do Corredor",
      "Fortalecimento",
      "Nutrição",
    ],
  },
  {
    title: "Lesões",
    items: [
      "Canelite",
      "Fascite Plantar",
      "Dor no Joelho",
      "Tendinite de Aquiles",
      "Banda Iliotibial",
      "Fraturas por Estresse",
      "Prevenção de Lesões",
    ],
  },
  {
    title: "A CareFit",
    items: [
      "Nossa História",
      "Metodologia (Ciclo Completo)",
      "Manifesto",
      "Time",
      "Estrutura",
    ],
  },
  {
    title: "Comunidade",
    items: ["Comunidade CareFit", "CareFit Cast", "Blog"],
  },
];

interface Props {
  wappUrl: string;
}

export default function Footer({ wappUrl }: Props) {
  return (
    <footer className="footer" id="contato">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <img
                src="/conheca-carefit/assets/carefit-logo-circle.png"
                alt=""
                style={{ width: 44, height: 44, borderRadius: "50%" }}
              />
              <div className="footer__brand-wm">
                CAREFIT <span>Run Base</span>
              </div>
            </div>
            <p>
              O HUB do Corredor. Recovery, fisioterapia, fortalecimento e
              nutrição integrados em Ribeirão Preto.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              {[
                { label: "WhatsApp", href: wappUrl },
                { label: "Instagram", href: "https://www.instagram.com/carefitrunbase/" },
                { label: "YouTube", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "6px 12px",
                    border: "1px solid color-mix(in srgb, var(--cf-off-white) 25%, transparent)",
                    borderRadius: 9999,
                    fontSize: 11,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "color-mix(in srgb, var(--cf-off-white) 85%, transparent)",
                    textDecoration: "none",
                    transition: "all 200ms",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "var(--cf-laranja)";
                    e.currentTarget.style.borderColor = "var(--cf-laranja)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor =
                      "color-mix(in srgb, var(--cf-off-white) 25%, transparent)";
                    e.currentTarget.style.color =
                      "color-mix(in srgb, var(--cf-off-white) 85%, transparent)";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="footer__col-head">{col.title}</div>
              <ul className="footer__list">
                {col.items.map((i) => (
                  <li key={i}>
                    <a href="#">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>© 2026 CareFit Run Base. Todos os direitos reservados.</span>
          <span>Ribeirão Preto · SP · (16) 99600-8849</span>
        </div>
      </div>
    </footer>
  );
}
