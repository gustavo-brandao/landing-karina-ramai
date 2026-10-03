import { $, $$ } from "./dom.js";

export function initUI() {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  initProcessLine();
  initWhatsFloat();
}

/* Linha do processo "desenha" conforme a rolagem e acende as etapas */
function initProcessLine() {
  const steps = $("#steps");
  if (!steps) return;
  const items = $$(".step", steps);
  const vertical = matchMedia("(max-width: 900px)");
  let ticking = false;

  const update = () => {
    ticking = false;
    const r = steps.getBoundingClientRect();
    const clamp = (v) => Math.min(Math.max(v, 0), 1);
    if (vertical.matches) {
      // celular: a linha acompanha a leitura (ponto de referência a 65% da tela)
      const mark = innerHeight * 0.65;
      steps.style.setProperty("--p", clamp((mark - r.top) / r.height).toFixed(3));
      items.forEach((el) => el.classList.toggle("is-active", el.getBoundingClientRect().top < mark));
    } else {
      // desktop: começa quando a linha entra em 90% da tela e completa ao percorrer ~45% da altura da tela
      const p = clamp((innerHeight * 0.9 - r.top) / (innerHeight * 0.45));
      steps.style.setProperty("--p", p.toFixed(3));
      items.forEach((el, i) => el.classList.toggle("is-active", p >= i / items.length + 0.02));
    }
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
}

/* Botão flutuante do WhatsApp: aparece depois do topo e some na seção de contato */
function initWhatsFloat() {
  const btn = $("#whatsFloat");
  const hero = $("#topo");
  const contact = $("#contato");
  if (!btn || !hero || !contact) return;
  let pastHero = false;
  let atContact = false;
  const render = () => btn.classList.toggle("is-visible", pastHero && !atContact);

  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; render(); }, { rootMargin: "-40% 0px 0px 0px" }).observe(hero);
  new IntersectionObserver(([e]) => { atContact = e.isIntersecting; render(); }, { threshold: 0.15 }).observe(contact);
}
