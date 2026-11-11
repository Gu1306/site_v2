import { useEffect, useRef } from "react";
import { useSeo } from "@/hooks/useSeo";
import { whatsappOferta } from "@/lib/ofertasCarefit";
import { track } from "@/lib/tracking";
import Practical from "./conheca-carefit/Practical";
import Nav from "./conheca-carefit/Nav";
import Hero from "./conheca-carefit/Hero";
import Method from "./conheca-carefit/Method";
import DualSession from "./conheca-carefit/DualSession";
import Audience from "./conheca-carefit/Audience";
import Testimonial from "./conheca-carefit/Testimonial";
import Pricing from "./conheca-carefit/Pricing";
import Footer from "./conheca-carefit/Footer";
import StickyCTA from "./conheca-carefit/StickyCTA";

const CSS_FILES = [
  "/conheca-carefit/colors_and_type.css",
  "/conheca-carefit/styles.css",
];

const ConhecaCareFit = () => {
  const WAPP_URL = whatsappOferta("dupla");
  const pricingRef = useRef<HTMLElement>(null);
  useSeo({ titulo: "Primeira Sessão Dupla — CareFit Run Base | Ribeirão Preto", descricao: "Dois encontros por R$ 230: avaliação e cuidado personalizado em 80 minutos, com retorno de 1h incluído em até 15 dias. Agende na CareFit.", caminho: "/conheca-a-carefit" });

  useEffect(() => {
    document.body.classList.add("conheca-carefit-page");
    const links: HTMLLinkElement[] = CSS_FILES.map((href) => {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = href;
      l.setAttribute("data-conheca-css", "true");
      document.head.appendChild(l);
      return l;
    });

    return () => {
      document.body.classList.remove("conheca-carefit-page");
      links.forEach((l) => l.remove());
    };
  }, []);

  const scrollToPricing = () => {
    const el = pricingRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div onClickCapture={(event) => {
      const link = (event.target as HTMLElement).closest("a");
      if (link?.href.startsWith("https://api.whatsapp.com/")) track("whatsapp_click", { servico: "dupla", onde: "landing" });
    }}>
      <Nav />
      <main>
        <Hero wappUrl={WAPP_URL} onScrollToPricing={scrollToPricing} />
        <DualSession />
        <Audience />
        <Method />
        <Testimonial />
        <Pricing wappUrl={WAPP_URL} innerRef={pricingRef} />
        <Practical />
      </main>
      <Footer wappUrl={WAPP_URL} />
      <div className="spacer-bottom"></div>
      <StickyCTA />
    </div>
  );
};

export default ConhecaCareFit;
