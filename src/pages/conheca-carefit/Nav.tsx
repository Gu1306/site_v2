import Icon from "./Icon";
import { useScrollProgress } from "./hooks";

interface Props {
  wappUrl: string;
}

export default function Nav({ wappUrl }: Props) {
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
          <a
            className="btn btn--secondary nav__cta"
            href={wappUrl}
            target="_blank"
            rel="noreferrer"
            style={{ padding: "10px 18px" }}
          >
            <Icon name="whatsapp" size={16} />
            Agendar
          </a>
        </div>
      </header>
    </>
  );
}
