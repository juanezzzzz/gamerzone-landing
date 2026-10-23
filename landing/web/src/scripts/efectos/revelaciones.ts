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

  // Counter animation: números cuentan desde 0
  document.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
    const target = parseInt(el.dataset.countTo || '0', 10);
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 1.8, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = String(Math.round(obj.val)); },
    });
  });

  // Secciones completas: fade + slide sutil al entrar al viewport
  document.querySelectorAll<HTMLElement>('.seccion, .declaracion, .galeria-seccion, .torneos-seccion').forEach((s) => {
    // No animar secciones que ya tienen su propia animación controlada (inicio, estaciones en desktop)
    if (s.id === 'inicio' || s.id === 'estaciones') return;
    gsap.from(s, {
      opacity: 0, y: 40, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: s, start: 'top 85%', once: true },
    });
  });

  // Statement word reveal: cada palabra pasa de apagada a encendida con el scroll
  const declaracion = document.querySelector<HTMLElement>('.declaracion-texto');
  if (declaracion) {
    SplitText.create(declaracion, {
      type: 'words', autoSplit: true,
      onSplit: (s) => {
        gsap.set(s.words, { opacity: 0.15 });
        gsap.to(s.words, {
          opacity: 1, duration: 0.3, stagger: 0.06, ease: 'none',
          scrollTrigger: { trigger: declaracion, start: 'top 75%', end: 'bottom 50%', scrub: true },
        });
      },
    });
  }

  // Gallery cells: scale in from 0.95 for editorial weight
  document.querySelectorAll<HTMLElement>('.galeria-celda').forEach((c) =>
    gsap.from(c, {
      scale: 0.95, opacity: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: c, start: 'top 90%', once: true },
    }));

  // Cierre: subtle scale for visual weight
  const cierre = document.querySelector<HTMLElement>('.cierre-titulo');
  if (cierre) {
    gsap.from(cierre, {
      scale: 0.96, opacity: 0.6, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: cierre, start: 'top 85%', once: true },
    });
  }

  gsap.to('.progreso-pagina', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
}
