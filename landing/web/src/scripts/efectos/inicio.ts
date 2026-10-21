import { gsap } from '../base/gsap';
import { actualizarCabecera } from '../base/cabecera';
import { zumbido } from '../sonido';
import type { Control3D } from './control3d';

const hayWebGL = () => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } };

// La sala se enciende con el scroll: el control 3D empieza solo en el centro de la pantalla, de escorzo
// y apagado; al bajar se va a su sitio girando hacia el frente, una franja de luz recorre su borde, la luz
// se derrama en la pared y entra el título. Al final la sala se encoge en una tarjeta.
export async function escenaInicio() {
  const inicio = document.querySelector<HTMLElement>('.inicio');
  const marco = document.querySelector<HTMLElement>('.letrero-marco');
  const movil = document.querySelector<HTMLElement>('.letrero-movil');
  const caja3d = document.querySelector<HTMLElement>('.control3d');
  if (!inicio || !marco || !movil || !caja3d) return;
  inicio.classList.add('escena');

  // Three.js llega aparte: mientras tanto se ve la imagen fija del control en su misma pose inicial.
  // Con ?poster=0.5 el control se pinta quieto en ese punto del recorrido (tools/control3d_poster.mjs).
  const modoPoster = new URLSearchParams(location.search).get('poster');
  const poster = modoPoster !== null && !Number.isNaN(Number(modoPoster)) ? Number(modoPoster) : null;
  let control: Pick<Control3D, 'progreso'> | null = null;
  let encendido = false;
  let ultimo = 0; // el progreso del scroll, para aplicarlo apenas el 3D esté listo
  const avanzar = (p: number) => {
    if (poster !== null) return;
    ultimo = p;
    control?.progreso(p);
    if (p > 0.97 && !encendido) { encendido = true; zumbido(); }
    if (p < 0.5) encendido = false;
  };

  gsap.matchMedia().add({ escritorio: '(min-width: 64rem)', celular: '(max-width: 63.99rem)' }, (c) => {
    const { escritorio } = c.conditions as { escritorio: boolean };
    // Distancia y escala para centrar el control, medidas sobre el marco (que nunca se transforma).
    const centrado = () => {
      const r = marco.getBoundingClientRect();
      const s = inicio.getBoundingClientRect();
      return {
        x: window.innerWidth / 2 - (r.left + r.width / 2),
        y: s.top + window.innerHeight / 2 - (r.top + r.height / 2),
        escala: Math.min((window.innerWidth * 0.84) / r.width, (window.innerHeight * 0.7) / r.height),
      };
    };
    // Parte del recorrido en la que el control termina de encenderse (antes de que la sala se cierre)
    const finDelEncendido = escritorio ? 0.7 : 0.55;

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: inicio, start: 'top top', end: escritorio ? '+=190%' : '+=70%', pin: true, scrub: 0.7, invalidateOnRefresh: true,
        onUpdate: (s) => {
          inicio.dataset.cerrando = s.progress > (escritorio ? 0.72 : 0.45) ? '1' : '';
          actualizarCabecera();
          avanzar(s.progress / finDelEncendido);
        },
      },
    });
    if (escritorio) {
      // Escritorio: el control arranca solo en el centro y el título entra cuando se va a su sitio.
      tl.from(movil, { x: () => centrado().x, y: () => centrado().y, scale: () => centrado().escala, duration: 1, ease: 'power2.inOut' }, 0)
        .to('.pista', { opacity: 0, duration: 0.15 }, 0)
        .from('.derrame', { opacity: 0, scale: 0.6, duration: 0.6 }, 0.1)
        .from('.palabra', { yPercent: 70, opacity: 0, skewX: -8, duration: 0.35, stagger: 0.08 }, 0.55)
        .from('.aparece', { opacity: 0, y: 16, duration: 0.3, stagger: 0.06 }, 0.75);
    } else {
      // Celular: el título y los datos se ven desde la primera pantalla; el scroll solo enciende el control.
      tl.from('.derrame', { opacity: 0, scale: 0.6, duration: 0.8 }, 0);
    }
    const cierre = escritorio ? 1.4 : 0.7;
    tl.fromTo(inicio, { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
      { clipPath: escritorio ? 'inset(5% 2.5% 5% 2.5% round 28px)' : 'inset(3% 3% 3% 3% round 20px)', duration: 0.5, ease: 'power2.inOut' }, cierre)
      .to('.inicio-grilla', { scale: 0.94, duration: 0.5, ease: 'power2.inOut' }, cierre);
  });

  // Celular: secuencia de fotogramas pre-renderizados, sin WebGL. Se piden cuando el navegador queda libre.
  if (poster === null && window.matchMedia('(max-width: 63.99rem)').matches) {
    await primeraOportunidad();
    const { crearSecuencia } = await import('./secuencia');
    control = crearSecuencia(caja3d);
    control.progreso(ultimo);
    return;
  }

  if (!hayWebGL()) { mostrarPosterEncendido(); return; }

  // Escritorio: 3D en vivo. Arranca con la primera interacción o cuando el navegador queda libre: armarlo
  // cuesta CPU y no debe competir con la carga. La imagen fija tiene la misma pose, así que el cambio no se nota.
  if (poster === null) await primeraOportunidad();
  const { crearControl3D } = await import('./control3d');
  const vivo = await crearControl3D(caja3d, { poster });
  if (!vivo) { mostrarPosterEncendido(); return; }
  control = vivo;
  caja3d.classList.add('con-3d');
  if (poster !== null) {
    (window as unknown as { __poster: string }).__poster = caja3d.querySelector('canvas')!.toDataURL('image/webp', 0.9);
    return;
  }
  control.progreso(ultimo);
}

// Sin 3D, la imagen fija pasa a la del control encendido y de frente (también con movimiento reducido).
export function mostrarPosterEncendido() {
  const img = document.querySelector<HTMLImageElement>('.control3d-poster');
  if (img) img.src = '/media/control-3d.webp';
}

function primeraOportunidad() {
  return new Promise<void>((listo) => {
    const eventos = ['scroll', 'pointermove', 'touchstart', 'keydown'] as const;
    const ya = () => { eventos.forEach((e) => window.removeEventListener(e, ya)); listo(); };
    eventos.forEach((e) => window.addEventListener(e, ya, { once: true, passive: true }));
    const libre = () => ('requestIdleCallback' in window ? requestIdleCallback(ya, { timeout: 3000 }) : setTimeout(ya, 2500));
    if (document.readyState === 'complete') libre(); else window.addEventListener('load', libre, { once: true });
  });
}
