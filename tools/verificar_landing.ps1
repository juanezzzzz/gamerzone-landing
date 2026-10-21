# Verificación completa de la landing antes de publicar o después de un cambio:
# pruebas unitarias (Vitest) → build (Astro) → pruebas de extremo a extremo (Playwright, escritorio,
# celular y movimiento reducido) contra un servidor que se levanta y se apaga solo.
#   powershell -File tools/verificar_landing.ps1
# La primera vez: python -m venv tools/.venv; tools/.venv/Scripts/python -m pip install playwright==1.55.0
$ErrorActionPreference = 'Stop'
$web = Join-Path $PSScriptRoot '..\landing\web'
$py = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
$env:PYTHONIOENCODING = 'utf-8'

Push-Location $web
try {
  npm test
  if ($LASTEXITCODE) { throw 'Fallan las pruebas unitarias' }
  npx astro build
  if ($LASTEXITCODE) { throw 'Falla el build' }
} finally { Pop-Location }

Push-Location $PSScriptRoot
try {
  & $py con_servidor.py --servidor "npx astro preview --port 4340" --puerto 4340 --carpeta $web -- $py pruebas_landing.py http://localhost:4340/
  if ($LASTEXITCODE) { throw 'Fallan las pruebas de extremo a extremo' }
} finally { Pop-Location }
Write-Host "`nTodo en orden." -ForegroundColor Green
