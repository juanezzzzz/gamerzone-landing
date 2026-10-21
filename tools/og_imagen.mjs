// Imagen para compartir (Open Graph, 1200×630): el letrero de neón, el título y el logo, como el inicio de la landing.
// Es lo que se ve al pegar el enlace en WhatsApp, Instagram o Facebook.
//   node tools/og_imagen.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const puppeteer = createRequire(import.meta.url)('puppeteer-core');
const raiz = new URL('../landing/', import.meta.url);
// En línea, cada neón necesita su propio id de filtro: con dos «halo» el segundo usaría la zona del primero.
const neon = (n) => readFileSync(new URL(`recursos/neon/${n}.svg`, raiz), 'utf8')
  .replace(/ width="\d+" height="\d+"/, '')
  .replaceAll('id="halo"', `id="halo-${n}"`).replaceAll('url(#halo)', `url(#halo-${n})`);
const fuente = new URL('web/node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2', raiz).href;
// El control 3D encendido (lo genera tools/control3d_poster.mjs)
const control3d = 'data:image/webp;base64,' + readFileSync(new URL('web/public/media/control-3d.webp', raiz)).toString('base64');
const logo = 'data:image/png;base64,' + readFileSync(new URL('recursos/imagenes/logo/logo-gamerzone.png', raiz)).toString('base64');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Archivo; src: url("${fuente}") format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; font-family: Archivo, sans-serif; color: #edeff5;
    background: radial-gradient(700px 480px at 78% 46%, rgba(82,242,242,.13), transparent 70%), #07090f; }
  .marco { position: absolute; inset: 0; display: grid; grid-template-columns: 1.05fr .95fr; align-items: center; gap: 40px; padding: 0 72px; }
  .marca { display: flex; align-items: center; gap: 16px; font-weight: 800; font-stretch: 125%; font-size: 26px; text-transform: uppercase; letter-spacing: .01em; }
  .marca img { width: 64px; height: 64px; }
  h1 { margin-top: 34px; font-weight: 850; font-stretch: 125%; font-size: 92px; line-height: .9; letter-spacing: -.035em; text-transform: uppercase; }
  p { margin-top: 26px; font-size: 27px; font-stretch: 106%; line-height: 1.4; color: rgba(237,239,245,.78); max-width: 24ch; }
  .letrero { position: relative; aspect-ratio: 5/4; border-radius: 22px; display: grid; grid-template-rows: auto 1fr; justify-items: center; align-items: center; padding: 9% 8% 7%;
    border: 1px solid rgba(237,239,245,.1); box-shadow: inset 0 0 80px rgba(0,0,0,.75), 0 30px 80px -30px rgba(82,242,242,.45);
    background: repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 1px, transparent 1px 13px), repeating-linear-gradient(-45deg, rgba(255,255,255,.05) 0 1px, transparent 1px 13px), #090c14; }
  .control { position: relative; display: grid; place-items: center; }
  .control::before { content: ''; position: absolute; inset: 10% 5%; background: radial-gradient(50% 50% at 50% 50%, rgba(82,242,242,.22), transparent 70%); filter: blur(30px); }
  .control img { position: relative; width: 112%; max-width: none; }
</style></head><body><div class="marco">
  <div><div class="marca"><img src="${logo}" alt="">GamerZone</div>
    <h1>¿Listo para jugar?</h1>
    <p>PC gamer, consolas, fútbol en pantalla grande y salas para el parche.</p></div>
  <div class="control"><img src="${control3d}" alt=""></div>
</div></body></html>`;

const destino = new URL('web/public/media/og.jpg', raiz);
mkdirSync(fileURLToPath(new URL('.', destino)), { recursive: true });
const nav = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] });
const p = await nav.newPage();
await p.setViewport({ width: 1200, height: 630 });
// Desde un archivo (no setContent): una página about:blank no puede leer la fuente local.
const temporal = join(tmpdir(), 'og-gamerzone.html');
writeFileSync(temporal, html);
await p.goto(pathToFileURL(temporal).href, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: fileURLToPath(destino), type: 'jpeg', quality: 88 });
await nav.close();
console.log('web/public/media/og.jpg');
