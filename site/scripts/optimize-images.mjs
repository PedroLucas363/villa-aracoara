// Converte as fotos de ../assets em WebP responsivo (public/img) com nomes semânticos.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "../assets";
const OUT = "public/img";
const WIDTHS = [640, 1280, 1920];

/** nome final → arquivo de origem (relativo a ../assets) */
/** recortes que removem o nome da suíte gravado na foto: nome → [origem, fração do topo a cortar] */
const CROPS = {
  "lua-fases": ["suite lua/1.png", 0.27],
  "mar-onda": ["suite mar/image (5).png", 0.4],
};

const MAP = {
  "casa-reflexo": "teste (7).png",
  "casa-piscina": "teste (4).png",
  "casa-jardim": "teste (2).png",
  "casa-coqueiros": "teste (5).png",
  "piscina": "teste (1).png",
  "deck": "teste (9).png",
  "lounge": "teste (8).png",
  "quadriciclo": "teste (6).png",
  "cafe-mesa": "image (5).png",
  "cafe-buffet": "image cafe.png",
  "cafe-varanda": "image cafe2.png",
  "sol-1": "sua sol/WhatsApp Image 2026-10-22 at 11.37.45 (1).jpeg",
  "sol-2": "sua sol/WhatsApp Image 2026-10-22 at 11.37.45 (2).jpeg",
  "sol-3": "sua sol/WhatsApp Image 2026-10-22 at 11.37.45 (3).jpeg",
  "sol-varanda": "sua sol/WhatsApp Image 2026-10-22 at 11.37.45 (4).jpeg",
  "sol-banho": "sua sol/WhatsApp Image 2026-10-22 at 11.37.45 (5).jpeg",
  "sol-vista": "sua sol/WhatsApp Image 2026-10-22 at 11.37.45 (6).jpeg",
  "sol-4": "sua sol/WhatsApp Image 2026-10-22 at 11.37.45 (7).jpeg",
  "sol-macrame": "sua sol/WhatsApp Image 2026-10-22 at 11.37.45.jpeg",
  "ceu-1": "suite ceu/1.png",
  "ceu-2": "suite ceu/2.png",
  "ceu-3": "suite ceu/3.png",
  "ceu-4": "suite ceu/4.png",
  "ceu-5": "suite ceu/5.png",
  "ceu-janela": "suite ceu/6.png",
  "ceu-por-do-sol": "suite ceu/7.png",
  "lua-1": "suite lua/1.png",
  "lua-2": "suite lua/2.png",
  "lua-3": "suite lua/3.png",
  "lua-varanda": "suite lua/4.png",
  "lua-banho": "suite lua/5.png",
  "lua-4": "suite lua/6.png",
  "mar-1": "suite mar/2.png",
  "mar-2": "suite mar/3.png",
  "mar-3": "suite mar/4.png",
  "mar-banho": "suite mar/5.png",
  "mar-rede": "suite mar/6.png",
  "mar-rede-2": "suite mar/7.png",
  "mar-macrame": "suite mar/image (5).png",
};

mkdirSync(OUT, { recursive: true });
const manifest = {};

for (const [name, file] of [...Object.entries(MAP), ...Object.keys(CROPS).map((k) => [k, CROPS[k][0]])]) {
  // As fotos "teste" vêm com tarjas pretas laterais: trim remove bordas de cor uniforme.
  const src = sharp(join(SRC, file));
  const base = file.startsWith("teste") ? src.trim({ background: "#000000", threshold: 30 }) : src;
  let buf = await base.toBuffer();
  if (CROPS[name]) {
    const m = await sharp(buf).metadata();
    const top = Math.round(m.height * CROPS[name][1]);
    buf = await sharp(buf).extract({ left: 0, top, width: m.width, height: m.height - top }).toBuffer();
  }
  const { width, height } = await sharp(buf).metadata();
  const sizes = WIDTHS.filter((w) => w < width).concat(width).filter((w, i, a) => a.indexOf(w) === i && w <= 1920);
  for (const w of sizes) {
    await sharp(buf).resize({ width: w }).webp({ quality: 76, effort: 5 }).toFile(join(OUT, `${name}-${w}.webp`));
  }
  manifest[name] = { w: width, h: height, sizes };
  console.log(name, width, height, sizes.join(","));
}

await import("node:fs").then((fs) =>
  fs.writeFileSync("src/data/images.json", JSON.stringify(manifest, null, 2))
);
