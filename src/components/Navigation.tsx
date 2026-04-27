import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import CareFitLogo from "./CareFitLogo";

interface DropdownItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const isActive = (path: string) => location.pathname === path;
  const isDropdownActive = (items: DropdownItem[]) =>
    items.some((item) => location.pathname === item.href);

  const navigation: NavItem[] = [
    { name: "Início", href: "/" },
    {
      name: "Para Corredores",
      dropdown: [
        { name: "Fisioterapia para Corredores", href: "/fisioterapia-para-corredores-ribeirao-preto" },
        { name: "Avaliação do Corredor", href: "/avaliacao-do-corredor-ribeirao-preto" },
        { name: "Fortalecimento para Corredores", href: "/fortalecimento-para-corredores-ribeirao-preto" },
        { name: "Recovery para Corredores", href: "/recovery-corredores-ribeirao-preto" },
        { name: "Nutrição para Corredores", href: "/nutricao-para-corredores-ribeirao-preto" },
        { name: "Biomecânica da Corrida", href: "/biomecanica-da-corrida-ribeirao-preto" },
        { name: "Treinamento para Maratona", href: "/treinamento-para-maratona-ribeirao-preto" },
      ],
    },
    {
      name: "Lesões",
      dropdown: [
        { name: "Lesões na Corrida", href: "/lesoes-na-corrida" },
        { name: "Canelite", href: "/canelite-ribeirao-preto" },
        { name: "Fascite Plantar", href: "/fascite-plantar-ribeirao-preto" },
        { name: "Tendinite do Aquiles", href: "/tendinite-aquiles-ribeirao-preto" },
        { name: "Dor no Joelho", href: "/dor-no-joelho-corrida-ribeirao-preto" },
        { name: "Banda Iliotibial", href: "/banda-iliotibial-ribeirao-preto" },
        { name: "Fratura por Estresse", href: "/fratura-por-estresse-ribeirao-preto" },
        { name: "Prevenção de Lesões", href: "/prevencao-de-lesoes-na-corrida-ribeirao-preto" },
      ],
    },
    { name: "CareFit Cast", href: "/carefit-cast" },
    { name: "Blog", href: "/comunidade" },
    {
      name: "A CareFit",
      dropdown: [
        { name: "Nossa História", href: "/nossa-historia" },
        { name: "Comunidade CareFit", href: "/comunidade-carefit" },
        { name: "Ciclo Completo", href: "/jornada" },
        { name: "Ice Mind", href: "/ice-mind-experience" },
        { name: "Nosso Espaço", href: "/espaco" },
        { name: "Performance CareFit", href: "/performance-ribeirao-preto" },
      ],
    },
    { name: "Contato", href: "/contato" },
  ];

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
    setOpenMobileDropdown(null);
  }, [location.pathname]);

  return (
    <>
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[4px]">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <CareFitLogo size={58} />
              <div className="text-xl font-bold text-primary px-[11px]">
                <span>CAREFIT</span>{" "}
                <span className="text-accent">Run Base</span>
                <div className="text-xs text-muted-foreground font-normal mx-0">
                  Centro de Transformação do Corredor.
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`text-sm font-medium transition-colors hover:text-accent flex items-center gap-1 ${
                        isDropdownActive(item.dropdown)
                          ? "text-accent"
                          : "text-foreground"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            className={`block px-4 py-2.5 text-sm transition-colors hover:bg-muted hover:text-accent ${
                              isActive(sub.href)
                                ? "text-accent bg-muted"
                                : "text-foreground"
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href!}
                    className={`text-sm font-medium transition-colors hover:text-accent ${
                      isActive(item.href!) ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border max-h-[80vh] overflow-y-auto">
              {navigation.map((item) =>
                item.dropdown ? (
                  <div key={item.name}>
                    <button
                      className={`w-full flex items-center justify-between px-3 py-2 text-base font-medium transition-colors hover:text-accent ${
                        isDropdownActive(item.dropdown)
                          ? "text-accent"
                          : "text-foreground"
                      }`}
                      onClick={() =>
                        setOpenMobileDropdown(
                          openMobileDropdown === item.name ? null : item.name
                        )
                      }
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openMobileDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openMobileDropdown === item.name && (
                      <div className="pl-4 space-y-1">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            className={`block px-3 py-2 text-sm transition-colors hover:text-accent ${
                              isActive(sub.href)
                                ? "text-accent"
                                : "text-foreground/80"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href!}
                    className={`block px-3 py-2 text-base font-medium transition-colors hover:text-accent ${
                      isActive(item.href!) ? "text-accent" : "text-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="whatsapp"
          size="icon"
          className="w-14 h-14 rounded-full shadow-2xl"
          onClick={() => {
            window.open(
              "https://api.whatsapp.com/send?phone=5516996008849",
              "_blank"
            );
          }}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </>
  );
};

export default Navigation;
