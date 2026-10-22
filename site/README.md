# Villa Aracoara — landing page

Protótipo da landing page da pousada (Praia do Preá, CE). Vite + React + TypeScript, Tailwind v4,
Motion (animações e scroll) e Lenis (rolagem suave). As fotos originais ficam em `../assets`.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run images` | regenera `public/img` (WebP 640/1280/1920) e `src/data/images.json` a partir de `../assets` |
| `npm run build` | build de produção em `dist/` |
| `npm start` | serve o build em http://127.0.0.1:5190 |
| `npm run build:artifact` | build + `dist/artifact.html` (CSS/JS embutidos) para publicar como Artifact no claude.ai |

## Onde está o quê

- `src/components/Hero.tsx` — entrada cinematográfica (máscara, zoom-out, título por linhas, seletor rápido)
- `src/components/Suites.tsx` + `Lightbox.tsx` — bento das suítes e galeria acessível
- `src/components/SunsetWindow.tsx` — sequência presa à rolagem (venezianas da Suíte Céu)
- `src/components/Arredores.tsx` — trilha horizontal presa no desktop, swipe no celular
- `src/components/Reserva.tsx` — simulador de reserva em etapas (demonstrativo: não envia nada)
- `src/data/content.ts` — textos, suítes e fotos

Com `prefers-reduced-motion`, a rolagem suave, o parallax e as sequências presas à rolagem são desligados.
