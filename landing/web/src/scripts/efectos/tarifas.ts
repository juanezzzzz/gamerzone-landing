import { gsap } from '../base/gsap';

export function tarifasPinned() {
  const pin = document.querySelector<HTMLElement>('.tarifas-pin');
  const paneles = [...document.querySelectorAll<HTMLElement>('.paso-panel')];
  if (!pin || paneles.length < 2) return;

  // Only pin on desktop
  const mm = gsap.matchMedia();
  mm.add('(min-width: 64rem)', () => {
    const total = paneles.length;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: `+=${total * 100}%`,
        pin: true,
        scrub: 0.6,
      },
    });

    paneles.forEach((panel, i) => {
      if (i > 0) {
        tl.fromTo(paneles[i - 1],
          { opacity: 1, yPercent: 0 },
          { opacity: 0, yPercent: -15, duration: 0.4 },
        );
        tl.fromTo(panel,
          { opacity: 0, yPercent: 15 },
          { opacity: 1, yPercent: 0, duration: 0.4 },
        );
        // Hold on each step
        tl.to(panel, { duration: 0.3 });
      } else {
        // Hold on first step
        tl.to(panel, { duration: 0.3 });
      }
    });

    // Fade out last step
    tl.to(paneles[total - 1], { opacity: 0, yPercent: -15, duration: 0.3 });
  });
}
