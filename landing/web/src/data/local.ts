// Datos del local. Lo que no está confirmado por el negocio va con `pendiente: true` (solo como marca
// en el código; en la página se ve normal). Por ahora la página usa información de referencia
// realista para verse completa: la lista de qué es real y qué no está en landing/DATOS-DE-REFERENCIA.md.
// Mientras REVISION sea true la página lleva noindex y no publica la ficha de negocio para Google.

export const REVISION = true;

export type Dato = { texto: string; pendiente?: boolean };

export const NEGOCIO = {
  nombre: 'GamerZone',
  nombreLargo: 'GamerZone E-Sports Center',
  // La ubicación de Instagram dice «ZonaGamer E-sport Center»: confirmar cuál se usa.
  nombrePendiente: true,
  ciudad: { texto: 'Yopal', pendiente: true } as Dato,
  direccion: { texto: 'Calle 15 # 21-40, Centro', pendiente: true } as Dato,
  // Afiche «Gracias por preferirnos» del local (v3). Confirmar.
  whatsapp: { numero: '573118811689', visible: '311 881 1689', pendiente: true },
  instagram: { texto: '@gamerzone.yopal', pendiente: true } as Dato,
  mapa: 'https://www.google.com/maps/search/?api=1&query=ZonaGamer%20E-sport%20Center',
};

// 0 = domingo … 6 = sábado. Horas en 24 h, hora de Colombia. Genérico: la única pista real es una
// historia navideña de Instagram («8 a. m. hasta las 6 p. m.»).
export const HORARIO = {
  pendiente: true,
  dias: [
    { dia: 1, abre: 10, cierra: 21 }, { dia: 2, abre: 10, cierra: 21 }, { dia: 3, abre: 10, cierra: 21 },
    { dia: 4, abre: 10, cierra: 21 }, { dia: 5, abre: 10, cierra: 23 }, { dia: 6, abre: 10, cierra: 23 },
    { dia: 0, abre: 12, cierra: 20 },
  ],
};

// Cada estación es un botón del control 3D del inicio (mismos colores que en control3d.ts).
// x/y: dónde cae el botón en public/media/control-3d.webp, en % (los da tools/control3d_poster.mjs).
export type Boton = 'A' | 'B' | 'X' | 'Y';
export const BOTONES: Record<Boton, { color: string; x: number; y: number }> = {
  A: { color: '#2bd97c', x: 64.63, y: 48.81 },
  B: { color: '#ff4f5e', x: 68.95, y: 43.62 },
  X: { color: '#4f7bff', x: 60.23, y: 43.67 },
  Y: { color: '#ffc233', x: 64.53, y: 38.39 },
};

export const MENSAJE_WA = 'Hola GamerZone, quiero ir a jugar. ¿Tienen puesto disponible?';

export const ESTACIONES: {
  id: string; puesto: string; boton: Boton; nombre: string; subtitulo: string; texto: string; specs: string[]; incluye: string[]; luz: string; precio: Dato;
}[] = [
  {
    id: 'pc',
    puesto: '07',
    boton: 'X',
    nombre: 'PC Arena',
    subtitulo: 'Rendimiento competitivo',
    texto: 'Equipos armados para competir. Sin lag, sin excusas.',
    specs: ['144 Hz', 'Mecánico', 'Low latency', '1 Gbps'],
    incluye: ['Monitor de 144 Hz', 'Teclado mecánico y mouse gamer', 'Audífonos con micrófono', 'Steam, Epic y Riot instalados'],
    luz: '#7B4DFF',
    precio: { texto: '$3.000 /h', pendiente: true },
  },
  {
    id: 'consolas',
    puesto: '11',
    boton: 'Y',
    nombre: 'Console Lounge',
    subtitulo: 'Juega acompañado',
    texto: 'Xbox con Game Pass, dos controles y pantalla grande. Siéntate y dale.',
    specs: ['Xbox', 'Game Pass', '50"', '2 controles'],
    incluye: ['Xbox con Game Pass', 'Dos controles por puesto', 'Pantalla de 50 pulgadas', 'Cooperativo y versus'],
    luz: '#52F2F2',
    precio: { texto: '$5.000 /h', pendiente: true },
  },
  {
    id: 'futbol',
    puesto: '03',
    boton: 'A',
    nombre: 'Fútbol',
    subtitulo: 'Pantalla grande. Grandes partidas.',
    texto: 'Uno contra uno o dos contra dos. La revancha se cobra el mismo día.',
    specs: ['EA FC 25', 'Pantalla grande', '4 jugadores', 'Versus'],
    incluye: ['EA Sports FC al día', 'Pantalla grande', 'Hasta cuatro jugadores', 'Ligas y equipos actualizados'],
    luz: '#2BD97C',
    precio: { texto: '$6.000 /h', pendiente: true },
  },
  {
    id: 'salas',
    puesto: '12',
    boton: 'B',
    nombre: 'Sala VIP',
    subtitulo: 'Tu juego. Tu espacio.',
    texto: 'Sofá, pantalla de 65", cuatro controles y privacidad para el parche.',
    specs: ['65"', '4 controles', 'Sofá', 'Privada'],
    incluye: ['Sofá para cuatro personas', 'Pantalla de 65 pulgadas', 'Consola con cuatro controles', 'Ideal para cumpleaños'],
    luz: '#FF4F9A',
    precio: { texto: '$15.000 /h', pendiente: true },
  },
];

// Los primeros vienen de la biblioteca de Xbox de los videos del local; el resto es genérico.
export const JUEGOS = {
  pendiente: true,
  lista: [
    'EA Sports FC', 'Fortnite', 'Valorant', 'League of Legends', 'Call of Duty', 'Forza Horizon 5',
    'GTA V', 'Halo Infinite', 'Minecraft', 'Rocket League', 'Mortal Kombat 1', 'Gang Beasts',
    'Far Cry', 'Hitman', 'Injustice 2', 'Fall Guys',
  ],
};

// Precio por hora de cada estación
export const TARIFAS = [
  { que: 'PC gamer', detalle: 'por puesto', precio: '$3.000' },
  { que: 'Consola', detalle: 'hasta dos jugadores', precio: '$5.000' },
  { que: 'Fútbol en pantalla grande', detalle: 'hasta cuatro jugadores', precio: '$6.000' },
  { que: 'Sala privada', detalle: 'hasta cuatro personas', precio: '$15.000' },
];

// Paquetes: el destacado es el que más conviene si vas a quedarte
export const PAQUETES = [
  { nombre: '3 horas en PC', precio: '$8.000', ahorro: 'Ahorras $1.000', incluye: ['Tres horas en un PC gamer', 'Para usar el mismo día', 'Puedes pausar y volver'], destacado: false },
  { nombre: 'Pase de día', precio: '$20.000', ahorro: 'Juega sin mirar el reloj', incluye: ['PC o consola, de la apertura al cierre', 'Cambias de puesto cuando quieras', 'Una bebida de bienvenida'], destacado: true },
];

// Cada plan con una foto real del local (fotogramas de sus videos, en src/assets/galeria)
export const PLANES: { titulo: string; texto: string; foto: string; alt: string; pendiente: boolean }[] = [
  { titulo: 'Ven con tu parche', texto: 'Varios puestos juntos para jugar entre ustedes. Escríbenos con un día de anticipación y te los apartamos.', foto: 'consola-pareja', alt: 'Dos personas de espaldas jugando una carrera en pantalla dividida en el puesto 11', pendiente: true },
  { titulo: 'Cumpleaños', texto: 'Sala privada por dos o tres horas, pantalla grande y cuatro controles. Pregunta por el combo con bebidas.', foto: 'sala-sofa-azul', alt: 'Sala con luz azul y verde y una pantalla grande frente al sofá', pendiente: true },
  { titulo: 'Torneos', texto: 'Torneos de EA Sports FC y Fortnite cada mes, con premio para el campeón. Inscripciones por WhatsApp.', foto: 'jugadores-pc', alt: 'Jugador con audífonos concentrado frente a un PC', pendiente: true },
];

export const TORNEOS = [
  { juego: 'Valorant', fecha: '25 Oct', hora: '2:00 p. m.', premio: 'Premio al campeón', inscripcion: 'WhatsApp', pendiente: true },
  { juego: 'EA Sports FC', fecha: '1 Nov', hora: '3:00 p. m.', premio: 'Premio al campeón', inscripcion: 'WhatsApp', pendiente: true },
  { juego: 'Fortnite', fecha: '8 Nov', hora: '2:00 p. m.', premio: 'Premio al campeón', inscripcion: 'WhatsApp', pendiente: true },
];

// Cómo es ir a jugar, en el orden en que pasa.
export const PASOS = [
  { titulo: 'Escríbenos', texto: 'Cuéntanos qué quieres jugar y a qué hora llegas. Si vienen varios, te apartamos los puestos juntos.' },
  { titulo: 'Llega y escoge', texto: 'PC, consola, fútbol o sala. Los controles y los audífonos ya están en el puesto.' },
  { titulo: 'Juega y paga al salir', texto: 'Pagas por el tiempo que jugaste, en efectivo, Nequi, Daviplata o transferencia.' },
];

// Lo que hay en la sala además de los puestos. El aire y las bebidas se ven en los videos del local.
export const COMODIDADES: { icono: 'aire' | 'wifi' | 'bebida' | 'audifonos'; titulo: string; texto: string }[] = [
  { icono: 'aire', titulo: 'Aire acondicionado', texto: 'Para jugar fresco aunque afuera esté haciendo calor.' },
  { icono: 'bebida', titulo: 'Bebidas y mecato', texto: 'Gaseosas, bebidas energizantes, agua y mecato en el mostrador.' },
  { icono: 'audifonos', titulo: 'Equipo incluido', texto: 'Controles, audífonos y teclados en cada puesto.' },
  { icono: 'wifi', titulo: 'Wifi gratis', texto: 'Conexión para los clientes mientras esperan su turno.' },
];

// Fotogramas reales sacados de los videos del local (landing/recursos/imagenes/fotogramas).
export const GALERIA = [
  { foto: 'letrero-gameroom', alt: 'Letrero de neón Game Room con un control dibujado, sobre la malla de la pared' },
  { foto: 'mostrador-lampara', alt: 'Mostrador con la lámpara Game Zone iluminada, un control blanco y una bebida' },
  { foto: 'jugadores-pc', alt: 'Jugador con audífonos frente a un PC con el juego en pantalla' },
  { foto: 'controles', alt: 'Controles de Xbox blancos y negros junto al teclado de la caja' },
  { foto: 'futbol-sala-verde', alt: 'Jugador de espaldas frente al partido en una pantalla grande con luz verde' },
  { foto: 'torres-rgb-completa', alt: 'Torre de PC con ventiladores RGB encendidos en azul y morado' },
];

export const PREGUNTAS = [
  { p: '¿Hay que apartar puesto?', r: 'No es obligatorio: si hay puesto libre, llegas y juegas. Para grupos o fines de semana es mejor escribirnos por WhatsApp y te lo apartamos.' },
  { p: '¿Pueden ir menores de edad?', r: 'Sí. Los menores de 12 años deben venir con un adulto, y los juegos para mayores de 18 solo se activan con permiso de un acudiente.' },
  { p: '¿Venden bebidas o mecato?', r: 'Sí: gaseosas, bebidas energizantes, agua y mecato en el mostrador.' },
  { p: '¿Puedo llevar mi propio control?', r: 'Claro. De todas formas cada puesto tiene sus controles y audífonos.' },
  { p: '¿Puedo jugar con mi cuenta?', r: 'Sí: inicias sesión con tu cuenta de Steam, Epic, Riot o Xbox y al terminar te ayudamos a cerrarla.' },
  { p: '¿Cómo se paga?', r: 'En efectivo, Nequi, Daviplata o transferencia. Pagas al terminar, por el tiempo que jugaste.' },
];
