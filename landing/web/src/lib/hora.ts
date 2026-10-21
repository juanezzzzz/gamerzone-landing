// «8 a. m.», «12 m.», «6 p. m.»: la hora como se dice en Colombia. Sin dependencias, la usan el servidor y el navegador.
// Con espacios que no se cortan: «8 a. m.» nunca debe quedar partido en dos líneas.
const NB = ' ';
export const hora = (h: number) => (h === 12 ? `12${NB}m.` : h < 12 ? `${h}${NB}a.${NB}m.` : `${h - 12}${NB}p.${NB}m.`);

export type Dia = { dia: number; abre: number; cierra: number };
