import { $, $$, lockScroll, reducedMotion } from "./dom.js";
import images from "../data/images.json";

const SLIDE_MS = 850;

/* Melhor arquivo para exibir em tela cheia (nunca maior que o original) */
const fullSrc = (name) => `/img/${name}-${images[name].w}.webp`;
const thumbSrc = (name) => `/img/${name}-${images[name].sizes[0]}.webp`;

export function initPortfolio() {
  initFilter();
  initLightbox();
}

/* ---------------- Filtro ---------------- */
function initFilter() {
  const grid = $("#projectsGrid");
  const buttons = $$(".filters button");
  const projects = $$(".project", grid);
  let timer;

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-active")) return;
      buttons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      const f = btn.dataset.filter;
      const swap = () => {
        grid.classList.toggle("is-filtered", f !== "all");
        projects.forEach((p) => {
          const show = f === "all" || p.dataset.category === f;
          p.classList.toggle("is-hidden", !show);
          p.classList.add("is-in");
          $$("[data-reveal]", p).forEach((c) => c.classList.add("is-in"));
        });
        requestAnimationFrame(() => requestAnimationFrame(() => projects.forEach((p) => p.classList.remove("is-leaving"))));
      };
      clearTimeout(timer);
      if (reducedMotion()) return swap();
      projects.forEach((p) => p.classList.add("is-leaving"));
      timer = setTimeout(swap, 350);
    })
  );
}

/* ---------------- Lightbox ---------------- */
function initLightbox() {
  const lb = $("#lightbox");
  const stage = $("#lbStage");
  const title = $("#lbTitle");
  const count = $("#lbCount");
  const thumbs = $("#lbThumbs");
  const progress = $("#lbProgress");
  const btnPrev = $("#lbPrev");
  const btnNext = $("#lbNext");
  const btnClose = $("#lbClose");

  let gallery = [];
  let index = 0;
  let current = null;
  let busy = false;
  let opener = null;

  // Limita à resolução real e ao espaço disponível: a foto nunca é ampliada (evita aspecto "borrado")
  function sizeImage(slide) {
    const img = $("img", slide);
    const { w, h } = images[img.dataset.name];
    const s = getComputedStyle(slide);
    const f = getComputedStyle(img.parentElement);
    const availH = slide.clientHeight - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom) - parseFloat(f.paddingTop) * 2;
    const availW = slide.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight) - parseFloat(f.paddingLeft) * 2;
    const scale = Math.min(1, availW / w, availH / h);
    img.style.width = `${Math.floor(w * scale)}px`;
    img.style.height = `${Math.floor(h * scale)}px`;
  }

  function makeSlide(i, offset) {
    const name = gallery[i];
    const slide = document.createElement("div");
    slide.className = "lb-slide";
    slide.innerHTML = `<div class="lb-frame"><img alt="" decoding="async"></div>`;
    const img = $("img", slide);
    img.dataset.name = name;
    img.src = fullSrc(name);
    img.alt = `${title.textContent} — foto ${i + 1} de ${gallery.length}`;
    slide.style.transition = "none";
    slide.style.transform = `translateX(${offset}%)`;
    slide.style.opacity = offset ? "0" : "1";
    stage.appendChild(slide);
    sizeImage(slide);
    void slide.offsetWidth;
    slide.style.transition = "";
    return slide;
  }

  function preload(i) {
    const name = gallery[(i + gallery.length) % gallery.length];
    if (name) new Image().src = fullSrc(name);
  }

  function updateUI() {
    const pad = (n) => String(n).padStart(2, "0");
    count.textContent = `${pad(index + 1)} / ${pad(gallery.length)}`;
    progress.style.width = `${((index + 1) / gallery.length) * 100}%`;
    $$("button", thumbs).forEach((b, i) => {
      b.classList.toggle("is-active", i === index);
      b.setAttribute("aria-current", i === index ? "true" : "false");
    });
    $$("button", thumbs)[index]?.scrollIntoView({ inline: "center", block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
    preload(index + 1);
    preload(index - 1);
  }

  function go(target, dir) {
    if (busy || gallery.length < 2) return;
    const next = (target + gallery.length) % gallery.length;
    if (next === index) return;
    dir = dir || (next > index ? 1 : -1);
    index = next;
    const incoming = makeSlide(index, dir * 60);
    const outgoing = current;
    current = incoming;
    updateUI();
    if (reducedMotion()) {
      outgoing.remove();
      incoming.style.transform = "none";
      incoming.style.opacity = "1";
      return;
    }
    busy = true;
    requestAnimationFrame(() => {
      outgoing.style.transform = `translateX(${-dir * 60}%)`;
      outgoing.style.opacity = "0";
      incoming.style.transform = "translateX(0)";
      incoming.style.opacity = "1";
    });
    setTimeout(() => { outgoing.remove(); busy = false; }, SLIDE_MS);
  }

  function open(project) {
    try { gallery = JSON.parse(project.dataset.gallery); } catch { gallery = []; }
    gallery = gallery.filter((n) => images[n]);
    if (!gallery.length) return;
    opener = project;
    index = 0;
    title.textContent = project.dataset.title;
    thumbs.innerHTML = gallery
      .map((n, i) => `<button type="button" aria-label="Ver foto ${i + 1}"><img src="${thumbSrc(n)}" alt="" loading="lazy"></button>`)
      .join("");
    $$("button", thumbs).forEach((b, i) => b.addEventListener("click", () => go(i)));
    btnPrev.hidden = btnNext.hidden = gallery.length < 2;

    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    lockScroll(true);
    $$(".lb-slide", stage).forEach((s) => s.remove());
    current = makeSlide(0, 0);
    current.style.transform = "scale(.95)";
    current.style.opacity = "0";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      current.style.transform = "none";
      current.style.opacity = "1";
    }));
    updateUI();
    btnClose.focus({ preventScroll: true });
  }

  function close() {
    if (!lb.classList.contains("is-open")) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    lockScroll(false);
    busy = false;
    setTimeout(() => { if (!lb.classList.contains("is-open")) $$(".lb-slide", stage).forEach((s) => s.remove()); }, 500);
    opener?.focus({ preventScroll: true });
  }

  $$(".project").forEach((p) => p.addEventListener("click", () => open(p)));
  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => go(index - 1, -1));
  btnNext.addEventListener("click", () => go(index + 1, 1));
  stage.addEventListener("click", (e) => { if (e.target === stage || e.target.classList.contains("lb-slide")) close(); });

  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") go(index + 1, 1);
    else if (e.key === "ArrowLeft") go(index - 1, -1);
    else if (e.key === "Tab") {
      // mantém o foco dentro da galeria
      const f = $$("button:not([hidden])", lb);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Gestos (swipe)
  let x0 = null, y0 = 0;
  stage.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, { passive: true });

  // Reajusta o tamanho máximo das fotos ao girar/redimensionar
  addEventListener("resize", () => {
    if (!lb.classList.contains("is-open")) return;
    $$(".lb-slide", stage).forEach(sizeImage);
  });
}
