# Landing Page — Karina Ramai Arquitetura

Landing page institucional da arquiteta **Karina Ramai**, com visual editorial ("revista de arquitetura"), identidade autoral e foco em apresentação profissional, portfólio e contato.

---

## 📌 Tecnologias

- HTML5 semântico + JavaScript (módulos, sem frameworks)
- [Vite](https://vite.dev) (build)
- [Tailwind CSS v4](https://tailwindcss.com) + CSS do tema editorial
- [sharp](https://sharp.pixelplumbing.com) para otimizar as fotos (WebP responsivo)
- Cloudflare Pages (hospedagem)

## 🚀 Como rodar

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev       # servidor local com recarregamento automático
npm run build     # gera a versão de produção em dist/
npm run preview   # visualiza o build localmente
```

## 🖼️ Fotos

As fotos originais ficam em `assets/` e `images/` (não são publicadas).
Depois de adicionar ou trocar uma foto, rode:

```bash
npm run images
```

O script gera versões WebP otimizadas em `public/img/` (480px, 960px e tamanho original — nunca amplia) e atualiza `src/data/images.json`, usado pela galeria.

Para um novo projeto no portfólio, copie um bloco `<button class="project">` em `index.html` e ajuste `data-category`, `data-title`, `data-gallery` (nomes dos arquivos sem extensão) e a imagem de capa.

## 📂 Estrutura

```text
index.html               página (conteúdo e SEO)
src/main.js              inicialização
src/styles/main.css      tema e layout
src/js/                  animações, menu, portfólio/galeria, contato, cookies
src/data/images.json     dimensões das fotos (gerado)
public/                  arquivos publicados (img/, favicon, robots, sitemap)
scripts/optimize-images.mjs
assets/, images/         fotos originais
```

## ☁️ Deploy (Cloudflare Pages)

Configuração do projeto no painel da Cloudflare:

| Campo | Valor |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Variável de ambiente | `NODE_VERSION` = `22` |

## ✨ Características

- Layout responsivo testado em 1920×1080, 1600×900, 1366×768, 1280×720, tablet e smartphones
- Animações de entrada ao rolar, galeria com transição, teclado e gestos
- Fotos com tratamento editorial e carregamento otimizado
- Google Analytics carregado apenas após consentimento de cookies
- Acessível: navegação por teclado, foco visível, respeito a "reduzir movimento"

## 🤖 Desenvolvimento assistido por IA

Este projeto foi desenvolvido com o apoio de ferramentas de Inteligência Artificial.
A estrutura base e organização do código foram criadas com auxílio do ChatGPT, ajustes visuais contaram com o suporte do GitHub Copilot, e o redesign editorial (v2) foi desenvolvido com o Claude Code — sempre com validação, revisão e curadoria manual.
