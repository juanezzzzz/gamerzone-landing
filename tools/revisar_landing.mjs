// Capturas de revisión de la landing (celular y escritorio), bajando por la página.
//   cd landing/web && npx astro preview --port 4330
//   node tools/revisar_landing.mjs [url] [carpeta]
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const puppeteer = createRequire(import.meta.url)('puppeteer-core');

const URL = process.argv[2] || 'http://localhost:4330/';
const DIR = process.argv[3] || 'landing/revision';
mkdirSync(DIR, { recursive: true });

const VISTAS = [
  { nombre: 'movil', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { nombre: 'escritorio', width: 1440, height: 900, deviceScaleFactor: 1 },
];

const navegador = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
for (const v of VISTAS) {
  const p = await navegador.newPage();
  await p.setViewport(v);
  const errores = [];
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  p.on('pageerror', (e) => errores.push(String(e)));
  await p.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1800));
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  let k = 0;
  for (let y = 0; y < alto; y += Math.round(v.height * 0.9)) {
    await p.evaluate((y) => window.scrollTo(0, y), y);
    await new Promise((r) => setTimeout(r, 1300));
    await p.screenshot({ path: `${DIR}/${v.nombre}-${String(k++).padStart(2, '0')}.png` });
  }
  console.log(v.nombre, 'alto', alto, 'capturas', k, 'ancho desborda:', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'errores:', errores);
  await p.close();
}
await navegador.close();
