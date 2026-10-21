# GamerZone · landing

Página informativa de GamerZone E-Sports Center (sala gamer en Yopal): Astro + GSAP + Three.js.

```bash
cd landing/web
npm install
npm run dev        # desarrollo
npm test           # pruebas unitarias
npm run build      # sitio estático en dist/
```

Verificación completa (unitarias, build y pruebas de extremo a extremo con Playwright):

```powershell
python -m venv tools/.venv; tools/.venv/Scripts/python -m pip install playwright==1.55.0   # la primera vez
powershell -File tools/verificar_landing.ps1
```

Decisiones de diseño, datos pendientes del cliente y cómo regenerar los recursos:
[`landing/RUTA-DISENO.md`](landing/RUTA-DISENO.md). Los datos del negocio viven en
`landing/web/src/data/local.ts`. Qué datos son reales y cuáles de referencia:
[`landing/DATOS-DE-REFERENCIA.md`](landing/DATOS-DE-REFERENCIA.md). La página queda en borrador
(`noindex`) mientras `REVISION = true`.
