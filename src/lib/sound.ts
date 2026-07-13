// Lightweight WebAudio click/tap/success sounds. No external assets.
import { useAppState } from "./app-store";

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

type Tone = { freq: number; dur: number; type?: OscillatorType; gain?: number };

function play(tones: Tone[]) {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  let t = now;
  tones.forEach(({ freq, dur, type = "sine", gain = 0.06 }) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
    t += dur * 0.85;
  });
}

const sounds = {
  tap: () => play([{ freq: 880, dur: 0.06, type: "triangle", gain: 0.05 }]),
  click: () => play([{ freq: 1100, dur: 0.05, type: "sine", gain: 0.05 }]),
  soft: () => play([{ freq: 520, dur: 0.09, type: "sine", gain: 0.045 }]),
  success: () =>
    play([
      { freq: 660, dur: 0.08, type: "triangle", gain: 0.06 },
      { freq: 990, dur: 0.12, type: "triangle", gain: 0.06 },
    ]),
  reject: () => play([{ freq: 220, dur: 0.16, type: "sine", gain: 0.05 }]),
  toggle: () => play([{ freq: 720, dur: 0.05, type: "square", gain: 0.035 }]),
};

export type SoundName = keyof typeof sounds;

export function playSound(name: SoundName) {
  if (typeof window === "undefined") return;
  // Read latest sound preference from localStorage to avoid stale closures.
  try {
    const raw = localStorage.getItem("vida-tranquila-state-v1");
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.sound === false) return;
    }
  } catch {}
  sounds[name]();
}

export function useSound() {
  const s = useAppState();
  return (name: SoundName) => {
    if (!s.sound) return;
    sounds[name]();
  };
}
