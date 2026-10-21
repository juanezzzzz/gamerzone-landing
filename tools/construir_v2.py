# -*- coding: utf-8 -*-
"""Versión 2 del video de Zyvo con el caso GamerZone: qué se ofrece y cómo se construye.

    python tools/construir_v2.py      # escribe video-v2-16x9/ y video-v2-9x16/

Diferencias con la v1 (tools/construir.py): menos recorrido de pantallas y más
capacidades — login por usuario y rol, modo noche/día, varias sedes, módulos, celular,
funcionamiento sin internet y el proceso de desarrollo de Zyvo (de su sitio web).

Las pantallas son de la DEMO de la app (datos ficticios). Lo que se afirma está en el
código de la app (rutas, roles, tema, sedes, offlineDb/syncService, pruebas) o en el
sitio de Zyvo (proceso de 4 fases, «el código es tuyo», «pruebas desde el inicio»).
"""
import html
import io
import json
import os
import shutil

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RAIZ)
PIN = "hyperframes@0.8.104"
SW, SH = 1440, 900
P = "assets/pantallas/"

# (tipo, inicio, fin, datos del visual, kicker, titular, acento, apoyo)
ESCENAS = [
    ("hook", 0, 3.5, {}, "", "¿Tu negocio necesita", "su propio sistema?", ""),
    ("pantalla", 3.5, 7.5, {"img": "01-login.png", "foco": (470, 140, 500, 620)},
     "Caso real", "GamerZone", "E-Sports Center", "Un sistema hecho a la medida de su operación."),
    ("login", 7.5, 13.5, {"rec": "20-login-admin.mp4", "foco": (500, 200, 440, 520)},
     "Acceso", "Cada persona", "con su usuario", "Administración, caja y bodega ven solo lo suyo."),
    ("tema", 13.5, 18.5, {"a": "21-dashboard-noche.png", "b": "23-dashboard-dia.png"},
     "Interfaz", "Modo noche", "y modo día", "Cada usuario elige cómo trabajar."),
    ("sedes", 18.5, 23, {"a": "24-sedes-abierto.png", "b": "25-dashboard-norte.png"},
     "Multisede", "Varias sedes,", "un solo sistema", "Cada sede con sus propias cuentas."),
    ("pantalla", 23, 30, {"rec": "17-hoja-turno.mp4", "foco": (715, 300, 505, 315)},
     "Caja", "El cajero registra.", "El sistema cuadra.", ""),
    ("mosaico", 30, 36, {}, "Módulos", "Todo el negocio", "en un lugar", ""),
    ("movil", 36, 40.5, {}, "Responsive", "También", "desde el celular", "La misma app en computador, tablet y teléfono."),
    ("offline", 40.5, 45, {}, "Sin internet", "Si se cae la red,", "se sigue trabajando", "Los cambios se guardan en el equipo y se sincronizan al volver."),
    ("proceso", 45, 54, {}, "Así lo construimos", "De la idea", "al sistema", ""),
]
CIERRE = (54, 60)
DUR = 60

ESCENAS_SOCIAL = [
    ("hook", 0, 2.5, {}, "", "¿Todavía cuadras la caja", "en un cuaderno?", ""),
    ("login", 2.5, 6, {"rec": "20-login-admin.mp4", "foco": (500, 200, 440, 520), "fase": 2.3},
     "Caso real · GamerZone", "Cada persona", "con su usuario", ""),
    ("tema", 6, 8.5, {"a": "21-dashboard-noche.png", "b": "23-dashboard-dia.png", "wipe": 0.6},
     "Interfaz", "Modo noche", "y modo día", ""),
    ("sedes", 8.5, 11, {"a": "24-sedes-abierto.png", "b": "25-dashboard-norte.png", "mid": 1.2},
     "Multisede", "Varias sedes,", "un solo sistema", ""),
    ("pantalla", 11, 16, {"rec": "17-hoja-turno.mp4", "foco": (715, 300, 505, 315)},
     "Caja", "Registra y", "el sistema cuadra", ""),
    ("mosaico", 16, 19, {}, "Módulos", "Todo el negocio", "en un lugar", ""),
    ("movil", 19, 22, {}, "Responsive", "También", "desde el celular", ""),
    ("offline", 22, 24.5, {"est": 0.5}, "Sin internet", "Sin red,", "sigue funcionando", ""),
    ("proceso", 24.5, 28, {"paso": 0.45}, "Así lo construimos", "De la idea", "al sistema", ""),
]
CIERRE_SOCIAL = (28, 31.5)
DUR_SOCIAL = 31.5

MODULOS = [  # (archivo, etiqueta)
    ("02-dashboard.png", "Panel financiero"), ("03-turnos.png", "Turnos y cuadre"),
    ("05-bodega.png", "Bodega e inventario"), ("04-cuentas-nomina.png", "Nómina y préstamos"),
    ("06-deudas-clientes.png", "Deudas de clientes"), ("08-bonificacion.png", "Bonificaciones"),
]
ROLES = [("21-dashboard-noche.png", "Administrador"), ("26-rol-cajero.png", "Cajero"), ("27-rol-bodega.png", "Bodega")]
MOVIL = ["movil/02-dashboard.png", "movil/14-cajero-bienvenida.png", "movil/05-bodega.png"]
PASOS = [  # sitio de Zyvo, «Cómo trabajamos»
    ("01", "Diagnóstico", "Reunión, requisitos y alcance por escrito"),
    ("02", "Diseño", "Prototipo navegable y arquitectura"),
    ("03", "Desarrollo", "Entregas parciales para probar y ajustar"),
    ("04", "Entrega", "Despliegue, capacitación y documentación"),
]
SELLOS = ["El código es tuyo", "Pruebas desde el inicio"]

FORMATOS = {
    "16x9": dict(w=1920, h=1080, va=(660, 175, 1180, 737.5), tx=110, ty=None, tw=500,
                 hl=92, kicker=24, body=30, hook=128, chip=24, name=150, sub=44, pitch=42, top=56, pad=110),
    # TikTok / Reels: nada importante debajo de y=1500 (texto de la publicación) ni en la franja derecha (botones)
    "social": dict(w=1080, h=1920, va=(60, 690, 900, 780), tx=70, ty=250, tw=860,
                   hl=112, kicker=30, body=38, hook=132, chip=28, name=140, sub=40, pitch=46, top=120, pad=70),
    "9x16": dict(w=1080, h=1920, va=(40, 290, 1000, 860), tx=70, ty=1250, tw=940,
                 hl=112, kicker=28, body=36, hook=118, chip=28, name=150, sub=44, pitch=40, top=150, pad=70),
}


def r(x):
    return ("%.3f" % x).rstrip("0").rstrip(".")


def esc(s):
    return html.escape(str(s), quote=False)


def camara(foco, cw, ch):
    k = max(cw / SW, ch / SH)
    if not foco:
        return k, (cw - SW * k) / 2, (ch - SH * k) / 2
    fx, fy, fw, fh = foco
    s = max(k, min(min(cw / fw, ch / fh) * 0.92, k * 2.6))
    x = min(0, max(cw - SW * s, cw / 2 - (fx + fw / 2) * s))
    y = min(0, max(ch - SH * s, ch / 2 - (fy + fh / 2) * s))
    return s, x, y


CSS = """
      @font-face { font-family: "Archivo"; src: url("assets/fonts/archivo-var-latin.woff2") format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }
      @font-face { font-family: "JetBrains Mono"; src: url("assets/fonts/jetbrainsmono-var-latin.woff2") format("woff2"); font-weight: 400 700; }
      :root { --noche:#0e1218; --acero:#1b212b; --azul:#4766f5; --azul-luz:#7b93ff; --marfil:#f5f4ef; --niebla:#8a93a3; --senal:#2bd67b; --ambar:#f5b544; }
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { margin:0; width:100%; height:100%; overflow:hidden; background:var(--noche); }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--noche); color:var(--marfil); font-family:"Archivo", sans-serif; }
      #hexgrid { position:absolute; inset:0; opacity:0.08; }
      #hexgrid svg { width:100%; height:100%; display:block; }
      #glow { position:absolute; width:1100px; height:1100px; right:-380px; top:-300px; border-radius:50%;
        background: radial-gradient(circle, rgba(71,102,245,0.22) 0%, rgba(71,102,245,0) 65%); }
      #header { position:absolute; left:{pad}px; right:{pad}px; top:{top}px; display:flex; justify-content:space-between; align-items:center; }
      .lockup-h { display:flex; align-items:center; gap:14px; }
      .lockup-h svg { width:54px; height:54px; display:block; }
      .wm { display:grid; gap:6px; line-height:1; }
      .wm-name { font-weight:750; font-stretch:125%; letter-spacing:0.06em; font-size:28px; }
      .wm-sub { font-weight:400; font-stretch:125%; letter-spacing:0.62em; font-size:9px; }
      .case { font-family:"JetBrains Mono", monospace; font-size:{kicker}px; color:var(--niebla); letter-spacing:0.1em; }

      .va { position:absolute; left:{vx}px; top:{vy}px; width:{vw}px; height:{vh}px; }
      .win { position:absolute; border-radius:16px; overflow:hidden; background:var(--acero); border:2px solid rgba(245,244,239,0.12);
        box-shadow:0 36px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(71,102,245,0.15); }
      .win .bar { height:34px; display:flex; align-items:center; gap:8px; padding:0 16px; background:#151a22; border-bottom:1px solid rgba(245,244,239,0.08); }
      .win .bar i { display:block; width:11px; height:11px; border-radius:50%; background:#2a3240; }
      .win .bar span { margin-left:12px; font-family:"JetBrains Mono", monospace; font-size:15px; color:var(--niebla); }
      .vp { position:relative; overflow:hidden; background:#0b0b0c; }
      .pan { position:absolute; left:0; top:0; width:1440px; height:900px; transform-origin:0 0; }
      .pan img, .pan video { position:absolute; left:0; top:0; width:1440px; height:900px; display:block; }
      .demo { position:absolute; right:12px; bottom:10px; font-family:"JetBrains Mono", monospace; font-size:13px; color:rgba(245,244,239,0.9);
        background:rgba(14,18,24,0.88); padding:4px 8px; border-radius:5px; }
      .tag { position:absolute; left:16px; top:16px; font-family:"JetBrains Mono", monospace; font-weight:700; font-size:{chip}px; color:var(--marfil);
        background:var(--azul); padding:8px 16px; border-radius:999px; }

      .txt { position:absolute; left:{tx}px; width:{tw}px; {tpos} }
      .txt .el, .hook .el { opacity:0; }
      .kicker { font-family:"JetBrains Mono", monospace; font-weight:700; font-size:{kicker}px; letter-spacing:0.14em; text-transform:uppercase; color:var(--azul-luz); margin-bottom:18px; }
      .hl, .it { font-weight:820; font-stretch:66%; text-transform:uppercase; font-size:{hl}px; line-height:1.04; text-wrap:balance; }
      .hl { color:var(--marfil); } .it { color:var(--azul-luz); }
      .body { margin-top:22px; font-size:{body}px; line-height:1.4; color:var(--niebla); text-wrap:pretty; }
      .hook { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 {pad}px; }
      .hook .hl, .hook .it { font-size:{hook}px; max-width:1500px; }

      .mod { position:absolute; border-radius:14px; overflow:hidden; background:var(--acero); border:2px solid rgba(245,244,239,0.12); opacity:0; }
      .mod img { position:absolute; display:block; }
      .mod b { position:absolute; left:0; right:0; bottom:0; padding:14px 16px 12px; font-family:"JetBrains Mono", monospace; font-weight:700; font-size:{chip}px;
        color:var(--marfil); background:linear-gradient(to top, rgba(14,18,24,0.96) 40%, rgba(14,18,24,0)); }
      .phone { position:absolute; border-radius:42px; overflow:hidden; background:#000; border:10px solid #2a3240; box-shadow:0 30px 70px rgba(0,0,0,0.6); opacity:0; }
      .phone img { display:block; width:100%; height:100%; object-fit:cover; object-position:top; }

      .off { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:34px; }
      .off svg { width:{ico}px; height:{ico}px; }
      .estado { display:flex; align-items:center; gap:16px; padding:16px 28px; border-radius:999px; background:var(--acero); border:2px solid rgba(245,244,239,0.14);
        font-family:"JetBrains Mono", monospace; font-size:{chip}px; color:var(--marfil); opacity:0; }
      .estado i { display:block; width:16px; height:16px; border-radius:50%; }

      .pasos { position:absolute; inset:0; display:grid; {pgrid} }
      .paso { position:relative; border-radius:16px; background:var(--acero); border:2px solid rgba(245,244,239,0.12); padding:24px 22px 20px; opacity:0; min-width:0; }
      .paso .n { font-family:"JetBrains Mono", monospace; font-weight:700; font-size:{kicker}px; color:var(--azul-luz); }
      .paso h4 { margin-top:12px; font-weight:820; font-stretch:66%; text-transform:uppercase; font-size:{ph}px; line-height:1.05; }
      .paso p { margin-top:10px; font-size:{body}px; line-height:1.35; color:var(--niebla); }
      .paso .barra { position:absolute; left:0; top:0; height:6px; width:100%; background:var(--azul); transform-origin:left center; }
      .sellos { position:absolute; left:0; right:0; bottom:-84px; flex-wrap:wrap; display:flex; gap:16px; }
      .sello { padding:12px 22px; border-radius:999px; border:2px solid rgba(123,147,255,0.5); font-family:"JetBrains Mono", monospace; font-size:{chip}px; color:var(--marfil); opacity:0; }

      .band-mover { position:absolute; top:-10%; left:0; width:520px; height:120%;
        -webkit-mask-image: linear-gradient(to bottom, transparent 0, transparent 260px, #000 420px); mask-image: linear-gradient(to bottom, transparent 0, transparent 260px, #000 420px); }
      .band-shape { width:100%; height:100%; background:var(--azul); transform:skewX(-39deg); }
      .seam { position:absolute; top:-10%; width:60px; height:120%; background:var(--azul); transform:skewX(-12deg); opacity:0; }

      #cierre { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:40px; text-align:center; padding:0 {pad}px; }
      #cierre .el { opacity:0; }
      .lockup-v { display:flex; flex-direction:column; align-items:center; gap:34px; }
      .lockup-v svg { width:230px; height:230px; display:block; }
      .lockup-v .wm { justify-items:center; gap:20px; }
      .lockup-v .wm-name { font-size:{name}px; margin-right:-0.06em; }
      .lockup-v .wm-sub { font-size:{sub}px; margin-right:-0.62em; }
      .pitch { font-weight:700; font-size:{pitch}px; color:var(--marfil); text-wrap:balance; max-width:1100px; }
      .tagline { font-family:"JetBrains Mono", monospace; font-size:{kicker}px; color:var(--azul-luz); letter-spacing:0.04em; }
      .lugar { font-family:"JetBrains Mono", monospace; font-size:{kicker}px; color:var(--niebla); letter-spacing:0.12em; text-transform:uppercase; }
"""

ISO = """      <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
        <clipPath id="zclip"><polygon points="100,4 183,52 183,148 100,196 17,148 17,52" /></clipPath>
        <symbol id="iso" viewBox="0 0 200 200"><g transform="translate(100 100) scale(.94) translate(-100 -100)">
          <path fill="#F5F4EF" stroke="#F5F4EF" stroke-width="8" stroke-linejoin="round" d="M22.06 88V55L100 10L177.94 55V88L100 46ZM177.94 112V145L100 190L22.06 145V112L100 154Z" />
          <path clip-path="url(#zclip)" fill="#4766F5" d="M10 102L64 79C80 72 88 93 100 100C112 93 125 76 149.4 69.6L190 52V106L136.1 122C120 128 112 107 100 100C88 107 75 124 50.6 130.4L10 147Z" />
        </g></symbol></defs></svg>
      <div id="hexgrid"><svg viewBox="0 0 1920 1920" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
        <pattern id="hx" width="120" height="207.84" patternUnits="userSpaceOnUse"><path d="M40 0h40l20 34.64-20 34.64H40L20 34.64zM-20 103.92h40l20 34.64-20 34.64h-40l-20-34.64zM100 103.92h40l20 34.64-20 34.64h-40l-20-34.64z" fill="none" stroke="#8A93A3" stroke-width="2" /></pattern>
      </defs><rect width="1920" height="1920" fill="url(#hx)" /></svg></div>
      <div id="glow"></div>"""

WIFI_OFF = """<svg viewBox="0 0 24 24" fill="none" stroke="#F5B544" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 20h.01" /><path d="M8.5 16.43a5 5 0 0 1 7 0" /><path d="M5 12.86a10 10 0 0 1 5.17-2.69" /><path d="M19 12.86a10 10 0 0 0-2-1.43" />
          <path d="M2 8.82a15 15 0 0 1 4.18-2.65" /><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" /><path d="m2 2 20 20" /></svg>"""


class Pieza:
    def __init__(self, fmt, escenas=None, cierre=None, dur=None, nombre=None, pitch=None):
        self.fmt, self.F = fmt, FORMATOS[fmt]
        self.escenas = escenas or ESCENAS
        self.cierre = cierre or CIERRE
        self.dur = dur or DUR
        self.nombre = nombre or f"video-v2-{fmt}"
        self.pitch = pitch or "¿Qué sistema necesita tu negocio? Lo construimos a la medida."
        self.o, self.js, self.sfx = [], [], []
        self.n = 0

    def J(self, s):
        self.js.append("      " + s)

    def ventana(self, wid, x, y, w, h, media_html, barra=True):
        bar = '<div class="bar"><i></i><i></i><i></i><span>gamerzone · sistema de turnos</span></div>' if barra else ""
        vh = h - (34 if barra else 0)
        return (f'<div class="win" id="{wid}" style="left:{r(x)}px;top:{r(y)}px;width:{r(w)}px;height:{r(h)}px">{bar}'
                f'<div class="vp" style="width:{r(w - 4)}px;height:{r(vh - 4)}px">{media_html}<div class="demo">datos de demostración</div></div></div>'), w - 4, vh - 4

    def media(self, mid, src, t0, d, pan_id):
        if src.endswith(".mp4"):
            m = (f'<video id="{mid}" class="clip" src="{P}{src}" data-start="{r(t0)}" data-duration="{r(d)}" data-media-start="0" '
                 f'data-track-index="0" muted playsinline></video>')
        else:
            m = f'<img id="{mid}" class="clip" src="{P}{src}" data-start="{r(t0)}" data-duration="{r(d)}" data-track-index="0" alt="" />'
        return f'<div class="pan" id="{pan_id}">{m}</div>'

    def textos(self, n, t0, t1, kick, hl, it, body, hook=False):
        partes = ([("kicker", kick)] if kick else []) + [("hl", hl), ("it", it)] + ([("body", body)] if body else [])
        cuerpo = "\n".join(f'          <div class="el {c}" id="x{n}-{j}">{esc(v)}</div>' for j, (c, v) in enumerate(partes))
        cls = "hook" if hook else "txt"
        self.o.append(f'      <div class="{cls} clip" id="s{n}" data-start="{r(t0)}" data-duration="{r(t1 - t0)}" data-track-index="2">\n{cuerpo}\n      </div>')
        t = t0 + (0.3 if hook else 0.2)
        ids = []
        for j, (c, _) in enumerate(partes):
            i = f"#x{n}-{j}"
            ids.append(f'"{i}"')
            self.J(f'tl.set("{i}", {{ opacity: 1, y: {70 if c in ("hl", "it") else 36} }}, {r(t)});')
            self.J(f'tl.to("{i}", {{ y: 0, duration: 0.24, ease: "power4.out" }}, {r(t)});')
            t += 0.18 if c == "kicker" else 0.22
        self.J(f'tl.to([{", ".join(ids)}], {{ opacity: 0, y: -30, duration: 0.2, ease: "power3.in", stagger: 0.03 }}, {r(t1 - 0.32)});')

    def entrada_salida(self, sel, t0, t1, y=60):
        self.J(f'tl.fromTo("{sel}", {{ opacity: 0, y: {y}, scale: 0.96 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }}, {r(t0)});')
        self.J(f'tl.to("{sel}", {{ opacity: 0, y: -40, duration: 0.3, ease: "power2.in" }}, {r(t1 - 0.3)});')

    def camara_a(self, pan, cw, ch, foco, t, dur=1.2, deriva_hasta=None):
        s, x, y = camara(foco, cw, ch)
        self.J(f'tl.to("#{pan}", {{ scale: {r(s)}, x: {r(x)}, y: {r(y)}, duration: {dur}, ease: "power3.inOut" }}, {r(t)});')
        if deriva_hasta and foco:
            cx_, cy_ = foco[0] + foco[2] / 2, foco[1] + foco[3] / 2
            s2 = s * 1.04
            self.J(f'tl.to("#{pan}", {{ scale: {r(s2)}, x: {r(x - (s2 - s) * cx_)}, y: {r(y - (s2 - s) * cy_)}, duration: {r(max(0.3, deriva_hasta - t - dur))}, ease: "none" }}, {r(t + dur)});')

    def camara_ini(self, pan, cw, ch, foco, t):
        s, x, y = camara(foco, cw, ch)
        self.J(f'tl.set("#{pan}", {{ scale: {r(s)}, x: {r(x)}, y: {r(y)} }}, {r(t)});')

    # ---------------- escenas ----------------
    def escena(self, n, tipo, t0, t1, d, kick, hl, it, body):
        vx, vy, vw, vh = self.F["va"]
        dur = t1 - t0
        cont = f'va{n}'
        partes = []
        if tipo == "hook":
            self.textos(n, t0, t1, kick, hl, it, body, hook=True)
            self.sfx.append(("impact-bass-2.mp3", 0.05, 2.0, 0.5))
            return
        if tipo == "pantalla":
            src = d.get("rec") or d["img"]
            win, cw, ch = self.ventana(f"w{n}", 0, 0, vw, vh, self.media(f"m{n}", src, t0, dur, f"pan{n}"))
            partes.append(win)
            self.camara_ini(f"pan{n}", cw, ch, None, t0)
            viaje = 1.0 if src.endswith(".mp4") else 0.55
            self.camara_a(f"pan{n}", cw, ch, d["foco"], t0 + viaje, deriva_hasta=t1 - 0.3)
            self.entrada_salida(f"#w{n}", t0, t1)
        elif tipo == "login":
            # grabación del login (cámara en el formulario, luego abre al panel) + tres roles en abanico
            fase = t0 + d.get("fase", 3.6)
            win, cw, ch = self.ventana(f"w{n}", 0, 0, vw, vh, self.media(f"m{n}", d["rec"], t0, fase - t0, f"pan{n}"))
            partes.append(win)
            self.camara_ini(f"pan{n}", cw, ch, d["foco"], t0)
            self.camara_a(f"pan{n}", cw, ch, None, t0 + 1.9, dur=1.0)
            self.J(f'tl.fromTo("#w{n}", {{ opacity: 0, y: 60, scale: 0.96 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }}, {r(t0)});')
            self.J(f'tl.to("#w{n}", {{ opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" }}, {r(fase - 0.3)});')
            # abanico de roles
            if self.fmt == "16x9":
                rw, rh, off = 560, 350, [(0, 0), (310, 193), (620, 387)]
            elif self.fmt == "social":
                rw, rh, off = 560, 350, [(0, 0), (170, 215), (340, 430)]
            else:
                rw, rh, off = 600, 375, [(0, 0), (200, 242), (400, 485)]
            for j, (img, etiqueta) in enumerate(ROLES):
                rid = f"r{n}-{j}"
                win, cw2, ch2 = self.ventana(rid, off[j][0], off[j][1], rw, rh,
                                             self.media(f"rm{n}-{j}", img, fase, t1 - fase, f"rp{n}-{j}"), barra=False)
                win = win.replace("</div></div>", f'</div><div class="tag">{esc(etiqueta)}</div></div>', 1)
                partes.append(win)
                self.camara_ini(f"rp{n}-{j}", cw2, ch2, None, fase)
                self.J(f'tl.fromTo("#{rid}", {{ opacity: 0, y: 80, rotation: {(-3, 0, 3)[j]} }}, {{ opacity: 1, y: 0, rotation: 0, duration: 0.45, ease: "back.out(1.6)" }}, {r(fase + 0.15 * j)});')
                self.J(f'tl.to("#{rid}", {{ opacity: 0, y: -40, duration: 0.3, ease: "power2.in" }}, {r(t1 - 0.3)});')
                self.sfx.append(("click-soft.mp3", fase + 0.15 * j, 0.4, 0.3))
        elif tipo == "tema":
            # noche → día: la versión clara se revela detrás de una costura azul
            win_a, cw, ch = self.ventana(f"w{n}", 0, 0, vw, vh,
                                         self.media(f"ma{n}", d["a"], t0, dur, f"pa{n}") + self.media(f"mb{n}", d["b"], t0, dur, f"pb{n}"))
            partes.append(win_a)
            self.camara_ini(f"pa{n}", cw, ch, None, t0)
            self.camara_ini(f"pb{n}", cw, ch, None, t0)
            self.J(f'tl.set("#pb{n}", {{ clipPath: "inset(0 100% 0 0)" }}, {r(t0)});')
            w0 = t0 + d.get("wipe", 1.6)
            self.J(f'tl.to("#pb{n}", {{ clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power3.inOut" }}, {r(w0)});')
            partes.append(f'<div class="seam" id="seam{n}" style="left:0"></div>')
            self.J(f'tl.set("#seam{n}", {{ opacity: 1, x: -60 }}, {r(w0)});')
            self.J(f'tl.to("#seam{n}", {{ x: {r(vw)}, duration: 1.1, ease: "power3.inOut" }}, {r(w0)});')
            self.J(f'tl.set("#seam{n}", {{ opacity: 0 }}, {r(w0 + 1.1)});')
            for p in (f"pa{n}", f"pb{n}"):
                self.camara_a(p, cw, ch, (280, 30, 1150, 520), w0 + 1.3, dur=1.4)
            self.entrada_salida(f"#w{n}", t0, t1)
            self.sfx.append(("whoosh-short.mp3", w0 + 0.2, 0.57, 0.35))
        elif tipo == "sedes":
            mid = t0 + d.get("mid", 2.1)
            win, cw, ch = self.ventana(f"w{n}", 0, 0, vw, vh,
                                       self.media(f"ma{n}", d["a"], t0, mid - t0, f"pa{n}") + self.media(f"mb{n}", d["b"], mid, t1 - mid, f"pb{n}"))
            partes.append(win)
            self.camara_ini(f"pa{n}", cw, ch, None, t0)
            self.camara_a(f"pa{n}", cw, ch, (980, 0, 460, 160), t0 + 0.5, dur=1.0)
            self.camara_ini(f"pb{n}", cw, ch, (280, 0, 1160, 380), mid)
            self.camara_a(f"pb{n}", cw, ch, (280, 120, 1110, 250), mid + 0.2, dur=1.2, deriva_hasta=t1 - 0.3)
            self.entrada_salida(f"#w{n}", t0, t1)
            self.sfx.append(("click-soft.mp3", t0 + 0.8, 0.4, 0.35))
        elif tipo == "mosaico":
            cols, filas = (3, 2) if self.fmt == "16x9" else (2, 3)
            gap = 24
            mw, mh = (vw - gap * (cols - 1)) / cols, (vh - gap * (filas - 1)) / filas
            for j, (img, etiqueta) in enumerate(MODULOS):
                c, f = j % cols, j // cols
                x, y = c * (mw + gap), f * (mh + gap)
                # se muestra el área de contenido (sin la barra lateral): x 260–1440 de la captura
                esc_ = max(mw / 1180, mh / 620)
                partes.append(f'<div class="mod" id="mo{n}-{j}" style="left:{r(x)}px;top:{r(y)}px;width:{r(mw)}px;height:{r(mh)}px">'
                              f'<img class="clip" id="mi{n}-{j}" src="{P}{img}" data-start="{r(t0)}" data-duration="{r(dur)}" data-track-index="0" '
                              f'style="width:{r(1440 * esc_)}px;height:{r(900 * esc_)}px;left:{r(-260 * esc_)}px;top:{r(-50 * esc_)}px" alt="" />'
                              f'<b>{esc(etiqueta)}</b></div>')
                tj = t0 + 0.15 + j * 0.12
                self.J(f'tl.fromTo("#mo{n}-{j}", {{ opacity: 0, y: 50, scale: 0.92 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" }}, {r(tj)});')
                self.J(f'tl.to("#mi{n}-{j}", {{ y: -18, duration: {r(dur - 0.8)}, ease: "none" }}, {r(tj)});')
                self.sfx.append(("key-press.mp3", tj, 0.3, 0.25))
            sel = ", ".join(f'"#mo{n}-{j}"' for j in range(len(MODULOS)))
            self.J(f'tl.to([{sel}], {{ opacity: 0, y: -30, duration: 0.25, ease: "power2.in", stagger: 0.03 }}, {r(t1 - 0.4)});')
        elif tipo == "movil":
            ph = vh * (0.94 if self.fmt == "16x9" else 0.9)
            pw = ph * 390 / 844
            cxm = vw / 2 - pw / 2
            dx = pw * (0.95 if self.fmt == "16x9" else 0.72)
            pos = [(cxm - dx, vh * 0.06, -6), (cxm, 0, 0), (cxm + dx, vh * 0.06, 6)]
            for j, img in enumerate(MOVIL):
                x, y, rot = pos[j]
                z = 2 if j == 1 else 1
                partes.append(f'<div class="phone" id="ph{n}-{j}" style="left:{r(x)}px;top:{r(y)}px;width:{r(pw)}px;height:{r(ph)}px;z-index:{z}">'
                              f'<img class="clip" src="{P}{img}" data-start="{r(t0)}" data-duration="{r(dur)}" data-track-index="0" alt="" /></div>')
                self.J(f'tl.fromTo("#ph{n}-{j}", {{ opacity: 0, y: 120, rotation: 0 }}, {{ opacity: 1, y: 0, rotation: {rot}, duration: 0.55, ease: "power3.out" }}, {r(t0 + 0.15 + abs(j - 1) * 0.15)});')
                self.J(f'tl.to("#ph{n}-{j}", {{ opacity: 0, y: -40, duration: 0.3, ease: "power2.in" }}, {r(t1 - 0.3)});')
        elif tipo == "offline":
            estados = [("#F5B544", "sin conexión"), ("#7B93FF", "cambios guardados en el equipo"), ("#2BD67B", "conexión de vuelta · sincronizado")]
            items = "\n".join(f'          <div class="estado" id="es{n}-{j}"><i style="background:{c}"></i>{esc(t)}</div>' for j, (c, t) in enumerate(estados))
            partes.append(f'<div class="off"><div id="ico{n}" style="opacity:0">{WIFI_OFF}</div>\n{items}\n        </div>')
            self.J(f'tl.fromTo("#ico{n}", {{ opacity: 0, scale: 0.6 }}, {{ opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }}, {r(t0 + 0.1)});')
            for j in range(3):
                self.J(f'tl.fromTo("#es{n}-{j}", {{ opacity: 0, x: -40 }}, {{ opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }}, {r(t0 + 0.6 + j * d.get("est", 0.9))});')
            self.sfx.append(("click-soft.mp3", t0 + 2.4, 0.4, 0.35))
            sel = ", ".join([f'"#ico{n}"'] + [f'"#es{n}-{j}"' for j in range(3)])
            self.J(f'tl.to([{sel}], {{ opacity: 0, y: -30, duration: 0.25, ease: "power2.in", stagger: 0.04 }}, {r(t1 - 0.4)});')
        elif tipo == "proceso":
            pasos = "\n".join(f'          <div class="paso" id="pa{n}-{j}"><i class="barra" id="pb{n}-{j}"></i><div class="n">{a}</div><h4>{esc(b)}</h4><p>{esc(c)}</p></div>'
                              for j, (a, b, c) in enumerate(PASOS))
            sellos = "".join(f'<div class="sello" id="se{n}-{j}">{esc(s)}</div>' for j, s in enumerate(SELLOS))
            partes.append(f'<div class="pasos">\n{pasos}\n          <div class="sellos">{sellos}</div>\n        </div>')
            for j in range(len(PASOS)):
                tj = t0 + 0.4 + j * d.get("paso", 1.3)
                self.J(f'tl.fromTo("#pa{n}-{j}", {{ opacity: 0, y: 50 }}, {{ opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }}, {r(tj)});')
                self.J(f'tl.fromTo("#pb{n}-{j}", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.9, ease: "power2.inOut" }}, {r(tj + 0.2)});')
                self.sfx.append(("key-press.mp3", tj, 0.3, 0.3))
            for j in range(len(SELLOS)):
                self.J(f'tl.fromTo("#se{n}-{j}", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: "back.out(2)" }}, {r(t0 + 0.4 + 4 * d.get("paso", 1.3) + 0.3 + j * 0.25)});')
            sel = ", ".join([f'"#pa{n}-{j}"' for j in range(4)] + [f'"#se{n}-{j}"' for j in range(len(SELLOS))])
            self.J(f'tl.to([{sel}], {{ opacity: 0, y: -30, duration: 0.25, ease: "power2.in", stagger: 0.03 }}, {r(t1 - 0.45)});')
        self.o.append(f'      <div class="va" id="{cont}">\n        ' + "\n        ".join(partes) + "\n      </div>")
        self.textos(n, t0, t1, kick, hl, it, body)
        self.sfx.append(("whoosh-short.mp3", t0 - 0.12, 0.57, 0.4))

    def construir(self):
        F, fmt = self.F, self.fmt
        W, H = F["w"], F["h"]
        vx, vy, vw, vh = F["va"]
        tpos = "top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center;" if F["ty"] is None else f"top: {F['ty']}px;"
        pgrid = ("grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; align-content: center; height: 70%; top: 8%;" if fmt == "16x9"
                 else "grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 18px; height: 82%;")
        vals = dict(F, vx=vx, vy=vy, vw=vw, vh=vh, tx=F["tx"], tw=F["tw"], tpos=tpos, pgrid=pgrid,
                    ico=260 if fmt == "16x9" else 300, ph=40 if fmt == "16x9" else 56)
        css = CSS
        if fmt == "social":
            # zonas seguras de TikTok / Reels: el gancho no entra a la franja de botones y el cierre sube
            css += """
      .hook .hl, .hook .it { max-width: 860px; }
      #cierre { justify-content: flex-start; padding-top: 330px; gap: 34px; }
      .lockup-v svg { width: 200px; height: 200px; }
      .pitch { max-width: 860px; } .lugar { max-width: 820px; letter-spacing: 0.06em; }
"""
        for k, v in vals.items():
            css = css.replace("{" + k + "}", str(r(v) if isinstance(v, float) else v))
        self.o.append(ISO)
        self.o.append(f"""      <div id="header">
        <div class="lockup-h" role="img" aria-label="Zyvo Solutions"><svg viewBox="0 0 200 200" aria-hidden="true"><use href="#iso" /></svg>
          <span class="wm"><span class="wm-name">ZYVO</span><span class="wm-sub">SOLUTIONS</span></span></div>
        <div class="case">{"caso · gamerzone" if fmt in ("9x16", "social") else "caso · gamerzone e-sports center"}</div>
      </div>""")
        for n, (tipo, t0, t1, d, kick, hl, it, body) in enumerate(self.escenas, 1):
            self.escena(n, tipo, t0, t1, d, kick, hl, it, body)

        cortes = [e[1] for e in self.escenas[1:]] + [self.cierre[0]]
        for i, c in enumerate(cortes, 1):
            self.o.append(f'      <div class="band-mover" id="band-{i}"><div class="band-shape"></div></div>')
            self.J(f'tl.fromTo("#band-{i}", {{ x: -1500 }}, {{ x: {W + 900}, duration: 0.55, ease: "power2.inOut" }}, {r(c - 0.28)});')

        c0, c1 = self.cierre
        self.o.append(f"""      <div id="cierre" class="clip" data-start="{r(c0)}" data-duration="{r(c1 - c0)}" data-track-index="3">
        <div class="lockup-v" role="img" aria-label="Zyvo Solutions"><svg class="el" id="c-iso" viewBox="0 0 200 200" aria-hidden="true"><use href="#iso" /></svg>
          <span class="wm"><span class="wm-name el" id="c-name">ZYVO</span><span class="wm-sub el" id="c-sub">SOLUTIONS</span></span></div>
        <div class="el pitch" id="c-pitch">{esc(self.pitch)}</div>
        <div class="el tagline" id="c-tag">Construye. Escala. Evoluciona.</div>
        <div class="el lugar" id="c-lugar">Software a la medida · Yopal, Casanare</div>
      </div>""")
        self.J(f'tl.to("#header", {{ opacity: 0, duration: 0.3 }}, {r(c0 - 0.1)});')
        self.J(f'tl.fromTo("#c-iso", {{ opacity: 0, scale: 0.7 }}, {{ opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }}, {r(c0 + 0.1)});')
        for j, cid in enumerate(["c-name", "c-sub", "c-pitch", "c-tag", "c-lugar"]):
            self.J(f'tl.fromTo("#{cid}", {{ opacity: 0, y: 30 }}, {{ opacity: {0.85 if cid == "c-sub" else 1}, y: 0, duration: 0.35, ease: "power4.out" }}, {r(c0 + 0.35 + j * 0.18)});')
        self.sfx.append(("chime.mp3", c0 + 0.1, 2.5, 0.45))

        auto = '{"version":1,"lanes":[{"target":"volume","points":[{"t":0,"v":0},{"t":0.4,"v":1},{"t":%s,"v":1},{"t":%s,"v":0}]}]}' % (r(self.dur - 1.5), r(self.dur))
        self.o.append(f"""      <audio id="musica" src="assets/bgm/track-larga.wav" data-start="0" data-duration="{r(self.dur)}" data-track-index="10" data-volume="0.85"
        data-automation='{auto}'></audio>""")
        for i, (f, t, d, v) in enumerate(sorted(self.sfx, key=lambda x: x[1]), 1):
            if t >= 0:
                self.o.append(f'      <audio id="sfx-{i}" src="assets/sfx/{f}" data-start="{r(t)}" data-duration="{r(min(d, self.dur - t))}" data-track-index="{11 + i % 2}" data-volume="{v}"></audio>')

        doc = f"""<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>{css}    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{r(self.dur)}" data-width="{W}" data-height="{H}">
{chr(10).join(self.o)}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      tl.fromTo("#header", {{ opacity: 0, y: -20 }}, {{ opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }}, 0.1);
      tl.fromTo("#glow", {{ scale: 0.9, opacity: 0.7 }}, {{ scale: 1.1, opacity: 1, duration: {r(self.dur / 2)}, ease: "sine.inOut", yoyo: true, repeat: 1 }}, 0);
{chr(10).join(self.js)}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""
        nombre = self.nombre
        os.makedirs(nombre, exist_ok=True)
        io.open(os.path.join(nombre, "index.html"), "w", encoding="utf-8", newline="\n").write(doc)
        destino = os.path.join(nombre, "assets")
        if os.path.isdir(destino):
            shutil.rmtree(destino)
        shutil.copytree("comun", destino)
        io.open(os.path.join(nombre, "package.json"), "w", encoding="utf-8").write(json.dumps({
            "name": f"zona-gamer-{nombre}", "private": True, "type": "module",
            "scripts": {k: f"npx --yes {PIN} {k if k != 'dev' else 'preview'}" for k in ("dev", "check", "render")}}, indent=2))
        io.open(os.path.join(nombre, "meta.json"), "w", encoding="utf-8").write(json.dumps({"id": f"zona-gamer-{nombre}", "name": f"zona-gamer-{nombre}"}))
        io.open(os.path.join(nombre, "hyperframes.json"), "w", encoding="utf-8").write(json.dumps({
            "$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
            "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
            "paths": {"blocks": "compositions", "components": "compositions/components", "assets": "assets"},
            "media": {"autoProxy": True}, "authoringSkill": "general-video"}, indent=2))
        print(f"{nombre}: {self.dur} s, {W}x{H}, {len(self.escenas)} escenas + cierre")


if __name__ == "__main__":
    for fmt in ("16x9", "9x16"):
        Pieza(fmt).construir()
    Pieza("social", ESCENAS_SOCIAL, CIERRE_SOCIAL, DUR_SOCIAL, "video-social-9x16",
          "¿Qué sistema necesita tu negocio? Lo construimos a la medida.").construir()
