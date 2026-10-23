# ASSET MANIFEST — GamerZone

Track every visual asset: source, processing, status, usage.

---

## Real Business Assets (Priority 1)

These are stills extracted from the venue's own videos. They live in `src/assets/galeria/`.

| File | Shows | Used In | Status |
|---|---|---|---|
| `consola-pareja.webp` | Couple playing a racing game on console station 11 | Planes (poster card), Console Lounge | Ready |
| `controles.webp` | Xbox controllers (white and black) next to register keyboard | Galeria | Ready |
| `futbol-sala-verde.webp` | Player facing football match on big screen, green ambient light | Galeria, Futbol station | Ready |
| `jugadores-pc.webp` | Player with headphones focused on a PC screen | Galeria, Planes (poster card) | Ready |
| `letrero-gameroom.webp` | Neon "Game Room" sign with controller icon on wall mesh | Galeria | Ready |
| `mostrador-lampara.webp` | Counter with "Game Zone" lamp lit, white controller, drink | Galeria | Ready |
| `sala-sofa-azul.webp` | VIP room with blue/green light, big screen facing the couch | Planes (poster card), VIP station | Ready |
| `torres-rgb-completa.webp` | PC tower with RGB fans lit in blue/purple | Galeria, PC Arena | Ready |
| `fachada.webp` | Building facade exterior | Visitanos | Ready |

### Source: `src/assets/`
| File | Shows | Used In | Status |
|---|---|---|---|
| `logo.png` | GamerZone logo | Cabecera, Pie, OG | Ready |

---

## Video Clips

These are clips from the venue's videos. They live in `public/media/clips/`.

| Clip | Formats | Shows | Used In | Status |
|---|---|---|---|---|
| `pc` | .mp4, .webm, .webp | PC gaming area, RGB, monitors | Estaciones (PC panel) | Ready |
| `consolas` | .mp4, .webm, .webp | Console area, people on couches | Estaciones (Console panel) | Ready |
| `futbol` | .mp4, .webm, .webp | Football on big screen | Estaciones (Futbol panel) | Ready |
| `salas` | .mp4, .webm, .webp | VIP room, couch, big screen | Estaciones (VIP panel) | Ready |
| `reel` | .mp4, .webm, .webp | General venue overview | Hero background | Ready |
| `juegos` | .mp4, .webm, .webp | Games being played | Lugar section | Ready |

---

## 3D / WebGL Assets

| File | What | Used In | Status |
|---|---|---|---|
| `public/media/control-3d.webp` | Controller poster (OG fallback) | Hero | Ready |
| `public/media/control-3d-inicio.webp` | Controller initial frame | Hero (before Three.js loads) | Ready |
| `public/media/control-seq/00-23.webp` | 24-frame controller rotation sequence | Hero scroll animation | Ready |
| `public/media/og.jpg` | Open Graph image | Meta tags | Ready |

---

## Reference Screenshots

Visual references in `REFERENCES/`. NOT used on the site — for art direction comparison only.

| Folder | Contents |
|---|---|
| `01-HERO/` | Apple MacBook hero, Aman hero video, Current GamerZone hero |
| `02-EXPERIENCIAS/` | Current GamerZone stations |
| `03-GALERIA/` | Aman properties grid |
| `05-EDITORIAL/` | Apple MacBook sections |
| `06-VIP-PREMIUM/` | Aman seasonal experiences |

---

## Pixabay Supplementary Images (Priority 2)

These are supplementary images from Pixabay, used on mobile for experience stations. They live in `src/assets/experiencias/`.

| File | Source | Shows | Used In | Status |
|---|---|---|---|---|
| `pc-arena.jpg` | Pixabay | RGB gaming PC tower with neon lighting | Estaciones — PC Arena (mobile) | Ready |
| `consolas-social.jpg` | Pixabay | Kids playing on console with big screen | Estaciones — Console Lounge (mobile) | Ready |
| `futbol-comp.jpg` | Pixabay | Football on big TV screen | Estaciones — Fútbol (mobile) | Ready |
| `vip-lounge.jpg` | Pixabay | Dark lounge room with ambient lighting | Estaciones — Sala VIP (mobile) | Ready |

---

## Audio Assets (ElevenLabs Generated)

Sound effects generated with ElevenLabs Sound Generation API. They live in `public/audio/`.

| File | Size | Description | Used In | Status |
|---|---|---|---|---|
| `ui-click.mp3` | 8.8 KB | Short UI click, subtle button press | Button click events | Ready |
| `transition.mp3` | 24.7 KB | Whoosh transition between sections | Station transitions | Ready |
| `ambient.mp3` | 81 KB | Subtle atmospheric background loop | Background ambience (when sound enabled) | Ready |
| `hover.mp3` | 8.8 KB | Soft electronic hover tone | Button hover events | Ready |

---

## Assets Needed

| What | For | Source | Process | Priority |
|---|---|---|---|---|
| Hero background video (higher quality) | Inicio.astro | Re-edit from source footage or Magnific-enhanced reel | Magnific upscale → color grade → compress | HIGH |
| PC Arena hero image (wider crop) | Estaciones — PC panel | Magnific enhance of `torres-rgb-completa.webp` or new still | Magnific → cinematic crop 16:9 → webp | MEDIUM |
| Console lifestyle shot (wider) | Estaciones — Console panel | Magnific enhance of `consola-pareja.webp` | Magnific → warm color grade → webp | MEDIUM |
| VIP room atmospheric shot | Estaciones — VIP panel | Magnific enhance of `sala-sofa-azul.webp` | Magnific → warm gold grade → webp | MEDIUM |
| Additional gallery photos | Galeria | Pixabay (gaming, esports venue, friends gaming) | Match to existing photo look → webp | LOW |

---

## Pixabay Search Terms (for supplementary assets only)

Use these terms to find complementary images that match the venue's actual look:
- `gaming room dark`
- `esports venue`
- `friends gaming console`
- `gaming setup rgb`
- `computer gaming`
- `arcade interior`
- `gaming lounge`

**Rule**: Every Pixabay image must be:
1. Color-graded to match the existing photos' palette
2. Cropped to a cinematic aspect ratio (16:9 or 21:9)
3. Not the visual centerpiece of any section (real photos take that role)
4. Tracked in this manifest with `SOURCE: Pixabay` noted

---

## Processing Pipeline

```
SOURCE (real photo / Pixabay / generated)
    ↓
SELECTION (choose best composition)
    ↓
MAGNIFIC (upscale to 2x or 4x, enhance details)
    ↓
COLOR GRADE (match to --noche palette, warm highlights)
    ↓
CROP (cinematic ratio, intentional composition)
    ↓
OPTIMIZE (webp, quality 80-85, max 400KB for photos, 2MB for hero)
    ↓
PLACE (add to src/assets/ or public/media/)
    ↓
TRACK (update this manifest)
```
