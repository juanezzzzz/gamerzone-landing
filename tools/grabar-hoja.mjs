// Abre un turno como cajero en la demo y graba el llenado de la hoja (el cuadre se mueve en vivo).
//   node tools/grabar-hoja.mjs [salida]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");
const OUT = process.argv[2] || "capturas/dark";
const BASE = "http://localhost:5173";
mkdirSync(OUT, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
await page.goto(`${BASE}/?reiniciar-demo`, { waitUntil: "networkidle0" });
await espera(1200);
await page.goto(`${BASE}/login`, { waitUntil: "networkidle0" });
await page.evaluate(() => { localStorage.setItem("theme", "dark"); document.documentElement.setAttribute("data-theme", "dark"); });
await page.reload({ waitUntil: "networkidle0" });
await page.type('input[type="text"]', "cajero");
await page.type('input[type="password"]', "demo2026");
await Promise.all([page.click('button[type="submit"]'), page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {})]);
await espera(800);

async function clicTexto(texto) {
  const ok = await page.evaluate((t) => {
    const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim().includes(t));
    if (b) b.click();
    return !!b;
  }, texto);
  if (!ok) throw new Error("no encontré el botón " + texto);
}
await clicTexto("Tarde");
await espera(400);
await Promise.all([clicTexto("Iniciar turno"), page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {})]);
await espera(1500);
await page.screenshot({ path: join(OUT, "17-hoja-turno.png") });
console.log("captura 17-hoja-turno", page.url());

// grabación a 1440x900 (sin escala) del llenado
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await espera(500);
const rec = await page.screencast({ path: join(OUT, "17-hoja-turno.webm") });
await espera(800);
const campos = await page.$$('input[inputmode="numeric"]');
const valores = ["850000", "420000", "185000", "35000"];
for (let i = 0; i < Math.min(campos.length, valores.length); i++) {
  await campos[i].scrollIntoView();
  await espera(300);
  await campos[i].click({ clickCount: 3 });
  await campos[i].type(valores[i], { delay: 90 });
  await espera(700);
}
await espera(1000);
await rec.stop();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await espera(600);
await page.screenshot({ path: join(OUT, "18-hoja-turno-llena.png") });
console.log("grabación 17-hoja-turno.webm · campos numéricos:", campos.length);
await browser.close();
