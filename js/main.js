/*
  Karina Ramai • Arquitetura
  Scripts principais
  ================================
*/

// =========================
// Inicializar AOS (Animate On Scroll)
// =========================
AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  once: true,
  offset: 50,
  delay: 0,
});

// =========================
// Helpers
// =========================
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

// =========================
// Mobile menu
// =========================
const menuBtn = $("#menuBtn");
const mobileNav = $("#mobileNav");

menuBtn?.addEventListener("click", () => {
  mobileNav.classList.toggle("hidden");
});

// Fecha menu mobile ao clicar em um link
$$("#mobileNav a").forEach(a => {
  a.addEventListener("click", () => mobileNav.classList.add("hidden"));
});

// =========================
// Ano no footer
// =========================
$("#year").textContent = new Date().getFullYear();

// =========================
// WhatsApp link
// =========================
const WHATS_NUMBER = "5567992383740"; // <-- TROQUE AQUI (DDI+DDD+NUMERO, só dígitos)
const whatsBtn = $("#whatsBtn");

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

whatsBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  openWhatsApp("Olá, Karina! Gostaria de falar sobre um projeto. 😊");
});

// =========================
// Portfólio: filtro
// =========================
const filterButtons = $$(".filterBtn");
const portfolioItems = $$(".portfolioItem");

function setActiveFilter(btn) {
  filterButtons.forEach(b => {
    b.style.borderColor = "rgba(0,0,0,.10)";
    b.style.background = "rgba(255,255,255,.70)";
  });
  // destaque no ativo (laranja sutil)
  btn.style.borderColor = "rgba(227,107,44,.45)";
  btn.style.background = "rgba(227,107,44,.10)";
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    setActiveFilter(btn);

    portfolioItems.forEach(item => {
      const cat = item.dataset.category;
      const show = (filter === "all") || (cat === filter);
      item.classList.toggle("hidden", !show);
    });
  });
});

// Marca "Todos" como ativo ao carregar
if (filterButtons[0]) setActiveFilter(filterButtons[0]);

// =========================
// Portfólio: modal/lightbox
// =========================
const modal = $("#modal");
const modalImg = $("#modalImg");
const modalTitle = $("#modalTitle");
const modalClose = $("#modalClose");

function openModal({ title, image }) {
  modalTitle.textContent = title || "Projeto";
  modalImg.src = image || "";
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
  modalImg.src = "";
}

portfolioItems.forEach(item => {
  item.addEventListener("click", () => {
    openModal({
      title: item.dataset.title,
      image: item.dataset.image
    });
  });
});

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  if (e.target === modal || e.target.classList.contains("modal-backdrop")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

// =========================
// Form → validação simples + monta mensagem p/ WhatsApp
// =========================
const leadForm = $("#leadForm");
const formSuccess = $("#formSuccess");

function showError(name, show) {
  const el = document.querySelector(`[data-error="${name}"]`);
  if (!el) return;
  el.classList.toggle("hidden", !show);
}

function isValidPhoneBR(value) {
  // validação básica: precisa ter ao menos 10-11 dígitos
  const digits = (value || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

leadForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const fd = new FormData(leadForm);
  const nome = String(fd.get("nome") || "").trim();
  const whatsapp = String(fd.get("whatsapp") || "").trim();
  const tipo = String(fd.get("tipo") || "").trim();
  const mensagem = String(fd.get("mensagem") || "").trim();

  // reset
  ["nome", "whatsapp", "tipo", "mensagem"].forEach(k => showError(k, false));

  let ok = true;
  if (!nome) { showError("nome", true); ok = false; }
  if (!isValidPhoneBR(whatsapp)) { showError("whatsapp", true); ok = false; }
  if (!tipo) { showError("tipo", true); ok = false; }
  if (!mensagem) { showError("mensagem", true); ok = false; }

  if (!ok) return;

  const text =
    `Olá, Karina! Meu nome é ${nome}.
Meu WhatsApp: ${whatsapp}
Tipo de projeto: ${tipo}

Mensagem:
${mensagem}`;

  formSuccess.classList.remove("hidden");
  openWhatsApp(text);

  // Opcional: limpar form
  // leadForm.reset();
  setTimeout(() => formSuccess.classList.add("hidden"), 3500);
});

// =========================
// Efeitos de scroll suave no header
// =========================
const header = $("header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header?.classList.add("shadow-lg");
  } else {
    header?.classList.remove("shadow-lg");
  }
  
  lastScroll = currentScroll;
}, { passive: true });

// =========================
// Parallax sutil no hero (opcional)
// =========================
const heroSection = $("section.paper-texture");
window.addEventListener("scroll", () => {
  if (heroSection && window.innerWidth > 768) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    heroSection.style.backgroundPositionY = `${rate}px`;
  }
}, { passive: true });

// =========================
// Refresh AOS ao redimensionar
// =========================
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    AOS.refresh();
  }, 250);
}, { passive: true });
