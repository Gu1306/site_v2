import { Link } from "react-router-dom";
import { MAPS } from "../Links";

export default function Footer({ wappUrl }: { wappUrl: string }) {
  return <footer className="footer" id="contato">
    <div className="container">
      <div className="footer__top footer__top--compact">
        <div className="footer__brand">
          <div className="footer__brand-wm">CAREFIT <span>Run Base</span></div>
          <p>Fisioterapia, recuperação e fortalecimento para quem corre. Ribeirão Preto/SP.</p>
          <p><a href={wappUrl} target="_blank" rel="noopener noreferrer">Fale com a equipe no WhatsApp</a></p>
        </div>
        <div><div className="footer__col-head">Seu atendimento</div><ul className="footer__list">
          <li><a href="#por-que-dupla">Os dois encontros</a></li>
          <li><a href="#antes-de-vir">Dúvidas e orientações</a></li>
          <li><a href={MAPS} target="_blank" rel="noopener noreferrer">Como chegar</a></li>
          <li><Link to="/lp/fisioterapia-ribeirao-preto">Avaliação de reabilitação</Link></li>
        </ul></div>
        <div><div className="footer__col-head">Conheça a CareFit</div><ul className="footer__list">
          <li><Link to="/espaco">Nosso espaço</Link></li>
          <li><a href="https://www.instagram.com/carefitrunbase/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://www.youtube.com/@CAREFITRUNBASE" target="_blank" rel="noopener noreferrer">YouTube</a></li>
          <li><Link to="/privacidade">Privacidade</Link></li>
        </ul></div>
      </div>
      <div className="footer__bottom"><span>© {new Date().getFullYear()} CareFit Run Base.</span><span>Av. Áurea A. B. Machado, 241 · (16) 99600-8849</span></div>
    </div>
  </footer>;
}
