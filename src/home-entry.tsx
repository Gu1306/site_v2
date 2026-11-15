import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CookieBanner from "./components/CookieBanner";
import { initGoogleTag, paginaVista, reabrirCookies, tagAtiva } from "./lib/tracking";
import "./index.css";
import "./jornada-home.js";

initGoogleTag();
paginaVista(window.location.pathname + window.location.search);

if (tagAtiva()) {
  const settings = document.querySelector<HTMLButtonElement>("#home-cookie-settings");
  if (settings) {
    settings.hidden = false;
    settings.addEventListener("click", reabrirCookies);
  }
  createRoot(document.getElementById("home-cookie-banner")!).render(
    <BrowserRouter>
      <CookieBanner reloadDocument />
    </BrowserRouter>,
  );
}
