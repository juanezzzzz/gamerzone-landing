// El póster de cada video se pide cuando el video está a menos de una pantalla y media de verse.
export function posters() {
  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const v = e.target as HTMLVideoElement;
      v.poster = v.dataset.poster!;
      observador.unobserve(v);
    }
  }, { rootMargin: '150% 0px' });
  document.querySelectorAll<HTMLVideoElement>('video[data-poster]').forEach((v) => observador.observe(v));
}

// Los videos marcados con data-auto solo se cargan y corren mientras están en pantalla.
export function videos() {
  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }
  }, { threshold: 0.25 });
  document.querySelectorAll<HTMLVideoElement>('video[data-auto]').forEach((v) => observador.observe(v));
}
