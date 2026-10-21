// Zumbido de neón al encender, sintetizado en el navegador (sin archivos de audio).
// Apagado por defecto: solo suena después de que el visitante toca el botón.

let ctx: AudioContext | null = null;
let activo = false;

export function zumbido() {
  if (!activo || !ctx) return;
  const t = ctx.currentTime;

  // Chispazo: ruido corto y filtrado, como el arranque del balasto.
  const largo = Math.floor(0.09 * ctx.sampleRate);
  const buffer = ctx.createBuffer(1, largo, ctx.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < largo; i++) datos[i] = (Math.random() * 2 - 1) * (1 - i / largo);
  const ruido = ctx.createBufferSource();
  ruido.buffer = buffer;
  const banda = ctx.createBiquadFilter();
  banda.type = 'bandpass';
  banda.frequency.value = 2400;
  banda.Q.value = 0.8;
  const volRuido = ctx.createGain();
  volRuido.gain.value = 0.1;
  ruido.connect(banda).connect(volRuido).connect(ctx.destination);
  ruido.start(t);

  // Zumbido grave del tubo prendido.
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 120;
  const pasabajos = ctx.createBiquadFilter();
  pasabajos.type = 'lowpass';
  pasabajos.frequency.value = 800;
  const vol = ctx.createGain();
  vol.gain.setValueAtTime(0, t);
  vol.gain.linearRampToValueAtTime(0.045, t + 0.02);
  vol.gain.setValueAtTime(0.045, t + 0.2);
  vol.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
  osc.connect(pasabajos).connect(vol).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.65);
}

export function iniciarSonido() {
  const boton = document.getElementById('sonido');
  if (!boton) return;
  boton.addEventListener('click', () => {
    activo = !activo;
    boton.setAttribute('aria-pressed', String(activo));
    if (activo) {
      ctx ??= new AudioContext();
      ctx.resume().then(zumbido);
    }
  });
}
