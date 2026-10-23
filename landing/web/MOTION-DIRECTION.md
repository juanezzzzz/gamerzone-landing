# MOTION DIRECTION — Animation & Transition System

## Philosophy

Motion serves narrative and hierarchy. If an animation doesn't improve comprehension or create a meaningful moment, it doesn't belong.

**Rule**: Every animation must answer "what story does this tell?" If the answer is "it looks cool," remove it.

---

## Motion Hierarchy

| Level | What | Tool | Easing |
|---|---|---|---|
| **Micro** | Hover states, focus, button feedback | CSS transitions | `ease-out`, 200-300ms |
| **Reveal** | Elements appearing on scroll | CSS + IntersectionObserver | `ease-out`, 600-800ms |
| **Sequence** | Multi-step scroll-driven narratives | GSAP ScrollTrigger | Custom per sequence |
| **Transition** | Scene changes between experiences | OGL shaders / GSAP | `power2.out`, 800-1200ms |
| **Ambient** | Continuous subtle motion (marquee, parallax) | CSS / GSAP | Linear for marquee, ease for parallax |

---

## Global Scroll Reveal

**File**: `src/scripts/efectos/revelaciones.ts`

Every section and major element uses a shared reveal pattern:
- `opacity: 0 → 1`
- `translateY(40px → 0)`
- Duration: 700ms
- Easing: `ease-out`
- Trigger: IntersectionObserver with `threshold: 0.15`
- Stagger: 100ms between sibling elements when multiple reveal together

**Exceptions**:
- Hero (has its own animation system)
- Marquee (continuous, no reveal)
- Sections with GSAP-driven pinned sequences (they manage their own reveals)

---

## Existing Animations (CONSERVE)

### Hero — Control 3D + Text
- Three.js controller rotates with scroll progress
- Text split-reveals with letter stagger
- **File**: `efectos/control3d.ts`, `efectos/inicio.ts`
- **DO NOT modify** unless specifically redesigning the hero

### Stations Desktop — Sticky Scroll + Video Transitions
- Sticky left panel with video player
- OGL shader transitions between station videos
- Right panel content changes per station
- **File**: `efectos/recorrido.ts`, `efectos/pantalla-gl.ts`
- **MODIFY CAREFULLY**: The right panel needs unique layouts per station, but the sticky + shader system works

### Pinned Steps (Tarifas)
- Each step pins and reveals in sequence
- **File**: `efectos/tarifas.ts`
- **CONSERVE**

### Horizontal Scroll (Planes)
- Poster cards scroll horizontally when pinned
- **File**: `efectos/planes.ts`
- **CONSERVE**

### Marquee (Juegos)
- CSS infinite horizontal scroll of game names
- **CONSERVE**

---

## New Animations (IMPLEMENT)

### 1. Counter Animation (Cifras)
- **File**: New, or add to existing reveal system
- Numbers count from 0 to final value
- Duration: 1500ms
- Easing: `power2.out` (fast start, slow end)
- Trigger: When Cifras section enters viewport
- Format: Respect locale (dot separators for thousands if needed)

### 2. Subtle Parallax (Gallery)
- **File**: New `efectos/parallax.ts` or integrate with reveals
- Gallery images scroll at slightly different rates
- Maximum displacement: 30px (subtle, not dramatic)
- Desktop only (disable on mobile for performance)
- Use `will-change: transform` on parallax elements

### 3. Statement Word Reveal
- The declaration text reveals word by word as user scrolls through it
- Use GSAP SplitText (already in the project)
- Each word goes from `opacity: 0.15` → `opacity: 1` as it becomes "active"
- Creates a reading-pace effect tied to scroll

---

## Transition Design Between Sections

Sections should not hard-cut. The transitions matter:

| From → To | Transition |
|---|---|
| Hero → Cifras | Fade hero video opacity as Cifras slides up |
| Cifras → PC Arena | Clean cut (Cifras is a thin strip) |
| PC Arena → Console | In sticky scroll: OGL shader dissolve on video, right panel cross-fades |
| Console → Futbol | Same sticky system, different panel composition slides in |
| Futbol → VIP | Background color shifts to `--superficie-2`, gold accent fades in |
| VIP → Statement | Fade to `--noche`, text reveals progressively |
| Statement → Gallery | Gallery images scale from 0.95 → 1.0 as they enter |
| Gallery → Torneos | Standard section reveal |
| Pricing sections | Standard section reveal with stagger |
| Cierre | Text scales subtly from 0.98 → 1.0 for weight |

---

## Easing Reference

| Name | CSS | GSAP | Use For |
|---|---|---|---|
| Smooth out | `ease-out` | `power2.out` | Most reveals, entries |
| Smooth in-out | `ease-in-out` | `power2.inOut` | Transitions between states |
| Snappy | `cubic-bezier(.16,1,.3,1)` | `back.out(1.2)` | UI feedback, buttons |
| Linear | `linear` | `none` | Marquees, continuous scroll |

**Default**: `power2.out` for GSAP, `ease-out` for CSS. Only deviate with a reason.

---

## Performance Rules

1. **Never animate layout properties** (width, height, top, left, margin, padding). Only animate `transform` and `opacity`.
2. **`will-change`** only on elements that are about to animate, remove after.
3. **Disable complex animations on mobile** when they cause frame drops. The page must be 60fps on a mid-range phone.
4. **Lazy-load videos** — don't autoplay off-screen.
5. **Prefer CSS animations** for simple reveals. Use GSAP only when you need scroll-scrubbing, timelines, or complex sequencing.
6. **requestAnimationFrame** for any custom JS animation. Never use setInterval.

---

## Sound (Future Optional Layer)

If implementing the ElevenLabs sound layer:

| Interaction | Sound | Volume | Trigger |
|---|---|---|---|
| Button hover | Tiny UI click | 5% | `mouseenter` |
| Section transition | Subtle whoosh | 8% | Scroll past threshold |
| VIP section | Cinematic impact | 10% | Section enters viewport |
| Booking confirmation | Confirmation tone | 15% | After WhatsApp redirect |

**Rules**:
- Global mute toggle, always accessible
- No sound until first user click (browser policy)
- Sounds must be < 50KB each
- Generate via ElevenLabs Sound Effects API
- This is the LAST thing to implement. Design is priority.
