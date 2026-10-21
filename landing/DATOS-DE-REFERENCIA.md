# Datos de referencia de la landing

La página se ve completa con información realista, pero **no todo es información confirmada por el
negocio**. Esta lista separa lo real de lo que es referencia, para reemplazarlo antes de publicar.

En el código, cada dato de referencia lleva `pendiente: true` en `web/src/data/local.ts` (o
`<Dato pendiente>` en los componentes, que en el HTML queda como el atributo `data-referencia`). En
la página no se marca de ninguna forma. Mientras `REVISION = true`, la página lleva `noindex` y no
publica la ficha de negocio para Google.

## Real (visto en el material del local)

| Dato | De dónde sale |
| --- | --- |
| Nombre GamerZone E-Sports Center y logo | Logo del local, letrero de la puerta |
| PC gamer con RGB, consolas Xbox, fútbol en pantalla grande, salas con sofá | Videos del local |
| Números de puesto 07, 11, 03, 12 | Pintados en las paredes (videos) |
| Juegos: Forza Horizon 5, Gang Beasts, Halo Infinite, Hitman, Far Cry, Injustice 2, GTA V, EA Sports FC | Biblioteca de Xbox en los videos |
| Aire acondicionado, bebidas en el mostrador, lámpara «Game Zone» | Videos del local |
| Fachada con Pac-Man y fantasmas de neón | Video de la entrada |
| WhatsApp 311 881 1689 | Afiche «Gracias por preferirnos» (confirmar que siga vigente) |
| Ciudad: Yopal | Ubicación de Instagram (confirmar) |
| Fotos y videos de la página | Fotogramas y tomas de los videos del local |

## Referencia (genérico, por reemplazar)

| Dato | Valor de referencia | Dónde se cambia |
| --- | --- | --- |
| Dirección | Calle 15 # 21-40, Centro | `NEGOCIO.direccion` |
| Instagram | @gamerzone.yopal | `NEGOCIO.instagram` |
| Horario | L–J 10 a. m.–9 p. m., V–S 10 a. m.–11 p. m., D 12 m.–8 p. m. (la única pista real es «8 a. m. a 6 p. m.» de una historia navideña) | `HORARIO` |
| Precios por hora | PC $3.000, consola $5.000, fútbol $6.000, sala privada $15.000 | `ESTACIONES[].precio`, `TARIFAS` |
| Paquetes | 3 horas en PC $8.000; pase de día $20.000 con bebida de bienvenida | `PAQUETES` |
| Qué incluye cada estación | Monitor de 144 Hz, Game Pass, pantallas de 50 y 65 pulgadas, cuatro controles… | `ESTACIONES[].incluye` |
| Juegos adicionales | Fortnite, Valorant, League of Legends, Call of Duty, Minecraft, Rocket League, Mortal Kombat 1, Fall Guys | `JUEGOS.lista` |
| Planes | Apartar puestos con un día de anticipación, combo de cumpleaños, torneos mensuales de EA FC y Fortnite | `PLANES` |
| Pasos | Formas de pago (efectivo, Nequi, Daviplata, transferencia) | `PASOS` |
| Comodidades | Wifi gratis | `COMODIDADES` |
| Preguntas frecuentes | Todas las respuestas | `PREGUNTAS` |
| Cifras | Se calculan solas de los datos de arriba | `lib/sitio.ts` |

## Antes de publicar

1. Reemplazar cada dato de referencia y quitarle `pendiente: true`.
2. Confirmar el nombre que se usa (GamerZone o ZonaGamer).
3. Definir el dominio y ponerlo en `site` de `web/astro.config.mjs`.
4. Pasar `REVISION` a `false` en `web/src/data/local.ts`: quita el `noindex` y publica la ficha de Google.
