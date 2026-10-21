import { gsap, SplitText } from '../base/gsap';

// Títulos que suben línea por línea desde una máscara (SplitText; se vuelve a partir si cambia el ancho
// o termina de cargar la fuente), listas en cascada, parallax suave en el video y la foto, y la línea
// de progreso de lectura bajo la cabecera.
export function revelaciones() {
  document.querySelectorAll<HTMLElement>('.seccion .titulo, .cierre-titulo').forEach((h) => {
    SplitText.create(h, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (s) => gsap.from(s.lines, {
        yPercent: 110, duration: 1.1, stagger: 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true },
      }),
    });
  });

  document.querySelectorAll<HTMLElement>('.seccion .entrada').forEach((p) =>
    gsap.from(p, { opacity: 0, y: 14, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 90%', once: true } }));

  document.querySelectorAll<HTMLElement>('.cascada').forEach((g) =>
    gsap.from(g.children, { opacity: 0, y: 18, duration: 0.7, stagger: 0.05, ease: 'power3.out', scrollTrigger: { trigger: g, start: 'top 85%', once: true } }));

  document.querySelectorAll<HTMLElement>('.marco-parallax').forEach((m) =>
    gsap.fromTo(m.firstElementChild, { yPercent: -7, scale: 1.16 }, {
      yPercent: 7, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true },
    }));

  // Las cifras cuentan desde cero hasta su valor al aparecer.
  document.querySelectorAll<HTMLElement>('[data-contar]').forEach((el) => {
    const contador = { v: 0 };
    el.textContent = '0'; // sin script se queda la cifra real del HTML
    gsap.to(contador, {
      v: Number(el.dataset.contar), duration: 1.4, ease: 'power3.out', snap: { v: 1 },
      onUpdate: () => { el.textContent = String(contador.v); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Así de fácil: la línea avanza con el scroll y cada paso se marca cuando la línea lo alcanza.
  const marco = document.querySelector<HTMLElement>('.pasos-marco');
  const avance = document.querySelector<HTMLElement>('.pasos-avance');
  const pasos = [...document.querySelectorAll<HTMLElement>('.paso')];
  if (marco && avance && pasos.length) {
    // --p va de 0 a 1; el CSS lo aplica a lo ancho en escritorio y a lo alto en celular.
    gsap.fromTo(avance, { '--p': 0 }, {
      '--p': 1, ease: 'none',
      scrollTrigger: {
        trigger: marco, start: 'top 75%', end: 'bottom 55%', scrub: 0.4,
        onUpdate: (s) => pasos.forEach((p, i) => p.classList.toggle('alcanzado', s.progress >= i / pasos.length + 0.02)),
      },
    });
  }

  // El control del cierre sube desde atrás y queda flotando, como el del inicio.
  const controlCierre = document.querySelector('.cierre-control img');
  if (controlCierre) {
    gsap.fromTo(controlCierre, { yPercent: 18, rotation: -8, scale: 0.86, opacity: 0 }, {
      yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: controlCierre, start: 'top 85%', once: true },
      onComplete: () => { gsap.to(controlCierre, { yPercent: -3, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }); },
    });
  }

  gsap.to('.progreso-pagina', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
}
