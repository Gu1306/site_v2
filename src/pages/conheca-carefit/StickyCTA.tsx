import { useEffect, useState } from "react";
import BookingCTA from "./BookingCTA";

export default function StickyCTA() {
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
        <BookingCTA className="btn btn--accent sticky-bar__cta" onde="barra" curto />
      </div>


    </>
  );
}
