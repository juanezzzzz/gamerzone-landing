# Biblioteca de recursos visuales de la landing: tomas maestras y fotogramas sacados de los videos
# originales del local. Todo lo que usa la web se genera después a partir de aquí.
#   powershell -File tools/recursos.ps1
$ErrorActionPreference = 'Stop'
$src = 'C:\Users\Usuario\Desktop\animaciones\ZONA GAMER\videos zona\descargas'
$rec = Join-Path $PSScriptRoot '..\landing\recursos'
$v = { param($hora) Join-Path $src "WhatsApp Video 2026-10-04 at $hora PM.mp4" }
foreach ($d in 'video\tomas', 'imagenes\fotogramas', 'imagenes\logo', 'neon') { New-Item -ItemType Directory -Force (Join-Path $rec $d) | Out-Null }

# nombre, video, inicio, duración, recorte. «null» = sin recorte.
# Las tomas de 1.05.42 llevan una marca de agua del logo abajo a la derecha: se recorta la franja de arriba.
$tomas = @(
  @('letrero-gameroom',  (& $v '1.05.44'), 0.0, 2.6, 'null'),
  @('torres-rgb',        (& $v '1.05.42'), 0.2, 3.0, 'crop=iw:ih*0.72:0:0'),
  @('torres-rgb-completa', (& $v '1.05.42'), 0.2, 3.0, 'null'),            # para vertical 9:16 (el recorte se vería ampliado 3×)
  @('jugadores-pc',      (& $v '1.05.42'), 9.0, 4.0, 'crop=iw:ih*0.72:0:0'),
  @('consola-pareja',    (& $v '1.05.31'), 2.0, 4.0, 'null'),
  @('biblioteca-xbox',   (& $v '1.05.15'), 7.0, 3.5, 'null'),
  @('futbol-sala-cian',  (& $v '1.05.43'), 4.2, 3.2, 'null'),
  @('futbol-sala-verde', (& $v '1.05.43'), 1.0, 2.8, 'null'),
  @('sala-sofa-azul',    (& $v '1.05.44'), 9.0, 3.0, 'null'),
  @('mostrador-lampara', (& $v '1.05.11'), 2.0, 4.0, 'null'),
  @('controles',         (& $v '1.05.46'), 1.0, 3.0, 'null'),
  @('fachada-fantasmas', (& $v '1.05.49'), 0.8, 2.4, 'crop=480:610:0:85')
)

foreach ($t in $tomas) {
  $nombre, $archivo, $ini, $dur, $recorte = $t
  # Maestra: resolución original, casi sin pérdida, sin audio.
  ffmpeg -v error -y -ss $ini -t $dur -i $archivo -vf "$recorte,fps=30" -an -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p "$rec\video\tomas\$nombre.mp4"
  # Fotograma representativo (el filtro thumbnail elige el más típico de la toma, no uno borroso de transición).
  ffmpeg -v error -y -i "$rec\video\tomas\$nombre.mp4" -vf 'thumbnail=60' -frames:v 1 -c:v libwebp -quality 90 "$rec\imagenes\fotogramas\$nombre.webp"
}

Copy-Item (Join-Path $PSScriptRoot '..\local-comun\img\logo-gamerzone.png') "$rec\imagenes\logo\" -Force
Get-ChildItem $rec -Recurse -File | Select-Object @{ n = 'Archivo'; e = { $_.FullName.Replace((Resolve-Path $rec).Path + '\', '') } }, @{ n = 'KB'; e = { [math]::Round($_.Length / 1KB) } }
