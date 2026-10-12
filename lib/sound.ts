// Sonido de la revelación, generado con Web Audio (no necesita archivos).
// Los navegadores solo permiten audio después de un toque del usuario, por eso
// primeSound() se llama dentro del envío del formulario y playReveal() lo
// programa con precisión para que coincida con el golpe visual.

type AudioCtor = typeof AudioContext;

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

export function primeSound() {
  try {
    const w = window as unknown as {
      AudioContext?: AudioCtor;
      webkitAudioContext?: AudioCtor;
    };
    const AC = w.AudioContext ?? w.webkitAudioContext;
    if (!AC) return;
    ctx = ctx ?? new AC();
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    ctx = null;
  }
}

function noiseBuffer(c: AudioContext) {
  if (noise) return noise;
  const buf = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noise = buf;
  return buf;
}

// impactIn = segundos desde ahora hasta el golpe
export function playReveal(impactIn: number) {
  const c = ctx;
  if (!c) return;
  try {
    if (c.state === "suspended") void c.resume();

    const t0 = c.currentTime + impactIn;

    // Compresor para que nada sature en parlantes de celular
    const master = c.createGain();
    master.gain.value = 0.8;
    const comp = c.createDynamicsCompressor();
    master.connect(comp).connect(c.destination);

    // 1) Barrido ascendente mientras sube la foto
    const whoosh = c.createBufferSource();
    whoosh.buffer = noiseBuffer(c);
    whoosh.loop = true;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(250, t0 - 0.7);
    bp.frequency.exponentialRampToValueAtTime(3200, t0);
    const wg = c.createGain();
    wg.gain.setValueAtTime(0.0001, t0 - 0.7);
    wg.gain.exponentialRampToValueAtTime(0.28, t0 - 0.05);
    wg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
    whoosh.connect(bp).connect(wg).connect(master);
    whoosh.start(t0 - 0.7);
    whoosh.stop(t0 + 0.15);

    // 2) Golpe grave
    const boom = c.createOscillator();
    boom.type = "sine";
    boom.frequency.setValueAtTime(160, t0);
    boom.frequency.exponentialRampToValueAtTime(42, t0 + 0.4);
    const bg = c.createGain();
    bg.gain.setValueAtTime(0.0001, t0);
    bg.gain.exponentialRampToValueAtTime(1, t0 + 0.012);
    bg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
    boom.connect(bg).connect(master);
    boom.start(t0);
    boom.stop(t0 + 0.6);

    // Chasquido seco que da cuerpo al golpe
    const crack = c.createBufferSource();
    crack.buffer = noiseBuffer(c);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1800;
    const cg = c.createGain();
    cg.gain.setValueAtTime(0.0001, t0);
    cg.gain.exponentialRampToValueAtTime(0.55, t0 + 0.006);
    cg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    crack.connect(lp).connect(cg).connect(master);
    crack.start(t0);
    crack.stop(t0 + 0.2);

    // 3) Campanitas doradas, escalonadas
    [1318.5, 1568, 2093, 2637].forEach((freq, i) => {
      const t = t0 + 0.04 + i * 0.075;
      const o = c.createOscillator();
      o.type = "triangle";
      o.frequency.value = freq;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.13, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + 1.05);
    });
  } catch {
    // Si el navegador bloquea el audio, la animación sigue igual sin sonido
  }
}
