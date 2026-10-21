import type { Dia } from '../../lib/hora';
import { describirEstado } from '../../lib/estado';

// «Abierto, cierra en 2 h 14 min» / «Cerrado, abre mañana a las 8 a. m.» con la hora de Colombia,
// sin importar dónde esté el visitante. Actualiza cada bloque [data-estado] (cabecera y cierre) cada minuto.
function actualizar() {
  const bloques = [...document.querySelectorAll<HTMLElement>('[data-estado]')];
  const fuente = document.querySelector<HTMLElement>('[data-horario]');
  if (!bloques.length || !fuente) return;
  const dias: Dia[] = JSON.parse(fuente.dataset.horario || '[]');
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(partes.find((p) => p.type === 'weekday')!.value);
  const ahora = Number(partes.find((p) => p.type === 'hour')!.value) + Number(partes.find((p) => p.type === 'minute')!.value) / 60;

  document.querySelectorAll<HTMLElement>('[data-dia]').forEach((f) => f.classList.toggle('hoy', Number(f.dataset.dia) === dia));
  const e = describirEstado(dias, dia, ahora);
  for (const b of bloques) {
    b.classList.toggle('abierto', e.abierto);
    b.classList.toggle('pronto', e.pronto);
    const txt = b.querySelector('[data-estado-texto]');
    if (txt) txt.textContent = e.texto;
  }
}

export function estado() {
  actualizar();
  setInterval(actualizar, 60_000);
}
