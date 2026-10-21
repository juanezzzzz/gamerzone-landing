// Tomas extra de la demo: login escrito, cambio de tema, selector de sede y modo sin conexión.
//   node tools/capturar-extra.mjs [salida]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");
const OUT = process.argv[2] || "capturas/extra";
const BASE = "http://localhost:5173";
mkdirSync(OUT, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});

async function sesion(tema = "dark") {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?reiniciar-demo`, { waitUntil: "networkidle0" });
  await espera(1000);
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle0" });
  await page.evaluate((t) => { localStorage.setItem("theme", t); document.documentElement.setAttribute("data-theme", t); }, tema);
  await page.reload({ waitUntil: "networkidle0" });
  return page;
}
async function entrar(page, usuario, { lento = false } = {}) {
  await page.type('input[type="text"]', usuario, { delay: lento ? 110 : 0 });
  await espera(lento ? 250 : 0);
  await page.type('input[type="password"]', "demo2026", { delay: lento ? 70 : 0 });
  await espera(lento ? 350 : 0);
  await Promise.all([page.click('button[type="submit"]'), page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {})]);
  await espera(900);
}
async function foto(page, nombre, escala = 2) {
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: escala });
  await espera(700);
  await page.screenshot({ path: join(OUT, `${nombre}.png`) });
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  console.log("captura", nombre);
}
async function clicTexto(page, texto) {
  return page.evaluate((t) => {
    const b = [...document.querySelectorAll("button, [role=option], li")].find((x) => x.textContent.trim() === t || x.textContent.trim().includes(t));
    if (b) b.click();
    return !!b;
  }, texto);
}

// 1. login escrito por el administrador → panel (grabación)
{
  const page = await sesion("dark");
  await espera(400);
  const rec = await page.screencast({ path: join(OUT, "20-login-admin.webm") });
  await espera(600);
  await entrar(page, "admin", { lento: true });
  await espera(1500);
  await rec.stop();
  console.log("grabación 20-login-admin");

  // 2. cambio de tema en el panel (grabación) + capturas en los dos temas
  await foto(page, "21-dashboard-noche");
  const rec2 = await page.screencast({ path: join(OUT, "22-cambio-tema.webm") });
  await espera(900);
  await page.click('[aria-label^="Cambiar a tema"]');
  await espera(1600);
  await page.click('[aria-label^="Cambiar a tema"]');
  await espera(1400);
  await rec2.stop();
  await page.click('[aria-label^="Cambiar a tema"]');
  await espera(800);
  await foto(page, "23-dashboard-dia");
  await page.click('[aria-label^="Cambiar a tema"]');
  await espera(500);
  console.log("grabación 22-cambio-tema");

  // 3. selector de sede abierto y la otra sede
  await page.click('[aria-label="Cambiar de sede"]');
  await espera(700);
  await foto(page, "24-sedes-abierto");
  const ok = await clicTexto(page, "Zona Gamer Norte");
  await espera(1500);
  if (ok) await foto(page, "25-dashboard-norte");
}

// 4. cada rol entra a su propio panel (capturas)
for (const [u, n] of [["cajero", "26-rol-cajero"], ["bodega", "27-rol-bodega"]]) {
  const page = await sesion("dark");
  await entrar(page, u);
  await foto(page, n);
}

// 5. sin conexión: el cajero sigue trabajando y los cambios quedan guardados en el equipo
{
  const page = await sesion("dark");
  await entrar(page, "cajero");
  await clicTexto(page, "Tarde");
  await espera(300);
  await Promise.all([clicTexto(page, "Iniciar turno"), page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {})]);
  await espera(1500);
  await page.setOfflineMode(true);
  await espera(800);
  const campos = await page.$$('input[inputmode="numeric"]');
  for (const [i, v] of [[0, "640000"], [1, "300000"]]) {
    if (!campos[i]) break;
    await campos[i].click({ clickCount: 3 });
    await campos[i].type(v, { delay: 40 });
    await espera(400);
  }
  await espera(3500);
  await foto(page, "28-sin-conexion");
  await page.setOfflineMode(false);
  await espera(1200);
  await foto(page, "29-reconectado");
}

await browser.close();
