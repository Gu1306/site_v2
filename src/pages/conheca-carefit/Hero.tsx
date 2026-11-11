import Icon from "./Icon";
import BookingCTA from "./BookingCTA";
import { useCountUp } from "./hooks";

interface Props {
  wappUrl: string;
  onScrollToPricing: () => void;
}

const YT_VIDEO_ID = "TyaycftJmz8";

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
            Primeira Sessão Dupla · Ribeirão Preto
          </div>

          <h1 className="hero__h1">
            Entenda o que seu corpo precisa para <em>seguir correndo</em>.
          </h1>

          <p className="hero__lede">
            Dois encontros para avaliar sua história, realizar um cuidado personalizado
            e orientar os próximos passos da sua corrida.
          </p>

          <div className="hero__price-chip">
            <span className="hero__price-chip-label">Duas sessões incluídas</span>
            <span className="hero__price-chip-value">
              <span className="hero__price-chip-prefix">R$</span>230
            </span>
            <span className="hero__price-chip-sub">80 min + retorno de 1h em até 15 dias</span>
          </div>

          <div className="hero__ctas">
            <BookingCTA className="btn btn-xl btn--accent btn-block" onde="hero" />
            <button
              className="btn btn-xl btn--ghost-light btn-block"
              onClick={onScrollToPricing}
            >
              Ver o que está incluído
              <Icon name="arrowDown" size={16} />
            </button>
          </div>

          <a className="hero__help" href={wappUrl} target="_blank" rel="noopener noreferrer">Prefere conversar? Fale com a equipe no WhatsApp</a>

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
          <div className="hero__video-frame" aria-label="Vídeo sobre as ferramentas da CareFit">
            <iframe
              src={`https://www.youtube.com/embed/${YT_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`}
              title="Lívia apresenta as ferramentas da CareFit Run Base"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="eager"
            />
          </div>
          <div className="hero__video-caption">
            <span className="hero__video-live">
              <span className="live-dot"></span>
              Lívia · Fisioterapeuta
            </span>
            <span className="hero__video-tag">Conheça a CareFit · 1 min</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
