import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  EVENTO_ABRIR_COOKIES,
  escolhaCookies,
  registrarEscolha,
  tagAtiva,
  type EscolhaCookies,
} from "@/lib/tracking";

/**
 * Aviso de cookies (LGPD). Só aparece se a tag do Google estiver ligada e a
 * pessoa ainda não tiver escolhido. "Aceitar" e "Recusar" têm o mesmo peso:
 * recusar não pode ser mais difícil que aceitar.
 */
const CookieBanner = () => {
  const { pathname } = useLocation();
  const [aberto, setAberto] = useState(() => tagAtiva() && escolhaCookies() === null);

  useEffect(() => {
    const abrir = () => setAberto(true);
    window.addEventListener(EVENTO_ABRIR_COOKIES, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_COOKIES, abrir);
  }, []);

  // Painéis da TV da base não têm visitante para perguntar.
  if (!aberto || !tagAtiva() || pathname.startsWith("/painel-")) return null;

  const escolher = (e: EscolhaCookies) => {
    registrarEscolha(e);
    setAberto(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto max-w-3xl rounded-2xl bg-primary text-primary-foreground shadow-2xl border border-primary-foreground/10 p-4 sm:p-5 sm:flex sm:items-center sm:gap-5">
        <p className="text-sm leading-relaxed text-primary-foreground/90">
          Usamos cookies do Google para medir as visitas e mostrar anúncios da CareFit a quem já
          conheceu o site. Você escolhe.{" "}
          <Link to="/privacidade" className="underline underline-offset-2 hover:text-accent">
            Política de privacidade
          </Link>
        </p>
        <div className="mt-3 sm:mt-0 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => escolher("recusado")}
            className="flex-1 sm:flex-none rounded-xl bg-transparent text-primary-foreground border border-primary-foreground/40 px-4 py-2.5 text-sm font-semibold hover:bg-primary-foreground/10 transition-colors"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => escolher("aceito")}
            className="flex-1 sm:flex-none rounded-xl bg-accent text-accent-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
