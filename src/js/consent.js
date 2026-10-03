import { $ } from "./dom.js";

const KEY = "cookieConsent";

const read = (store) => { try { return store.getItem(KEY); } catch { return null; } };
const write = (store, v) => { try { store.setItem(KEY, v); } catch { /* armazenamento bloqueado */ } };

/*
  Banner de cookies.
  - "Aceitar": grava a escolha e carrega o Google Analytics (loadGoogleAnalytics está no <head>).
  - "Agora não": esconde até o fim da sessão, sem carregar o Analytics.
*/
export function initConsent() {
  const banner = $("#cookieBanner");
  if (!banner) return;
  if (read(localStorage) === "accepted" || read(sessionStorage) === "dismissed") return;

  banner.hidden = false;
  document.body.classList.add("cookie-visible");
  setTimeout(() => banner.classList.add("is-visible"), 900);

  const hide = () => {
    banner.classList.remove("is-visible");
    document.body.classList.remove("cookie-visible");
    setTimeout(() => (banner.hidden = true), 600);
  };

  $("#acceptCookies").addEventListener("click", () => {
    write(localStorage, "accepted");
    hide();
    if (typeof window.loadGoogleAnalytics === "function") window.loadGoogleAnalytics();
  });
  $("#declineCookies").addEventListener("click", () => {
    write(sessionStorage, "dismissed");
    hide();
  });
}
