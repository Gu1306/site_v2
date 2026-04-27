import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const pageTitles: Record<string, string> = {
  "/recovery-corredores-ribeirao-preto": "Recovery para Corredores em Ribeirão Preto",
  "/avaliacao-do-corredor-ribeirao-preto": "Avaliação do Corredor em Ribeirão Preto",
  "/fortalecimento-para-corredores-ribeirao-preto": "Fortalecimento para Corredores em Ribeirão Preto",
  "/fisioterapia-para-triatletas-ribeirao-preto": "Fisioterapia para Triatletas em Ribeirão Preto",
  "/lesoes-na-corrida": "Lesões na Corrida",
  "/canelite-ribeirao-preto": "Canelite em Ribeirão Preto",
  "/fascite-plantar-ribeirao-preto": "Fascite Plantar em Ribeirão Preto",
  "/dor-no-joelho-corrida-ribeirao-preto": "Dor no Joelho na Corrida em Ribeirão Preto",
  "/tendinite-aquiles-ribeirao-preto": "Tendinite do Aquiles em Ribeirão Preto",
  "/banda-iliotibial-ribeirao-preto": "Síndrome da Banda Iliotibial em Ribeirão Preto",
  "/fratura-por-estresse-ribeirao-preto": "Fratura por Estresse em Ribeirão Preto",
};

const PlaceholderPage = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Página em Construção";

  const handleWhatsApp = () => {
    window.open("https://api.whatsapp.com/send?phone=5516996008849", "_blank");
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-primary mb-6">
            {title}
          </h1>
          <p className="text-lg text-primary/70 font-poppins max-w-2xl mx-auto mb-8">
            Conteúdo especializado em breve. Enquanto isso, fale com nossos especialistas para saber mais sobre {title.toLowerCase()}.
          </p>
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-montserrat font-semibold"
            onClick={handleWhatsApp}
          >
            Fale com um Especialista
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PlaceholderPage;
