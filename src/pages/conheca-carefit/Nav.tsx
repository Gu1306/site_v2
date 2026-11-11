import BookingCTA from "./BookingCTA";
import { useScrollProgress } from "./hooks";

export default function Nav() {
  const p = useScrollProgress();
  return (
    <>
      <div className="progress" style={{ transform: `scaleX(${p})` }}></div>
      <header className="nav">
        <div className="nav__inner">
          <a className="nav__brand" href="#top" style={{ textDecoration: "none" }}>
            <img src="/conheca-carefit/assets/carefit-logo-circle.png" alt="CareFit Run Base" />
            <div>
              <div className="nav__wordmark">
                CAREFIT <span>Run Base</span>
              </div>
              <div className="nav__tag">Centro de Transformação do Corredor.</div>
            </div>
          </a>
          <BookingCTA className="btn btn--accent nav__cta" onde="menu" curto />
        </div>
      </header>
    </>
  );
}
