// piano-phrase の型定義

export type Degree = string; // "R","△3","P5","m7","♭9","♯9","♯11","♭13" など

export type ScaleNote = {
  midi: number;
  deg: Degree;
};

export type LickNote = {
  midi: number;
  deg: Degree;
  d?: number; // 音価（省略=1, 三連=0.5）
  resolve?: boolean; // 解決音（青）
};

export type Lick = {
  name: string;
  note: string;
  seq: LickNote[];
};

export type Phrase = {
  id: string;
  title: string;
  subtitle?: string;
  key: string;
  progression: string;
  technique: string[];
  range: [number, number]; // [最低MIDI, 最高MIDI]
  positionLabel: string;
  scale: ScaleNote[];
  licks: Lick[];
  point: string;
};
