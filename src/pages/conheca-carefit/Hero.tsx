import Icon from "./Icon";
import { useCountUp } from "./hooks";

interface Props {
  wappUrl: string;
  onScrollToPricing: () => void;
}

const YT_VIDEO_ID = "BlOgSub8ylM";

export default function Hero({ wappUrl, onScrollToPricing }: Props) {
  const [refRunners, runners] = useCountUp(300);
  const [refMar, mar] = useCountUp(110);
  const [refYears, years] = useCountUp(3);

  return (
    <section className="hero hero--video" id="top">
      <div className="hero__bg"></div>
      <div className="hero__grain"></div>

      <div className="container hero__inner hero__inner--video">
        <div className="hero__copy">
          <div className="hero__eyebrow">
            Mensagem do fundador · 60 segundos
          </div>

          <h1 className="hero__h1">
            Você não compra <em>uma sessão</em>.<br />
            Você entra em <em>um método</em>.
          </h1>

          <p className="hero__lede">
            Antes de marcar, assista 60 segundos do convite do Gustavo.
            Se fizer sentido, clica no WhatsApp e a gente conversa.
          </p>

          <div className="hero__price-chip">
            <span className="hero__price-chip-label">Porta de entrada</span>
            <span className="hero__price-chip-value">
              <span className="hero__price-chip-prefix">R$</span>230
            </span>
            <span className="hero__price-chip-sub">1:30 + 1h · duas sessões</span>
          </div>

          <div className="hero__ctas">
            <a
              className="btn btn-xl btn--accent btn-block"
              href={wappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={20} />
              Quero agendar pelo WhatsApp
            </a>
            <button
              className="btn btn-xl btn--ghost-light btn-block"
              onClick={onScrollToPricing}
            >
              Ver o que está incluído
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

        <aside className="hero__video-side">
          <div className="hero__video-frame" aria-label="Vídeo do convite">
            <iframe
              src={`https://www.youtube.com/embed/${YT_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`}
              title="Convite do Gustavo · CareFit Run Base"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="eager"
            />
          </div>
          <div className="hero__video-caption">
            <span className="hero__video-live">
              <span className="live-dot"></span>
              Gustavo · Fundador
            </span>
            <span className="hero__video-tag">▶ Aperta play</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
