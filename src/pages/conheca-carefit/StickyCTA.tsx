import { useEffect, useState } from "react";
import Icon from "./Icon";

interface Props {
  wappUrl: string;
}

export default function StickyCTA({ wappUrl }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={`sticky-bar ${visible ? "is-visible" : ""}`}
        role="region"
        aria-label="Agendar Sessão Dupla"
      >
        <div>
          <div className="sticky-bar__price">R$230</div>
          <div className="sticky-bar__label">Primeira Sessão Dupla</div>
        </div>
        <a
          className="btn btn--accent sticky-bar__cta"
          href={wappUrl}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="whatsapp" size={14} />
          Agendar
        </a>
      </div>

      <a
        className="wapp-fab"
        href={wappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a CareFit pelo WhatsApp"
      >
        <Icon name="whatsapp" size={28} />
      </a>
    </>
  );
}
