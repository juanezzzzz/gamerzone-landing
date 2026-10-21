// Letreros de neón dibujados a mano, en el estilo de los del local (fantasmas de Pac-Man en la
// puerta, letrero GAME ROOM). Se «encienden» dibujando cada trazo con DrawSVG.

const fantasma = (x: number) =>
  `<path d="M${x} 54V30A22 22 0 0 1 ${x + 44} 30V54L${x + 36.7} 48L${x + 29.3} 54L${x + 22} 48L${x + 14.7} 54L${x + 7.3} 48Z"/>` +
  `<circle cx="${x + 14}" cy="30" r="5"/><circle cx="${x + 30}" cy="30" r="5"/>`;

export const FORMAS = {
  control: {
    caja: '0 0 200 200',
    trazo:
      '<path d="M62 66C40 66 28 80 22 102C14 132 12 156 28 162C41 167 51 154 61 140C67 132 75 128 85 128H115C125 128 133 132 139 140C149 154 159 167 172 162C188 156 186 132 178 102C172 80 160 66 138 66C126 66 120 73 100 73C80 73 74 66 62 66Z"/>' +
      '<circle cx="66" cy="96" r="10"/>' +
      '<path d="M82 108V124M74 116H90"/>' +
      '<circle cx="120" cy="116" r="9"/>' +
      '<circle cx="136" cy="86" r="4"/><circle cx="146" cy="96" r="4"/>' +
      '<circle cx="126" cy="96" r="4"/><circle cx="136" cy="106" r="4"/>' +
      '<circle cx="100" cy="92" r="5"/>',
  },
  pc: {
    caja: '0 0 200 200',
    trazo:
      '<rect x="28" y="34" width="144" height="90" rx="6"/>' +
      '<path d="M92 124L88 146M108 124L112 146M74 148H126"/>' +
      '<rect x="34" y="160" width="104" height="20" rx="4"/>' +
      '<path d="M46 170H126"/>' +
      '<rect x="150" y="158" width="16" height="24" rx="8"/>' +
      '<circle cx="100" cy="79" r="16"/>' +
      '<path d="M100 57V69M100 89V101M78 79H90M110 79H122"/>',
  },
  futbol: {
    caja: '0 0 200 200',
    trazo:
      '<rect x="22" y="30" width="156" height="104" rx="6"/>' +
      '<rect x="32" y="40" width="36" height="10" rx="2"/>' +
      '<circle cx="100" cy="84" r="26"/>' +
      '<path d="M100 71L112 80L107.5 94H92.5L88 80Z"/>' +
      '<path d="M100 71V58M112 80L124 76M107.5 94L114 106M92.5 94L86 106M88 80L76 76"/>' +
      '<path d="M92 134L88 152M108 134L112 152M72 154H128"/>',
  },
  sala: {
    caja: '0 0 200 200',
    trazo:
      '<rect x="58" y="22" width="84" height="52" rx="4"/>' +
      '<path d="M92 74V84M108 74V84M82 86H118"/>' +
      '<path d="M40 152V124A10 10 0 0 1 60 124V136H140V124A10 10 0 0 1 160 124V152Z"/>' +
      '<path d="M52 116V108A8 8 0 0 1 60 100H140A8 8 0 0 1 148 108V116"/>' +
      '<path d="M48 152V164M152 152V164"/>',
  },
  parche: {
    caja: '0 0 200 200',
    trazo:
      '<rect x="36" y="26" width="128" height="76" rx="6"/>' +
      '<path d="M66 64L80 55A16 16 0 1 0 80 73Z"/>' +
      '<circle cx="100" cy="64" r="2.5"/><circle cx="116" cy="64" r="2.5"/><circle cx="132" cy="64" r="2.5"/>' +
      '<circle cx="78" cy="134" r="14"/><circle cx="122" cy="134" r="14"/>' +
      '<path d="M52 180A26 26 0 0 1 104 180M96 180A26 26 0 0 1 148 180"/>',
  },
  pastel: {
    caja: '0 0 200 200',
    trazo:
      '<rect x="44" y="112" width="112" height="48" rx="4"/>' +
      '<path d="M44 130Q58 140 72 130T100 130T128 130T156 130"/>' +
      '<rect x="60" y="90" width="80" height="22" rx="3"/>' +
      '<path d="M80 90V74M100 90V74M120 90V74"/>' +
      '<path d="M80 66C76 62 80 57 80 54C80 57 84 62 80 66ZM100 66C96 62 100 57 100 54C100 57 104 62 100 66ZM120 66C116 62 120 57 120 54C120 57 124 62 120 66Z"/>' +
      '<path d="M36 170H164"/>',
  },
  trofeo: {
    caja: '0 0 200 200',
    trazo:
      '<path d="M70 40H130V70A30 30 0 0 1 70 70Z"/>' +
      '<path d="M70 50H56A14 14 0 0 0 72 74M130 50H144A14 14 0 0 1 128 74"/>' +
      '<path d="M100 54L104 62L112 63L106 69L108 77L100 73L92 77L94 69L88 63L96 62Z"/>' +
      '<path d="M100 100V122"/>' +
      '<rect x="82" y="122" width="36" height="22" rx="3"/>' +
      '<path d="M70 156H130"/>',
  },
  // La puerta del local: Pac-Man comiéndose los puntos y tres fantasmas (verde, rojo, azul).
  fantasmas: {
    caja: '0 0 320 64',
    trazo:
      '<g style="color:#FFC233"><path d="M30 32L46.4 20.5A20 20 0 1 0 46.4 43.5Z"/>' +
      '<circle cx="66" cy="32" r="3"/><circle cx="84" cy="32" r="3"/><circle cx="102" cy="32" r="3"/></g>' +
      `<g style="color:#2BD97C">${fantasma(124)}</g>` +
      `<g style="color:#FF4F5E" class="titila">${fantasma(190)}</g>` +
      `<g style="color:#4F7BFF">${fantasma(256)}</g>`,
  },
} as const;

export type Forma = keyof typeof FORMAS;
