import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Compass } from "lucide-react";
import Footer from "@/components/Footer";

const atalhos = [
  { nome: "Nossos serviços", href: "/servicos" },
  { nome: "Lesões na corrida", href: "/lesoes-na-corrida" },
  { nome: "CareFit Cast", href: "/carefit-cast" },
  { nome: "Conteúdo para corredores", href: "/comunidade" },
  { nome: "Nosso espaço", href: "/espaco" },
  { nome: "Falar com a gente", href: "/contato" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Página não encontrada | CareFit Run Base";
    console.error("404: rota inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
        <div className="text-center max-w-2xl">
          <p className="text-7xl md:text-8xl font-montserrat font-bold text-primary/15 mb-2">404</p>
          <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-primary mb-4">
            Essa página saiu do percurso
          </h1>
          <p className="text-lg text-primary/70 font-poppins mb-8">
            O endereço que você tentou acessar não existe ou foi movido. Sem problema — a gente te
            leva de volta para o caminho certo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 font-montserrat font-semibold">
                <Home className="mr-2 h-5 w-5" />
                Voltar para a home
              </Button>
            </Link>
            <Link to="/servicos">
              <Button size="lg" variant="outline" className="px-8 font-montserrat font-semibold">
                <Compass className="mr-2 h-5 w-5" />
                Ver o que fazemos
              </Button>
            </Link>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-sm text-primary/60 font-poppins mb-4 uppercase tracking-wider font-semibold">
              Talvez você procurasse
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {atalhos.map((a) => (
                <Link
                  key={a.href}
                  to={a.href}
                  className="px-4 py-2 rounded-full bg-muted text-sm text-primary font-poppins hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {a.nome}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFound;
