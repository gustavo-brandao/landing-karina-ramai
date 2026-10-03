import { $$, reducedMotion } from "./dom.js";

/*
  Revelações ao rolar.
  - [data-reveal]          sobe e aparece
  - [data-reveal="mask"]   foto revelada de baixo para cima
  - [data-reveal="lines"]  título linha a linha
  Elementos dentro de outro [data-reveal] são revelados junto com o "pai".
  Máscaras são observadas pelo elemento pai (clip-path pode impedir a detecção).
*/
export function initReveal() {
  const items = $$("[data-reveal]");

  // Escalonamento automático entre irmãos
  const groups = new Map();
  for (const el of items) {
    if (el.style.getPropertyValue("--delay")) continue;
    const list = groups.get(el.parentElement) || [];
    list.push(el);
    groups.set(el.parentElement, list);
  }
  for (const list of groups.values()) {
    list.forEach((el, i) => el.style.setProperty("--delay", `${Math.min(i * 0.09, 0.45)}s`));
  }

  const show = (el) => {
    el.classList.add("is-in");
    $$("[data-reveal]", el).forEach((child) => child.classList.add("is-in"));
    el.dispatchEvent(new CustomEvent("reveal"));
    $$("[data-count]", el).forEach(countUp);
  };

  if (reducedMotion() || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        (triggers.get(e.target) || []).forEach(show);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  // Contadores começam do zero (sem JS, o HTML já mostra o valor final)
  $$("[data-count]").forEach((el) => (el.textContent = (el.dataset.prefix || "") + "0"));

  const triggers = new Map();
  for (const el of items) {
    if (el.parentElement.closest("[data-reveal]")) continue; // revelado pelo pai
    const trigger = el.dataset.reveal === "mask" ? el.parentElement : el;
    const list = triggers.get(trigger) || [];
    list.push(el);
    triggers.set(trigger, list);
  }

  // O que já está visível ao carregar anima logo em seguida; o resto ao rolar
  requestAnimationFrame(() => {
    for (const [trigger, list] of triggers) {
      const r = trigger.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) setTimeout(() => list.forEach(show), 80);
      else io.observe(trigger);
    }
  });
}

function countUp(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = "1";
  const to = Number(el.dataset.count);
  const prefix = el.dataset.prefix || "";
  const t0 = performance.now();
  const dur = 1500;
  const step = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = prefix + Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
