# Clips web de la landing, a partir de las tomas maestras de landing/recursos (tools/recursos.ps1).
# Cada clip sale en AV1 (.webm, más liviano) y H.264 (.mp4, respaldo) con su póster.
#   powershell -File tools/clips_landing.ps1
$ErrorActionPreference = 'Stop'
$tomas = Join-Path $PSScriptRoot '..\landing\recursos\video\tomas'
$out = Join-Path $PSScriptRoot '..\landing\web\public\media\clips'
New-Item -ItemType Directory -Force $out | Out-Null

function Codificar($entrada, $nombre, $filtro) {
  ffmpeg -v error -y -i $entrada -vf $filtro -an -c:v libsvtav1 -crf 38 -preset 6 -pix_fmt yuv420p "$out\$nombre.webm"
  ffmpeg -v error -y -i $entrada -vf $filtro -an -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart "$out\$nombre.mp4"
  ffmpeg -v error -y -i "$out\$nombre.mp4" -frames:v 1 -c:v libwebp -quality 72 "$out\$nombre.webp"
}

# Estación → toma
$estaciones = @{ pc = 'torres-rgb'; consolas = 'consola-pareja'; futbol = 'futbol-sala-cian'; salas = 'sala-sofa-azul' }
foreach ($e in $estaciones.GetEnumerator()) { Codificar "$tomas\$($e.Value).mp4" $e.Key 'scale=480:-2,fps=30' }

# Juegos: la biblioteca de la Xbox del local, encuadrada en 4:3 sobre la pantalla del televisor
Codificar "$tomas\biblioteca-xbox.mp4" 'juegos' 'crop=iw:iw*3/4:0:ih*0.12,scale=640:-2,fps=30'

# Reel de «Así se ve por dentro»: el último render del proyecto HyperFrames (recursos/animaciones/reel-lugar).
# Se muestra a ~26rem de ancho, así que 720×900 basta incluso en pantallas de alta densidad.
$reel = Get-ChildItem (Join-Path $PSScriptRoot '..\landing\recursos\animaciones\reel-lugar\renders\*.mp4') | Sort-Object LastWriteTime | Select-Object -Last 1
Codificar $reel.FullName 'reel' 'scale=720:900'

Get-ChildItem $out | Select-Object Name, @{ n = 'KB'; e = { [math]::Round($_.Length / 1KB) } }
