import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import CareFitLogo from "./CareFitLogo";

const Footer = () => {
  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Para Corredores */}
          <div>
            <h3 className="font-montserrat font-bold text-sm uppercase tracking-wider mb-4 text-accent">
              Para Corredores
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/fisioterapia-para-corredores-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Fisioterapia para Corredores
                </Link>
              </li>
              <li>
                <Link to="/nutricao-para-corredores-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Nutrição para Corredores
                </Link>
              </li>
              <li>
                <Link to="/recovery-corredores-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Recovery
                </Link>
              </li>
              <li>
                <Link to="/avaliacao-do-corredor-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Avaliação do Corredor
                </Link>
              </li>
              <li>
                <Link to="/fortalecimento-para-corredores-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Fortalecimento para Corrida
                </Link>
              </li>
              <li>
                <Link to="/biomecanica-da-corrida-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Biomecânica da Corrida
                </Link>
              </li>
              <li>
                <Link to="/treinamento-para-maratona-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Treinamento para Maratona
                </Link>
              </li>
              <li>
                <Link to="/fisioterapia-para-triatletas-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Triatletas
                </Link>
              </li>
            </ul>
          </div>

          {/* Lesões */}
          <div>
            <h3 className="font-montserrat font-bold text-sm uppercase tracking-wider mb-4 text-accent">
              Lesões
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/canelite-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Canelite
                </Link>
              </li>
              <li>
                <Link to="/fascite-plantar-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Fascite Plantar
                </Link>
              </li>
              <li>
                <Link to="/dor-no-joelho-corrida-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Dor no Joelho
                </Link>
              </li>
              <li>
                <Link to="/tendinite-aquiles-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Tendinite do Aquiles
                </Link>
              </li>
              <li>
                <Link to="/banda-iliotibial-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Banda Iliotibial
                </Link>
              </li>
              <li>
                <Link to="/fratura-por-estresse-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Fratura por Estresse
                </Link>
              </li>
              <li>
                <Link to="/prevencao-de-lesoes-na-corrida-ribeirao-preto" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Prevenção de Lesões
                </Link>
              </li>
            </ul>
          </div>

          {/* CareFit */}
          <div>
            <h3 className="font-montserrat font-bold text-sm uppercase tracking-wider mb-4 text-accent">
              CareFit
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/nossa-historia" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Nossa História
                </Link>
              </li>
              <li>
                <Link to="/jornada" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Metodologia (Ciclo Completo)
                </Link>
              </li>
              <li>
                <Link to="/ice-mind-experience" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Ice Mind
                </Link>
              </li>
              <li>
                <Link to="/espaco" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Estrutura
                </Link>
              </li>
            </ul>
          </div>

          {/* Comunidade */}
          <div>
            <h3 className="font-montserrat font-bold text-sm uppercase tracking-wider mb-4 text-accent">
              Comunidade
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/comunidade-carefit" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Comunidade CareFit
                </Link>
              </li>
              <li>
                <Link to="/carefit-cast" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  CareFit Cast
                </Link>
              </li>
              <li>
                <Link to="/comunidade" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-montserrat font-bold text-sm uppercase tracking-wider mb-4 text-accent">
              Contato
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contato" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <button
                  onClick={handleWhatsApp}
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/carefitrunbase"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@CAREFITRUNBASE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CareFitLogo size={36} />
            <span className="text-sm font-medium">
              CAREFIT <span className="text-accent">Run Base</span>
            </span>
          </div>
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} CareFit Run Base. Todos os direitos reservados. Ribeirão Preto - SP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
