// Gera dist/artifact.html para publicar como Artifact: CSS e JS embutidos, sem o esqueleto
// <html>/<head>/<body> (o publicador adiciona o dele). As fotos continuam como arquivos em dist/img.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
let html = readFileSync(join(DIST, "index.html"), "utf8");

html = html.replace(/<link rel="stylesheet" crossorigin href="\.\/(assets\/[^"]+\.css)">/g, (_, href) => {
  const css = readFileSync(join(DIST, href), "utf8");
  return `<style>${css}</style>`;
});

html = html.replace(/<script type="module" crossorigin src="\.\/(assets\/[^"]+\.js)"><\/script>/g, (_, src) => {
  const js = readFileSync(join(DIST, src), "utf8").replace(/<\/script/gi, "<\\/script");
  return `<script type="module">${js}</script>`;
});

html = html
  .replace(/<!doctype html>/i, "")
  .replace(/<\/?html[^>]*>/gi, "")
  .replace(/<\/?head>/gi, "")
  .replace(/<\/?body>/gi, "")
  .replace(/<meta charset="UTF-8" \/>/i, "")
  .replace(/<meta name="viewport"[^>]*>/i, "")
  .trim();

writeFileSync(join(DIST, "artifact.html"), html);

const images = readdirSync(join(DIST, "img")).map((f) => `img/${f}`);
writeFileSync(join(DIST, "artifact-files.json"), JSON.stringify(images));
console.log(`artifact.html: ${(html.length / 1024).toFixed(0)} KB, ${images.length} imagens`);
