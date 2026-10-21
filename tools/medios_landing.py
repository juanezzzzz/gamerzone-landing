"""Medios PROVISIONALES de la landing del local (landing/web/public/media/).

Salen de los videos de WhatsApp normalizados (local-comun/video/v1…v9, 720×1280). Se
reemplazan por los recursos definitivos en la fase F4 (ver landing/RUTA-DISENO.md §5).

    python tools/medios_landing.py
"""
import subprocess
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
VID = BASE / "local-comun" / "video"
OUT = BASE / "landing" / "web" / "public" / "media"
REEL = BASE / "local-reel-9x16" / "renders" / "local-reel-9x16_2026-10-05_09-12-35.mp4"

# Recortes: (escala, origen y) sobre 720×1280. v4 trae el logo incrustado abajo y v9 stickers
# de Instagram; se encuadra arriba / al centro para dejarlos fuera.
def encuadre(escala=1.0, oy=0.5):
    w, h = round(720 / escala) // 2 * 2, round(1280 / escala) // 2 * 2
    return f"crop={w}:{h}:(iw-{w})/2:(ih-{h})*{oy},scale=720:1280"

# Bucle del inicio: (video, segundo, duración, escala, origen y)
BUCLE = [
    ("v6", 1.6, 1.8, 1.0, 0.5),    # neón «Game Room»
    ("v4", 3.4, 1.6, 1.35, 0.0),   # torres RGB
    ("v5", 5.4, 1.8, 1.1, 0.5),    # FIFA en pantallas grandes
    ("v4", 11.6, 1.6, 1.35, 0.0),  # jugador con audífonos
    ("v8", 6.8, 1.6, 1.1, 0.5),    # sala con luz morada
    ("v3", 6.0, 1.6, 1.15, 0.6),   # dos jugando frente al puesto 11
]

# Fotos: nombre → (video, segundo, escala, origen y)
FOTOS = {
    "pc":       ("v4", 4.1, 1.35, 0.0),
    "pc-jugador": ("v4", 12.3, 1.35, 0.0),
    "consola":  ("v2", 6.9, 1.0, 0.5),
    "juegos":   ("v2", 9.2, 1.0, 0.5),
    "futbol":   ("v5", 6.2, 1.1, 0.5),
    "sala":     ("v7", 13.3, 1.0, 0.6),
    "sala-morada": ("v8", 7.8, 1.0, 0.5),
    "parche":   ("v3", 8.0, 1.15, 0.6),
    "neon":     ("v6", 2.9, 1.0, 0.5),
    "mostrador": ("v1", 4.0, 1.0, 0.5),
    "fachada":  ("v9", 2.0, 1.5, 0.45),
}


def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    partes = []
    for k, (v, t, d, esc, oy) in enumerate(BUCLE):
        p = OUT / f"_parte{k}.mp4"
        ff("-ss", str(t), "-t", str(d), "-i", str(VID / f"{v}.mp4"), "-an",
           "-vf", encuadre(esc, oy) + ",fps=30", "-c:v", "libx264", "-crf", "18", str(p))
        partes.append(p)
    lista = OUT / "_lista.txt"
    lista.write_text("".join(f"file '{p.name}'\n" for p in partes), encoding="utf-8")
    ff("-f", "concat", "-safe", "0", "-i", str(lista), "-an",
       "-c:v", "libx264", "-crf", "27", "-preset", "slow", "-pix_fmt", "yuv420p",
       "-movflags", "+faststart", str(OUT / "inicio.mp4"))
    ff("-i", str(OUT / "inicio.mp4"), "-frames:v", "1", "-c:v", "libwebp", "-quality", "78",
       str(OUT / "inicio.webp"))
    for p in [*partes, lista]:
        p.unlink()

    for nombre, (v, t, esc, oy) in FOTOS.items():
        # 4:5 a partir del encuadre 9:16 (se corta arriba y abajo)
        ff("-ss", str(t), "-i", str(VID / f"{v}.mp4"), "-frames:v", "1",
           "-vf", encuadre(esc, oy) + ",crop=720:900:0:190", "-c:v", "libwebp", "-quality", "80",
           str(OUT / f"{nombre}.webp"))

    # Reel del local para «El lugar»
    ff("-i", str(REEL), "-vf", "scale=540:960", "-c:v", "libx264", "-crf", "28", "-preset", "slow",
       "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(OUT / "reel.mp4"))
    ff("-ss", "1.5", "-i", str(OUT / "reel.mp4"), "-frames:v", "1", "-c:v", "libwebp",
       "-quality", "78", str(OUT / "reel.webp"))

    for p in sorted(OUT.iterdir()):
        print(f"{p.name:22} {p.stat().st_size / 1024:8.0f} KB")


if __name__ == "__main__":
    main()
