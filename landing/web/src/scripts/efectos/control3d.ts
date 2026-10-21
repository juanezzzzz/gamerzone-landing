import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// El control del inicio en 3D: cuerpo de plástico grafito extruido desde la misma silueta del letrero,
// sticks de goma, cruceta, botones translúcidos y una franja LED que recorre el borde. El scroll lo
// gira de escorzo a frente y «lo enciende»: la franja avanza y al final se prende el botón central.

// Silueta del cuerpo (la misma del neón original, en unidades del SVG de 200 × 200)
const CUERPO = 'M62 66C40 66 28 80 22 102C14 132 12 156 28 162C41 167 51 154 61 140C67 132 75 128 85 128H115C125 128 133 132 139 140C149 154 159 167 172 162C188 156 186 132 178 102C172 80 160 66 138 66C126 66 120 73 100 73C80 73 74 66 62 66Z';
const ALTO = 14;          // grosor del cuerpo
const BISEL = 9;          // bisel del canto (redondea los bordes)
const FRENTE = BISEL;     // la cara de arriba queda en z = BISEL tras voltear la extrusión
const CIAN = new THREE.Color('#52f2f2');
const VIOLETA = new THREE.Color('#7b4dff');
const ROSA = new THREE.Color('#ff4f9a');

// Coordenadas del SVG (y hacia abajo) a la escena (y hacia arriba)
const en = (x: number, y: number, z = FRENTE) => new THREE.Vector3(x, -y, z);

function formaDelCuerpo() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${CUERPO}"/></svg>`;
  return SVGLoader.createShapes(new SVGLoader().parse(svg).paths[0])[0];
}

function cruceta(brazo: number, ancho: number) {
  const a = ancho / 2;
  const s = new THREE.Shape();
  s.moveTo(-a, brazo); s.lineTo(a, brazo); s.lineTo(a, a); s.lineTo(brazo, a); s.lineTo(brazo, -a); s.lineTo(a, -a);
  s.lineTo(a, -brazo); s.lineTo(-a, -brazo); s.lineTo(-a, -a); s.lineTo(-brazo, -a); s.lineTo(-brazo, a); s.lineTo(-a, a);
  s.closePath();
  return s;
}

export type Control3D = {
  progreso: (p: number) => void;
  destruir: () => void;
};

// Cede el hilo al navegador entre los pasos pesados para no bloquear la página mientras se arma la escena.
const ceder = () => new Promise((r) => setTimeout(r, 0));

// poster: un punto del recorrido (0 = de escorzo y apagado, 1 = de frente y encendido) pinta un único cuadro
// quieto, para las imágenes fijas y la secuencia de celular (tools/control3d_poster.mjs).
export async function crearControl3D(
  contenedor: HTMLElement, { poster = null }: { poster?: number | null } = {},
): Promise<Control3D | null> {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: poster !== null });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.classList.add('control3d-lienzo');
  await ceder();

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environmentIntensity = 0.55;
  await ceder();

  const camara = new THREE.PerspectiveCamera(28, 1, 10, 3000);

  // ---------- El control ----------
  const control = new THREE.Group();
  const piezas = new THREE.Group();
  control.add(piezas);

  const forma = formaDelCuerpo();
  const cuerpoGeo = new THREE.ExtrudeGeometry(forma, {
    depth: ALTO, bevelEnabled: true, bevelThickness: BISEL, bevelSize: 7, bevelSegments: 14, curveSegments: 96,
  });
  cuerpoGeo.rotateX(Math.PI); // y del SVG hacia arriba; la cara de arriba queda hacia la cámara
  const plastico = new THREE.MeshPhysicalMaterial({
    color: '#12151d', roughness: 0.38, metalness: 0.05, clearcoat: 0.7, clearcoatRoughness: 0.28, sheen: 0.4, sheenColor: '#3a4a66',
  });
  piezas.add(new THREE.Mesh(cuerpoGeo, plastico));
  await ceder();

  // Gatillos superiores (bumpers), asomando por detrás del borde de arriba
  const gatillo = new THREE.MeshPhysicalMaterial({ color: '#0c0e14', roughness: 0.5, clearcoat: 0.4 });
  for (const [x, giro] of [[58, 0.18], [142, -0.18]]) {
    const g = new THREE.Mesh(new THREE.CapsuleGeometry(5.5, 30, 8, 24).rotateZ(Math.PI / 2 + giro), gatillo);
    g.position.copy(en(x, 63, -ALTO * 0.45));
    piezas.add(g);
  }

  // Sticks: pozo, base, tapa de goma con su borde de agarre
  const goma = new THREE.MeshStandardMaterial({ color: '#1b1f29', roughness: 0.85, metalness: 0 });
  const pozo = new THREE.MeshStandardMaterial({ color: '#06070a', roughness: 0.6 });
  for (const [x, y] of [[62, 94], [118, 114]]) {
    const anillo = new THREE.Mesh(new THREE.TorusGeometry(11.4, 1.2, 16, 64), pozo);
    anillo.position.copy(en(x, y, FRENTE - 0.5));
    const base = new THREE.Mesh(new THREE.CylinderGeometry(8.4, 9.4, 6, 48).rotateX(Math.PI / 2), goma);
    base.position.copy(en(x, y, FRENTE + 3));
    const tapa = new THREE.Mesh(new THREE.CylinderGeometry(8.8, 8.8, 2.2, 48).rotateX(Math.PI / 2), goma);
    tapa.position.copy(en(x, y, FRENTE + 7));
    const borde = new THREE.Mesh(new THREE.TorusGeometry(8.3, 1.2, 16, 64), goma);
    borde.position.copy(en(x, y, FRENTE + 8));
    piezas.add(anillo, base, tapa, borde);
  }

  // Cruceta dentro de su pozo circular
  const crucetaGeo = new THREE.ExtrudeGeometry(cruceta(7.6, 5), { depth: 2.2, bevelEnabled: true, bevelThickness: 0.9, bevelSize: 0.8, bevelSegments: 6 });
  const cruz = new THREE.Mesh(crucetaGeo, new THREE.MeshPhysicalMaterial({ color: '#1a1e28', roughness: 0.4, clearcoat: 0.6 }));
  cruz.position.copy(en(84, 114, FRENTE - 0.3));
  const pozoCruz = new THREE.Mesh(new THREE.TorusGeometry(10, 1.1, 16, 64), pozo);
  pozoCruz.position.copy(en(84, 114, FRENTE - 0.5));
  piezas.add(cruz, pozoCruz);

  // A, B, X, Y: botones translúcidos con su color; brillan un poco más al encender
  const botones: THREE.MeshPhysicalMaterial[] = [];
  for (const [x, y, color] of [[136, 106, '#2bd97c'], [146, 96, '#ff4f5e'], [126, 96, '#4f7bff'], [136, 86, '#ffc233']] as const) {
    const m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.08, emissive: color, emissiveIntensity: 0.12 });
    botones.push(m);
    const b = new THREE.Mesh(new THREE.SphereGeometry(4.7, 40, 20), m);
    b.scale.set(1, 1, 0.55);
    b.position.copy(en(x, y, FRENTE + 1.2));
    piezas.add(b);
  }

  // Botones pequeños de vista y menú
  for (const x of [90, 110]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1.6, 24).rotateX(Math.PI / 2), goma);
    p.position.copy(en(x, 99, FRENTE + 0.6));
    piezas.add(p);
  }

  // Botón central: apagado al principio, se prende al final del encendido
  const luzCentral = new THREE.MeshStandardMaterial({ color: '#0d1016', emissive: CIAN, emissiveIntensity: 0, roughness: 0.3 });
  const central = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 5.6, 2, 48).rotateX(Math.PI / 2), luzCentral);
  central.position.copy(en(100, 88, FRENTE + 0.8));
  const aro = new THREE.Mesh(new THREE.TorusGeometry(6.6, 0.75, 16, 64), new THREE.MeshBasicMaterial({ color: CIAN, toneMapped: false, transparent: true, opacity: 0 }));
  aro.position.copy(en(100, 88, FRENTE + 1.2));
  piezas.add(central, aro);

  // Franja LED: sigue la silueta un poco hacia adentro, sobre la cara de arriba, con degradé cian → violeta → rosa
  const puntos = forma.getSpacedPoints(480).slice(0, -1);
  const centro = new THREE.Vector2(100, 116);
  const ruta = new THREE.CatmullRomCurve3(
    puntos.map((p) => { const q = p.clone().sub(centro).multiplyScalar(0.9).add(centro); return en(q.x, q.y, FRENTE + 0.3); }), true,
  );
  const tramos = 600;
  const colorEn = (t: number) => (t < 0.33 ? CIAN.clone().lerp(VIOLETA, t / 0.33) : t < 0.66 ? VIOLETA.clone().lerp(ROSA, (t - 0.33) / 0.33) : ROSA.clone().lerp(CIAN, (t - 0.66) / 0.34));
  const franja = (radio: number, material: THREE.Material) => {
    const g = new THREE.TubeGeometry(ruta, tramos, radio, 6, true);
    const colores: number[] = [];
    for (let i = 0; i <= tramos; i++) { const c = colorEn(i / tramos); for (let j = 0; j <= 6; j++) colores.push(c.r, c.g, c.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3));
    g.setDrawRange(0, 0);
    piezas.add(new THREE.Mesh(g, material));
    return g;
  };
  const tubo = franja(0.75, new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
  const halo = franja(2.6, new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
  await ceder();
  const indices = tubo.index!.count;

  // Centrar el conjunto en el origen
  const caja = new THREE.Box3().setFromObject(piezas);
  piezas.position.sub(caja.getCenter(new THREE.Vector3()));
  escena.add(control);

  // ---------- Luces de estudio + contraluces de color ----------
  const clave = new THREE.DirectionalLight('#ffffff', 1.6);
  clave.position.set(-120, 220, 320);
  const relleno = new THREE.DirectionalLight('#9fb4ff', 0.35);
  relleno.position.set(200, -60, 200);
  const contraCian = new THREE.PointLight(CIAN, 90000, 900, 2);
  contraCian.position.set(-260, 80, -160);
  const contraRosa = new THREE.PointLight(ROSA, 70000, 900, 2);
  contraRosa.position.set(260, -40, -140);
  escena.add(clave, relleno, contraCian, contraRosa);

  // ---------- Tamaño ----------
  const medir = () => {
    const { width: w, height: h } = contenedor.getBoundingClientRect();
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    // El control (≈ 190 de ancho con bisel) ocupa ~78 % del ancho del contenedor
    const ancho = 190 / 0.78;
    const distancia = ancho / 2 / Math.tan(THREE.MathUtils.degToRad(camara.fov / 2)) / camara.aspect;
    camara.position.set(0, 0, Math.max(distancia, 330));
    camara.updateProjectionMatrix();
  };
  medir();
  const observador = new ResizeObserver(medir);
  observador.observe(contenedor);

  // ---------- Estado ----------
  const quieto = poster !== null;
  let p = poster ?? 0;
  const puntero = { x: 0, y: 0, ox: 0, oy: 0 };
  const alMover = (e: PointerEvent) => { puntero.x = e.clientX / window.innerWidth - 0.5; puntero.y = e.clientY / window.innerHeight - 0.5; };
  const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fino && !quieto) window.addEventListener('pointermove', alMover, { passive: true });

  const suave = (t: number) => t * t * (3 - 2 * t);
  const aplicar = (seg: number) => {
    // Giro: de escorzo (ladeado y visto desde abajo) a casi de frente
    const g = suave(Math.min(1, p / 0.8));
    puntero.ox += (puntero.x - puntero.ox) * 0.06;
    puntero.oy += (puntero.y - puntero.oy) * 0.06;
    const flota = quieto ? 0 : Math.sin(seg * 1.1) * 0.025;
    control.rotation.set(
      THREE.MathUtils.lerp(0.95, 0.32, g) + puntero.oy * 0.25 + flota,
      THREE.MathUtils.lerp(-0.75, -0.12, g) + puntero.ox * 0.4,
      THREE.MathUtils.lerp(0.28, 0.04, g),
    );
    control.position.y = quieto ? 0 : Math.sin(seg * 0.9) * 2.5;

    // Encendido: la franja avanza con el scroll; al final se prende el botón central y suben los colores
    const luz = Math.min(1, p / 0.75);
    const tramo = Math.floor((indices * luz) / 6) * 6;
    tubo.setDrawRange(0, tramo);
    halo.setDrawRange(0, tramo);
    const fin = suave(Math.max(0, Math.min(1, (p - 0.7) / 0.3)));
    luzCentral.emissiveIntensity = fin * 3.2;
    (aro.material as THREE.MeshBasicMaterial).opacity = fin;
    for (const b of botones) b.emissiveIntensity = 0.12 + fin * 0.5;
    contraCian.intensity = 50000 + 60000 * luz;
    contraRosa.intensity = 30000 + 60000 * luz;
  };

  let corriendo = false;
  let visible = true;
  const reloj = new THREE.Timer();
  const cuadro = (t?: number) => {
    reloj.update(t);
    aplicar(reloj.getElapsed());
    renderer.render(escena, camara);
    if (corriendo) requestAnimationFrame(cuadro);
  };
  // Compila los shaders sin bloquear (en paralelo cuando el navegador lo permite) y recién entonces
  // pone el lienzo encima de la imagen fija y pinta el primer cuadro.
  aplicar(0);
  await renderer.compileAsync(escena, camara);
  contenedor.append(renderer.domElement);
  renderer.render(escena, camara);

  const vista = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !corriendo && !quieto) { corriendo = true; requestAnimationFrame(cuadro); }
    if (!visible) corriendo = false;
  });
  vista.observe(contenedor);

  return {
    progreso(valor) { p = Math.max(0, Math.min(1, valor)); if (!corriendo && visible) { aplicar(reloj.getElapsed()); renderer.render(escena, camara); } },
    destruir() {
      corriendo = false;
      vista.disconnect();
      observador.disconnect();
      window.removeEventListener('pointermove', alMover);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
