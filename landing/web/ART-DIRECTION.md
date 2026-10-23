# ART DIRECTION — Per-Section Compositions

Every section has a specific visual strategy. This document is the source of truth for what each section should look and feel like. Do not improvise layouts — reference this before building.

---

## 01 — HERO (Inicio.astro)

**Layout**: Full-viewport, dark, cinematic
**Composition**: Video reel of the venue as background. 3D controller floats above. Massive Sora typography as the anchor.

```
┌──────────────────────────────────────────────────────┐
│  ████████████████████████████████████████████████████ │
│  ████████████ VIDEO REEL BACKGROUND █████████████████ │
│  ████████████████████████████████████████████████████ │
│                                                      │
│     GAMERZONE                    ┌──────────┐        │
│                                  │  3D CTRL  │        │
│     TU SIGUIENTE                 │  (Three)  │        │
│     NIVEL.                       └──────────┘        │
│                                                      │
│     ▸ Reservar sesión                                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Fallback chain**: WebGL + video → video only → static image → solid `--noche`
**Typography**: Sora, `clamp(3rem, 11vw, 7.5rem)`, uppercase, tight tracking
**Motion**: Text reveals with split-letter stagger. Controller rotates with scroll.
**Mobile**: Video fills viewport, text centered, controller smaller or hidden. CTA prominent.
**Mood**: Walking into the venue for the first time. Dark, ambient, a sense of arrival.

---

## 02 — CIFRAS (Cifras.astro)

**Layout**: Horizontal strip, light respiro
**Composition**: A minimal bar with key numbers. Functions as a visual breath between hero and experiences.

```
┌──────────────────────────────────────────────────────┐
│   7 Puestos PC  ·  11 Consolas  ·  3 Pantallas  ·  1 VIP  │
└──────────────────────────────────────────────────────┘
```

**Typography**: Numbers in Sora large (display scale), labels in JetBrains Mono uppercase
**Motion**: Numbers count up from 0 when section enters viewport
**Purpose**: Credibility. Quick scan of scale. Visual palette cleanser.

---

## 03 — PC ARENA (Estaciones.astro — panel 1)

**Layout**: Split asymmetric — text 45% left, media 55% right
**Composition**: Technical, performance-oriented. Specs as prominent badges.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   01                                                 │
│   PC ARENA                       ████████████████    │
│                                  ████████████████    │
│   BUILT FOR                      ████ VIDEO/IMG █    │
│   PERFORMANCE.                   ████████████████    │
│                                  ████████████████    │
│   ┌──────┬──────┬──────┬──────┐                      │
│   │144 Hz│Mecán.│Low L.│1Gbps │                      │
│   └──────┴──────┴──────┴──────┘                      │
│                                                      │
│   [ RESERVAR ]                                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Typography**: Station number in Sora huge + muted. Name in Sora display. Specs in JetBrains Mono as pill badges.
**Imagery**: Video/photo of the PC area — RGB towers, monitors, someone gaming.
**Copy tone**: Technological. Direct. Dry. "No lag, no excuses."
**Mobile**: Full-width image above, text below, specs as horizontal scroll of pills.

---

## 04 — CONSOLE LOUNGE (Estaciones.astro — panel 2)

**Layout**: Media dominant — photo/video occupies 60-70% of viewport, text below
**Composition**: Social, lifestyle. The photo tells the story.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   ████████████████████████████████████████████████   │
│   ████████████████████████████████████████████████   │
│   ██████████████ FOTO/VIDEO GRANDE ██████████████   │
│   ████████████████████████████████████████████████   │
│   ████████████████████████████████████████████████   │
│                                                      │
│              02                                      │
│              CONSOLE LOUNGE                          │
│              PLAY TOGETHER.                          │
│                                                      │
│          Xbox · Game Pass · 50" · 2 controles        │
│                                                      │
│              [ RESERVAR ]                            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Typography**: Name and tagline centered. Specs in mono, inline with middot separators.
**Imagery**: Couple or friends on the couch playing together. Social, warm.
**Copy tone**: Warm. Inviting. Social. "Sit down and play."
**Mobile**: Photo full-width with slight gradient bottom, text overlaid at base.

---

## 05 — FUTBOL (Estaciones.astro — panel 3)

**Layout**: Editorial with large number — split asymmetric (inverted from PC Arena)
**Composition**: Competitive, sporty. The number "03" is a visual anchor.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│         03                                           │
│                                                      │
│         EA FC                    ████████████████    │
│                                  ████████████████    │
│         THE MATCH                ████ VIDEO/IMG █    │
│         STARTS                   ████████████████    │
│         HERE.                    ████████████████    │
│                                                      │
│         4 jugadores · Versus                         │
│                                                      │
│         [ RESERVAR ]                                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Typography**: "03" in Sora at editorial scale, partially faded. Title stacked.
**Imagery**: Football match on the big screen, green ambient light.
**Copy tone**: Competitive. Direct. "The rematch happens the same day."
**Mobile**: Number above, image full-width, text below.

---

## 06 — SALA VIP (Estaciones.astro — panel 4)

**Layout**: Centered minimal — everything centered, maximum whitespace
**Composition**: Exclusive, private. Different surface color. Gold accents.

```
┌──────────────────────────────────────────────────────┐
│  background: --superficie-2 + subtle gold border     │
│                                                      │
│              ████████████████████████                 │
│              ████████████████████████                 │
│              ████████ FOTO ██████████                 │
│              ████████████████████████                 │
│              ████████████████████████                 │
│                                                      │
│                      04                              │
│                      VIP                             │
│                                                      │
│                YOUR GAME.                            │
│                YOUR SPACE.                           │
│                                                      │
│           65" · Privada · 4 controles                │
│                                                      │
│              [ RESERVAR — gold ]                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Typography**: "VIP" in Sora display. Specs in mono gold. Everything centered.
**Imagery**: The private room — couch, big screen, ambient lighting. Aspirational.
**Surface**: Background shifts to `--superficie-2`. Subtle gold top border (1px, `#D4AF37` at 30% opacity).
**Copy tone**: Exclusive. Intimate. Premium. "Your game. Your space."
**Mobile**: Photo with gentle gold vignette, centered text below. Most whitespace of any section.

---

## 07 — STATEMENT (inline in index.astro)

**Layout**: Full-width typographic moment
**Composition**: Just text. Sora at massive scale. A breath, a declaration.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│     No vendemos horas                                │
│     frente a un computador.                          │
│                                                      │
│     Vendemos una experiencia                         │
│     de gaming.                                       │
│                                                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Typography**: Sora, `clamp(2.5rem, 6vw, 5rem)`. Italic for the second line.
**Motion**: Reveals word by word on scroll.
**Purpose**: The pivot from showing experiences to showing evidence (gallery).

---

## 08 — GALERIA (Galeria.astro)

**Layout**: Full-bleed edge-to-edge, asymmetric grid
**Composition**: Editorial photo grid. No rounded corners. Minimal gap. Photos ARE the section.

**Current state**: Already redesigned and working well. CONSERVE.
**Rule**: Photos must show experience (people enjoying) not just equipment (RGB towers).

---

## 09 — TORNEOS (Torneos.astro)

**Layout**: Editorial cards with large typography
**Composition**: Upcoming events. Each card has the game name big, date/time in mono.

**Current state**: Recently rewritten. CONSERVE.

---

## 10 — JUEGOS (Juegos.astro)

**Layout**: Full-width marquee
**Composition**: Continuous horizontal scroll of game names in Sora uppercase.

**Current state**: Working as interstitial. CONSERVE.

---

## 11 — TARIFAS (Tarifas.astro)

**Layout**: Pinned steps → rate card
**Composition**: Three steps (write, arrive, play) pinned on scroll, then the rate card appears.

**Needed change**: More internal whitespace, better visual hierarchy, stronger contrast for the featured package. NOT a redesign — a refinement.

---

## 12 — PLANES (Planes.astro)

**Layout**: Horizontal scroll poster cards
**Composition**: Each plan is a card with a real photo, title, description.

**Current state**: Well executed. CONSERVE.

---

## 13 — TESTIMONIOS (Testimonios.astro)

**Layout**: Centered editorial quote
**Composition**: Large rotating quote. Minimal UI.

**Current state**: Recently rewritten. CONSERVE.

---

## 14 — LUGAR (Lugar.astro)

**Layout**: Full-bleed video + amenities + filmstrip
**Composition**: The venue tour. Video of the actual space, then comfort features.

**Current state**: One of the best sections. CONSERVE.

---

## 15 — VISITANOS (Visitanos.astro)

**Layout**: Split — text left, facade photo right
**Composition**: Practical. Address, hours, how to get there.

**Current state**: Functional. CONSERVE.

---

## 16 — PREGUNTAS (Preguntas.astro)

**Layout**: Split — sticky heading left, accordion right
**Composition**: FAQ. Clean execution.

**Current state**: Well executed. CONSERVE.

---

## 17 — CIERRE (Cierre.astro)

**Layout**: Full-screen typographic CTA
**Composition**: Massive centered text. Final push to action.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│              LISTO                                    │
│              PARA                                    │
│              JUGAR?                                  │
│                                                      │
│              [ RESERVAR SESION ]                      │
│                                                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Current state**: Recently rewritten. CONSERVE. Ensure Sora is at `clamp(3.5rem, 16vw, 14rem)`.
