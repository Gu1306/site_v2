import Icon from "./Icon";
import { useCountUp } from "./hooks";

interface Props {
  wappUrl: string;
  onScrollToPricing: () => void;
}

export default function Hero({ wappUrl, onScrollToPricing }: Props) {
  const [refRunners, runners] = useCountUp(300);
  const [refMar, mar] = useCountUp(110);
  const [refYears, years] = useCountUp(3);

  return (
    <section className="hero" id="top">
      <div
        className="hero__photo"
        style={{ backgroundImage: "url(/conheca-carefit/assets/hero-runners.jpg)" }}
      ></div>
      <div className="hero__bg"></div>
      <div className="hero__grain"></div>

      <div className="container hero__inner">
        <div>
          <div className="hero__eyebrow">CareFit Run Base · Ribeirão Preto</div>

          <h1 className="hero__h1">
            Você não compra <em>uma sessão</em>.<br />
            Você entra em <em>um método</em>.
          </h1>

          <p className="hero__lede">
            A primeira sessão a CareFit começa escutando a sua história. Depois,
            mostra como o nosso método funciona na prática e desenha a primeira
            jornada feita para você.
          </p>

          <div className="hero__ctas">
            <a
              className="btn btn-xl btn--gold-strong btn-block"
              href={wappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={18} />
              Quero conhecer a CareFit
            </a>
            <button
              className="btn btn-xl btn--ghost-light btn-block"
              onClick={onScrollToPricing}
            >
              Ver como funciona
              <Icon name="arrowDown" size={16} />
            </button>
          </div>

          <div className="hero__stats">
            <div className="hero__stat" ref={refRunners}>
              <div className="num">{runners}+</div>
              <div className="lbl">corredores transformados</div>
            </div>
            <div className="hero__stat" ref={refMar}>
              <div className="num">{mar}+</div>
              <div className="lbl">maratonistas</div>
            </div>
            <div className="hero__stat" ref={refYears}>
              <div className="num">{years} anos</div>
              <div className="lbl">de jornada</div>
            </div>
          </div>
        </div>

        <aside className="entry-card">
          <div className="entry-card__label">Porta de entrada</div>
          <h2 className="entry-card__title">
            Primeira Sessão{" "}
            <em
              style={{
                fontFamily: "var(--font-quote)",
                fontStyle: "italic",
                fontWeight: 500,
                color: "var(--cf-dourado)",
              }}
            >
              Dupla
            </em>
          </h2>
          <div className="entry-card__price">
            <span className="amount-prefix">R$</span>
            <span className="amount">230</span>
            <span className="label-small">à vista</span>
          </div>
          <div className="entry-card__meta">
            <div className="entry-card__meta-item">
              <span className="dot">
                <Icon name="clock" size={14} />
              </span>
              <div>
                <strong>1:30</strong>
                de avaliação
              </div>
            </div>
            <div className="entry-card__meta-item">
              <span className="dot">
                <Icon name="refresh" size={14} />
              </span>
              <div>
                <strong>1h de retorno</strong>
                em até 15 dias
              </div>
            </div>
            <div className="entry-card__meta-item">
              <span className="dot">
                <Icon name="clipboard" size={14} />
              </span>
              <div>
                <strong>Protocolo</strong>
                personalizado
              </div>
            </div>
            <div className="entry-card__meta-item">
              <span className="dot">
                <Icon name="route" size={14} />
              </span>
              <div>
                <strong>Plano</strong>
                de jornada
              </div>
            </div>
          </div>
          <a
            className="btn btn--accent btn-xl btn-block"
            href={wappUrl}
            target="_blank"
            rel="noreferrer"
            style={{ marginTop: 8 }}
          >
            Agendar agora pelo WhatsApp
            <Icon name="arrowRight" size={16} />
          </a>
        </aside>
      </div>
    </section>
  );
}
