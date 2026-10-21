"""Pruebas de extremo a extremo de la landing (Playwright + el Chrome del sistema).

Uso, desde la carpeta tools/ (levanta y apaga el servidor solo):
  .venv\\Scripts\\python con_servidor.py --servidor "npx astro preview --port 4340" --puerto 4340 ^
    --carpeta ..\\landing\\web -- .venv\\Scripts\\python pruebas_landing.py http://localhost:4340/

O contra un servidor ya abierto:  .venv\\Scripts\\python pruebas_landing.py http://localhost:4332/
Sale con código 1 si falla alguna prueba.
"""
import re
import sys

from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4332/"
ESCRITORIO = {"width": 1440, "height": 900}
CELULAR = {"width": 390, "height": 844}
resultados: list[tuple[str, bool, str]] = []


def prueba(nombre: str, ok: bool, detalle: str = "") -> None:
    resultados.append((nombre, ok, detalle))


def abrir(navegador, viewport, **extra):
    pagina = navegador.new_page(viewport=viewport, **extra)
    errores: list[str] = []
    pagina.on("pageerror", lambda e: errores.append(str(e)))
    pagina.on("console", lambda m: errores.append(m.text) if m.type == "error" else None)
    pagina.goto(URL)
    pagina.wait_for_load_state("networkidle")
    pagina.wait_for_timeout(1500)  # los efectos que se cargan cuando el navegador queda libre
    return pagina, errores


def desborda(pagina) -> bool:
    return pagina.evaluate("document.documentElement.scrollWidth > innerWidth")


def recortados(pagina) -> list[str]:
    """Títulos, botones y párrafos que se salen de la pantalla aunque la página no se ensanche
    (un contenedor con overflow: hidden los corta en silencio)."""
    return pagina.evaluate("""[...document.querySelectorAll('h1, h2, h3, .boton, main p')]
        .filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > innerWidth + 1 || r.left < -1); })
        .map(e => (e.innerText || '').trim().slice(0, 40))""")


def bajar_a(pagina, selector: str, desplazamiento: int = 0):
    y = pagina.evaluate(f"document.querySelector('{selector}').getBoundingClientRect().top + scrollY")
    pagina.evaluate(f"scrollTo(0, {int(y) + desplazamiento})")
    pagina.wait_for_timeout(1300)


with sync_playwright() as p:
    navegador = p.chromium.launch(
        channel="chrome", headless=True,
        args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"],
    )

    # ---------- Escritorio ----------
    pagina, errores = abrir(navegador, ESCRITORIO)
    prueba("escritorio: sin errores de consola", not errores, "; ".join(errores[:3]))
    prueba("escritorio: sin scroll horizontal", not desborda(pagina))
    fuera = recortados(pagina)
    prueba("escritorio: ningún texto ni botón se sale de la pantalla", not fuera, "; ".join(fuera[:4]))

    estado = pagina.inner_text("#estado-texto")
    prueba("cabecera: estado del horario calculado", bool(re.match(r"^(Abierto, cierra en|Cerrado)", estado)), estado)

    prueba("inicio: escena del scroll activa", pagina.evaluate("document.querySelector('.inicio').classList.contains('escena')"))
    prueba("cabecera: oscura sobre la sala al cargar", not pagina.evaluate("document.querySelector('.cabecera').classList.contains('clara')"))

    cifras = pagina.evaluate("[...document.querySelectorAll('.inicio .cifra dd')].map(e => e.textContent.trim())")
    prueba("inicio: cifras del local", cifras == ["4", "16+", "7"], str(cifras))

    # Cada estación, paquete y plan abre WhatsApp con un mensaje distinto
    mensajes = pagina.evaluate("""[...document.querySelectorAll('.estacion-cta, .paquete-boton, a.plan')]
        .map(a => new URL(a.href).searchParams.get('text'))""")
    prueba("whatsapp: un mensaje propio por estación, paquete y plan",
           len(mensajes) == 9 and len(set(mensajes)) == 9 and all(mensajes), f"{len(mensajes)} enlaces, {len(set(mensajes))} distintos")

    bajar_a(pagina, "#estaciones", 100)
    prueba("cabecera: clara al llegar a la información", pagina.evaluate("document.querySelector('.cabecera').classList.contains('clara')"))
    prueba("recorrido: activo en escritorio", pagina.evaluate("document.getElementById('estaciones').classList.contains('recorrido-activo')"))
    prueba("recorrido: pantalla WebGL", pagina.evaluate("document.querySelector('.escenario').classList.contains('con-gl')"))

    bajar_a(pagina, "#futbol", -270)
    num = pagina.inner_text(".escenario-num").strip()
    prueba("recorrido: el número de puesto sigue a la estación", num == "03", f"muestra «{num}»")
    llenas = pagina.evaluate("document.querySelectorAll('.escenario-progreso li.lleno').length")
    prueba("recorrido: progreso en la tercera estación", llenas == 3, f"{llenas} barras llenas")
    anillo = pagina.evaluate("[...document.querySelectorAll('.mando-anillo')].findIndex(a => a.classList.contains('activo'))")
    prueba("recorrido: en el control se enciende el botón de la estación", anillo == 2, f"botón encendido: {anillo}")

    titulos_ocultos = pagina.evaluate("""[...document.querySelectorAll('.seccion .titulo')]
        .filter(h => { const r = h.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })
        .filter(h => getComputedStyle(h).visibility === 'hidden').length""")
    prueba("títulos: visibles en pantalla", titulos_ocultos == 0)

    sin_nombre = pagina.evaluate("""[...document.querySelectorAll('a, button')].filter(e => {
        const visible = e.getClientRects().length > 0;
        const nombre = (e.getAttribute('aria-label') || e.innerText || '').trim();
        return visible && !nombre; }).map(e => e.outerHTML.slice(0, 80))""")
    prueba("accesibilidad: enlaces y botones con nombre", not sin_nombre, "; ".join(sin_nombre))

    prueba("meta: imagen para compartir", pagina.evaluate("!!document.querySelector('meta[property=\"og:image\"][content$=\"/media/og.jpg\"]')"))
    noindex = pagina.evaluate("!!document.querySelector('meta[name=robots][content=noindex]')")
    ficha = pagina.evaluate("!!document.querySelector('script[type=\"application/ld+json\"]')")
    prueba("meta: borrador con noindex y sin ficha, o publicado con ficha y sin noindex", noindex != ficha)
    prueba("datos de referencia sin marcas visuales", pagina.locator(".pendiente, .aviso-revision").count() == 0)

    prueba("pasos: tres, en orden", pagina.locator("#como-funciona .paso").count() == 3)
    bajar_a(pagina, ".galeria", -200)
    pagina.wait_for_timeout(1500)
    fotos = pagina.evaluate("[...document.querySelectorAll('.galeria img')].map(i => i.complete && i.naturalWidth > 0)")
    prueba("galería: las seis fotos cargan", len(fotos) == 6 and all(fotos), str(fotos))

    fuentes = pagina.evaluate("[...document.querySelectorAll('#lugar video source')].map(s => s.type.split(';')[0])")
    prueba("reel: AV1 primero y H.264 de respaldo", fuentes == ["video/webm", "video/mp4"], str(fuentes))
    pagina.close()

    # ---------- Celular ----------
    pagina, errores = abrir(navegador, CELULAR, is_mobile=True, has_touch=True)
    prueba("celular: sin errores de consola", not errores, "; ".join(errores[:3]))
    prueba("celular: sin scroll horizontal", not desborda(pagina))
    prueba("celular: barra de contacto visible", pagina.is_visible(".barra-movil"))
    prueba("celular: título del inicio visible al cargar", pagina.evaluate("getComputedStyle(document.querySelector('.inicio-titulo .palabra')).opacity") == "1")
    fuera = recortados(pagina)
    prueba("celular: ningún texto ni botón se sale de la pantalla", not fuera, "; ".join(fuera[:4]))
    bajar_a(pagina, "#estaciones")
    prueba("celular: estaciones como tarjetas (sin recorrido)", not pagina.evaluate("document.getElementById('estaciones').classList.contains('recorrido-activo')"))
    prueba("celular: las cuatro estaciones visibles", pagina.locator(".estaciones .estacion").count() == 4)
    pagina.close()

    # ---------- Movimiento reducido ----------
    pagina, errores = abrir(navegador, ESCRITORIO, reduced_motion="reduce")
    prueba("movimiento reducido: sin errores", not errores, "; ".join(errores[:3]))
    prueba("movimiento reducido: sin escena del scroll", not pagina.evaluate("document.querySelector('.inicio').classList.contains('escena')"))
    titulo_visible = pagina.evaluate("getComputedStyle(document.querySelector('.inicio-titulo .palabra')).opacity") == "1"
    prueba("movimiento reducido: el título del inicio se ve de entrada", titulo_visible)
    pagina.close()

    navegador.close()

ancho = max(len(n) for n, _, _ in resultados)
for nombre, ok, detalle in resultados:
    print(f"{'OK  ' if ok else 'FALLA'} {nombre.ljust(ancho)} {'' if ok else detalle}")
fallas = sum(1 for _, ok, _ in resultados if not ok)
print(f"\n{len(resultados) - fallas}/{len(resultados)} pruebas pasan")
sys.exit(1 if fallas else 0)
