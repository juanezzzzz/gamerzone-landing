// Exporta cada neón de la landing como SVG suelto (fondo transparente, con resplandor), para redes o afiches.
//   node tools/neon_svg.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { FORMAS } from '../landing/web/src/data/neon.ts';

const COLORES = { control: '#52F2F2', pc: '#7B4DFF', futbol: '#2BD97C', sala: '#FF4F9A', parche: '#52F2F2', pastel: '#FF4F9A', trofeo: '#FFC233', fantasmas: '#52F2F2' };
const destino = new URL('../landing/recursos/neon/', import.meta.url);
mkdirSync(destino, { recursive: true });

for (const [nombre, { caja, trazo }] of Object.entries(FORMAS)) {
  const [, , w, h] = caja.split(' ').map(Number);
  // Margen alrededor del dibujo: usado como <img>, el SVG se recorta en su viewBox y cortaría el resplandor.
  const m = 28;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-m} ${-m} ${w + 2 * m} ${h + 2 * m}" width="${(w + 2 * m) * 4}" height="${(h + 2 * m) * 4}" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color:${COLORES[nombre]}">
  <defs><filter id="halo" filterUnits="userSpaceOnUse" x="${-m}" y="${-m}" width="${w + 2 * m}" height="${h + 2 * m}"><feGaussianBlur stdDeviation="7"/></filter></defs>
  <g stroke="currentColor" stroke-width="9" opacity="0.55" filter="url(#halo)">${trazo}</g>
  <g stroke="currentColor" stroke-width="4.2">${trazo}</g>
  <g stroke="#fff" stroke-width="1.3" opacity="0.75">${trazo}</g>
</svg>
`;
  writeFileSync(new URL(`${nombre}.svg`, destino), svg);
  console.log('neon/' + nombre + '.svg');
}
