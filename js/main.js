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
const modalPrev = $("#modalPrev");
const modalNext = $("#modalNext");
const modalCounter = $("#modalCounter");
const modalContent = $("#modalContent");

// Variáveis para galeria
let currentGallery = [];
let currentIndex = 0;
let isAnimating = false;

function updateGalleryNav() {
  if (currentGallery.length > 1) {
    modalPrev?.classList.remove("hidden");
    modalNext?.classList.remove("hidden");
    modalCounter?.classList.remove("hidden");
    modalCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
  } else {
    modalPrev?.classList.add("hidden");
    modalNext?.classList.add("hidden");
    modalCounter?.classList.add("hidden");
  }
}

function showGalleryImage(index) {
  if (isAnimating) return;
  isAnimating = true;
  
  if (index < 0) index = currentGallery.length - 1;
  if (index >= currentGallery.length) index = 0;
  currentIndex = index;
  
  // Animação de fade na troca de imagem
  modalImg.classList.add("img-changing");
  
  setTimeout(() => {
    modalImg.src = currentGallery[currentIndex];
    updateGalleryNav();
    
    // Aguarda a imagem carregar antes de mostrar
    modalImg.onload = () => {
      modalImg.classList.remove("img-changing");
      isAnimating = false;
    };
    
    // Fallback caso a imagem já esteja em cache
    if (modalImg.complete) {
      modalImg.classList.remove("img-changing");
      isAnimating = false;
    }
  }, 150);
}

function openModal({ title, image, gallery }) {
  if (isAnimating) return;
  isAnimating = true;
  
  modalTitle.textContent = title || "Projeto";
  
  // Se tem galeria, usar galeria; senão, usar só a imagem única
  if (gallery && gallery.length > 0) {
    currentGallery = gallery;
    currentIndex = 0;
    modalImg.src = currentGallery[0];
  } else {
    currentGallery = [image];
    currentIndex = 0;
    modalImg.src = image || "";
  }
  
  updateGalleryNav();
  
  // Mostra o modal e inicia animação
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
  
  // Trigger reflow para garantir que a transição funcione
  modal.offsetHeight;
  
  // Adiciona classe para animação de entrada
  requestAnimationFrame(() => {
    modal.classList.add("modal-visible");
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  });
}

function closeModal() {
  if (isAnimating) return;
  isAnimating = true;
  
  // Adiciona classe de fechamento para animação de saída
  modal.classList.add("modal-closing");
  modal.classList.remove("modal-visible");
  
  // Aguarda a animação terminar antes de esconder
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("flex", "modal-closing");
    document.body.style.overflow = "";
    modalImg.src = "";
    currentGallery = [];
    currentIndex = 0;
    isAnimating = false;
  }, 300);
}

portfolioItems.forEach(item => {
  item.addEventListener("click", () => {
    let gallery = [];
    if (item.dataset.gallery) {
      try {
        gallery = JSON.parse(item.dataset.gallery);
      } catch (e) {
        gallery = [];
      }
    }
    openModal({
      title: item.dataset.title,
      image: item.dataset.image,
      gallery: gallery
    });
  });
});

// Navegação da galeria
modalPrev?.addEventListener("click", (e) => {
  e.stopPropagation();
  showGalleryImage(currentIndex - 1);
});

modalNext?.addEventListener("click", (e) => {
  e.stopPropagation();
  showGalleryImage(currentIndex + 1);
});

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  if (e.target === modal || e.target.classList.contains("modal-backdrop")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  // Navegação por teclado
  if (!modal.classList.contains("hidden") && currentGallery.length > 1) {
    if (e.key === "ArrowLeft") showGalleryImage(currentIndex - 1);
    if (e.key === "ArrowRight") showGalleryImage(currentIndex + 1);
  }
});

// =========================
// Suporte a gestos touch (swipe) no modal
// =========================
let touchStartX = 0;
let touchEndX = 0;
const SWIPE_THRESHOLD = 50; // mínimo de pixels para considerar swipe

modalContent?.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

modalContent?.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  if (currentGallery.length <= 1) return;
  
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    if (diff > 0) {
      // Swipe para esquerda = próxima imagem
      showGalleryImage(currentIndex + 1);
    } else {
      // Swipe para direita = imagem anterior
      showGalleryImage(currentIndex - 1);
    }
  }
}

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
