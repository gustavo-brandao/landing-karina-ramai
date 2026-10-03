# Redesign editorial — Landing Karina Ramai

**Data:** 2026-10-03 · **Branch:** `redesign-editorial` · **Direção aprovada:** Estilo D (mockup em `.superpowers/mockups/estilo-d-editorial.html`)

## Objetivo

Modernizar a landing page da arquiteta Karina Ramai com um visual editorial e sofisticado ("revista de arquitetura"), mantendo identidade (cores, assinatura Allura, títulos Playfair), conteúdo, fotos e todas as funcionalidades atuais. Deve ficar impecável em 1366×768, 1600×900, 1920×1080 e em smartphones (≥360px).

## Decisões aprovadas

- **Estilo D:** editorial minimalista — muito respiro, grid assimétrico, linhas finas, sem cantos arredondados, serifa grande.
- **Fotos (origem Instagram, 900–1280px):** moldura passe-partout, tratamento de cor unificado (volta ao natural no hover), grão fino, tamanhos de exibição limitados, zoom de animação contido (≤1.08), lightbox nunca amplia além da resolução real.
- **Karina:** nome/assinatura no topo; retrato grande uma única vez, na seção "A arquiteta", logo após os projetos.
- **Stack:** Vite + Tailwind CSS v4 (`@tailwindcss/vite`), JS vanilla em módulos. Sem AOS (animações próprias com IntersectionObserver).

## Estrutura da página

1. **Header fixo** — assinatura "Karina Ramai"; links Projetos · A arquiteta · Serviços · Processo · Contato; botão "Orçamento". Ganha fundo translúcido ao rolar. Mobile: menu em tela cheia com links grandes em serifa, animados.
2. **Hero** — eyebrow "Karina Ramai — Arquiteta & Urbanista · Campo Grande, MS"; título em 3 linhas com revelação por máscara; lead; CTAs "Ver projetos" / "Conheça a arquiteta"; números (8 anos · +50 projetos · 3D). À direita: projeto em moldura grande + miniatura sobreposta + legenda assinada. Cabe inteiro em 1366×768.
3. **Marquee** — Residencial ✦ Interiores ✦ Comercial ✦ Acompanhamento de obra ✦ Projeto 3D.
4. **(01) Projetos** — 4 projetos em grid assimétrico, filtro (Todos/Residencial/Interiores/Comercial) com transição, lightbox com slide horizontal, miniaturas, contador, barra de progresso, teclado, swipe, foco acessível.
5. **(02) A arquiteta** — retrato em moldura + assinatura; citação; texto "Sobre" atual; ficha (atuação, especialidade, diferencial, base); selo "Na mídia".
6. **(03) Serviços** — lista editorial de 3 linhas (número, título, descrição, itens) com ícones de traço fino; hover destaca a linha.
7. **(04) Processo** — 4 etapas em linha do tempo; a linha "desenha" ao rolar.
8. **(05) Na mídia** — matéria do Campo Grande News em destaque (imagem + título + link externo).
9. **(06) Contato** — "Vamos conversar"; WhatsApp, e-mail e Instagram em linhas; formulário editorial (nome, WhatsApp, tipo, mensagem) com validação que monta a mensagem e abre o WhatsApp. Sem textos de rascunho.
10. **Footer** — assinatura grande, navegação, redes sociais, política de privacidade (`#privacidade`), créditos.
11. **Botão flutuante de WhatsApp** discreto, aparece após o hero.
12. **Banner de cookies** redesenhado.

## Comportamentos preservados

- Google Analytics `G-Y1X47J4Z57` só após consentimento (`localStorage.cookieConsent === 'accepted'`).
- Microsoft Clarity (`uw3wuf04il`), Cloudflare Web Analytics, meta `msvalidate.01`.
- WhatsApp `5567992383740`, e-mail `arqkarinaramai@gmail.com`, Instagram `arq.karinaramai`, LinkedIn.
- `robots.txt` e `sitemap.xml` (domínio `arqkarinaramai.pages.dev`), `lastmod` atualizado.

## Arquitetura técnica

```
index.html                 entrada do Vite (HTML estático, bom para SEO)
src/main.js                importa CSS e inicializa módulos
src/styles/main.css        @import "tailwindcss"; @theme (tokens); camadas base/components
src/js/reveal.js           revelações ao rolar (+ prefers-reduced-motion)
src/js/header.js           estado do header, menu mobile, link ativo
src/js/portfolio.js        filtro + lightbox
src/js/contact.js          validação + WhatsApp
src/js/consent.js          banner de cookies + carregamento do GA
src/js/ui.js               marquee/linha do processo/botão flutuante/ano
scripts/optimize-images.mjs  sharp: gera WebP responsivo (480/960/original) em public/img
public/                    img/ otimizadas, robots.txt, sitemap.xml, favicon.svg, og-image
```

- Imagens: originais permanecem em `assets/` e `images/` (não publicados); `npm run images` gera WebP com nitidez leve, nunca ampliando. `<img>` com `srcset/sizes`, `loading="lazy"` (exceto hero), `width/height` para evitar layout shift.
- `vite.config.js` com `base: './'`.
- SEO: title/description atuais, Open Graph, canonical, JSON-LD (`ProfessionalService`).

## Deploy (Cloudflare Pages)

Antes do merge na `main`, no painel da Cloudflare Pages: **Build command** `npm run build`, **Build output directory** `dist`, variável `NODE_VERSION=22` (ou superior). Sem isso o site publicado quebraria.

## Verificação (2 rodadas completas)

Para 1366×768, 1600×900, 1920×1080, 390×844 e 360×780: sem rolagem horizontal; hero cabe na tela; todas as fotos de todas as galerias carregam (checagem automática de `naturalWidth`); revelações, marquee, linha do processo, filtro, lightbox (setas, teclado, swipe, miniaturas, fechar), menu mobile, formulário (validação + link do WhatsApp), banner de cookies; console sem erros; `npm run build` sem erros.
