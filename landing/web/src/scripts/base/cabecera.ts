// Oscura translúcida sobre la sala; blanca cuando la información llega debajo de ella
// o cuando la sala empieza a cerrarse en tarjeta (efectos/inicio.ts marca data-cerrando).
let actualizar = () => {};

export function cabecera() {
  const c = document.querySelector('.cabecera');
  const info = document.getElementById('estaciones');
  const inicio = document.querySelector<HTMLElement>('.inicio');
  actualizar = () => {
    c?.classList.toggle('con-fondo', window.scrollY > 40);
    c?.classList.toggle('clara', (!!info && info.getBoundingClientRect().top <= 72) || inicio?.dataset.cerrando === '1');
  };
  actualizar();
  window.addEventListener('scroll', () => actualizar(), { passive: true });
}

export const actualizarCabecera = () => actualizar();
