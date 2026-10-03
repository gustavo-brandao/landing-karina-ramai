/*
  Gera versões WebP otimizadas das fotos originais.
  - Originais (assets/, images/) não são publicados.
  - Nunca amplia: só gera larguras menores que a original + a original.
  - Nitidez leve ao reduzir (fotos vindas do Instagram ficam mais "limpas").
  Uso: npm run images
*/
import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";

const OUT = "public/img";
const SOURCES = [
  { dir: "assets", match: /\.(jpe?g|png)$/i },
  { dir: "images", match: /^(sobre|projeto)\.(jpe?g|png)$/i },
];
const WIDTHS = [480, 960];
const MAX = 1600;

await mkdir(OUT, { recursive: true });
const manifest = {};

for (const { dir, match } of SOURCES) {
  for (const file of (await readdir(dir)).filter((f) => match.test(f))) {
    const name = parse(file).name;
    const input = sharp(join(dir, file)).rotate();
    const { width, height } = await input.metadata();
    const full = Math.min(width, MAX);
    const sizes = [...WIDTHS.filter((w) => w < full), full];

    for (const w of sizes) {
      let img = sharp(join(dir, file)).rotate().resize({ width: w, withoutEnlargement: true });
      if (w < width) img = img.sharpen({ sigma: 0.6 });
      await img.webp({ quality: 82, effort: 6 }).toFile(join(OUT, `${name}-${w}.webp`));
    }
    manifest[name] = { w: full, h: Math.round((height * full) / width), sizes };
    console.log(`✓ ${name} → ${sizes.join(", ")}`);
  }
}

// Imagem de compartilhamento (Open Graph) 1200×630
await sharp("assets/saloes_capa.jpeg")
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(join(OUT, "og-image.jpg"));

await writeFile("src/data/images.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${Object.keys(manifest).length} imagens → ${OUT}`);
