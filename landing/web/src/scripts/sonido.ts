let ctx: AudioContext | null = null;
let activo = false;
const cache = new Map<string, AudioBuffer>();
let ambienteNode: AudioBufferSourceNode | null = null;
let ambienteGain: GainNode | null = null;

function asegurarCtx(): AudioContext {
  ctx ??= new AudioContext();
  return ctx;
}

async function cargarBuffer(ruta: string): Promise<AudioBuffer | null> {
  if (cache.has(ruta)) return cache.get(ruta)!;
  try {
    const res = await fetch(ruta);
    const buf = await asegurarCtx().decodeAudioData(await res.arrayBuffer());
    cache.set(ruta, buf);
    return buf;
  } catch { return null; }
}

function reproducirBuffer(buf: AudioBuffer, vol = 0.5) {
  const c = asegurarCtx();
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(g).connect(c.destination);
  src.start();
}

export function zumbido() {
  if (!activo || !ctx) return;
  const t = ctx.currentTime;
  const largo = Math.floor(0.09 * ctx.sampleRate);
  const buffer = ctx.createBuffer(1, largo, ctx.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < largo; i++) datos[i] = (Math.random() * 2 - 1) * (1 - i / largo);
  const ruido = ctx.createBufferSource();
  ruido.buffer = buffer;
  const banda = ctx.createBiquadFilter();
  banda.type = 'bandpass'; banda.frequency.value = 2400; banda.Q.value = 0.8;
  const volRuido = ctx.createGain();
  volRuido.gain.value = 0.1;
  ruido.connect(banda).connect(volRuido).connect(ctx.destination);
  ruido.start(t);
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth'; osc.frequency.value = 120;
  const pasabajos = ctx.createBiquadFilter();
  pasabajos.type = 'lowpass'; pasabajos.frequency.value = 800;
  const vol = ctx.createGain();
  vol.gain.setValueAtTime(0, t);
  vol.gain.linearRampToValueAtTime(0.045, t + 0.02);
  vol.gain.setValueAtTime(0.045, t + 0.2);
  vol.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  osc.connect(pasabajos).connect(vol).connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.65);
}

export async function transicion() {
  if (!activo) return;
  const buf = await cargarBuffer('/audio/transition.mp3');
  if (buf) reproducirBuffer(buf, 0.35);
}

export async function clic() {
  if (!activo) return;
  const buf = await cargarBuffer('/audio/ui-click.mp3');
  if (buf) reproducirBuffer(buf, 0.5);
}

async function iniciarAmbiente() {
  const buf = await cargarBuffer('/audio/ambient.mp3');
  if (!buf || !ctx) return;
  ambienteNode = ctx.createBufferSource();
  ambienteNode.buffer = buf;
  ambienteNode.loop = true;
  ambienteGain = ctx.createGain();
  ambienteGain.gain.setValueAtTime(0, ctx.currentTime);
  ambienteGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);
  ambienteNode.connect(ambienteGain).connect(ctx.destination);
  ambienteNode.start();
}

function detenerAmbiente() {
  if (ambienteGain && ctx) {
    ambienteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
  }
  const node = ambienteNode;
  setTimeout(() => { try { node?.stop(); } catch {} }, 900);
  ambienteNode = null;
  ambienteGain = null;
}

async function hover() {
  if (!activo) return;
  const buf = await cargarBuffer('/audio/hover.mp3');
  if (buf) reproducirBuffer(buf, 0.15);
}

export function iniciarSonido() {
  const boton = document.getElementById('sonido');
  if (!boton) return;
  boton.addEventListener('click', () => {
    activo = !activo;
    boton.setAttribute('aria-pressed', String(activo));
    if (activo) {
      asegurarCtx().resume().then(zumbido);
      cargarBuffer('/audio/transition.mp3');
      cargarBuffer('/audio/ui-click.mp3');
      cargarBuffer('/audio/hover.mp3');
      iniciarAmbiente();
    } else {
      detenerAmbiente();
    }
  });
  document.querySelectorAll<HTMLAnchorElement>('.boton').forEach(b => {
    b.addEventListener('click', () => clic());
    b.addEventListener('mouseenter', () => hover());
  });
}
