import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './base/gsap';
import { estado } from './base/estado';
import { cabecera } from './base/cabecera';
import { posters, videos } from './base/videos';
import { iniciarSonido } from './sonido';
import { escenaInicio, mostrarPosterEncendido } from './efectos/inicio';

// Lo que no está en la primera pantalla se carga cuando el navegador queda libre (o al primer scroll).
function cuandoLibre(fn: () => void) {
  let hecho = false;
  const una = () => { if (!hecho) { hecho = true; fn(); } };
  if ('requestIdleCallback' in window) requestIdleCallback(una, { timeout: 1500 });
  else setTimeout(una, 600);
  window.addEventListener('scroll', una, { once: true, passive: true });
}

export function iniciar() {
  estado();
  cabecera();
  iniciarSonido();
  posters();

  // Con movimiento reducido todo queda quieto y legible: sin scroll suave, sin escenas ni videos en marcha,
  // y el control del inicio como imagen fija ya encendida.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { mostrarPosterEncendido(); return; }

  videos();
  const lenis = new Lenis({ lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => { e.preventDefault(); lenis.scrollTo(a.getAttribute('href')!, { offset: -70 }); }),
  );

  escenaInicio();

  cuandoLibre(async () => {
    const [r, v] = await Promise.all([import('./efectos/recorrido'), import('./efectos/revelaciones')]);
    v.revelaciones();
    await r.recorridoEstaciones();
    ScrollTrigger.refresh();
  });
}
