# Tablero de Referencias Visuales — GamerZone

Cada referencia tiene: URL, qué observar, y cómo aplica a nuestra landing.

## Screenshots capturados

| Archivo | Qué muestra |
|---------|-------------|
| `01-HERO/apple-macbook-hero.jpg` | Apple MacBook Pro: tipografía masiva blanca + producto sobre negro |
| `01-HERO/aman-hero-video.jpg` | Aman Resorts: hero con video full-bleed, navbar minimalista |
| `01-HERO/gamerzone-actual-hero.jpg` | **ANTES**: Nuestro hero actual con control 3D |
| `02-EXPERIENCIAS/gamerzone-actual-estaciones.jpg` | **ANTES**: Estaciones actuales — mismo layout para todas |
| `03-GALERIA/aman-properties-grid.jpg` | Aman: grid asimétrico de propiedades con fotos dominantes |
| `05-EDITORIAL/apple-macbook-sections.jpg` | Apple: "Get the highlights" con chips carousel |
| `06-VIP-PREMIUM/aman-seasonal-experiences.jpg` | Aman: "Seasonal Experiences" — label uppercase + cards horizontales |

---

## 01 — HERO (Full-screen inmersivo)

### Apple MacBook Pro
**URL**: https://www.apple.com/macbook-pro/
**Qué observar**:
- Tipografía masiva blanca sobre fondo negro como primer impacto
- Producto como protagonista absoluto, no como decoración
- "Get the highlights" como sub-sección con carousel de chips — demuestra jerarquía sin clutter
- El navbar desaparece visualmente en el fondo negro
- No hay CTA en el hero — la composición visual ES el enganche

**Cómo aplica a GamerZone**:
- Nuestro hero debe ser oscuro con tipografía masiva (Sora) + el control 3D como el "producto"
- Video reel del local como background, no fondo negro plano
- El CTA de WhatsApp queda en la barra sticky, no compite con la composición del hero

### PORSCHEvolution
**URL**: https://porschevolution.com/
**Qué observar**:
- Timeline scroll-driven donde cada década revela un modelo diferente
- Fondo negro constante, la fotografía cambia con el scroll
- Parallax suave entre texto y producto — no se mueven a la misma velocidad
- Soundtrack cambia con la sección — multisensorial

**Cómo aplica a GamerZone**:
- El recorrido de experiencias (PC → Console → Fútbol → VIP) puede usar un patrón similar
- Cada "estación" se revela con scroll, no aparece como card estática
- La transición entre estaciones debe sentirse como cambio de escena, no como siguiente item de lista

### Rivian (Automotive)
**URL**: https://rivian.com/r1s
**Qué observar**:
- Hero full-viewport con video autoplay silencioso
- Texto superpuesto con gradient bottom para legibilidad
- El producto se muestra en contexto (naturaleza, aventura) no en estudio
- Scroll-triggered video sequences: al hacer scroll, el vehículo gira/se mueve

**Cómo aplica a GamerZone**:
- Nuestro hero necesita video del local real (jugadores, RGB, ambiente)
- El control 3D se superpone al video como elemento de marca
- Cadena de fallback: WebGL → video → imagen → color

---

## 02 — EXPERIENCIAS (Layouts únicos por sección)

### Apple AirPods Pro
**URL**: https://www.apple.com/airpods-pro/
**Qué observar**:
- Cada feature tiene un layout COMPLETAMENTE diferente
- Sección "Adaptive Audio": split izquierda texto / derecha animación
- Sección "Active Noise Cancellation": fondo que cambia de color, producto centrado
- Sección "Personalized Spatial Audio": ilustración full-width con texto superpuesto
- NINGUNA sección repite el patrón de la anterior

**Cómo aplica a GamerZone**:
- PC Arena, Console, Fútbol, VIP → cada una DEBE tener su propio layout
- Es el cambio #1 del PLAN MAESTRO. Si no hacemos esto, seguimos pareciendo plantilla

### Aman Resorts
**URL**: https://www.aman.com/
**Qué observar**:
- Cada propiedad tiene su propia "composición visual" en la landing
- Uso magistral de whitespace — no hay prisa por meter contenido
- Fotografía como protagonista absoluta — los textos son mínimos
- Transiciones suaves entre propiedades

**Cómo aplica a GamerZone**:
- La Sala VIP debe tener este nivel de espacio y respiro
- Menos texto, más imagen. La foto del sofá + pantalla grande dice más que 3 párrafos
- El dorado de VIP debe usarse con la contención de un hotel de lujo, no como un badge

### Tesla Model S
**URL**: https://www.tesla.com/models
**Qué observar**:
- Split asimétrico: texto minimalista a un lado, media grande al otro
- Specs técnicos presentados como "badges" prominentes (0-60: 1.99s, 405mi range)
- Cada sección de specs tiene diferente composición
- Fondo que alterna entre oscuro y blanco para crear ritmo

**Cómo aplica a GamerZone**:
- PC Arena → specs como badges prominentes (144 Hz, Mecánico, 1 Gbps)
- Split asimétrico texto/media es el layout ideal para PC Arena
- El número grande + specs mono encaja perfecto con JetBrains Mono

---

## 03 — GALERÍA (Full-bleed, asimétrica)

### Fortress Melbourne (venue)
**URL**: https://fortress.com.au/
**Qué observar**:
- Galería del venue usa fotos edge-to-edge
- Mix de fotos del espacio + gente jugando + detalles de setup
- No hay bordes redondeados — editorial, directo
- Las fotos muestran la EXPERIENCIA, no solo el hardware

**Cómo aplica a GamerZone**:
- Nuestra galería ya es full-bleed y asimétrica (bien)
- Pero necesitamos fotos que muestren personas disfrutando, no solo RGB y equipos
- El gap de 4px y sin border-radius que ya tenemos es correcto

### Cereal Magazine
**URL**: https://readcereal.com/
**Qué observar**:
- Grid editorial donde cada foto tiene diferente tamaño/proporción
- Mucho whitespace entre elementos
- Las fotos respiran — no están apiñadas
- Tipografía serif ligera como contrapunto a las imágenes

**Cómo aplica a GamerZone**:
- Referencia de cómo hacer que un grid de fotos se sienta editorial, no "galería de producto"
- Nuestro grid ya alterna proporciones — mantener esa dirección

---

## 04 — TIPOGRAFÍA (Como elemento compositivo)

### Locomotive (agency)
**URL**: https://locomotive.ca/
**Qué observar**:
- Headings que ocupan todo el viewport width
- Palabras que se cortan intencionalmente en el borde
- Mix de weights extremos: ultra-thin con ultra-bold
- La tipografía ES la composición visual en secciones de statement

**Cómo aplica a GamerZone**:
- La sección "declaración" ("No vendemos horas...") debe usar Sora a un tamaño que ocupe casi todo el ancho
- El CTA final ("¿Listo para jugar?") ya va en esa dirección con clamp(3.5rem, 16vw, 14rem)
- Los números de Cifras deben ser enormes y participar en la composición

### Stripe
**URL**: https://stripe.com/
**Qué observar**:
- Gradientes en tipografía que dan dimensión
- Headings masivos pero con tracking tight (-0.04em)
- Mono como sistema para code/specs/technical
- Jerarquía clara: DISPLAY → HEADING → BODY → CAPTION → MONO

**Cómo aplica a GamerZone**:
- Nuestra escala tipográfica (Sora display / DM Sans body / JetBrains Mono specs) ya sigue este patrón
- Reforzar el uso de mono para specs, labels, metadata — no solo decorativo

---

## 05 — EDITORIAL (Ritmo y pacing)

### Apple iPhone
**URL**: https://www.apple.com/iphone/
**Qué observar**:
- El scroll completo se siente como un RECORRIDO, no una lista
- Alternancia constante de layouts: full-screen → split → centrado → multi-column
- Color de fondo cambia entre secciones para crear "escenas"
- Video integrado al scroll (scroll-scrub)

**Cómo aplica a GamerZone**:
- REFERENCIA MAESTRA para el ritmo de scroll
- Nuestro flow debe ser: hero oscuro → cifras claro → PC split → Console foto → Fútbol editorial → VIP respiro → statement → galería → etc.
- Ninguna sección consecutiva puede tener el mismo tipo de layout

### Awwwards — Tourisme Saumur Artense
**URL**: https://www.awwwards.com/inspiration/desktop-tourisme-sumene-artense
**Qué observar**:
- Scroll-driven con cambios de escena
- Fotografía inmersiva que cambia con la sección
- Tipografía superpuesta sobre imágenes con gradientes
- Transiciones suaves entre "actos" de la narrativa

**Cómo aplica a GamerZone**:
- Cada "experiencia" es un acto. El scroll entre PC Arena → Console es un cambio de escena
- Las transiciones no son cortes duros — son fades, reveals, shifts

---

## 06 — VIP / PREMIUM (Exclusividad visual)

### Aman Hotels (detalle)
**URL**: https://www.aman.com/resorts/amanzoe
**Qué observar**:
- Paleta mínima: crema + dorado sutil + negro
- La exclusividad viene del ESPACIO, no del ornamento
- Fotografía con luz cálida, suave
- Cada propiedad tiene su propia identidad visual dentro de la marca

**Cómo aplica a GamerZone**:
- Sala VIP: fondo diferenciado (superficie-2), borde dorado sutil, MUCHO whitespace
- El dorado (#D4AF37) debe usarse como acento puntual, no como tema completo
- Copy corto y directo: "Your Game. Your Space." — no necesita más

### Equinox
**URL**: https://www.equinox.com/
**Qué observar**:
- Club membership presentado como lifestyle, no como servicio
- Fotografía aspiracional (cuerpos, espacios, ambientes)
- Dark theme con tipografía serif delgada
- El pricing no es visible — el valor se comunica antes del precio

**Cómo aplica a GamerZone**:
- La sección VIP debe vender la experiencia antes del precio
- Fotografía del sofá, la pantalla privada, el ambiente exclusivo
- El CTA es "Reservar" con look dorado, no "Ver precios"

---

## 07 — PRICING (Rate card premium)

### Notion Pricing
**URL**: https://www.notion.so/pricing
**Qué observar**:
- Cards con mucho whitespace interno
- Un plan destacado visualmente (outline o fill diferente)
- Features en lista limpia, no tabla densa
- CTA diferenciado por plan

**Cómo aplica a GamerZone**:
- Nuestra carta de precios necesita más whitespace
- El paquete destacado debe tener un tratamiento visual claro (borde azul, fondo diferente)
- Mantener la estructura de pasos pinned → rate card que ya funciona

### Linear Pricing
**URL**: https://linear.app/pricing
**Qué observar**:
- Pricing ultra-limpio con mucho espacio
- Toggle annual/monthly con animación sutil
- Comparison table debajo para quienes quieren detalle
- El free tier no se siente inferior — tiene presencia visual

**Cómo aplica a GamerZone**:
- Referencia para la jerarquía interna de la rate card
- Whitespace generoso entre rows
- El precio grande + periodo en texto secundario

---

## 08 — MOBILE (Diseño propio, no desktop apilado)

### Uber App Landing
**URL**: https://www.uber.com/
**Qué observar**:
- En mobile, el hero es completamente diferente al desktop
- CTAs prominentes, siempre visibles
- Horizontal scroll para categorías con snap
- Imágenes adaptadas a mobile (crop diferente, no solo encogidas)

**Cómo aplica a GamerZone**:
- Mobile no es "desktop en una columna" — es su propio diseño
- CTA sticky inferior (ya lo tenemos con .cta-movil)
- Experiencias en mobile como slides full-width con swipe
- Torneos y Planes ya usan horizontal scroll con snap

### Deliveroo App
**URL**: https://deliveroo.co.uk/
**Qué observar**:
- Categorías como chips horizontales
- Cards con imagen grande + info mínima
- Bottom sheet pattern para detalles
- Gestos de swipe nativos

**Cómo aplica a GamerZone**:
- Las experiencias en mobile podrían ser cards verticales full-width con foto grande
- Specs como chips debajo de la foto
- Swipe entre PC → Console → Fútbol → VIP

---

## Patrones globales a aplicar

### 1. Alternancia de composiciones
Nunca dos secciones consecutivas con el mismo tipo de layout:
```
full-screen → split → centrado → full-bleed → horizontal → editorial → split(inv)
```

### 2. Imagen como protagonista
- Las fotos deben ocupar mínimo 40% del viewport cuando aparecen
- Texto se monta sobre la imagen con gradient, no al lado en una card
- Las imágenes muestran EXPERIENCIA (personas jugando) no EQUIPO (solo hardware)

### 3. Transiciones entre escenas
- Fade suave entre secciones con diferente fondo
- Elementos que se revelan con scroll (opacity + translateY)
- Clip-path reveals para momentos de impacto

### 4. Tipografía compositiva
- Sora en tamaños que rompen el grid (10vw+)
- JetBrains Mono para toda metadata/specs/labels
- DM Sans solo para body text y UI
- Letter-spacing tight en display (-0.04em)

### 5. Whitespace como lujo
- Más espacio = más premium
- No llenar cada pixel con contenido
- Respirar entre secciones
- El espacio vacío comunica exclusividad

---

## Prioridad de implementación

| Ref. | Impacto | Dificultad | Aplica a |
|------|---------|-----------|----------|
| Apple AirPods Pro (layouts únicos) | ALTO | ALTA | Estaciones |
| Apple MacBook Pro (hero inmersivo) | ALTO | MEDIA | Inicio |
| Aman Hotels (VIP premium) | ALTO | BAJA | Sala VIP |
| Apple iPhone (ritmo editorial) | ALTO | MEDIA | Toda la página |
| Tesla Model S (specs como badges) | MEDIO | BAJA | PC Arena |
| PORSCHEvolution (scroll-driven) | MEDIO | ALTA | Estaciones desktop |
| Stripe (tipografía) | MEDIO | BAJA | Statement, Cierre |
| Linear (pricing) | BAJO | BAJA | Tarifas |
