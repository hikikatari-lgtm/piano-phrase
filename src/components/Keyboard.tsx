"use client";

// 鍵盤レンダラ。MIDI レンジで白鍵 / 黒鍵を実物配置で並べ、
// scale 音には度数ラベル、lick 音にはステップ番号、hot 音をハイライト。

import { isBlackKey, noteName, roleColor } from "@/lib/music";
import type { LickNote, ScaleNote } from "@/lib/types";

interface Props {
  scale: ScaleNote[];
  lick?: LickNote[]; // 表示中のリック（未指定なら scale のみ）
  hot?: number; // lick 内の現在ステップ index（-1 で非アクティブ）
  range: [number, number];
}

// 白鍵に該当する MIDI 余り
const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11];
const isWhite = (midi: number) => WHITE_OFFSETS.includes(midi % 12);

export default function Keyboard({ scale, lick, hot = -1, range }: Props) {
  const [low, high] = range;

  // レンジ内の MIDI 一覧
  const allMidis: number[] = [];
  for (let m = low; m <= high; m++) allMidis.push(m);

  const whiteMidis = allMidis.filter(isWhite);
  const blackMidis = allMidis.filter((m) => !isWhite(m));

  // 白鍵: 等幅、黒鍵: 白鍵境界付近に重ねる
  const whiteW = 36;
  const whiteH = 160;
  const blackW = 22;
  const blackH = whiteH * 0.62;
  const width = whiteMidis.length * whiteW;
  const labelArea = 18; // 鍵盤上にステップ番号を出すスペース
  const height = whiteH + labelArea;

  // 白鍵の x（左端）座標
  const whiteX: Record<number, number> = {};
  whiteMidis.forEach((m, i) => (whiteX[m] = i * whiteW));

  // scale / lick のマップ
  const scaleMap = new Map(scale.map((n) => [n.midi, n]));
  const lickMap = new Map<number, { note: LickNote; step: number }>();
  if (lick) {
    // 同じ MIDI が複数回出るリックでもステップは hot に基づく
    lick.forEach((n, step) => {
      if (!lickMap.has(n.midi)) lickMap.set(n.midi, { note: n, step });
    });
  }
  const lickActive = !!lick;

  // 各鍵の度数ラベル描画
  const renderMarker = (midi: number, cx: number, cy: number) => {
    const sNote = scaleMap.get(midi);
    if (!sNote) return null;
    const lickEntry = lickMap.get(midi);
    const inLick = !!lickEntry;
    // リック表示中：scale は薄く、lick の音は濃く
    const dim = lickActive && !inLick;
    const isHot = hot >= 0 && lick && lick[hot]?.midi === midi;
    const resolve = !!lickEntry?.note.resolve;
    const deg = lickEntry?.note.deg ?? sNote.deg;
    const color = isHot
      ? "var(--amber)"
      : resolve
        ? "var(--blue)"
        : roleColor(deg, resolve);
    const opacity = dim ? 0.25 : 1;
    return (
      <g key={`m-${midi}`} opacity={opacity}>
        <circle
          cx={cx}
          cy={cy}
          r={11}
          fill={color}
          stroke={isHot ? "var(--amber-hi)" : "rgba(0,0,0,0.4)"}
          strokeWidth={isHot ? 2 : 0.8}
        />
        <text
          x={cx}
          y={cy + 3.5}
          textAnchor="middle"
          fontSize={9}
          fontWeight={700}
          fill={isHot ? "#1c1410" : "#1c1410"}
          fontFamily="var(--font-mono)"
        >
          {deg}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-md border border-[var(--line)] bg-[var(--surface)] p-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        style={{ minWidth: width }}
      >
        {/* 白鍵 */}
        {whiteMidis.map((m) => {
          const x = whiteX[m];
          return (
            <g key={`w-${m}`}>
              <rect
                x={x + 1}
                y={labelArea}
                width={whiteW - 2}
                height={whiteH - 1}
                rx={3}
                fill="var(--cream)"
                stroke="var(--line)"
                strokeWidth={1}
              />
              {/* 白鍵下端に音名（極小） */}
              <text
                x={x + whiteW / 2}
                y={labelArea + whiteH - 6}
                textAnchor="middle"
                fontSize={7}
                fill="var(--muted)"
                fontFamily="var(--font-mono)"
              >
                {noteName(m)}
              </text>
            </g>
          );
        })}
        {/* 黒鍵（白鍵の上に重ねる） */}
        {blackMidis.map((m) => {
          // 黒鍵は直前の白鍵の右端付近に配置
          const prevWhite = m - 1;
          const x = (whiteX[prevWhite] ?? 0) + whiteW - blackW / 2;
          return (
            <rect
              key={`b-${m}`}
              x={x}
              y={labelArea}
              width={blackW}
              height={blackH}
              rx={2}
              fill="#1f130a"
              stroke="#0b0805"
              strokeWidth={0.8}
            />
          );
        })}
        {/* 度数マーカー */}
        {whiteMidis.map((m) => {
          const cx = whiteX[m] + whiteW / 2;
          const cy = labelArea + whiteH - 28;
          return renderMarker(m, cx, cy);
        })}
        {blackMidis.map((m) => {
          const prevWhite = m - 1;
          const cx = (whiteX[prevWhite] ?? 0) + whiteW;
          const cy = labelArea + blackH - 16;
          return renderMarker(m, cx, cy);
        })}
        {/* ステップ番号（リック内の弾き順） */}
        {lick &&
          lick.map((n, step) => {
            const m = n.midi;
            let cx: number;
            if (isWhite(m)) {
              cx = whiteX[m] + whiteW / 2;
            } else {
              const prevWhite = m - 1;
              cx = (whiteX[prevWhite] ?? 0) + whiteW;
            }
            // 同じ音が複数回出る場合は、最初の出現のみ表示
            const firstStep = lick.findIndex((x) => x.midi === m);
            if (firstStep !== step) return null;
            return (
              <text
                key={`step-${step}`}
                x={cx}
                y={12}
                textAnchor="middle"
                fontSize={9}
                fontWeight={700}
                fill={hot === step ? "var(--amber)" : "var(--muted)"}
                fontFamily="var(--font-mono)"
              >
                {step + 1}
              </text>
            );
          })}
      </svg>
    </div>
  );
}
