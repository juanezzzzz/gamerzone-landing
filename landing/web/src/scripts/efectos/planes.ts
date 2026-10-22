import { gsap } from '../base/gsap';

export function planesScroll() {
  const carril = document.querySelector<HTMLElement>('.planes-carril');
  const strip = document.querySelector<HTMLElement>('.planes');
  if (!carril || !strip) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 64rem)', () => {
    const distance = () => strip.scrollWidth - carril.offsetWidth;

    gsap.to(strip, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: carril,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });
  });
}
