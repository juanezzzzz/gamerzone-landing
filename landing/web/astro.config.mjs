// @ts-check
import { defineConfig } from 'astro/config';

// Landing del local GamerZone (marca del cliente, Z-12). Dominio por definir: cuando exista, ponerlo en
// `site` para que la imagen de compartir y la ficha de Google salgan con URL absoluta.
export default defineConfig({
  // El CSS pesa ~6 KB: va dentro del HTML para no bloquear el primer pintado con otra petición.
  build: { inlineStylesheets: 'always' },
});
