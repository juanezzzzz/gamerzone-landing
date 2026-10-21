import { hora, type Dia } from './hora';

const NOMBRES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const NB = ' ';

// «2 h 14 min», «35 min», «1 h» (con espacios que no se cortan)
function duracion(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (!h) return `${m}${NB}min`;
  return m ? `${h}${NB}h ${m}${NB}min` : `${h}${NB}h`;
}

export type Estado = { abierto: boolean; pronto: boolean; texto: string };

// El estado del local para un día (0 = domingo) y una hora decimal (14.5 = 2:30 p. m.), en hora de Colombia.
// «pronto» marca la última hora antes de cerrar o antes de abrir.
export function describirEstado(dias: Dia[], dia: number, ahora: number): Estado {
  const hoy = dias.find((d) => d.dia === dia);
  if (hoy && ahora >= hoy.abre && ahora < hoy.cierra) {
    const falta = Math.round((hoy.cierra - ahora) * 60);
    return { abierto: true, pronto: falta <= 60, texto: `Abierto, cierra en ${duracion(falta)}` };
  }
  if (hoy && ahora < hoy.abre) {
    const falta = Math.round((hoy.abre - ahora) * 60);
    return falta <= 60
      ? { abierto: false, pronto: true, texto: `Cerrado, abre en ${duracion(falta)}` }
      : { abierto: false, pronto: false, texto: `Cerrado, abre hoy a las ${hora(hoy.abre)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const sig = dias.find((d) => d.dia === (dia + i) % 7);
    if (sig) {
      const cuando = i === 1 ? 'mañana' : `el ${NOMBRES[sig.dia]}`;
      return { abierto: false, pronto: false, texto: `Cerrado, abre ${cuando} a las ${hora(sig.abre)}` };
    }
  }
  return { abierto: false, pronto: false, texto: 'Cerrado' };
}
