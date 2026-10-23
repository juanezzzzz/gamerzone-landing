# PLAN MAESTRO — GamerZone Landing Page

## Objetivo

Transformar la landing de **"landing de gaming con componentes"** → **"experiencia digital premium de un gaming club"**.

El resultado debe sentirse como un sitio que podría aparecer en Awwwards / Webflow Showcase / Dribbble, sin ser copia de ninguno.

---

## Diagnóstico: las 10 decisiones que hacen que parezca plantilla

### 1. Todas las secciones usan el mismo contenedor
Todo vive dentro de `.envoltura` (max-width: 72rem centrado). No hay full-bleed real, no hay asimetría, no hay momentos que rompan el grid. Cada sección se siente como la anterior con diferente texto.

**Cambio**: Alternar entre contenido contenido, full-bleed, split asimétrico, y composiciones que rompan el margen. No todas las secciones deben respetar el mismo ancho.

### 2. Las 4 experiencias son 4 cards idénticas
PC, Consolas, Fútbol y VIP comparten el mismo componente con el mismo layout. En mobile son 4 rectángulos iguales apilados. No hay identidad propia por experiencia.

**Cambio**: Cada experiencia debe tener una composición completamente diferente:
- **PC Arena** → Tecnología/rendimiento. Layout split con specs técnicos grandes.
- **Console Lounge** → Social/lifestyle. Foto grande dominante con texto superpuesto.
- **Fútbol** → Competitivo/deportivo. Número editorial + video.
- **Sala VIP** → Exclusividad/privacidad. Minimalista, fondo diferenciado, dorado.

### 3. Las imágenes son secundarias
Las fotos viven dentro de cards como thumbnails, recortadas a aspect-ratio fijos. No son protagonistas. En un sitio premium, la fotografía ES la sección — el texto se monta sobre ella.

**Cambio**: Imágenes a pantalla completa o casi. El texto se superpone con gradient. Las fotos definen el espacio visual, no lo rellenan.

### 4. No hay transiciones entre escenas
Cada sección termina → espacio → siguiente sección empieza. No hay continuidad. No hay sensación de recorrido. Es una lista, no una película.

**Cambio**: Las secciones deben fundirse. Color/iluminación que cambia, elementos que aparecen/desaparecen con scroll, clips-path que revelan la siguiente escena.

### 5. La tipografía no participa en la composición
Los títulos son `h2` con un tamaño grande y ya. No hay tipografía que rompa el grid, que ocupe media pantalla, que funcione como elemento visual en sí misma.

**Cambio**: Permitir headings enormes que funcionen como composición visual. Line breaks intencionales. Palabras parcialmente fuera del grid. Contraste claro entre DISPLAY / BODY / MONO.

### 6. El hero depende 100% del WebGL
Si Three.js no carga → espacio vacío. No hay plan B visual. Además el control 3D es el único elemento visual, cuando debería complementar una imagen/video cinematográfica.

**Cambio**: Video del local como fondo del hero. El control 3D se superpone. Si WebGL falla → video visible. Si video falla → imagen. Nunca espacio vacío.

### 7. No hay variación de ritmo
El scroll es: sección → sección → sección, todas con la misma cadencia. No hay momentos que respiren (whitespace puro) ni momentos que golpeen (full-screen image).

**Cambio**: Alternar ritmos:
```
FULL SCREEN → EDITORIAL → STICKY → FULL BLEED → TYPOGRAPHIC → HORIZONTAL → SPLIT → FULL SCREEN
```

### 8. Los precios parecen una tabla de café internet
La información es correcta pero la presentación es plana. La carta de precios y los paquetes se ven genéricos.

**Cambio**: Presentar como "rate card premium". Más whitespace interno, mejor jerarquía visual, separación clara entre tarifa base y paquetes.

### 9. Mobile es desktop apilado
No hay diseño mobile propio. Las cards se apilan, los splits se vuelven columnas. No hay decisiones de diseño específicas para mobile.

**Cambio**: Mobile como experiencia propia. Hero adaptado, experiencias como slides full-width, galería con swipe, CTA sticky siempre visible.

### 10. No hay "momentos memorables"
Falta ese momento donde el usuario para y piensa "esto está bien hecho". No hay un shot a pantalla completa, no hay una animación que sorprenda, no hay una composición que destaque.

**Cambio**: Al menos 3-4 "full-screen moments" distribuidos en la página. Galería full-bleed, declaración tipográfica, sección VIP diferenciada, CTA final inmersivo.

---

## Dirección artística

### Concepto
**Gaming + Technology + Luxury + Hospitality + Editorial Design.**

No es una página de un café internet. Es la presencia digital de un club de entretenimiento premium. La experiencia digital debe transmitir la experiencia física.

### Sensación objetivo
Más cerca de: **Apple Store / Porsche Design / hotel boutique / esports arena profesional**
Lejos de: **"gaming setup de adolescente" / plantilla WordPress / dashboard**

### Paleta (se mantiene)
| Token | Valor | Uso |
|---|---|---|
| `--noche` | `#080808` | Fondo principal |
| `--superficie` | `#101010` | Cards, secciones diferenciadas |
| `--superficie-2` | `#1B1B1B` | Elevación media |
| `--superficie-3` | `#222222` | Elevación alta |
| `--acento` | `#2563EB` | CTAs, highlights |
| `--acento-claro` | `#60A5FA` | Labels, specs |
| `--texto` | `#F5F5F5` | Texto principal |
| `--texto-secundario` | `#A8A8A8` | Texto secundario |
| VIP gold | `#D4AF37` | Solo sección VIP |

### Regla 70/20/10
- **70%** negro/grafito (fondos, superficies)
- **20%** fotografía/video (contenido visual protagonista)
- **10%** acento azul (CTAs, highlights, detalles)

### Tipografía
| Token | Fuente | Uso |
|---|---|---|
| `--fd` | Sora | Display: headings enormes, números, composición tipográfica |
| `--ft` | DM Sans | Body: texto corrido, botones, UI |
| `--fm` | JetBrains Mono | Mono: specs técnicos, labels, metadata, etiquetas |

La tipografía debe participar en la composición. Sora como elemento de dirección artística, no solo como fuente de títulos.

---

## Cómo debe sentirse el scroll completo

```
HERO (pantalla completa, oscuro, 3D + video, tipografía masiva)
    ↓ reveal suave
CIFRAS (barra horizontal ligera — respiro)
    ↓ scroll normal
PC ARENA (split: specs técnicos a la izquierda, media a la derecha — tecnología)
    ↓ transición: media se expande
CONSOLE LOUNGE (foto grande dominante, texto superpuesto — lifestyle)
    ↓ transición: fade a oscuro
FÚTBOL (número editorial 03 + video — deportivo/competitivo)
    ↓ transición: slide
SALA VIP (fondo diferenciado, dorado, minimalista — exclusividad)
    ↓ respiro: declaración tipográfica
STATEMENT ("No vendemos horas... vendemos una experiencia")
    ↓ impacto visual
GALERÍA (full-bleed edge-to-edge, grid editorial asimétrico — EVIDENCIA)
    ↓ scroll horizontal o continuación
TORNEOS (cards de eventos con tipografía grande — próximamente)
    ↓ intersticio
JUEGOS (marquesina tipográfica full-width — catálogo)
    ↓ cambio de escena a oscuro
PRECIOS (pasos pinned → rate card premium — conversión)
    ↓ horizontal scroll
PLANES (poster cards con foto — grupales)
    ↓ validación social
TESTIMONIOS (cita editorial grande centrada — prueba social)
    ↓ recorrido
EL LUGAR (video full-bleed + comodidades + filmstrip — inmersión)
    ↓ información
UBICACIÓN (split texto + foto fachada — práctico)
    ↓ dudas
FAQ (split sticky + acordeón — resolución)
    ↓ cierre
CTA FINAL (tipografía masiva centrada, oscuro — acción)
```

Cada transición entre secciones tiene un propósito. El ritmo alterna entre impacto visual (full-screen) y contenido editorial (split, grid). Nunca dos secciones con el mismo layout consecutivas.

---

## Rediseño de experiencias — composiciones individuales

### PC Arena — Tecnología / Rendimiento

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   PC ARENA                                       │
│                                                  │
│   BUILT FOR                    ██████████████    │
│   PERFORMANCE.                 ██████████████    │
│                                ██  VIDEO/IMG █    │
│   ┌────────┬────────┬────────┐ ██████████████    │
│   │ 144 Hz │Mecánico│1 Gbps  │ ██████████████    │
│   └────────┴────────┴────────┘                   │
│                                                  │
│   [ RESERVAR ]                                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Layout **split asimétrico**: texto 45% / media 55%
- Specs en monospace como badges prominentes
- Copy: tecnológico, directo, seco
- La foto/video es del área de PCs del local

### Console Lounge — Social / Lifestyle

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   ████████████████████████████████████████████   │
│   ████████████████████████████████████████████   │
│   ████████████ FOTO/VIDEO GRANDE █████████████   │
│   ████████████████████████████████████████████   │
│   ████████████████████████████████████████████   │
│                                                  │
│              PLAY TOGETHER.                      │
│                                                  │
│          Xbox · Game Pass · 50" · 2 controles    │
│                                                  │
│              [ RESERVAR ]                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Layout **media dominante**: foto ocupa 60-70% del viewport
- Texto centrado debajo, lifestyle
- Copy: cálido, social, invitante
- La foto es de la pareja jugando en consola

### Fútbol — Competitivo / Deportivo

```
┌──────────────────────────────────────────────────┐
│                                                  │
│         03                                       │
│                                                  │
│         EA FC                                    │
│                                                  │
│         THE MATCH              ██████████████    │
│         STARTS                 ██████████████    │
│         HERE.                  ██  VIDEO/IMG █    │
│                                ██████████████    │
│         4 jugadores · Versus   ██████████████    │
│                                                  │
│         [ RESERVAR ]                             │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Layout **editorial con número**: número grande como marca visual
- Split asimétrico (invertido del PC Arena)
- Copy: competitivo, directo
- La foto/video es del futbol en pantalla grande

### Sala VIP — Exclusividad / Privacidad

```
┌──────────────────────────────────────────────────┐
│  background: superficie-2 + borde dorado sutil   │
│                                                  │
│              ████████████████████████             │
│              ████████████████████████             │
│              ████████ FOTO ██████████             │
│              ████████████████████████             │
│              ████████████████████████             │
│                                                  │
│                      VIP                         │
│                                                  │
│                YOUR GAME.                        │
│                YOUR SPACE.                       │
│                                                  │
│           65" · Privada · 4 controles            │
│                                                  │
│              [ RESERVAR  — dorado ]              │
│                                                  │
└──────────────────────────────────────────────────┘
```

- Layout **centrado minimalista**: todo centrado, mucho whitespace
- Fondo diferenciado (más claro, borde dorado)
- Specs en dorado
- Copy: exclusivo, íntimo, premium
- La foto es de la sala con sofá y pantalla grande

---

## Secciones: qué cambia y qué NO

### REDISEÑAR (cambio compositivo real)

| Sección | Qué cambia |
|---|---|
| **Estaciones.astro** | Dejar de ser 4 cards en grid. Cada experiencia es su propia composición full-width. En desktop mantener sticky scroll con videos, pero el panel derecho tiene layouts únicos por experiencia. En mobile, cada experiencia es una sección inmersiva. |
| **Inicio.astro** | Agregar video reel como background. 3D se superpone. Fallback chain: WebGL → video → imagen → color sólido. |
| **Tarifas.astro** | Misma estructura (pasos pinned + carta), pero mejorar whitespace interno, jerarquía visual, y contraste del paquete destacado. |

### CONSERVAR (ya funcionan)

| Sección | Por qué se conserva |
|---|---|
| **Cifras.astro** | Barra de stats funcional. Ya tiene separadores. |
| **Juegos.astro** | Marquesina tipográfica. Excelente intersticio. |
| **Planes.astro** | Poster cards con horizontal scroll. Bien ejecutado. |
| **Testimonios.astro** | Cita editorial rotativa. Recién reescrito, funciona. |
| **Galeria.astro** | Grid full-bleed asimétrico. Recién reescrito. |
| **Torneos.astro** | Cards editoriales con tipografía grande. Recién reescrito. |
| **Lugar.astro** | Video full-bleed + comodidades + filmstrip. Una de las mejores. |
| **Visitanos.astro** | Split texto + foto fachada. Funcional. |
| **Preguntas.astro** | Split sticky + acordeón. Bien ejecutado. |
| **Cierre.astro** | Tipografía masiva centrada. Recién reescrito. |
| **Cabecera.astro** | Navbar minimalista + CTA reservar. |
| **Statement** (inline en index.astro) | Declaración tipográfica. Funciona. |

---

## Sistema de animaciones

### Existentes (conservar)
- Hero: Control 3D gira con scroll + texto split reveal
- Estaciones desktop: Sticky scroll con video transitions (OGL shaders)
- Pasos pinned: Cada paso aparece/desaparece en viewport
- Planes: Horizontal scroll pinned en desktop
- Marquesina juegos: CSS infinite scroll

### Nuevas (implementar)

1. **Scroll reveal global** — Todas las secciones con `opacity: 0→1` + `translateY(40px→0)`. IntersectionObserver nativo. Archivo: `efectos/revelar.ts`

2. **Counter animation** — Números de Cifras cuentan desde 0. Archivo: `efectos/contadores.ts`

3. **Parallax suave** — Fotos grandes en galería con velocidad de scroll diferente. Solo desktop. Archivo: `efectos/parallax.ts`

4. **Transiciones entre experiencias** — En el sticky scroll desktop, la transición entre PC→Console→Fútbol→VIP cambia el layout del panel derecho, no solo el texto. Archivo: modificar `efectos/recorrido.ts`

### Regla
Cada animación debe mejorar jerarquía o narrativa. Si no hace ninguna de las dos, no va.

---

## Estrategia responsive

### Mobile (< 48rem)
- **CTA fijo inferior**: "Reservar sesión" siempre visible
- **Experiencias**: Cada una es una slide full-width con foto grande + texto superpuesto + specs. NO cards pequeñas.
- **Galería**: 1 columna, imágenes a ancho completo
- **Torneos**: Horizontal scroll con snap
- **Planes**: Horizontal scroll con snap
- **Prioridad**: CTA → Experiencias → Precio → Ubicación → WhatsApp

### Tablet (48rem - 64rem)
- **Experiencias**: Composiciones alternadas (split izq/der)
- **Galería**: Grid 2 columnas asimétrico
- **Torneos**: Grid 2-3 columnas

### Desktop (> 64rem)
- **CTA fijo desaparece**
- **Experiencias**: Sticky scroll con video + layouts únicos por experiencia
- **Galería**: Grid 3 columnas asimétrico full-bleed
- **Torneos**: Grid 3 columnas

---

## Plan de implementación

### Fase 1: Experiencias como composiciones individuales
El cambio de mayor impacto. Reescribir Estaciones.astro para que cada experiencia tenga su propio layout. En desktop, el panel derecho del sticky scroll cambia de composición por experiencia. En mobile, cada experiencia es una sección inmersiva full-width.

**Archivos**: `Estaciones.astro` (rewrite completo de la parte visual), `efectos/recorrido.ts` (adaptar para layouts diferentes)

### Fase 2: Hero con video fallback
Video reel como background del hero. 3D se superpone. Cadena de fallback.

**Archivos**: `Inicio.astro`, `efectos/inicio.ts`

### Fase 3: Scroll reveal global
Script que revela todas las secciones con fade+slide al entrar al viewport. Impacto visual inmediato en toda la página.

**Archivos**: Nuevo `efectos/revelar.ts`, `main.ts`

### Fase 4: Refinamiento de Tarifas
Whitespace, jerarquía visual, contraste del paquete destacado.

**Archivos**: `Tarifas.astro` (CSS only)

### Fase 5: Counter animation + parallax
Los números cuentan desde 0. Fotos con parallax sutil.

**Archivos**: `efectos/contadores.ts`, `efectos/parallax.ts`

---

## Stack técnico (NO cambiar)

- **Astro 5.18** — Static site generator
- **GSAP + ScrollTrigger + SplitText** — Animaciones avanzadas
- **Three.js** — Control 3D en hero
- **OGL** — WebGL shader transitions entre videos
- **Lenis** — Smooth scroll
- **Google Fonts** — Sora + DM Sans + JetBrains Mono

No agregar dependencias. No cambiar framework.

---

## Qué NO hacer

- No cambiar colores otra vez
- No cambiar fuentes otra vez
- No agregar más secciones
- No agregar dependencias
- No hacer cambios cosméticos sin propósito
- No tocar la estructura de datos
- No "añadir más animaciones" — mejorar la coreografía de las existentes
- No cambiar el contenido textual que ya es correcto

---

## Criterio de aprobación

| Categoría | Pregunta |
|---|---|
| **Art Direction** | ¿Parece una marca real? |
| **Originalidad** | ¿Se distingue de una plantilla? |
| **Ritmo visual** | ¿Cada sección tiene personalidad propia? |
| **Imágenes** | ¿Las fotos/videos son protagonistas? |
| **Tipografía** | ¿Sora participa en la composición, no solo en los títulos? |
| **Motion** | ¿El movimiento cuenta algo? |
| **UX** | ¿Es fácil reservar? |
| **Mobile** | ¿Mobile se siente diseñado, no apilado? |
| **Premium** | ¿Se siente caro? |
