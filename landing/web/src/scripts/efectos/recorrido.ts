import { gsap, ScrollTrigger } from '../base/gsap';
import type { PantallaGL } from './pantalla-gl';

const ESCRITORIO = '(min-width: 64rem)';
const hayWebGL = () => { try { return !!document.createElement('canvas').getContext('webgl'); } catch { return false; } };

// Escritorio: la pantalla de la izquierda se queda fija y, cuando cada estación de la derecha llega al centro,
// cambia el video (con WebGL, un borde líquido; sin WebGL, un barrido), el número y el nombre del puesto se
// reemplazan y en el control de la esquina se enciende el botón de esa estación.
export async function recorridoEstaciones() {
  const seccion = document.getElementById('estaciones');
  const escenario = document.querySelector<HTMLElement>('.escenario');
  const capas = [...document.querySelectorAll<HTMLElement>('.escenario-capa')];
  const paneles = [...document.querySelectorAll<HTMLElement>('.estaciones .estacion')];
  const num = document.querySelector<HTMLElement>('.escenario-num');
  const nombre = document.querySelector<HTMLElement>('.escenario-nombre');
  const barras = [...document.querySelectorAll<HTMLElement>('.escenario-progreso li')];
  const anillos = [...document.querySelectorAll<HTMLElement>('.mando-anillo')];
  if (!seccion || !escenario || !capas.length || !num) return;
  const videos = capas.map((c) => c.querySelector('video')!);

  // OGL solo se descarga en escritorio y si el navegador tiene WebGL.
  const crearPantallaGL = window.matchMedia(ESCRITORIO).matches && hayWebGL()
    ? (await import('./pantalla-gl')).crearPantallaGL : null;

  gsap.matchMedia().add(ESCRITORIO, () => {
    seccion.classList.add('recorrido-activo');
    let velocidad = 0;
    const leerVelocidad = () => (velocidad *= 0.9);
    const pantalla: PantallaGL | null = crearPantallaGL?.(escenario, videos, gsap, leerVelocidad) ?? null;
    if (pantalla) escenario.classList.add('con-gl');

    let actual = 0;
    let previo = -1;
    let visible = false;
    // Durante la mezcla corren dos videos (el que se va y el que llega); el resto queda en pausa.
    const reproducir = () => videos.forEach((v, i) => (visible && (i === actual || i === previo) ? v.play().catch(() => {}) : v.pause()));

    const cambiarVideo = (antes: number, i: number) => {
      if (pantalla) {
        pantalla.cambiar(antes, i, 1.1);
        return;
      }
      capas.forEach((c, k) => (c.style.zIndex = k === i ? '2' : k === antes ? '1' : '0'));
      gsap.fromTo(capas[i], { clipPath: i > antes ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut', overwrite: true,
        onComplete: () => capas.forEach((c, k) => { if (k !== actual) c.style.clipPath = 'inset(100% 0% 0% 0%)'; }),
      });
      gsap.fromTo(videos[i], { scale: 1.18 }, { scale: 1, duration: 1.3, ease: 'expo.out' });
    };

    const mostrar = (i: number) => {
      paneles.forEach((p, k) => p.classList.toggle('activa', k === i));
      barras.forEach((b, k) => b.classList.toggle('lleno', k <= i));
      anillos.forEach((a, k) => a.classList.toggle('activo', k === i));
      if (i === actual) return;
      const antes = actual;
      actual = i;
      previo = antes;
      gsap.delayedCall(1.3, () => { if (previo === antes) { previo = -1; reproducir(); } });
      cambiarVideo(antes, i);
      gsap.timeline()
        .to(num, { yPercent: i > antes ? -40 : 40, opacity: 0, duration: 0.25, ease: 'power2.in' })
        .call(() => { num.textContent = paneles[i].dataset.puesto ?? ''; if (nombre) nombre.textContent = paneles[i].dataset.nombre ?? ''; })
        .fromTo(num, { yPercent: i > antes ? 40 : -40 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'expo.out' });
      reproducir();
    };

    paneles.forEach((p, i) => ScrollTrigger.create({
      trigger: p, start: 'top 55%', end: 'bottom 55%',
      onToggle: (s) => { if (s.isActive) mostrar(i); },
    }));
    ScrollTrigger.create({
      trigger: '.recorrido', start: 'top bottom', end: 'bottom top',
      onToggle: (s) => { visible = s.isActive; pantalla?.encender(visible); reproducir(); },
      onUpdate: (s) => { velocidad = gsap.utils.clamp(-1, 1, s.getVelocity() / 2500); },
    });
    mostrar(0);

    return () => {
      seccion.classList.remove('recorrido-activo');
      escenario.classList.remove('con-gl');
      pantalla?.destruir();
      videos.forEach((v) => v.pause());
      capas.forEach((c) => { c.style.clipPath = ''; c.style.zIndex = ''; });
    };
  });
}
