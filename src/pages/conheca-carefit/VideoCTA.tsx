import { useState, useEffect } from "react";
import Icon from "./Icon";

interface Props {
  wappUrl: string;
}

export default function VideoCTA({ wappUrl }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const VIDEO_SRC = "/conheca-carefit/assets/video-gatilho.mp4";
  const POSTER_SRC = "/conheca-carefit/assets/video-poster.jpg";

  return (
    <section className="section video-cta" id="video">
      <div className="container">
        <div className="video-cta__grid">
          <div className="video-cta__copy">
            <span className="eyebrow-section">Mensagem do fundador · 45s</span>
            <h2 className="section-title">
              Quem fala com você é o <em>Gustavo</em>.
            </h2>
            <p className="section-lede">
              Fundador da CareFit. Corredor antes de tudo. Em menos de um minuto
              ele conta por que criou a CareFit e o que muda quando você entra
              no método.
            </p>
            <ul className="video-cta__list">
              <li>
                <span className="dot"></span>Por que não é &ldquo;mais uma sessão&rdquo;
              </li>
              <li>
                <span className="dot"></span>Dashboard, Strava e mapeamento de risco
              </li>
              <li>
                <span className="dot"></span>Banheira de gelo, ofurô, liberação, compressão
              </li>
            </ul>

            <div className="video-cta__author">
              <div className="video-cta__author-avatar">G</div>
              <div>
                <div className="video-cta__author-name">Gustavo Rosa</div>
                <div className="video-cta__author-role">Fundador · CareFit Run Base</div>
              </div>
            </div>

            <a
              className="btn btn--accent btn-xl"
              href={wappUrl}
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: 16 }}
            >
              <Icon name="whatsapp" size={18} />
              Falar com a CareFit
            </a>
          </div>

          <button
            className="video-frame"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Assistir vídeo"
          >
            <div
              className="video-frame__poster"
              style={{
                backgroundImage: `url(${POSTER_SRC}), url(/conheca-carefit/assets/recovery-atletas.jpg)`,
              }}
            ></div>
            <div className="video-frame__overlay"></div>

            <div className="video-frame__top">
              <span className="video-frame__live">
                <span className="live-dot"></span>
                Gustavo · Fundador
              </span>
            </div>

            <div className="video-frame__play">
              <span className="play-pulse"></span>
              <span className="play-pulse play-pulse--2"></span>
              <span className="play-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>

            <div className="video-frame__caption">
              <div className="video-frame__cap-title">&ldquo;Aqui não é sessão. É método.&rdquo;</div>
              <div className="video-frame__cap-meta">
                <span>▶ Assistir mensagem</span>
                <span>·</span>
                <span>45s</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="video-modal"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <button
            className="video-modal__close"
            onClick={() => setOpen(false)}
            aria-label="Fechar"
          >
            ✕
          </button>
          <div className="video-modal__stage">
            <video
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              controls
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                background: "#000",
              }}
              onError={(e) => {
                const target = e.currentTarget as HTMLVideoElement;
                target.style.display = "none";
                const fb = target.nextSibling as HTMLElement | null;
                if (fb) fb.style.display = "flex";
              }}
            />
            <div className="video-modal__fallback" style={{ display: "none" }}>
              <div>
                <Icon name="searchEye" size={32} />
                <h3>Vídeo em produção</h3>
                <p>
                  Esse é o espaço pro vídeo vertical de 60s. Salve seu arquivo em
                  <br />
                  <code>assets/video-gatilho.mp4</code>
                  <br />
                  (e o poster em <code>assets/video-poster.jpg</code>).
                </p>
                <a
                  className="btn btn--accent btn-xl"
                  href={wappUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginTop: 18 }}
                >
                  <Icon name="whatsapp" size={16} />
                  Falar com a CareFit
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
