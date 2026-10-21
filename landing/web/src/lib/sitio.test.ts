import { describe, expect, it } from 'vitest';
import { agruparHorario } from './sitio';

const sinNbsp = (filas: { dia: string; rango: string }[]) => filas.map((f) => `${f.dia}, ${f.rango.replace(/ /g, ' ')}`);

describe('agruparHorario', () => {
  it('todos los días igual', () => {
    const d = [0, 1, 2, 3, 4, 5, 6].map((dia) => ({ dia, abre: 8, cierra: 18 }));
    expect(sinNbsp(agruparHorario(d))).toEqual(['Todos los días, 8 a. m. a 6 p. m.']);
  });

  it('agrupa días seguidos y usa «y» para dos, «a» para más', () => {
    const d = [
      ...[1, 2, 3, 4].map((dia) => ({ dia, abre: 10, cierra: 21 })),
      ...[5, 6].map((dia) => ({ dia, abre: 10, cierra: 23 })),
      { dia: 0, abre: 12, cierra: 20 },
    ];
    expect(sinNbsp(agruparHorario(d))).toEqual([
      'Lunes a jueves, 10 a. m. a 9 p. m.',
      'Viernes y sábado, 10 a. m. a 11 p. m.',
      'Domingo, 12 m. a 8 p. m.',
    ]);
  });

  it('marca los días sin horario como cerrados', () => {
    const d = [1, 2, 3, 4, 5, 6].map((dia) => ({ dia, abre: 9, cierra: 19 }));
    expect(sinNbsp(agruparHorario(d))).toEqual(['Lunes a sábado, 9 a. m. a 7 p. m.', 'Domingo, Cerrado']);
  });
});
