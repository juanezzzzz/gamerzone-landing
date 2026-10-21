# Landing GamerZone — ruta de diseño

> Página informativa **del local, con la marca de GamerZone** (como el reel, Z-12; Zyvo no
> aparece salvo en un crédito pequeño si el cliente lo acepta). Empezada el 2026-10-17.
> Mientras se producen los recursos visuales, se trabaja con los provisionales de
> `referencia/` y del material ya normalizado (`../local-comun/`).

## 1. El cliente y su público

**Qué es:** GamerZone E-Sports Center («ZonaGamer E-sport Center» en su ubicación de
Instagram), sala gamer de barrio: PC gamer con RGB, consolas Xbox, FIFA en pantallas grandes,
salas con sofás, puestos numerados en la pared (07, 11…) en amarillo, letrero de neón de
Pac-Man en la entrada, lámpara acrílica «Game Zone» y bebidas en el mostrador.

**Quién llega a la página (en orden):**

| Público | Qué busca en 10 segundos | Cómo llega |
| --- | --- | --- |
| Jóvenes 13–25 que ya juegan | ¿Qué hay (PC, consolas, juegos), cuánto vale la hora y está abierto ahora? | Link en la bio de Instagram/TikTok, WhatsApp |
| El parche que arma plan | ¿Caben varios?, ¿se puede reservar una sala?, ¿torneos? | Mensaje compartido en un grupo |
| Papás y mamás | ¿Es un lugar seguro?, ¿horario?, ¿dónde queda? | Google Maps, recomendación |
| Quien organiza cumpleaños o eventos | ¿Alquilan la sala?, ¿qué incluye? | Búsqueda o voz a voz |

**Consecuencias de diseño:**

- **Celular primero.** Casi todo el tráfico vendrá de redes y WhatsApp; el escritorio es secundario.
- **La conversión es un mensaje de WhatsApp o un «Cómo llegar»,** no un formulario ni una reserva
  online (no tienen sistema de reservas público; su software es interno de caja).
- **Abierto ahora / horario** tiene que verse sin bajar.
- **Confianza local:** dirección, fotos reales del lugar, reseñas de Google si las tienen.
- **Nada de precios, torneos ni promociones inventados** (regla de Zyvo): todo dato falta
  marcado `[corchetes]` hasta que el cliente lo confirme.

## 2. Referencias

### Salas reales (estructura y conversión)

| Sitio | Qué tomar | Qué no |
| --- | --- | --- |
| [EVO CLUB, Las Vegas](https://gg-pc.com/) | Hero con frase corta + **franja de datos** (horario, precio desde, internet); secciones numeradas «01 · The lineup»; tarifas lado a lado con «Más popular»; **contador «abre en…»**; barra fija abajo en celular con *Llamar* / *Reservar*; cierre con frase de una palabra («Pull up.») | Tarifas confusas por mezclar servicios |
| [Sky Gaming Lounge, Brooklyn](https://skygaminglounge.com/) | **«Elige tu estación»**: tarjeta por tipo de puesto con foto, para qué sirve y precio por hora; texto prellenado para escribir; marquesina con los juegos; reseñas de Google con nombre y fecha; FAQ corta | Cuatro botones en el hero (demasiados) |
| [Sixes Social Cricket](https://www.sixescricket.com/) | El juego como **plan social**: tarjetas por ocasión (cumpleaños, colegio, empresa), fotos de gente pasándola bien, marcador animado, copy con humor | Widget de reserva complejo (no aplica) |
| [Game Arena](https://www.game-arena.co/gaming-lounge), [Balance Patch](https://www.balancepatch.com/prices) | Tarifas por paquetes de horas (1 h / 3 h / día) y consolas por tamaño del grupo: el formato para cuando tengamos precios | — |

Patrón común de las mejores: **hero con el lugar de noche → qué hay (estaciones) → precios →
ocasiones/grupos → galería/video → reseñas → cómo llegar y horario → FAQ → cierre**, con el
mismo botón principal repetido en todo el recorrido.

### Estética (lo «top» de 2026)

- **Awwwards, Games & Entertainment** ([lista](https://www.awwwards.com/websites/games-entertainment/)):
  los premiados de sep–oct 2026 (Overworld Audio, The Tie-break, BEIGE FORCE!!, Night Drive)
  apuestan por pantalla como escenario: video o 3D a pantalla completa, tipografía enorme y
  microinteracciones de «juego» (hover que suena o vibra, contadores, cursores propios).
- **Tendencias que sí aplican** ([line25](https://line25.com/articles/web-design-trends-2026/),
  [studiomeyer](https://studiomeyer.io/en/blog/webdesign-trends-2026)): narrativa por scroll
  (CSS `scroll-timeline`, sin JS pesado), **bento grid** para «qué hay», tipografía cinética en
  el hero, modo oscuro por defecto, rendimiento como parte del diseño.
- **Lo que se evita:** WebGL/3D pesado (celulares de gama media, datos móviles), parallax
  complejo en celular, morado/rosado genérico «gamer» (la búsqueda de UI Pro Max propuso
  `#7C3AED` + `#F43F5E`; se descarta porque la marca ya tiene su cian).

## 3. Dirección visual: «Estación 07»

Concepto: **la página es el local de noche.** Pantallas encendidas en un cuarto oscuro, y cada
sección es un **puesto numerado** como los de la pared (01 PC GAMER, 02 CONSOLAS, 03 FÚTBOL…).
La numeración no es decoración: es la navegación.

| Elemento | Decisión | De dónde sale |
| --- | --- | --- |
| Fondo | Noche `#07090F` y superficies `#0E131C` | Muestreado del logo (reel del local) |
| Primario | Cian neón `#52F2F2` (botones, bordes de estación, brillos) | Logo |
| Acento | Ámbar de los números de puesto `#D97E18` (muestreado del «11» en v3, 2026-10-20) | Pared del local (v3, v8) |
| Texto | Blanco hueso `#E9EEF2` / gris `#8A97A6` | — |
| Títulos | **Chakra Petch** Bold Italic, mayúsculas, apretada | Ya usada en el reel (OFL, en `../local-comun/fonts/`) |
| Cuerpo | Chakra Petch Regular/Medium (o Inter si se ve pesada en párrafos) | UI Pro Max la recomienda para gaming |
| Números de puesto | Chakra Petch Bold Italic en amarillo, enormes, con el número cortado por el borde | Pared del local |
| Íconos | Lucide (SVG, trazo), nunca emojis | — |
| Texturas | Scanlines muy suaves sobre fotos, brillo de pantalla (glow) solo en el elemento activo | Reel del local (barrido cian y destello) |
| Logo | El PNG del cliente tal cual, sin redibujar; pedir versión en alta / vector | `ZONA GAMER/public/images/icono.png` |

**Movimiento** (Astro + GSAP + Lenis, como zyvo-web):

- Hero: video en bucle del local (sin audio, 6–8 s, < 2 MB) con el título entrando palabra por
  palabra al ritmo del reel: «¿LISTO PARA *JUGAR*?».
- Al entrar cada estación: el número barre de lado (barrido cian del reel) y la foto «enciende»
  como una pantalla (de negro a imagen con un parpadeo corto).
- Contador «Abierto ahora · cierra en 2 h 14 min» que cambia a «Abre mañana a las…».
- `prefers-reduced-motion`: todo aparece quieto; el video del hero queda en su portada.
- Sin sonido automático. Si se agrega un sonido de «moneda» al botón, que sea opcional.

## 4. Estructura de la página (celular primero)

| # | Sección | Contenido | Provisional mientras llegan recursos |
| --- | --- | --- | --- |
| 00 | Barra superior | Logo · «Abierto ahora» · botón WhatsApp | Logo actual |
| 01 | Hero | Video del local, «¿Listo para jugar?», franja: horario · dirección · [precio desde] · botones **Escríbenos** / **Cómo llegar** | Corte de v6 (letrero GAME ROOM) / v4 |
| 02 | Elige tu estación | Bento: PC GAMER · CONSOLAS · FÚTBOL · SALAS, cada una con foto, para qué sirve y [precio por hora] | Cuadros `referencia/cuadros/` v4, v2, v5, v6 |
| 03 | Juegos | Marquesina con los títulos (FIFA, Forza, Halo, GTA, Gang Beasts, Hitman…) | Lista vista en v2/v7; **confirmar** |
| 04 | Tarifas | Tabla por horas / paquetes / día, «Más pedido» | Todo en `[corchetes]` hasta tener precios |
| 05 | Planes en grupo | Cumpleaños · parche · torneos (solo los que existan) | Fotos de espaldas (v3, v8) |
| 06 | El lugar | Galería/reel: el reel del local 9:16 embebido + 6 fotos | `../local-reel-9x16/renders/` |
| 07 | Reseñas | 3–5 reseñas de Google con nombre y fecha | Ocultar si no hay |
| 08 | Visítanos | Mapa (imagen estática + enlace a Maps, no iframe pesado), dirección, horario por día, WhatsApp | ⚠ datos por confirmar |
| 09 | Preguntas | ¿Hay que reservar?, ¿menores de edad?, ¿venden bebidas?, ¿se puede llevar control propio? | Respuestas del cliente |
| 10 | Cierre | «Te esperamos.» + WhatsApp + redes | — |
| — | Barra fija (celular) | **WhatsApp** · **Cómo llegar** | — |

## 5. Recursos por producir (y especificación)

| Recurso | Para | Especificación |
| --- | --- | --- |
| Video del hero | 01 | Horizontal **y** vertical, 8–10 s, estable (trípode o gimbal), recorrido lento por el local de noche con pantallas prendidas; calidad original del celular, no por WhatsApp |
| 4 fotos de estación | 02 | Una por tipo (PC, consola, fútbol, sala), 4:5, oscuro con pantallas encendidas, sin caras de frente o con permiso |
| Detalles | 02/06 | Manos en el control, teclado RGB, número de puesto en la pared, neón de Pac-Man, lámpara «Game Zone» |
| Fachada de día | 08 | Para que la gente la reconozca al llegar |
| Ambiente con gente | 05/06 | Grupo jugando (de espaldas o con permiso) |
| Logo en alta | todas | PNG grande con fondo transparente o vector; si no existe, se pide al cliente (no se redibuja) |
| Portada para compartir | OG 1200×630 | Logo + «¿Listo para jugar?» sobre foto del local (se genera con satori como en zyvo-web) |

Mientras tanto: `referencia/cuadros/v1…v9.jpg` (cuadros de los videos de WhatsApp, 720×1280,
**solo provisionales**: baja calidad y algunos con stickers de Instagram).

## 6. Datos que faltan del cliente (⚠ no se inventan)

- [ ] Nombre a usar: «GamerZone» (logo) o «ZonaGamer» (Instagram). Mismo pendiente que el caso.
- [ ] Dirección, pin de Maps y si hay una o varias sedes.
- [ ] Horario vigente por día (el «8 a. m. – 6 p. m.» es de una historia navideña).
- [ ] WhatsApp (311 881 1689 visto en un afiche) y usuarios de Instagram/TikTok.
- [ ] Tarifas: PC y consola por hora, paquetes, alquiler de sala.
- [ ] Lista de juegos y consolas.
- [ ] ¿Torneos, cumpleaños, venta de bebidas? ¿Edad mínima o reglas?
- [ ] Reseñas de Google (¿tienen perfil de negocio?).
- [ ] Dominio o subdominio y quién lo paga; si aceptan el crédito «Hecho por Zyvo» en el pie.

## 7. Técnica

- **Astro + Tailwind 4 + GSAP + Lenis**, igual que `zyvo-web` (mismo flujo, se publica en Vercel).
- Una sola página estática; datos del local en un archivo (`src/data/local.ts`) para cambiar
  horario/precios sin tocar el diseño, con los faltantes como `[corchetes]`.
- Metas: LCP < 2,5 s en 4G, peso inicial < 1,5 MB (video del hero en AV1/H.264 a 720p, póster
  AVIF), imágenes AVIF/WebP con tamaño reservado.
- SEO local: título «Sala gamer en [ciudad] · GamerZone», datos estructurados
  `LocalBusiness`/`EntertainmentBusiness` con horario y dirección, enlace al perfil de Google.
- Accesibilidad: contraste AA (cian sobre noche pasa; amarillo sobre noche verificar), foco
  visible, botones ≥ 44 px, movimiento reducido.

## 8. Ruta (fases)

| Fase | Qué | Sale | Quién |
| --- | --- | --- | --- |
| **F0** | Datos del cliente (sección 6) y recursos (sección 5) | Lista respondida, carpeta `recursos/` | Cliente |
| **F1** | Wireframe celular + escritorio con provisionales; muestreo de colores reales | `wireframe` navegable | Diseño |
| **F2** | Diseño alta fidelidad del hero y «Elige tu estación» (las dos piezas que definen el estilo); aprobación | Prototipo con movimiento | Diseño → revisión |
| **F3** | Resto de secciones, barra fija, contador de horario, FAQ | Página completa con `[corchetes]` | Diseño |
| **F4** | Cambio de provisionales por recursos reales y datos confirmados | Página final | Ambos |
| **F5** | Revisión: rendimiento, accesibilidad, celulares reales, OG; publicación y enlace en la bio | En línea | Ambos |

## 9. Estado (2026-10-17): F1 + F2 hechas con provisionales

Página completa en `web/` (Astro 5.18 + GSAP + Lenis, sin Tailwind; CSS propio):

```bash
python tools/medios_landing.py            # medios provisionales → web/public/media/
cd landing/web && npm install && npx astro build && npx astro preview --port 4330
node tools/revisar_landing.mjs            # capturas en landing/revision/ (celular y escritorio)
```

- **Idea fuerte: la luz cambia de sala en sala.** Cada sección lleva `data-luz`; al bajar, el
  resplandor de fondo toma el color de la estación en pantalla (PC morado, consolas cian,
  fútbol verde, salas rosado neón, «Visítanos» amarillo). Lo demás va sobrio.
- **Un solo momento orquestado:** al cargar, la pantalla del inicio se enciende como un televisor
  (línea → imagen con destello) y entra el título. Las fotos de estación «encienden» una vez.
- Celular: video a pantalla completa, sombra solo en la franja del texto; los botones van en la
  barra fija de abajo (WhatsApp / Cómo llegar). Escritorio: el video vertical en su propia pantalla.
- Números de puesto en amarillo pintura (07, 11, 03, 12: los que se ven en las paredes).
- Estado «Abierto hasta las 6 p. m.» calculado con la hora de Colombia desde `HORARIO`.
- **Datos:** todo en `web/src/data/local.ts`. Lo no confirmado lleva `pendiente: true` y se ve
  subrayado en ámbar con un aviso «Borrador: N datos por confirmar»; `REVISION = false` lo quita
  (y quita el `noindex`).
- Revisado: sin errores de consola, sin desborde horizontal a 390 px, `prefers-reduced-motion`
  deja todo quieto y el video en su portada.

Siguiente: F0 (datos y recursos) → F4 (cambiar `public/media/*` por lo real).

## 10. Estado (2026-10-20): neones en vez de fotos provisionales

Las fotos (cuadros de WhatsApp) se veían borrosas y hacían ver la página provisional. Se cambiaron
por **letreros de neón dibujados en SVG** (`src/data/neon.ts` + `src/components/Neon.astro`),
en el estilo de los del local: Pac-Man y fantasmas de la puerta, montados sobre la malla de alambre
(`.malla`). Cada estación, plan y la sección «Visítanos» tiene su neón; se encienden con parpadeo.

- Hero: el letrero se dibuja tubo por tubo al cargar; ya no hay video en el inicio.
- Único video: `inicio.mp4` dentro de un televisor con líneas de barrido en «Así se ve por dentro»,
  solo se reproduce mientras está en pantalla.
- `reel.mp4` y todas las fotos se movieron a `referencia/descartados/` (no se borraron).
  ⚠ `tools/medios_landing.py` las vuelve a copiar a `public/media/` si se corre otra vez.
- Cuando lleguen fotos reales buenas (sección 5), pueden volver como complemento de los neones.

### Más premium (mismo día)

- **Inicio con scroll:** el letrero empieza solo, centrado y grande; al bajar (fijado con ScrollTrigger)
  va a su sitio, la luz se derrama en la pared, aparece su reflejo en el piso (escritorio) y entra el título.
- **Con mouse:** linterna sobre la malla de alambre y el letrero se inclina hacia el cursor.
- **Grano de película** encima de todo; **zumbido de neón** sintetizado (`scripts/sonido.ts`), apagado
  por defecto, con botón en la cabecera.
- **Videos del local** (`ZONA GAMER/videos zona/descargas`, los mismos 9 de `fuente/local`):
  `tools/clips_landing.ps1` corta un clip de 3–4 s por estación (fondo en blanco y negro, oscuro y
  teñido del color de la estación) y un montaje de 10 s para el televisor. Todo pesa ~1,2 MB y solo
  se carga cuando está en pantalla. `inicio.mp4` pasó a `referencia/descartados/`.

### Ajuste: más seria e informativa

«Mucho negro y demasiado neón; debe ser informativa y seria. El scroll es un punto fuerte.»

- **Oscuro y neón solo en el inicio** (la escena del scroll se queda). Desde «Escoge dónde jugar» la
  página es clara: papel `#F2F4F7`, tarjetas blancas, texto `#10151C`, gris `#545E6B`, acento
  `#0A7A85` (cian con contraste AA) y ámbar `#B45F0B` para los números de puesto.
- **Tipografía: una sola familia, Archivo variable** (`@fontsource-variable/archivo/wdth.css`).
  Títulos expandidos (ancho 120–125 %, peso 800–850, interletra negativa, `text-wrap: balance`);
  texto a 106 % de ancho; rótulos pequeños a 108 % con interletra positiva. Escala de tercera mayor
  sobre 17 px (`--t-xs` … `--t-xxl`), cifras tabulares en precios y horarios, y el «¿» del título
  colgado fuera del margen en pantallas medianas y grandes. Se quitaron Chakra Petch e Inter.
- Estaciones: tarjeta blanca con el clip del local **a color** arriba y precio abajo. Juegos como
  lista, tarifas como tabla, planes con íconos Lucide, «Cómo llegar» con foto real de la fachada
  (`media/fachada.webp`, sacada de v9 sin los stickers de Instagram).
- La cabecera es oscura translúcida sobre la sala y se vuelve blanca al llegar a la información.

### El scroll como hilo de toda la página

- **Cierre de la sala:** al final del inicio fijado, la sala se encoge en una tarjeta redondeada
  (`clip-path`) y deja ver la página clara; la cabecera pasa a blanca en ese momento.
- **Recorrido de estaciones (escritorio ≥ 64rem):** pantalla fija a la izquierda con el clip de la
  estación activa (cambio con barrido y zoom), número de puesto grande y barra de progreso; a la
  derecha bajan las estaciones y la activa se ilumina. Lo activa el script con la clase
  `recorrido-activo`; sin script, con movimiento reducido o en celular quedan las tarjetas.
- Títulos que suben desde una máscara, filas y tarjetas en cascada, parallax en el video del
  local y en la foto de la fachada, y línea de progreso de lectura bajo la cabecera.

## 11. Recursos y refactor (2026-10-20)

### Carpeta `landing/recursos/` (la biblioteca; la web se genera desde aquí)

| Carpeta | Qué hay | Cómo se genera |
| --- | --- | --- |
| `video/tomas/` | 11 tomas maestras (casi sin pérdida, sin audio) | `tools/recursos.ps1` desde `ZONA GAMER/videos zona/descargas` |
| `imagenes/fotogramas/` | un fotograma representativo por toma | idem (filtro `thumbnail`) |
| `imagenes/logo/` | logo del cliente | copia de `local-comun/img` |
| `neon/` | los 8 neones como SVG sueltos (redes, afiches) | `node tools/neon_svg.mjs` |
| `animaciones/reel-lugar/` | reel HyperFrames de 12 s en 4:5 para «Así se ve por dentro» | HyperFrames (`general-video`) |

`tools/clips_landing.ps1` saca de las tomas los clips web (AV1 `.webm` + H.264 `.mp4` + póster) a
`web/public/media/clips/`, y del último render del reel (`reel-lugar/renders/`) el `reel` de 720×900
que se ve en «Así se ve por dentro» (sin parallax, para no recortar sus rótulos). Para cambiar el reel:
editarlo en Studio (`npx hyperframes preview --background` dentro de `reel-lugar`), renderizar con
`npm run render` y volver a correr `clips_landing.ps1`.

### Arquitectura de `web/`

- `src/pages/index.astro` solo compone: `layouts/Base.astro` + `components/secciones/*`
  (Cabecera, Inicio, Estaciones, Informacion, Lugar, Preguntas, Pie). `components/Video.astro` pone
  AV1 primero y H.264 de respaldo.
- `src/scripts/main.ts` arranca lo esencial (estado, cabecera, sonido, Lenis, escena del inicio) y
  carga el resto cuando el navegador queda libre: `efectos/recorrido.ts`, `revelaciones.ts`,
  `cursor.ts`. `efectos/pantalla-gl.ts` (OGL, ~15 KB gzip) solo se descarga en escritorio con WebGL.
- GSAP con plugins gratuitos: **SplitText** (títulos línea por línea con máscara), **DrawSVG**
  (los neones se dibujan desde el centro de cada tubo; por eso `neon.ts` ya no usa `pathLength`).
  MorphSVG se descartó: los neones tienen varias piezas y el morph de un solo trazo los deforma.
- Recorrido de escritorio: la pantalla fija mezcla los videos con un **shader** (borde líquido con
  filo cian y separación RGB según la velocidad del scroll); el neón de la estación retrae sus tubos
  y dibuja el siguiente. Sin WebGL, barrido con `clip-path`.
- La fachada usa `<Picture>` de Astro (AVIF 22 KB, respaldo WebP).

### Antes de publicar (F5)

- **Imagen para compartir** `public/media/og.jpg` (1200×630, `node tools/og_imagen.mjs`): letrero,
  título y logo. Metaetiquetas Open Graph y `twitter:card` completas.
- **Ficha de Google** (`EntertainmentBusiness` en JSON-LD, en `layouts/Base.astro`): se publica sola
  cuando `REVISION = false`; mientras tanto la página lleva `noindex`.
- **Lighthouse en celular** (red lenta simulada), 2026-10-20: rendimiento 100, accesibilidad 100,
  buenas prácticas 100, LCP 1,9 s, 187 KB iniciales. SEO 63 solo por el `noindex` del borrador.
  Lo que lo subió: logo de 222 KB → AVIF de 1–4 KB, `preload` de la fuente, CSS dentro del HTML y
  pósters de video que se piden al acercarse.
- **Faltan del cliente** (sección 6): dirección, horario vigente, tarifas, Instagram, respuestas de
  las preguntas, nombre definitivo y dominio. Con el dominio: poner `site` en `astro.config.mjs`
  (la imagen de compartir y la ficha necesitan URL absoluta) y pasar `REVISION` a `false`.
- **Plantilla HyperFrames** `reel-estaciones-local` guardada (nivel personal) para hacer otro reel
  igual: «haz otro reel-estaciones-local».

## 12. Mejoras sin datos del cliente (2026-10-20)

- **Reloj del horario** en la cabecera: «Abierto, cierra en 2 h 14 min» / «Cerrado, abre mañana a
  las 8 a. m.»; en la última hora el punto pasa a ámbar y respira. Cálculo puro en `src/lib/estado.ts`.
- **Reel para historias** (`recursos/animaciones/reel-historias`, 9:16, 14 s): misma receta, con zonas
  seguras de Instagram (250 px arriba, 340 px abajo), toma completa de las torres y tarjeta de cierre
  «¿Listo para jugar? / Escríbenos por WhatsApp» con los neones de la landing.
- **Entregables para redes** en `recursos/video/redes/`: `gamerzone-historia-estaciones-9x16.mp4`
  (historias de Instagram/TikTok, 14 s) y `gamerzone-reel-estaciones-4x5.mp4` (publicación del feed,
  12 s en bucle). Ambos sin audio: la música se elige dentro de la app.
- **Neones SVG** exportados con margen en el `viewBox`: usados como `<img>` el resplandor ya no se
  corta en un recuadro.
- **Pruebas**: `npm test` (Vitest, 9 pruebas del reloj) y `tools/pruebas_landing.py` (Playwright con el
  Chrome del sistema, 23 pruebas: consola, desbordes, escena del inicio, recorrido con WebGL, celular,
  movimiento reducido, accesibilidad de enlaces y metaetiquetas). Todo junto:
  `powershell -File tools/verificar_landing.ps1`.

## 13. Segunda pasada de diseño (2026-10-21)

Crítica: después del recorrido la página se volvía una plantilla (mismo «título izquierda, contenido
derecha» tres veces, blanco muerto, sin marca) y terminaba sin cierre. Cambios:

- **Juegos**: la lista junto a una pantalla con el video real de la biblioteca de la Xbox del local
  (clip `juegos`, de la toma `biblioteca-xbox`).
- **Tarifas**: marcador a lo ancho en dos columnas, sin columna vacía.
- **Planes**: cada uno con su neón (grupo, pastel, trofeo) sobre la malla del letrero; se dibujan y
  parpadean al llegar.
- **Cierre nuevo** (`Cierre.astro`): tarjeta oscura que espeja el final del inicio, «TE ESPERAMOS.» a
  todo el ancho, estado del horario en vivo, dirección, WhatsApp y Cómo llegar, y el letrero de la puerta.
- **Pie** con navegación a las secciones.
- **Celular**: el título del inicio se ve desde la primera pantalla; el scroll solo enciende la luz y
  cierra la sala en tarjeta. La invitación «Desliza…» queda solo en escritorio.
- Títulos de sección más grandes (`--t-xl` hasta 3,9rem) y horas con espacios que no se cortan.
- Prueba nueva: ningún título, botón o párrafo se sale de la pantalla (detectó el cierre recortado
  en celular, que la prueba de scroll horizontal no veía).

## 14. Datos genéricos y más contenido (2026-10-21)

Se llenó la página con información genérica para que no se viera vacía. **Todo lo
inventado sigue con `pendiente: true`** (subrayado en el borrador) y hay que reemplazarlo antes de
publicar:

- Dirección «Calle 15 # 21-40, Centro», Instagram «@gamerzone.yopal», horario por tramos
  (lunes a jueves 10–21, viernes y sábado 10–23, domingo 12–20).
- Precios: PC $3.000/h, consola $5.000/h, fútbol $6.000/h, sala $15.000/h, paquete 3 h PC $8.000,
  pase de día $20.000.
- Qué incluye cada estación (monitor de 144 Hz, Game Pass, pantallas de 50 y 65 pulgadas…), juegos
  extra (Fortnite, Valorant, LoL, CoD, Minecraft, Rocket League, MK1, Fall Guys), textos de planes
  (torneos mensuales de EA FC y Fortnite), respuestas de las preguntas y «wifi gratis».
- Real (de los videos): aire acondicionado, bebidas en el mostrador, la biblioteca de Xbox y las fotos.

Contenido nuevo: franja de cifras calculada de los datos (con conteo), «Incluye» en cada estación,
«Así de fácil» (3 pasos), comodidades con íconos, galería de 6 fotos reales del local en AVIF, y
«Hoy» con el estado en vivo en el inicio. El horario se agrupa por tramos (`agruparHorario`, con
pruebas). Pruebas: 13 unitarias y 29 de extremo a extremo.

## 15. Control 3D en el inicio (2026-10-21)

Se conservó el concepto y el scroll, pero el control de líneas no convencía. El
control de líneas de neón se cambió por un **control 3D** (`efectos/control3d.ts`, Three.js 0.185):
cuerpo extruido de la misma silueta con bisel, plástico grafito con clearcoat, sticks de goma,
cruceta, bumpers, botones translúcidos, entorno de estudio y contraluces cian y rosa. El scroll lo
gira de escorzo a frente y lo enciende: una franja LED cian → violeta → rosa recorre el borde y al
final se prende el botón central (con zumbido si el sonido está activo). En escritorio sigue al cursor.

- **Escritorio:** 3D en vivo, cargado con la primera interacción o cuando el navegador queda libre
  (armar la escena costaba ~2,5 s de bloqueo en Lighthouse si se hacía al cargar).
- **Celular:** 24 fotogramas pre-renderizados del mismo control (`efectos/secuencia.ts`,
  `public/media/control-seq/`, 417 KB que se piden después de cargar) que recorre el scroll.
- **Sin WebGL o movimiento reducido:** imagen fija encendida `control-3d.webp`; mientras carga,
  `control-3d-inicio.webp` en la pose inicial.
- Todo se regenera con `node tools/control3d_poster.mjs` (la página se renderiza a sí misma con
  `?poster=<0..1>`). La imagen para compartir usa el control 3D.
- Lighthouse celular: rendimiento 94, LCP 3,1 s, bloqueo 50 ms.
- Fuera de la web ya no hay neones de líneas: los planes son afiches con fotos reales del local
  (pareja en el puesto 11, sala con sofá, jugador en PC), el cierre lleva el control 3D encendido
  (sube y queda flotando), la pantalla del recorrido muestra número y nombre del puesto, y la
  tarjeta final del reel de historias usa el control 3D (render y entregable actualizados).
- Se borraron `Neon.astro`, `efectos/cursor.ts`, el plugin DrawSVG y los estilos `.malla`/`.titila`.

## 16. Tercera pasada de diseño (2026-10-21)

- **Juegos:** marquesina de títulos grandes a lo ancho (una fila en contorno, otra rellena, en
  sentidos opuestos; se pausa al pasar el mouse) bajo la pantalla con la biblioteca real.
- **Tarifas:** banda oscura con carta «por hora» (puntos guía) y dos paquetes (`PAQUETES` en
  `data/local.ts`); el pase de día va destacado con su botón cian. Precios genéricos, pendientes.
- **Así de fácil:** números 01–03 en contorno que se rellenan cuando la línea los alcanza; la línea
  avanza con el scroll (vertical en celular, horizontal en escritorio).
- **Cómo llegar:** horario de la semana en tabla con el día de hoy resaltado en vivo.
- **Preguntas:** acordeón de tarjetas (una abierta a la vez, apertura suave con `::details-content`
  donde el navegador lo soporta) y tarjeta oscura «¿Tu pregunta no está?» fija al lado.
  `data/neon.ts` y `recursos/neon/` siguen para piezas de redes.
