// MIDI / 音名 / 度数色 / Web Audio 発音

export const freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

export const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;

export const noteName = (midi: number) =>
  NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);

export const isBlackKey = (midi: number) =>
  [1, 3, 6, 8, 10].includes(midi % 12);

// 度数の色（コードトーン=赤、テンション=ピンク、解決=青）
const CHORD_TONES = new Set([
  "R", "3", "△3", "5", "5th", "P5", "m7", "♭7", "△7", "7",
]);

export function roleColor(deg: string, resolve = false): string {
  if (resolve) return "var(--blue)";
  return CHORD_TONES.has(deg.replace("→", "")) ? "var(--red)" : "var(--pink)";
}

// AudioContext は遅延生成（クライアントのみ）
let _ctx: AudioContext | null = null;
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    _ctx = new Ctor();
  }
  return _ctx;
}

// iOS Safari 用：最初のユーザー操作で AudioContext を resume
export async function resumeAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") await ctx.resume();
}

// 1音を発音（duration 秒）。triangle + sawtooth×2(detune±4) → lowpass(2600→900) → AD env
export function playNote(midi: number, duration: number, gain = 0.5) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const f = freq(midi);
  const dur = Math.max(0.05, duration);

  // オシレーター
  const osc1 = ctx.createOscillator();
  osc1.type = "triangle";
  osc1.frequency.value = f;
  const osc2 = ctx.createOscillator();
  osc2.type = "sawtooth";
  osc2.frequency.value = f;
  osc2.detune.value = 4;
  const osc3 = ctx.createOscillator();
  osc3.type = "sawtooth";
  osc3.frequency.value = f;
  osc3.detune.value = -4;

  // ローパス（明→暗）
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 0.5;
  filter.frequency.setValueAtTime(2600, now);
  filter.frequency.exponentialRampToValueAtTime(900, now + dur * 0.85);

  // AD エンベロープ
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(gain, now + 0.02);
  env.gain.exponentialRampToValueAtTime(0.001, now + dur);

  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(filter);
  filter.connect(env);
  env.connect(ctx.destination);

  osc1.start(now);
  osc1.stop(now + dur);
  osc2.start(now);
  osc2.stop(now + dur);
  osc3.start(now);
  osc3.stop(now + dur);
}

// 度数からの白鍵/黒鍵テンポ計算ヘルパ
export const beatMs = (bpm: number) => 60000 / bpm;
