import { gsap, SplitText } from '../base/gsap';

// Títulos que suben línea por línea desde una máscara (SplitText; se vuelve a partir si cambia el ancho
// o termina de cargar la fuente), listas en cascada, parallax suave en el video y la foto, y la línea
// de progreso de lectura bajo la cabecera.
export function revelaciones() {
  // Hero titles: split by chars for dramatic staggered reveal
  document.querySelectorAll<HTMLElement>('.cierre-titulo, .juegos-titulo').forEach((h) => {
    SplitText.create(h, {
      type: 'chars', autoSplit: true,
      onSplit: (s) => gsap.from(s.chars, {
        opacity: 0, yPercent: 60, rotateX: -40, duration: 1, stagger: 0.025, ease: 'expo.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true },
      }),
    });
  });

  // Section titles: lines masked reveal
  document.querySelectorAll<HTMLElement>('.seccion .titulo').forEach((h) => {
    SplitText.create(h, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (s) => gsap.from(s.lines, {
        yPercent: 120, duration: 1.4, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true },
      }),
    });
  });

  document.querySelectorAll<HTMLElement>('.seccion .entrada').forEach((p) =>
    gsap.from(p, { opacity: 0, y: 20, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 90%', once: true } }));

  document.querySelectorAll<HTMLElement>('.cascada').forEach((g) =>
    gsap.from(g.children, { opacity: 0, y: 28, duration: 0.9, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: g, start: 'top 85%', once: true } }));

  document.querySelectorAll<HTMLElement>('.marco-parallax').forEach((m) =>
    gsap.fromTo(m.firstElementChild, { yPercent: -7, scale: 1.16 }, {
      yPercent: 7, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true },
    }));

  // El control del cierre sube desde atrás y queda flotando, como el del inicio.
  const controlCierre = document.querySelector('.cierre-control img');
  if (controlCierre) {
    gsap.fromTo(controlCierre, { yPercent: 22, rotation: -10, scale: 0.82, opacity: 0 }, {
      yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: controlCierre, start: 'top 85%', once: true },
      onComplete: () => { gsap.to(controlCierre, { yPercent: -4, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 }); },
    });
  }

  gsap.to('.progreso-pagina', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
}
