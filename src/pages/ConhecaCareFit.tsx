import { useEffect, useRef } from "react";
import Nav from "./conheca-carefit/Nav";
import Hero from "./conheca-carefit/Hero";
import VideoCTA from "./conheca-carefit/VideoCTA";
import Method from "./conheca-carefit/Method";
import DualSession from "./conheca-carefit/DualSession";
import Feelings from "./conheca-carefit/Feelings";
import Audience from "./conheca-carefit/Audience";
import Testimonial from "./conheca-carefit/Testimonial";
import Pricing from "./conheca-carefit/Pricing";
import Footer from "./conheca-carefit/Footer";
import StickyCTA from "./conheca-carefit/StickyCTA";

const WAPP_URL =
  "https://api.whatsapp.com/send?phone=5516996008849&text=" +
  encodeURIComponent(
    "Olá! Quero saber mais sobre a Primeira Sessão Dupla CareFit (R$230)."
  );

const CSS_FILES = [
  "/conheca-carefit/colors_and_type.css",
  "/conheca-carefit/styles.css",
];

const ConhecaCareFit = () => {
  const pricingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title =
      "Primeira Sessão Dupla — CareFit Run Base | Ribeirão Preto";
    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    meta.setAttribute(
      "content",
      "Você não compra uma sessão. Você entra em um método. Primeira Sessão Dupla CareFit — avaliação 1:30 + retorno 1h em até 15 dias. R$230."
    );

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
    <>
      <Nav wappUrl={WAPP_URL} />
      <main>
        <Hero wappUrl={WAPP_URL} onScrollToPricing={scrollToPricing} />
        <VideoCTA wappUrl={WAPP_URL} />
        <Method />
        <DualSession />
        <Feelings />
        <Audience />
        <Testimonial />
        <Pricing wappUrl={WAPP_URL} innerRef={pricingRef} />
      </main>
      <Footer wappUrl={WAPP_URL} />
      <div className="spacer-bottom"></div>
      <StickyCTA wappUrl={WAPP_URL} />
    </>
  );
};

export default ConhecaCareFit;
