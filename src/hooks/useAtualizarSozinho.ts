import { useEffect, useRef } from "react";

/* =========================================================================
 *  Recarrega a página quando há versão nova do site no ar.
 *
 *  O app do atleta fica aberto dias no celular (ícone na tela inicial) e não
 *  tem service worker: depois de um deploy, quem não fechar o app continua na
 *  versão velha. Aqui, ao voltar para a tela e a cada 5 minutos, a página
 *  pede o HTML de novo (sem cache) e compara o script principal com o que
 *  está rodando. Mudou → recarrega, mas nunca no meio de algo digitado.
 * ========================================================================= */

const CHAVE = "carefit:recarregou-para";
const INTERVALO_MS = 5 * 60000;

// O script de entrada do build (hoje "/assets/site-xxxx.js"): o nome muda a cada versão.
const scriptRodando = () =>
  document.querySelector<HTMLScriptElement>('script[type="module"][src^="/assets/"]')?.getAttribute("src") || "";

const scriptNoAr = async () => {
  const resposta = await fetch(window.location.pathname, { cache: "no-store", credentials: "same-origin" });
  if (!resposta.ok) return "";
  const html = await resposta.text();
  return /<script[^>]*type="module"[^>]*src="(\/assets\/[^"]+\.js)"/.exec(html)?.[1] || "";
};

/** Algo digitado e não salvo (código, telefone, anotação) segura a atualização. */
const temAlgoDigitado = () =>
  Array.from(document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("textarea, input[type=text], input[type=tel], input[type=email], input[inputmode=numeric]")).some(
    (campo) => campo.value.trim() !== ""
  );

/**
 * `ocupado` diz se a tela está no meio de algo que não pode ser interrompido
 * (ex.: escolhendo aula). Lido na hora da checagem, por ref.
 */
export function useAtualizarSozinho(ocupado: () => boolean = () => false) {
  const ocupadoRef = useRef(ocupado);
  ocupadoRef.current = ocupado;

  useEffect(() => {
    const rodando = scriptRodando();
    if (!rodando) return; // servidor de desenvolvimento do Vite: nada a comparar
    let checando = false;

    const checar = async () => {
      if (checando || document.visibilityState !== "visible") return;
      checando = true;
      try {
        const noAr = await scriptNoAr();
        if (!noAr || noAr === rodando) return;
        // Já recarregou para esta versão e continuou na velha: não insiste (evita laço).
        let jaTentou = "";
        try {
          jaTentou = sessionStorage.getItem(CHAVE) || "";
        } catch {
          /* sem storage: segue */
        }
        if (jaTentou === noAr) return;
        if (ocupadoRef.current() || temAlgoDigitado()) return; // tenta de novo na próxima
        try {
          sessionStorage.setItem(CHAVE, noAr);
        } catch {
          /* sem storage: segue */
        }
        window.location.reload();
      } catch {
        /* sem internet: tenta na próxima */
      } finally {
        checando = false;
      }
    };

    const aoVoltar = () => {
      if (document.visibilityState === "visible") checar();
    };
    document.addEventListener("visibilitychange", aoVoltar);
    window.addEventListener("pageshow", aoVoltar);
    window.addEventListener("focus", aoVoltar);
    const relogio = window.setInterval(aoVoltar, INTERVALO_MS);
    return () => {
      document.removeEventListener("visibilitychange", aoVoltar);
      window.removeEventListener("pageshow", aoVoltar);
      window.removeEventListener("focus", aoVoltar);
      window.clearInterval(relogio);
    };
  }, []);
}
