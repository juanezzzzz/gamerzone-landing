// @ts-check
import { defineConfig } from 'astro/config';

// Landing del local GamerZone (marca del cliente, Z-12). Dominio por definir: cuando exista, ponerlo en
// `site` para que la imagen de compartir y la ficha de Google salgan con URL absoluta.
export default defineConfig({
  site: 'https://juanezzzzz.github.io',
  base: '/gamerzone-landing',
  build: { inlineStylesheets: 'always' },
});
