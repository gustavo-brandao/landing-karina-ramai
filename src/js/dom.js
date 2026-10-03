export const $ = (q, el = document) => el.querySelector(q);
export const $$ = (q, el = document) => [...el.querySelectorAll(q)];
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Trava a rolagem da página sem "pulo" causado pela barra de rolagem
let locks = 0;
export function lockScroll(lock) {
  const root = document.documentElement;
  if (lock) {
    if (locks++ === 0) {
      const sb = innerWidth - root.clientWidth;
      root.style.overflow = "hidden";
      if (sb > 0) document.body.style.paddingRight = `${sb}px`;
    }
  } else if (locks > 0 && --locks === 0) {
    root.style.overflow = "";
    document.body.style.paddingRight = "";
  }
}
