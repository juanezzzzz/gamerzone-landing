# -*- coding: utf-8 -*-
"""Video de Zyvo: caso GamerZone E-Sports Center (sistema de turnos, caja, bodega y nómina).

    python tools/construir.py        # escribe video-16x9/ y video-9x16/
    cd video-16x9 && npx hyperframes check && npx hyperframes render

Las pantallas salen de la DEMO de la app (datos ficticios), capturadas con
tools/capturar.mjs y tools/grabar-hoja.mjs. Cada escena muestra una pantalla dentro de
una ventana de navegador y la cámara viaja a su zona clave (FOCO, en píxeles lógicos
de la pantalla de 1440×900).
"""
import html
import io
import json
import os
import shutil

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RAIZ)
PIN = "hyperframes@0.8.104"
B = 0.5  # un tiempo a 120 BPM
SW, SH = 1440, 900  # tamaño lógico de las capturas

# escena: (inicio, fin, pantalla | None, foco (x, y, w, h) | None, kicker, titular, acento, apoyo, chip)
ESCENAS = [
    (0, 4, None, None, "", "¿Tu negocio todavía cuadra la caja", "en un cuaderno?", "", None),
    (4, 8, "01-login.png", (420, 140, 600, 620), "Caso real", "GamerZone", "E-Sports Center",
     "Dos sedes. Cajeros, bodega y administración en un solo sistema.", None),
    (8, 12.5, "02-dashboard.png", (280, 195, 1110, 175), "01 · Panel", "Todo el negocio", "en una pantalla",
     "Recaudo, gastos y pendientes del mes.", None),
    (12.5, 16.5, "03-turnos.png", (280, 330, 1130, 370), "02 · Turnos", "Cada turno", "con su cuadre",
     "Quién atendió, en qué caja y cuánto cuadró.", None),
    (16.5, 23.5, "17-hoja-turno.mp4", (715, 300, 505, 315), "03 · Caja", "El cajero registra.", "El sistema cuadra.",
     "", ("live", "cuadre en vivo")),
    (23.5, 27.5, "05-bodega.png", (280, 360, 1110, 520), "04 · Bodega", "Inventario", "al día",
     "Ingresos, salidas y existencias por producto.", None),
    (27.5, 31.5, "06-deudas-clientes.png", (340, 190, 980, 640), "05 · Clientes", "Deudas y abonos", "bajo control",
     "", None),
    (31.5, 35.5, "04-cuentas-nomina.png", (280, 140, 1130, 380), "06 · Nómina", "Pagos y préstamos", "por trabajador",
     "", None),
    (35.5, 40, "11-usuarios.png", (280, 230, 1130, 410), "07 · Roles", "Cada quien ve", "lo que necesita",
     "", ("sync", "guarda sin internet y sincroniza al volver")),
]
CIERRE = (40, 46)
# encuadres más cerrados para la vertical (la ventana es más angosta): índice de escena → foco
FOCO_9x16 = {
    2: (470, 140, 500, 620),
    3: (280, 195, 560, 330),
    4: (280, 330, 720, 370),
    6: (280, 360, 760, 520),
    7: (350, 190, 960, 360),
    8: (280, 140, 720, 380),
    9: (280, 230, 760, 410),
}
DUR = 46

FORMATOS = {
    "16x9": dict(w=1920, h=1080, card=(660, 175, 1180, 737.5), txt=(110, 0, 500), txt_v="center",
                 hl=96, it=96, kicker=24, body=30, hook=128, chip=24, name=150, sub=44, tag=42, top=56, pad=110),
    "9x16": dict(w=1080, h=1920, card=(40, 290, 1000, 860), txt=(70, 1250, 940), txt_v="top",
                 hl=118, it=118, kicker=28, body=36, hook=124, chip=28, name=150, sub=44, tag=40, top=150, pad=70),
}


def r(x):
    return ("%.3f" % x).rstrip("0").rstrip(".")


def esc(s):
    return html.escape(str(s), quote=False)


def camara(foco, cw, ch):
    """Escala y desplazamiento de la capa .pan para encuadrar el foco dentro de la ventana."""
    k = max(cw / SW, ch / SH)  # cubrir la ventana
    if not foco:
        return k, (cw - SW * k) / 2, (ch - SH * k) / 2
    fx, fy, fw, fh = foco
    s = min(cw / fw, ch / fh) * 0.92
    s = max(k, min(s, k * 2.6))
    x = cw / 2 - (fx + fw / 2) * s
    y = ch / 2 - (fy + fh / 2) * s
    x = min(0, max(cw - SW * s, x))
    y = min(0, max(ch - SH * s, y))
    return s, x, y


CSS = """
      @font-face { font-family: "Archivo"; src: url("assets/fonts/archivo-var-latin.woff2") format("woff2"); font-weight: 100 900; font-stretch: 62%% 125%%; }
      @font-face { font-family: "JetBrains Mono"; src: url("assets/fonts/jetbrainsmono-var-latin.woff2") format("woff2"); font-weight: 400 700; }
      /* Identidad Zyvo v2.0 (registro corporativo, con el azul de la app del cliente en las pantallas) */
      :root { --noche:#0e1218; --acero:#1b212b; --azul:#4766f5; --azul-luz:#7b93ff; --marfil:#f5f4ef; --niebla:#8a93a3; --senal:#2bd67b; }
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { margin:0; width:100%%; height:100%%; overflow:hidden; background:var(--noche); }
      #root { position:relative; width:100%%; height:100%%; overflow:hidden; background:var(--noche); color:var(--marfil); font-family:"Archivo", sans-serif; }
      #hexgrid { position:absolute; inset:0; opacity:0.08; }
      #hexgrid svg { width:100%%; height:100%%; display:block; }
      #glow { position:absolute; width:1100px; height:1100px; right:-380px; top:-300px; border-radius:50%%;
        background: radial-gradient(circle, rgba(71,102,245,0.22) 0%%, rgba(71,102,245,0) 65%%); }

      #header { position:absolute; left:%(pad)dpx; right:%(pad)dpx; top:%(top)dpx; display:flex; justify-content:space-between; align-items:center; }
      .lockup-h { display:flex; align-items:center; gap:14px; }
      .lockup-h svg { width:54px; height:54px; display:block; }
      .wm { display:grid; gap:6px; line-height:1; }
      .wm-name { font-weight:750; font-stretch:125%%; letter-spacing:0.06em; font-size:28px; }
      .wm-sub { font-weight:400; font-stretch:125%%; letter-spacing:0.62em; font-size:9px; }
      .case { font-family:"JetBrains Mono", monospace; font-size:%(kicker)dpx; color:var(--niebla); letter-spacing:0.1em; }

      .card { position:absolute; left:%(cx)dpx; top:%(cy)dpx; width:%(cw)dpx; border-radius:18px; overflow:hidden;
        background:var(--acero); border:2px solid rgba(245,244,239,0.12);
        box-shadow: 0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(71,102,245,0.15); }
      .card .bar { height:40px; display:flex; align-items:center; gap:9px; padding:0 18px; background:#151a22; border-bottom:1px solid rgba(245,244,239,0.08); }
      .card .bar i { display:block; width:12px; height:12px; border-radius:50%%; background:#2a3240; }
      .card .bar span { margin-left:14px; font-family:"JetBrains Mono", monospace; font-size:16px; color:var(--niebla); }
      .vp { position:relative; width:%(cw)dpx; height:%(chh)dpx; overflow:hidden; background:#0b0b0c; }
      .pan { position:absolute; left:0; top:0; width:%(sw)dpx; height:%(sh)dpx; transform-origin:0 0; }
      .pan img, .pan video { position:absolute; left:0; top:0; width:%(sw)dpx; height:%(sh)dpx; display:block; }
      .demo { position:absolute; right:14px; bottom:12px; font-family:"JetBrains Mono", monospace; font-size:15px; color:rgba(245,244,239,0.75);
        background:rgba(14,18,24,0.78); padding:5px 10px; border-radius:6px; }

      .txt { position:absolute; left:%(tx)dpx; width:%(tw)dpx; %(tpos)s }
      .txt .el { opacity:0; }
      .kicker { font-family:"JetBrains Mono", monospace; font-weight:700; font-size:%(kicker)dpx; letter-spacing:0.14em; text-transform:uppercase; color:var(--azul-luz); margin-bottom:18px; }
      .hl { font-weight:820; font-stretch:66%%; text-transform:uppercase; font-size:%(hl)dpx; line-height:1.04; color:var(--marfil); text-wrap:balance; }
      .it { font-weight:820; font-stretch:66%%; text-transform:uppercase; font-size:%(it)dpx; line-height:1.04; color:var(--azul-luz); text-wrap:balance; }
      .body { margin-top:22px; font-size:%(body)dpx; line-height:1.4; color:var(--niebla); max-width:%(tw)dpx; }
      .chip { display:inline-flex; align-items:center; gap:14px; margin-top:28px; padding:12px 22px; border-radius:999px; background:var(--noche);
        border:2px solid rgba(245,244,239,0.16); font-family:"JetBrains Mono", monospace; font-size:%(chip)dpx; color:var(--marfil); }
      .chip i { display:block; width:14px; height:14px; border-radius:50%%; background:var(--senal); box-shadow:0 0 0 6px rgba(43,214,123,0.22); }
      .chip.sync i { background:var(--azul-luz); box-shadow:0 0 0 6px rgba(123,147,255,0.22); }

      .hook { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:0 %(pad)dpx; }
      .hook .hl, .hook .it { font-size:%(hook)dpx; max-width:1500px; }

      .band-mover { position:absolute; top:-10%%; left:0; width:520px; height:120%%;
        -webkit-mask-image: linear-gradient(to bottom, transparent 0, transparent 260px, #000 420px); mask-image: linear-gradient(to bottom, transparent 0, transparent 260px, #000 420px); }
      .band-shape { width:100%%; height:100%%; background:var(--azul); transform:skewX(-39deg); }

      #cierre { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:40px; text-align:center; padding:0 %(pad)dpx; }
      #cierre .el { opacity:0; }
      .lockup-v { display:flex; flex-direction:column; align-items:center; gap:34px; }
      .lockup-v svg { width:230px; height:230px; display:block; }
      .lockup-v .wm { justify-items:center; gap:20px; }
      .lockup-v .wm-name { font-size:%(name)dpx; margin-right:-0.06em; }
      .lockup-v .wm-sub { font-size:%(sub)dpx; margin-right:-0.62em; }
      .pitch { font-weight:700; font-stretch:100%%; font-size:%(tag)dpx; color:var(--marfil); text-wrap:balance; max-width:1100px; }
      .tagline { font-family:"JetBrains Mono", monospace; font-size:%(kicker)dpx; color:var(--azul-luz); letter-spacing:0.04em; }
      .lugar { font-family:"JetBrains Mono", monospace; font-size:%(kicker)dpx; color:var(--niebla); letter-spacing:0.12em; text-transform:uppercase; }
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


def construir(fmt):
    F = FORMATOS[fmt]
    W, H = F["w"], F["h"]
    cx, cy, cw, chh = F["card"]
    tx, ty, tw = F["txt"]
    tpos = "top: 50%%; transform: translateY(-50%%);" if F["txt_v"] == "center" else f"top: {ty}px;"
    if F["txt_v"] == "center":
        tpos = "top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center;"
    css = CSS % dict(F, cx=cx, cy=cy, cw=cw, chh=chh, sw=SW, sh=SH, tx=tx, tw=tw, tpos=tpos)
    o, js, sfx = [], [], []

    o.append(ISO)
    o.append(f"""      <div id="header">
        <div class="lockup-h" role="img" aria-label="Zyvo Solutions"><svg viewBox="0 0 200 200" aria-hidden="true"><use href="#iso" /></svg>
          <span class="wm"><span class="wm-name">ZYVO</span><span class="wm-sub">SOLUTIONS</span></span></div>
        <div class="case">{"caso · gamerzone" if fmt == "9x16" else "caso · gamerzone e-sports center"}</div>
      </div>""")

    for n, (t0, t1, pant, foco, kick, hl, it, body, chip) in enumerate(ESCENAS, 1):
        d = t1 - t0
        if fmt == "9x16" and n in FOCO_9x16:
            foco = FOCO_9x16[n]
        if pant:
            s0, x0, y0 = camara(None, cw, chh)
            s1, x1, y1 = camara(foco, cw, chh)
            if pant.endswith(".mp4"):
                media = (f'<video id="m{n}" class="clip" src="assets/pantallas/{pant}" data-start="{r(t0)}" data-duration="{r(d)}" '
                         f'data-media-start="0" data-track-index="0" muted playsinline></video>')
            else:
                media = f'<img id="m{n}" class="clip" src="assets/pantallas/{pant}" data-start="{r(t0)}" data-duration="{r(d)}" data-track-index="0" alt="" />'
            o.append(f"""      <div class="card" id="card{n}">
        <div class="bar"><i></i><i></i><i></i><span>gamerzone · sistema de turnos</span></div>
        <div class="vp"><div class="pan" id="pan{n}">{media}</div><div class="demo">datos de demostración</div></div>
      </div>""")
            # entrada de la ventana, viaje de cámara al foco y salida
            js.append(f'      tl.fromTo("#card{n}", {{ opacity: 0, y: 60, scale: 0.96 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }}, {r(t0)});')
            js.append(f'      tl.set("#pan{n}", {{ scale: {r(s0)}, x: {r(x0)}, y: {r(y0)} }}, {r(t0)});')
            viaje = 1.0 if pant.endswith(".mp4") else 0.55
            js.append(f'      tl.to("#pan{n}", {{ scale: {r(s1)}, x: {r(x1)}, y: {r(y1)}, duration: 1.2, ease: "power3.inOut" }}, {r(t0 + viaje)});')
            js.append(f'      tl.to("#pan{n}", {{ scale: {r(s1 * 1.04)}, x: {r(x1 - (s1 * 0.04) * (foco[0] + foco[2] / 2))}, y: {r(y1 - (s1 * 0.04) * (foco[1] + foco[3] / 2))}, duration: {r(max(0.3, d - viaje - 1.6))}, ease: "none" }}, {r(t0 + viaje + 1.2)});')
            js.append(f'      tl.to("#card{n}", {{ opacity: 0, y: -40, duration: 0.3, ease: "power2.in" }}, {r(t1 - 0.3)});')
            sfx.append(("whoosh-short.mp3", t0 - 0.12, 0.57, 0.4))
            sfx.append(("click-soft.mp3", t0 + viaje + 0.1, 0.4, 0.35))

        # textos
        cls = "hook" if not pant else "txt"
        partes = []
        if kick:
            partes.append(("kicker", kick))
        partes += [("hl", hl), ("it", it)]
        if body:
            partes.append(("body", body))
        cuerpo = "\n".join(f'          <div class="el {c}" id="x{n}-{j}">{esc(v)}</div>' for j, (c, v) in enumerate(partes))
        if chip:
            cuerpo += f'\n          <div class="el chip {chip[0]}" id="x{n}-chip"><i></i>{esc(chip[1])}</div>'
        o.append(f'      <div class="{cls} clip" id="s{n}" data-start="{r(t0)}" data-duration="{r(d)}" data-track-index="2">\n{cuerpo}\n      </div>')
        t = t0 + (0.2 if pant else 0.3)
        ids = [f"x{n}-{j}" for j in range(len(partes))]
        for j, (c, _) in enumerate(partes):
            trav = 70 if c in ("hl", "it") else 36
            js.append(f'      tl.set("#{ids[j]}", {{ opacity: 1, y: {trav} }}, {r(t)});')
            js.append(f'      tl.to("#{ids[j]}", {{ y: 0, duration: 0.24, ease: "power4.out" }}, {r(t)});')
            t += 0.18 if c == "kicker" else 0.22
        todos = [f'"#{i}"' for i in ids]
        if chip:
            js.append(f'      tl.fromTo("#x{n}-chip", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "back.out(2)" }}, {r(t + 0.6)});')
            todos.append(f'"#x{n}-chip"')
        js.append(f'      tl.to([{", ".join(todos)}], {{ opacity: 0, y: -30, duration: 0.2, ease: "power3.in", stagger: 0.03 }}, {r(t1 - 0.32)});')
        if not pant:
            sfx.append(("impact-bass-2.mp3", 0.05, 2.0, 0.5))

    # bandas de marca en cada cambio de escena
    cortes = [e[0] for e in ESCENAS[1:]] + [CIERRE[0]]
    for i, c in enumerate(cortes, 1):
        o.append(f'      <div class="band-mover" id="band-{i}"><div class="band-shape"></div></div>')
        js.append(f'      tl.fromTo("#band-{i}", {{ x: -1500 }}, {{ x: {W + 900}, duration: 0.55, ease: "power2.inOut" }}, {r(c - 0.28)});')

    c0, c1 = CIERRE
    o.append(f"""      <div id="cierre" class="clip" data-start="{r(c0)}" data-duration="{r(c1 - c0)}" data-track-index="3">
        <div class="lockup-v" role="img" aria-label="Zyvo Solutions"><svg class="el" id="c-iso" viewBox="0 0 200 200" aria-hidden="true"><use href="#iso" /></svg>
          <span class="wm"><span class="wm-name el" id="c-name">ZYVO</span><span class="wm-sub el" id="c-sub">SOLUTIONS</span></span></div>
        <div class="el pitch" id="c-pitch">¿Qué necesita tu negocio? Lo construimos a la medida.</div>
        <div class="el tagline" id="c-tag">Construye. Escala. Evoluciona.</div>
        <div class="el lugar" id="c-lugar">Software a la medida · Yopal, Casanare</div>
      </div>""")
    js.append(f'      tl.to("#header", {{ opacity: 0, duration: 0.3 }}, {r(c0 - 0.1)});')
    js.append(f'      tl.fromTo("#c-iso", {{ opacity: 0, scale: 0.7 }}, {{ opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }}, {r(c0 + 0.1)});')
    for j, cid in enumerate(["c-name", "c-sub", "c-pitch", "c-tag", "c-lugar"]):
        op = 0.85 if cid == "c-sub" else 1
        js.append(f'      tl.fromTo("#{cid}", {{ opacity: 0, y: 30 }}, {{ opacity: {op}, y: 0, duration: 0.35, ease: "power4.out" }}, {r(c0 + 0.35 + j * 0.18)});')
    sfx.append(("chime.mp3", c0 + 0.1, 2.5, 0.45))

    auto = '{"version":1,"lanes":[{"target":"volume","points":[{"t":0,"v":0},{"t":0.4,"v":1},{"t":%s,"v":1},{"t":%s,"v":0}]}]}' % (r(DUR - 1.5), r(DUR))
    o.append(f"""      <audio id="musica" src="assets/bgm/track.wav" data-start="0" data-duration="{r(DUR)}" data-track-index="10" data-volume="0.85"
        data-automation='{auto}'></audio>""")
    for i, (f, t, d, v) in enumerate(sorted(sfx, key=lambda x: x[1]), 1):
        if t < 0:
            continue
        o.append(f'      <audio id="sfx-{i}" src="assets/sfx/{f}" data-start="{r(t)}" data-duration="{r(min(d, DUR - t))}" data-track-index="{11 + i % 2}" data-volume="{v}"></audio>')

    doc = f"""<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>{css}    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{r(DUR)}" data-width="{W}" data-height="{H}">
{chr(10).join(o)}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      tl.fromTo("#header", {{ opacity: 0, y: -20 }}, {{ opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }}, 0.1);
      tl.fromTo("#glow", {{ scale: 0.9, opacity: 0.7 }}, {{ scale: 1.1, opacity: 1, duration: {r(DUR / 2)}, ease: "sine.inOut", yoyo: true, repeat: 1 }}, 0);
{chr(10).join(js)}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""
    nombre = f"video-{fmt}"
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
    print(f"{nombre}: {DUR} s, {W}x{H}, {len(ESCENAS)} escenas + cierre")


if __name__ == "__main__":
    # comun/bgm/track.wav = pista MusicGen (assets/bgm) extendida a 57 s con un fundido en bucle
    for fmt in FORMATOS:
        construir(fmt)
