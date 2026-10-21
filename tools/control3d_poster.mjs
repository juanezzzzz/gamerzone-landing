// Imágenes del control 3D, renderizadas por la propia página (?poster=<0..1>) con fondo transparente:
//   control-3d-inicio.webp: de escorzo y apagado, la pose inicial; se ve mientras carga el 3D.
//   control-3d.webp: de frente y encendido; sin WebGL o con movimiento reducido.
//   control-seq/00..23.webp: la secuencia que recorre el scroll en celular (efectos/secuencia.ts).
//   cd landing/web && npx astro preview --port 4332
//   node tools/control3d_poster.mjs [url]
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const puppeteer = createRequire(import.meta.url)('puppeteer-core');
const base = process.argv[2] || 'http://localhost:4332/';
const FOTOGRAMAS = 24; // igual que en efectos/secuencia.ts
const media = (archivo) => fileURLToPath(new URL(`../landing/web/public/media/${archivo}`, import.meta.url));
mkdirSync(media('control-seq'), { recursive: true });

const nav = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

async function pintar(p, viewport, destino) {
  const pagina = await nav.newPage();
  await pagina.setViewport(viewport);
  await pagina.goto(`${base}?poster=${p}`, { waitUntil: 'networkidle0' });
  await pagina.waitForFunction(() => window.__poster, { timeout: 30000 });
  const datos = await pagina.evaluate(() => window.__poster);
  writeFileSync(destino, Buffer.from(datos.split(',')[1], 'base64'));
  await pagina.close();
}

// Escritorio: el panel mide ~560 px; a densidad 2, ~1100 px
const escritorio = { width: 1440, height: 900, deviceScaleFactor: 2 };
await pintar(0, escritorio, media('control-3d-inicio.webp'));
await pintar(1, escritorio, media('control-3d.webp'));

// Celular: el panel mide ~358 px y es 16:10; a densidad 2, ~716 px. Se renderiza en un viewport de celular
// para que los fotogramas tengan la misma proporción y encuadre que el panel.
const celular = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
for (let i = 0; i < FOTOGRAMAS; i++) {
  await pintar((i / (FOTOGRAMAS - 1)).toFixed(4), celular, media(`control-seq/${String(i).padStart(2, '0')}.webp`));
  process.stdout.write('.');
}
console.log('\nlisto');
await nav.close();
