import { $ } from "./dom.js";

export const WHATS_NUMBER = "5567992383740";

export function openWhatsApp(message) {
  const url = `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

const isValidPhoneBR = (v) => {
  const d = (v || "").replace(/\D/g, "");
  return d.length >= 10 && d.length <= 13;
};

// Máscara simples: (67) 99999-9999
function maskPhone(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function initContact() {
  const form = $("#leadForm");
  if (!form) return;
  const success = $("#formSuccess");
  const phone = form.elements.whatsapp;

  phone.addEventListener("input", () => { phone.value = maskPhone(phone.value); });

  const rules = {
    nome: (v) => v.trim().length > 1,
    whatsapp: isValidPhoneBR,
    tipo: (v) => v.trim() !== "",
    mensagem: (v) => v.trim().length > 2,
  };

  const check = (name) => {
    const el = form.elements[name];
    const ok = rules[name](el.value);
    el.closest(".field").classList.toggle("has-error", !ok);
    el.setAttribute("aria-invalid", String(!ok));
    el.setAttribute("aria-describedby", `e-${name}`);
    return ok;
  };

  // Revalida ao corrigir um campo que já mostrou erro
  Object.keys(rules).forEach((name) => {
    const el = form.elements[name];
    const evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, () => { if (el.closest(".field").classList.contains("has-error")) check(name); });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map(check);
    if (results.includes(false)) {
      const firstInvalid = Object.keys(rules)[results.indexOf(false)];
      form.elements[firstInvalid].focus();
      success.textContent = "";
      return;
    }
    const fd = new FormData(form);
    const text =
      `Olá, Karina! Meu nome é ${String(fd.get("nome")).trim()}.\n` +
      `Meu WhatsApp: ${String(fd.get("whatsapp")).trim()}\n` +
      `Tipo de projeto: ${fd.get("tipo")}\n\n` +
      `Mensagem:\n${String(fd.get("mensagem")).trim()}`;
    success.textContent = "Mensagem pronta! Abrindo o WhatsApp…";
    openWhatsApp(text);
    setTimeout(() => (success.textContent = ""), 5000);
  });
}
