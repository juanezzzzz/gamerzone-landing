// Celular: el mismo control 3D, pero como secuencia de fotogramas pre-renderizados que el scroll recorre
// (la técnica de las páginas de producto de Apple). Se ve igual que el 3D en vivo y no cuesta procesador.
// Los fotogramas los genera tools/control3d_poster.mjs en public/media/control-seq/.

export const FOTOGRAMAS = 24;
const ruta = (i: number) => `/media/control-seq/${String(i).padStart(2, '0')}.webp`;

export type Secuencia = { progreso: (p: number) => void };

export function crearSecuencia(contenedor: HTMLElement): Secuencia {
  const lienzo = document.createElement('canvas');
  lienzo.className = 'control3d-lienzo';
  const ctx = lienzo.getContext('2d')!;
  const imagenes: (HTMLImageElement | null)[] = Array(FOTOGRAMAS).fill(null);
  let actual = -1;
  let pedido = 0;
  let puesto = false;

  const dibujar = (i: number) => {
    // Si el fotograma pedido aún no llegó, se muestra el más cercano que ya cargó.
    let k = -1;
    for (let d = 0; d < FOTOGRAMAS && k < 0; d++) {
      if (imagenes[i - d]) k = i - d;
      else if (imagenes[i + d]) k = i + d;
    }
    if (k < 0 || k === actual) return;
    const img = imagenes[k]!;
    if (lienzo.width !== img.naturalWidth) { lienzo.width = img.naturalWidth; lienzo.height = img.naturalHeight; }
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    ctx.drawImage(img, 0, 0);
    actual = k;
    if (!puesto) { puesto = true; contenedor.append(lienzo); contenedor.classList.add('con-3d'); }
  };

  // Carga primero los extremos y el medio, después el resto, para que el recorrido sea fluido cuanto antes.
  const orden = [0, FOTOGRAMAS - 1, FOTOGRAMAS >> 1, ...Array.from({ length: FOTOGRAMAS }, (_, i) => i)];
  for (const i of new Set(orden)) {
    const img = new Image();
    img.decoding = 'async';
    img.src = ruta(i);
    img.decode().then(() => { imagenes[i] = img; if (i === pedido || actual === -1) dibujar(pedido); }).catch(() => {});
  }

  return {
    progreso(p) {
      pedido = Math.round(Math.max(0, Math.min(1, p)) * (FOTOGRAMAS - 1));
      dibujar(pedido);
    },
  };
}
