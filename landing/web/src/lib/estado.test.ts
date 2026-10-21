import { describe, expect, it } from 'vitest';
import { describirEstado } from './estado';

const todosLosDias = [0, 1, 2, 3, 4, 5, 6].map((dia) => ({ dia, abre: 8, cierra: 18 }));
const sinDomingo = todosLosDias.filter((d) => d.dia !== 0);

// Los textos llevan espacios que no se cortan; para comparar se leen como espacios normales.
const leer = (dias: typeof todosLosDias, dia: number, h: number) => {
  const e = describirEstado(dias, dia, h);
  return { ...e, texto: e.texto.replace(/ /g, ' ') };
};

describe('describirEstado', () => {
  it('abierto con horas y minutos para cerrar', () => {
    expect(leer(todosLosDias, 2, 15.75)).toEqual({ abierto: true, pronto: false, texto: 'Abierto, cierra en 2 h 15 min' });
  });

  it('horas exactas sin «0 min»', () => {
    expect(leer(todosLosDias, 2, 9).texto).toBe('Abierto, cierra en 9 h');
  });

  it('última hora antes de cerrar: pronto', () => {
    expect(leer(todosLosDias, 2, 17.5)).toEqual({ abierto: true, pronto: true, texto: 'Abierto, cierra en 30 min' });
  });

  it('a la hora de cierre ya está cerrado', () => {
    expect(leer(todosLosDias, 2, 18).texto).toBe('Cerrado, abre mañana a las 8 a. m.');
  });

  it('antes de abrir, con más de una hora', () => {
    expect(leer(todosLosDias, 2, 6)).toEqual({ abierto: false, pronto: false, texto: 'Cerrado, abre hoy a las 8 a. m.' });
  });

  it('antes de abrir, en la última hora: pronto', () => {
    expect(leer(todosLosDias, 2, 7.6)).toEqual({ abierto: false, pronto: true, texto: 'Cerrado, abre en 24 min' });
  });

  it('salta los días cerrados y nombra el día', () => {
    expect(leer(sinDomingo, 6, 20).texto).toBe('Cerrado, abre el lunes a las 8 a. m.');
    expect(leer(sinDomingo, 0, 10).texto).toBe('Cerrado, abre mañana a las 8 a. m.');
  });

  it('mediodía como «12 m.»', () => {
    const tarde = [{ dia: 3, abre: 12, cierra: 20 }];
    expect(leer(tarde, 3, 9).texto).toBe('Cerrado, abre hoy a las 12 m.');
  });

  it('sin horario', () => {
    expect(leer([], 3, 9).texto).toBe('Cerrado');
  });

  it('la hora y la duración no se parten en dos líneas', () => {
    expect(describirEstado(todosLosDias, 2, 6).texto).toContain('8 a. m.');
    expect(describirEstado(todosLosDias, 2, 15.75).texto).toContain('2 h 15 min');
  });
});
