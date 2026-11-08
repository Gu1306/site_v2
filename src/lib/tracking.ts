/**
 * Rastreamento das landing pages de anúncio (Google Ads).
 *
 * Tudo aqui é opcional e inofensivo sem configuração: se VITE_GOOGLE_TAG_ID não
 * existir no build, nada é carregado e `track()` só não faz nada. Assim dá para
 * publicar o código antes de ter o ID da tag.
 *
 * Variáveis (valem no BUILD; ver Dockerfile e .env.example):
 *   VITE_GOOGLE_TAG_ID               ex.: AW-1234567890 (ou G-XXXX do GA4)
 *   VITE_GOOGLE_ADS_SEND_TO_WHATSAPP ex.: AW-1234567890/AbCdEf   (conversão: clique no WhatsApp)
 *   VITE_GOOGLE_ADS_SEND_TO_AGENDAR  ex.: AW-1234567890/GhIjKl   (conversão: clique em Agendar)
 */

const TAG = import.meta.env.VITE_GOOGLE_TAG_ID as string | undefined;

const CONVERSAO: Record<string, string | undefined> = {
  whatsapp_click: import.meta.env.VITE_GOOGLE_ADS_SEND_TO_WHATSAPP as string | undefined,
  agendar_click: import.meta.env.VITE_GOOGLE_ADS_SEND_TO_AGENDAR as string | undefined,
};

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: Gtag;
  }
}

// ---------- Consentimento de cookies (LGPD + Consent Mode do Google) ----------
// O Google começa NEGADO. Sem "Aceitar", a tag manda só sinais sem cookie (não
// entra em lista de remarketing). A escolha fica no navegador da pessoa.
const CONSENT_KEY = "carefit_cookies_v1";
export const EVENTO_ABRIR_COOKIES = "carefit:abrir-cookies";
export type EscolhaCookies = "aceito" | "recusado";

const NEGADO = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
};
const PERMITIDO = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
};

export function tagAtiva() {
  return !!TAG;
}

export function escolhaCookies(): EscolhaCookies | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null;
  }
}

export function registrarEscolha(escolha: EscolhaCookies) {
  try {
    localStorage.setItem(CONSENT_KEY, escolha);
  } catch {
    /* sem storage: vale só para esta visita */
  }
  window.gtag?.("consent", "update", escolha === "aceito" ? PERMITIDO : NEGADO);
}

/** Reabre o aviso para a pessoa mudar a escolha (rodapé e página de privacidade). */
export function reabrirCookies() {
  window.dispatchEvent(new Event(EVENTO_ABRIR_COOKIES));
}

const ATTR_KEY = "carefit_attr";
const PARAMS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function initGoogleTag() {
  if (typeof document === "undefined") return;
  guardarAtribuicao();
  if (!TAG || document.getElementById("gtag-js")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // O gtag.js exige o objeto `arguments`, não um array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  const s = document.createElement("script");
  s.id = "gtag-js";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(TAG)}`;
  document.head.appendChild(s);

  // Consentimento ANTES do config: padrão negado; quem já aceitou volta liberado.
  window.gtag("consent", "default", { ...NEGADO, wait_for_update: 500 });
  if (escolhaCookies() === "aceito") window.gtag("consent", "update", PERMITIDO);

  window.gtag("js", new Date());
  // O site é SPA: a troca de página não recarrega. O page_view é enviado por
  // `paginaVista()` a cada rota (inclusive a primeira), por isso desligado aqui.
  window.gtag("config", TAG, { send_page_view: false });
}

/** Páginas internas (TV da base) não entram nos públicos de remarketing. */
const SEM_RASTREIO = ["/painel-"];

/** Registra a página vista; é o que alimenta os públicos de remarketing do Ads. */
export function paginaVista(caminho: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  if (SEM_RASTREIO.some((p) => caminho.startsWith(p))) return;
  window.gtag("event", "page_view", {
    page_path: caminho,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Guarda gclid/UTM da primeira visita da sessão (a landing pode ser trocada por outra página). */
function guardarAtribuicao() {
  try {
    const q = new URLSearchParams(window.location.search);
    const novo: Record<string, string> = {};
    PARAMS.forEach((p) => {
      const v = q.get(p);
      if (v) novo[p] = v;
    });
    if (Object.keys(novo).length) {
      const atual = JSON.parse(sessionStorage.getItem(ATTR_KEY) || "{}");
      sessionStorage.setItem(ATTR_KEY, JSON.stringify({ ...atual, ...novo }));
    }
  } catch {
    /* sessionStorage pode estar bloqueado; rastrear é conveniência, não requisito */
  }
}

export function atribuicao(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Evento no Google tag; dispara também a conversão do Ads quando o rótulo estiver configurado. */
export function track(evento: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", evento, params);
  const sendTo = CONVERSAO[evento];
  if (sendTo) window.gtag("event", "conversion", { send_to: sendTo, ...params });
}
