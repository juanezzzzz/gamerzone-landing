import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

// Pantalla del recorrido dibujada con WebGL: los videos de las estaciones se mezclan con un borde
// líquido que sube desde abajo, con un filo cian, y una leve separación de color cuando el scroll va rápido.
// Si el navegador no tiene WebGL, devuelve null y el recorrido usa el barrido con clip-path.

const VERTICE = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENTO = /* glsl */ `
  precision highp float;
  uniform sampler2D tA;
  uniform sampler2D tB;
  uniform vec2 tamA;
  uniform vec2 tamB;
  uniform vec2 lienzo;
  uniform float progreso;
  uniform float velocidad;
  uniform float tiempo;
  varying vec2 vUv;

  // object-fit: cover dentro del shader
  vec2 cubrir(vec2 uv, vec2 img) {
    float rl = lienzo.x / lienzo.y;
    float ri = img.x / max(img.y, 1.0);
    vec2 s = rl > ri ? vec2(1.0, ri / rl) : vec2(rl / ri, 1.0);
    return (uv - 0.5) * s + 0.5;
  }

  float azar(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float ruido(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(azar(i), azar(i + vec2(1.0, 0.0)), u.x), mix(azar(i + vec2(0.0, 1.0)), azar(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  vec3 muestra(sampler2D t, vec2 uv, float corrimiento) {
    return vec3(
      texture2D(t, uv + vec2(corrimiento, 0.0)).r,
      texture2D(t, uv).g,
      texture2D(t, uv - vec2(corrimiento, 0.0)).b
    );
  }

  void main() {
    float n = ruido(vec2(vUv.x * 4.0, tiempo * 0.6)) * 0.6 + ruido(vec2(vUv.x * 11.0, tiempo)) * 0.4;
    float borde = vUv.y + (n - 0.5) * 0.3;
    float umbral = progreso * 1.35 - 0.1;
    float mascara = 1.0 - smoothstep(umbral - 0.05, umbral + 0.05, borde);
    float franja = mascara * (1.0 - mascara) * 4.0;

    vec2 desplaza = vec2(0.0, franja * 0.06);
    float rgb = clamp(abs(velocidad), 0.0, 1.0) * 0.006 + franja * 0.004;
    vec3 a = muestra(tA, cubrir(vUv + desplaza, tamA), rgb);
    vec3 b = muestra(tB, cubrir(vUv - desplaza, tamB), rgb);

    vec3 color = mix(a, b, mascara);
    color += vec3(0.32, 0.95, 0.95) * pow(franja, 3.0) * 0.55;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export type PantallaGL = {
  encender: (si: boolean) => void;
  cambiar: (antes: number, despues: number, duracion: number) => void;
  destruir: () => void;
};

export function crearPantallaGL(contenedor: HTMLElement, videos: HTMLVideoElement[], gsap: typeof import('gsap').gsap,
  leerVelocidad: () => number): PantallaGL | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: false, antialias: false });
  } catch {
    return null;
  }
  const gl = renderer.gl;
  if (!gl) return null;
  gl.canvas.classList.add('escenario-gl');
  contenedor.prepend(gl.canvas);

  const opciones = { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR, wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE };
  const tA = new Texture(gl, opciones);
  const tB = new Texture(gl, opciones);
  const programa = new Program(gl, {
    vertex: VERTICE,
    fragment: FRAGMENTO,
    uniforms: {
      tA: { value: tA }, tB: { value: tB },
      tamA: { value: [1, 1] }, tamB: { value: [1, 1] },
      lienzo: { value: [1, 1] },
      progreso: { value: 0 }, velocidad: { value: 0 }, tiempo: { value: 0 },
    },
  });
  const malla = new Mesh(gl, { geometry: new Triangle(gl), program: programa });

  let a = 0;
  let b = 0;
  const estado = { progreso: 0 };

  const medir = () => {
    const r = contenedor.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
    programa.uniforms.lienzo.value = [r.width, r.height];
  };
  medir();
  const observador = new ResizeObserver(medir);
  observador.observe(contenedor);

  const subir = (t: Texture, v: HTMLVideoElement, tam: { value: number[] }) => {
    if (v.readyState < 2) return;
    t.image = v;
    t.needsUpdate = true;
    tam.value = [v.videoWidth, v.videoHeight];
  };

  const dibujar = (seg: number) => {
    subir(tA, videos[a], programa.uniforms.tamA);
    subir(tB, videos[b], programa.uniforms.tamB);
    programa.uniforms.progreso.value = estado.progreso;
    programa.uniforms.tiempo.value = seg;
    const v = programa.uniforms.velocidad.value;
    programa.uniforms.velocidad.value = v + (leerVelocidad() - v) * 0.12;
    renderer.render({ scene: malla });
  };
  let encendida = false;

  return {
    // Solo se dibuja mientras la pantalla está a la vista.
    encender(si) {
      if (si === encendida) return;
      encendida = si;
      if (si) gsap.ticker.add(dibujar);
      else gsap.ticker.remove(dibujar);
    },
    cambiar(antes, despues, duracion) {
      // Si llega un cambio a mitad de otro, el estado actual pasa a ser el punto de partida.
      a = estado.progreso > 0.5 ? b : antes;
      b = despues;
      gsap.fromTo(estado, { progreso: 0 }, {
        progreso: 1, duration: duracion, ease: 'expo.inOut', overwrite: true,
        onComplete: () => { a = b; estado.progreso = 0; },
      });
    },
    destruir() {
      gsap.ticker.remove(dibujar);
      observador.disconnect();
      gl.canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
