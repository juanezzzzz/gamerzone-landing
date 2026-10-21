// Datos derivados que comparten varias secciones.
import { ESTACIONES, HORARIO, JUEGOS, MENSAJE_WA, NEGOCIO } from '../data/local';
import { hora, type Dia } from './hora';

export const WA = `https://wa.me/${NEGOCIO.whatsapp.numero}?text=${encodeURIComponent(MENSAJE_WA)}`;

const NOMBRES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const may = (s: string) => s[0].toUpperCase() + s.slice(1);

// Agrupa los días seguidos con el mismo horario, de lunes a domingo:
// «Lunes a jueves, 10 a. m. a 9 p. m.», «Viernes y sábado, …», «Domingo, …». Un día sin horario: «Cerrado».
export function agruparHorario(dias: Dia[]) {
  const semana = [1, 2, 3, 4, 5, 6, 0].map((n) => ({ n, d: dias.find((x) => x.dia === n) }));
  const grupos: { desde: number; hasta: number; rango: string; cuantos: number }[] = [];
  for (const { n, d } of semana) {
    const rango = d ? `${hora(d.abre)} a ${hora(d.cierra)}` : 'Cerrado';
    const ultimo = grupos.at(-1);
    if (ultimo && ultimo.rango === rango) { ultimo.hasta = n; ultimo.cuantos++; } else grupos.push({ desde: n, hasta: n, rango, cuantos: 1 });
  }
  return grupos.map((g) => {
    const dia = g.cuantos === 7 ? 'Todos los días'
      : g.cuantos === 1 ? may(NOMBRES[g.desde])
      : `${may(NOMBRES[g.desde])} ${g.cuantos === 2 ? 'y' : 'a'} ${NOMBRES[g.hasta]}`;
    return { dia, rango: g.rango };
  });
}

export const FILAS_HORARIO = agruparHorario(HORARIO.dias);

// La hora de cierre más tardía de la semana, para los datos de la franja.
export const CIERRE_MAS_TARDE = hora(Math.max(...HORARIO.dias.map((d) => d.cierra)));
export const DIAS_ABIERTO = HORARIO.dias.length;
export const CUANTOS = { estaciones: ESTACIONES.length, juegos: JUEGOS.lista.length };

export const ICONO_PIN = '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>';
