# -*- coding: utf-8 -*-
"""Reel del local de GamerZone (marca GamerZone, no Zyvo) — genera el proyecto HyperFrames.

Material: videos del punto físico enviados por WhatsApp el 2026-10-04
(fuente/local/, normalizados en local-comun/video/v1..v9.mp4 sin audio).

    python tools/construir_local.py          # arma local-reel-9x16/
    cd local-reel-9x16 && npx hyperframes check

Los cortes se ajustan al pulso de la música (beats/…json del proyecto, si existe).
"""
import io
import json
import os
import shutil
import statistics

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROY = os.path.join(RAIZ, "local-reel-9x16")
COMUN = os.path.join(RAIZ, "local-comun")

# Datos del cierre. Fuente entre paréntesis; ⚠ = confirmar con el cliente antes de publicar.
DATOS = {
    "horario": "8 a. m. – 6 p. m.",      # ⚠ historia de Instagram del local (v9, con #feliznavidad)
    "whatsapp": "311 881 1689",          # ⚠ afiche «Gracias por preferirnos» del local (v3)
}

# (video, segundo de la fuente, velocidad, duración objetivo, cámara (escala ini, fin, origen))
# v4 trae el logo de GamerZone incrustado abajo: se encuadra con origen arriba y escala ≥ 1,35.
# v9 trae stickers de Instagram arriba a la derecha y abajo: escala ≥ 1,4 al centro.
CAPITULOS = [
    # rótulo, palabras [(texto, acento)], tomas
    ("hook", [("¿Listo", 0), ("para", 0), ("jugar?", 1)], [
        ("v6", 0.0, 1, 2.4, (1.12, 1.32, "50% 45%")),       # letrero GAME ROOM
    ]),
    ("PC GAMER", [("Equipos", 0), ("gamer", 1)], [
        ("v4", 0.0, 1, 1.6, (1.4, 1.55, "50% 0%")),         # PC con RGB
        ("v4", 2.2, 1, 1.4, (1.55, 1.4, "50% 0%")),
        ("v4", 10.0, 1, 2.0, (1.4, 1.5, "50% 0%")),         # jugando con audífonos
    ]),
    ("CONSOLAS", [("Tus", 0), ("juegos", 0), ("favoritos", 1)], [
        ("v2", 5.0, 1, 1.2, (1.15, 1.3, "50% 50%")),        # Xbox
        ("v2", 7.0, 1, 1.6, (1.1, 1.25, "50% 40%")),        # biblioteca de juegos
        ("v2", 9.3, 1, 1.2, (1.25, 1.1, "50% 40%")),
        ("v7", 1.0, 1, 1.4, (1.15, 1.3, "50% 60%")),        # controles
    ]),
    ("FÚTBOL", [("Arma", 0), ("el", 0), ("partido", 1)], [
        ("v5", 0.0, 1, 2.0, (1.1, 1.25, "50% 50%")),        # FIFA con luces que cambian
        ("v5", 4.5, 1, 2.0, (1.25, 1.1, "50% 50%")),
        ("v7", 6.5, 1, 1.4, (1.15, 1.3, "50% 45%")),
    ]),
    ("SALAS", [("Ven", 0), ("con", 0), ("tu", 0), ("parche", 1)], [
        ("v8", 2.0, 1, 1.4, (1.15, 1.3, "50% 40%")),        # sala azul
        ("v6", 5.5, 1, 1.6, (1.1, 1.25, "50% 45%")),
        ("v3", 4.0, 1, 1.4, (1.1, 1.25, "50% 55%")),        # dos jugadores
        ("v7", 13.0, 1, 1.4, (1.1, 1.22, "50% 40%")),       # pared de GTA
        ("v8", 7.0, 1, 1.4, (1.15, 1.3, "50% 45%")),
    ]),
    ("VISÍTANOS", [("Te", 0), ("esperamos", 1)], [
        ("v9", 0.5, 1, 2.2, (1.42, 1.55, "50% 50%")),       # fachada
        ("v1", 3.0, 1, 1.8, (1.1, 1.28, "45% 50%")),        # escritorio con el letrero
    ]),
]
OUTRO_DUR = 4.2


def r(x):
    return ("%.2f" % x).rstrip("0").rstrip(".")


def grilla():
    """Pulso de la música: (origen, periodo) a partir de beats/…json; None si no hay."""
    p = os.path.join(PROY, "beats", "assets", "bgm", "track.wav.json")
    if not os.path.exists(p):
        return None
    b = [x if isinstance(x, (int, float)) else x.get("t", x.get("time")) for x in json.load(open(p))["beats"]]
    d = [b2 - b1 for b1, b2 in zip(b, b[1:]) if 0.25 < b2 - b1 < 1.2]
    per = statistics.median(d)
    org = statistics.median([(x % per) for x in b])
    return org, per


def ajustar(t, g):
    if not g:
        return t
    org, per = g
    k = round((t - org) / per)
    return max(0.0, org + k * per)


def plan():
    g = grilla()
    tomas, caps, t = [], [], 0.0
    for ci, (lab, words, shots) in enumerate(CAPITULOS):
        c0 = t
        for si, (src, ms, rate, du, cam) in enumerate(shots):
            fin = ajustar(t + du, g)
            if fin - t < 0.5:
                fin = t + du
            tomas.append(dict(src=src, st=t, du=fin - t, ms=ms, rate=rate, cam=cam))
            t = fin
        caps.append(dict(lab=lab, words=words, st=c0, en=t))
    return tomas, caps, t


def html(tomas, caps, outro):
    total = outro + OUTRO_DUR
    o = []
    o.append("""<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      @font-face { font-family: "Chakra"; src: url("assets/fonts/ChakraPetch-BoldItalic.ttf") format("truetype"); font-weight: 700; font-style: italic; }
      @font-face { font-family: "Chakra"; src: url("assets/fonts/ChakraPetch-SemiBold.ttf") format("truetype"); font-weight: 600; font-style: normal; }
      :root { --noche: #07090F; --cian: #52F2F2; --cian-2: #2EC4D6; --navy: #1B2233; --blanco: #F4F7FA; --piel: #F2C090; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: var(--noche); }
      #root { position: relative; width: 1080px; height: 1920px; overflow: hidden; background: var(--noche); font-family: "Chakra", sans-serif; color: var(--blanco); }
      .shot { position: absolute; inset: 0; overflow: hidden; }
      .shot video { width: 100%; height: 100%; object-fit: cover; display: block; }
      #tint { position: absolute; inset: 0; background: radial-gradient(120% 70% at 50% 40%, rgba(7, 9, 15, 0) 40%, rgba(7, 9, 15, 0.55) 100%); }
      #scan { position: absolute; inset: 0; background: repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 0 2px, rgba(0, 0, 0, 0) 2px 6px); mix-blend-mode: overlay; }
      #scrim-top { position: absolute; left: 0; right: 0; top: 0; height: 420px; background: linear-gradient(to bottom, rgba(7, 9, 15, 0.85), rgba(7, 9, 15, 0)); }
      #scrim-bottom { position: absolute; left: 0; right: 0; top: 960px; height: 960px; background: linear-gradient(to bottom, rgba(7, 9, 15, 0) 0%, rgba(7, 9, 15, 0.82) 40%, rgba(7, 9, 15, 0.92) 100%); }
      #header { position: absolute; left: 70px; top: 120px; display: flex; align-items: center; gap: 18px; }
      #header img { width: 150px; height: 150px; object-fit: contain; filter: drop-shadow(0 0 18px rgba(82, 242, 242, 0.35)); }
      .title-block { position: absolute; left: 80px; right: 120px; top: 1080px; height: 440px; }
      .kicker { display: inline-flex; align-items: center; gap: 14px; font-weight: 600; font-style: normal; font-size: 30px; letter-spacing: 0.22em; color: var(--cian); padding: 8px 18px; border: 2px solid rgba(82, 242, 242, 0.7); background: rgba(7, 9, 15, 0.7); clip-path: polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px); }
      .kicker i { width: 12px; height: 12px; background: var(--cian); transform: rotate(45deg); }
      .headline { margin-top: 26px; font-weight: 700; font-style: italic; font-size: 128px; line-height: 1.08; text-transform: uppercase; max-width: 860px; text-shadow: 0 6px 30px rgba(0, 0, 0, 0.6); }
      .headline .w { display: inline-block; margin-right: 0.18em; opacity: 0; }
      .headline .acc { color: var(--cian); text-shadow: 0 0 26px rgba(82, 242, 242, 0.45), 0 6px 30px rgba(0, 0, 0, 0.6); }
      #hook .headline { font-size: 150px; }
      .slash { position: absolute; top: -200px; left: 0; width: 260px; height: 2400px; background: linear-gradient(to right, rgba(82, 242, 242, 0), rgba(82, 242, 242, 0.85) 45%, rgba(244, 247, 250, 0.95) 50%, rgba(82, 242, 242, 0.85) 55%, rgba(82, 242, 242, 0)); transform: translateX(-600px) skewX(-20deg); }
      #flash { position: absolute; inset: 0; background: var(--cian); opacity: 0; mix-blend-mode: screen; }
      #outro-bg { position: absolute; inset: 0; opacity: 0; background: radial-gradient(70% 45% at 50% 42%, #10283A 0%, var(--noche) 70%); }
      #grid { position: absolute; inset: 0; opacity: 0; background-image: linear-gradient(rgba(82, 242, 242, 0.12) 2px, transparent 2px), linear-gradient(90deg, rgba(82, 242, 242, 0.12) 2px, transparent 2px); background-size: 90px 90px; }
      #outro { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; padding-top: 330px; }
      #o-logo { width: 560px; height: 560px; object-fit: contain; filter: drop-shadow(0 0 40px rgba(82, 242, 242, 0.4)); }
      #o-name { margin-top: 10px; font-weight: 700; font-style: italic; font-size: 92px; letter-spacing: 0.02em; }
      #o-sub { font-weight: 600; font-size: 34px; letter-spacing: 0.4em; color: var(--cian); margin-top: 4px; }
      .chips { margin-top: 56px; display: flex; flex-direction: column; gap: 18px; align-items: center; }
      .chip { font-weight: 600; font-size: 36px; padding: 14px 30px; border: 2px solid rgba(82, 242, 242, 0.6); background: rgba(7, 9, 15, 0.75); color: var(--blanco); clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px); }
      .chip b { color: var(--cian); font-weight: 600; margin-right: 12px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="__TOTAL__" data-width="1080" data-height="1920">
      <!-- ===== Tomas del local (track 0) ===== -->""".replace("__TOTAL__", r(total)))
    for i, s in enumerate(tomas, 1):
        rate = f' data-playback-rate="{r(s["rate"])}"' if s["rate"] != 1 else ""
        o.append(f"""      <div class="shot" id="w{i}">
        <video id="t{i}" class="clip" src="assets/video/{s['src']}.mp4" data-start="{r(s['st'])}" data-duration="{r(s['du'])}" data-media-start="{r(s['ms'])}"{rate} data-track-index="0" muted playsinline></video>
      </div>""")
    o.append("""
      <div id="tint"></div>
      <div id="scan"></div>
      <div id="scrim-top"></div>
      <div id="scrim-bottom"></div>
      <div id="header"><img src="assets/img/logo-gamerzone.png" alt="GamerZone E-Sports Center" /></div>
""")
    for ci, c in enumerate(caps):
        bid = "hook" if c["lab"] == "hook" else f"cap-{ci}"
        spans = "\n".join(
            f'          <span class="w{" acc" if a else ""}" id="{bid}-w{j}">{txt}</span>' for j, (txt, a) in enumerate(c["words"]))
        kicker = "" if c["lab"] == "hook" else f'\n        <div class="kicker" id="{bid}-k"><i></i>{c["lab"]}</div>'
        o.append(f"""      <div class="title-block clip" id="{bid}" data-start="{r(c['st'])}" data-duration="{r(c['en'] - c['st'])}" data-track-index="3">{kicker}
        <div class="headline">
{spans}
        </div>
      </div>""")
    cortes = [c["st"] for c in caps[1:]] + [outro]
    for k in range(len(cortes)):
        o.append(f'      <div class="slash" id="slash-{k}"></div>')
    auto = ('{"version":1,"lanes":[{"target":"volume","points":[{"t":0,"v":0},{"t":0.3,"v":1},'
            '{"t":%s,"v":1},{"t":%s,"v":0}]}]}' % (r(total - 1.2), r(total)))
    o.append(f"""      <div id="flash"></div>

      <!-- ===== Cierre ===== -->
      <div id="outro-bg"></div>
      <div id="grid"></div>
      <div id="outro" class="clip" data-start="{r(outro)}" data-duration="{r(OUTRO_DUR)}" data-track-index="4">
        <img id="o-logo" src="assets/img/logo-gamerzone.png" alt="GamerZone E-Sports Center" />
        <div id="o-name">GAMERZONE</div>
        <div id="o-sub">E-SPORTS CENTER</div>
        <div class="chips">
          <div class="chip" id="o-c1"><b>HORARIO</b>{DATOS['horario']}</div>
          <div class="chip" id="o-c2"><b>WHATSAPP</b>{DATOS['whatsapp']}</div>
        </div>
      </div>

      <!-- ===== Audio ===== -->
      <audio id="music" src="assets/bgm/track.wav" data-start="0" data-duration="{r(total)}" data-track-index="10" data-volume="0.75" data-automation='{auto}'></audio>
      <audio id="sfx-hit" src="assets/sfx/impact-bass-2.mp3" data-start="0.05" data-duration="2" data-track-index="11" data-volume="0.5"></audio>""")
    for k, c in enumerate(cortes):
        o.append(f'      <audio id="sfx-w{k}" src="assets/sfx/whoosh-short.mp3" data-start="{r(max(0, c - 0.18))}" data-duration="0.57" data-track-index="11" data-volume="0.5"></audio>')
    o.append(f'      <audio id="sfx-end" src="assets/sfx/impact-bass-2.mp3" data-start="{r(outro + 0.1)}" data-duration="2" data-track-index="11" data-volume="0.45"></audio>')
    o.append("    </div>\n")

    # ---- línea de tiempo ----
    js = ["""    <script>
      const tl = gsap.timeline({ paused: true });
      const F = 1 / 30;
      function waterfall(ids, t0) {
        let t = t0;
        ids.forEach((id, i) => {
          tl.set(id, { opacity: 1, y: i === ids.length - 1 ? 80 : 50, skewX: -8 }, t);
          tl.to(id, { y: 0, skewX: 0, duration: 0.18, ease: "power4.out" }, t);
          t += 0.12;
        });
      }
      function salida(ids, at) {
        tl.to(ids, { x: 60, opacity: 0, duration: 0.15, ease: "power3.in", stagger: 0.02 }, at);
      }
"""]
    for i, s in enumerate(tomas, 1):
        a, b, orig = s["cam"]
        ease = "power2.out" if a > b else "none"
        js.append(f'      tl.fromTo("#w{i}", {{ scale: {a}, transformOrigin: "{orig}" }}, {{ scale: {b}, duration: {r(s["du"])}, ease: "{ease}" }}, {r(s["st"])});')
    js.append(f'      tl.fromTo("#header", {{ opacity: 0, x: -40 }}, {{ opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }}, 0.15);')
    js.append(f'      tl.to("#header", {{ opacity: 0, duration: 0.2 }}, {r(outro - 0.1)});')
    for ci, c in enumerate(caps):
        bid = "hook" if c["lab"] == "hook" else f"cap-{ci}"
        ids = ", ".join(f'"#{bid}-w{j}"' for j in range(len(c["words"])))
        t0 = c["st"] + (0.1 if c["lab"] == "hook" else 0.12)
        if c["lab"] != "hook":
            js.append(f'      tl.fromTo("#{bid}-k", {{ opacity: 0, x: -50 }}, {{ opacity: 1, x: 0, duration: 0.25, ease: "expo.out" }}, {r(t0)});')
            t0 += 0.1
        js.append(f"      waterfall([{ids}], {r(t0)});")
        if c["lab"] == "hook":
            # sacudida de entrada (determinista)
            js.append(f'      tl.to("#hook .headline", {{ keyframes: [{{ x: -10, duration: 0.04 }}, {{ x: 8, duration: 0.04 }}, {{ x: -4, duration: 0.04 }}, {{ x: 0, duration: 0.04 }}] }}, {r(t0 + 0.4)});')
        ex = ids if c["lab"] == "hook" else ids + f', "#{bid}-k"'
        js.append(f"      salida([{ex}], {r(c['en'] - 0.28)});")
    js.append("      // cortes de capítulo: barrido cian + destello")
    for k, c in enumerate(cortes):
        js.append(f'      tl.fromTo("#slash-{k}", {{ x: -600 }}, {{ x: 1500, duration: 0.36, ease: "power2.inOut" }}, {r(c - 0.18)});')
        js.append(f'      tl.fromTo("#flash", {{ opacity: 0.45 }}, {{ opacity: 0, duration: 0.2, ease: "power2.out", immediateRender: false }}, {r(c)});')
    js.append(f"""      // cierre
      tl.to("#outro-bg", {{ opacity: 1, duration: 0.3 }}, {r(outro)});
      tl.fromTo("#grid", {{ opacity: 0, backgroundPositionY: 0 }}, {{ opacity: 1, backgroundPositionY: 180, duration: {r(OUTRO_DUR)}, ease: "none" }}, {r(outro)});
      tl.fromTo("#o-logo", {{ opacity: 0, scale: 0.6, rotate: -8 }}, {{ opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(1.7)" }}, {r(outro + 0.1)});
      tl.fromTo("#o-name", {{ opacity: 0, y: 40 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "power4.out" }}, {r(outro + 0.4)});
      tl.fromTo("#o-sub", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "power4.out" }}, {r(outro + 0.52)});
      tl.fromTo(["#o-c1", "#o-c2"], {{ opacity: 0, x: -40 }}, {{ opacity: 1, x: 0, duration: 0.3, ease: "expo.out", stagger: 0.12 }}, {r(outro + 0.75)});
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
""")
    return "\n".join(o) + "\n".join(js)


def preparar():
    os.makedirs(PROY, exist_ok=True)
    for sub in ("video", "fonts", "img"):
        d = os.path.join(PROY, "assets", sub)
        os.makedirs(d, exist_ok=True)
        for f in os.listdir(os.path.join(COMUN, sub)):
            dst = os.path.join(d, f)
            if not os.path.exists(dst):
                shutil.copy(os.path.join(COMUN, sub, f), dst)
    for sub, src in (("bgm", os.path.join(COMUN, "bgm")), ("sfx", os.path.join(RAIZ, "comun", "sfx"))):
        if not os.path.isdir(src):
            continue
        d = os.path.join(PROY, "assets", sub)
        os.makedirs(d, exist_ok=True)
        for f in os.listdir(src):
            if f.endswith((".wav", ".mp3")) and not os.path.exists(os.path.join(d, f)):
                shutil.copy(os.path.join(src, f), os.path.join(d, f))
    base = os.path.join(os.path.dirname(RAIZ), "..", "videos", "resina-completo")
    for f in ("hyperframes.json", "AGENTS.md"):
        if not os.path.exists(os.path.join(PROY, f)) and os.path.exists(os.path.join(base, f)):
            shutil.copy(os.path.join(base, f), os.path.join(PROY, f))
    io.open(os.path.join(PROY, "meta.json"), "w").write('{"id":"local-reel-9x16","name":"local-reel-9x16"}')
    io.open(os.path.join(PROY, "package.json"), "w").write(json.dumps({
        "name": "local-reel-9x16", "private": True, "type": "module",
        "scripts": {k: f"npx --yes hyperframes@0.8.104 {k if k != 'dev' else 'preview'}" for k in ("dev", "check", "render")}}, indent=2))


if __name__ == "__main__":
    preparar()
    tomas, caps, outro = plan()
    io.open(os.path.join(PROY, "index.html"), "w", encoding="utf-8", newline="\n").write(html(tomas, caps, outro))
    print(f"local-reel-9x16/index.html: {len(tomas)} tomas, {len(caps)} capítulos, {outro + OUTRO_DUR:.1f} s"
          + ("" if grilla() else " (sin pulso: correr `npx hyperframes beats` y volver a generar)"))
