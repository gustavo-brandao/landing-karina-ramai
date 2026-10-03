import { $, $$, lockScroll } from "./dom.js";

export function initHeader() {
  const header = $("#header");
  const toggle = $("#menuToggle");
  const menu = $("#mobileMenu");
  const label = $(".menu-toggle-label", toggle);

  // Fundo translúcido depois do topo
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const setOpen = (open) => {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    label.textContent = open ? "Fechar" : "Menu";
    lockScroll(open);
  };
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  toggle.addEventListener("click", () => setOpen(!isOpen()));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) setOpen(false); });
  matchMedia("(min-width: 961px)").addEventListener("change", (e) => { if (e.matches && isOpen()) setOpen(false); });

  // Link ativo conforme a seção visível
  const links = $$(".menu a[data-nav]");
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const link = byId.get(e.target.id);
        if (!link) continue;
        if (e.isIntersecting) {
          links.forEach((l) => l.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "true");
        } else if (link.hasAttribute("aria-current")) {
          link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}
