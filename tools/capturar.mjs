// Recorre la demo de Zona Gamer (datos ficticios) y guarda capturas de cada pantalla.
//   node tools/capturar.mjs [salida] [--tema dark|light] [--ancho 1440] [--alto 900]
// Requiere la demo corriendo en http://localhost:5173 (npx vite en la carpeta ZONA GAMER).
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i > 0 ? process.argv[i + 1] : d;
};
const OUT = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "capturas";
const TEMA = arg("tema", "dark");
const W = +arg("ancho", 1440);
const H = +arg("alto", 900);
const BASE = "http://localhost:5173";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  defaultViewport: { width: W, height: H, deviceScaleFactor: 2 },
});
let page = await browser.newPage();
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function tema() {
  await page.evaluate((t) => {
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }, TEMA);
}
async function foto(nombre) {
  await espera(1200);
  await page.screenshot({ path: join(OUT, `${nombre}.png`) });
  console.log("captura", nombre);
}
async function entrar(usuario) {
  // sesión limpia por rol: la demo siembra los mismos datos en cada contexto
  const ctx = await browser.createBrowserContext();
  page = await ctx.newPage();
  await page.goto(`${BASE}/?reiniciar-demo`, { waitUntil: "networkidle0" });
  await espera(1200);
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle0" });
  await tema();
  await page.reload({ waitUntil: "networkidle0" });
  await page.type('input[type="text"]', usuario);
  await page.type('input[type="password"]', "demo2026");
  await Promise.all([page.click('button[type="submit"]'), page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {})]);
  await espera(800);
}
async function salir() {
  await page.evaluate(() => {
    for (const k of Object.keys(localStorage)) if (/session|auth/i.test(k)) localStorage.removeItem(k);
  });
}

// estado inicial reproducible
await page.goto(`${BASE}/?reiniciar-demo`, { waitUntil: "networkidle0" });
await espera(1500);
await page.goto(`${BASE}/login`, { waitUntil: "networkidle0" });
await tema();
await page.reload({ waitUntil: "networkidle0" });
await foto("01-login");

// administrador
await entrar("admin");
const rutasAdmin = [
  ["02-dashboard", "/admin"],
  ["03-turnos", "/admin/turnos"],
  ["04-cuentas-nomina", "/admin/cuentas"],
  ["05-bodega", "/admin/bodega"],
  ["06-deudas-clientes", "/admin/deudas-clientes"],
  ["07-gastos-local", "/admin/gastos-local"],
  ["08-bonificacion", "/admin/bonificacion"],
  ["09-trabajadores", "/admin/trabajadores"],
  ["10-prestamos", "/admin/prestamos"],
  ["11-usuarios", "/admin/usuarios"],
  ["12-config-turno", "/admin/config-turno"],
];
for (const [n, r] of rutasAdmin) {
  await page.goto(BASE + r, { waitUntil: "networkidle0" });
  await foto(n);
}
// detalle de un turno: primer enlace de la lista
await page.goto(BASE + "/admin/turnos", { waitUntil: "networkidle0" });
await espera(800);
const enlace = await page.$('a[href^="/admin/turno/"]');
if (enlace) {
  await Promise.all([enlace.click(), page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {})]);
  await foto("13-turno-detalle");
}

// cajero
await entrar("cajero");
await foto("14-cajero-bienvenida");
await page.goto(BASE + "/ver-turnos", { waitUntil: "networkidle0" });
await foto("15-cajero-ver-turnos");

// bodeguero
await entrar("bodega");
await foto("16-bodeguero-inventario");

await browser.close();
