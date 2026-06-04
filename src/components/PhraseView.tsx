"use client";

import { useEffect, useRef, useState } from "react";
import { beatMs, playNote, resumeAudio, roleColor } from "@/lib/music";
import type { Phrase } from "@/lib/types";
import Keyboard from "./Keyboard";

interface Props {
  phrase: Phrase;
}

const DEFAULT_BPM = 90;

export default function PhraseView({ phrase }: Props) {
  const [lickIdx, setLickIdx] = useState(0);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [hot, setHot] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const playingRef = useRef(false);

  const lick = phrase.licks[lickIdx];

  // 再生：seq をテンポに沿って順番に発音し、hot index を更新
  async function play() {
    if (playingRef.current) return;
    playingRef.current = true;
    setPlaying(true);
    await resumeAudio();
    const ms = beatMs(bpm);
    for (let i = 0; i < lick.seq.length; i++) {
      if (!playingRef.current) break;
      const n = lick.seq[i];
      const dur = (n.d ?? 1) * (ms / 1000);
      setHot(i);
      playNote(n.midi, dur, 0.45);
      await new Promise((r) => setTimeout(r, (n.d ?? 1) * ms));
    }
    playingRef.current = false;
    setPlaying(false);
    setHot(-1);
  }

  function stop() {
    playingRef.current = false;
    setPlaying(false);
    setHot(-1);
  }

  // Unmount 時にストップ
  useEffect(() => {
    return () => {
      playingRef.current = false;
    };
  }, []);

  // リック切替時に停止して hot リセット
  function chooseLick(i: number) {
    stop();
    setLickIdx(i);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      {/* ヘッダ */}
      <header>
        <h1 className="font-display text-2xl font-bold text-[var(--amber)]">
          {phrase.title}
        </h1>
        {phrase.subtitle ? (
          <p className="mt-1 text-sm text-[var(--muted)]">{phrase.subtitle}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-[var(--muted)]">
          <span className="rounded bg-[var(--surface)] px-2 py-0.5 font-mono">
            Key {phrase.key}
          </span>
          <span className="rounded bg-[var(--surface)] px-2 py-0.5 font-mono">
            {phrase.progression}
          </span>
          {phrase.technique.map((t) => (
            <span
              key={t}
              className="rounded bg-[var(--surface)] px-2 py-0.5 font-mono uppercase"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      {/* リック切替 */}
      {phrase.licks.length > 1 ? (
        <section>
          <div className="mb-1.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
            リック切替
          </div>
          <div className="inline-flex rounded-md border border-[var(--line)] bg-[var(--surface)] p-[3px]">
            {phrase.licks.map((l, i) => (
              <button
                key={i}
                type="button"
                onClick={() => chooseLick(i)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  lickIdx === i
                    ? "bg-[var(--amber)] text-[var(--bg)]"
                    : "text-[var(--cream)] hover:text-[var(--amber-hi)]"
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* リックノート */}
      <section>
        <div className="mb-1 text-[10px] uppercase tracking-wider text-[var(--muted)]">
          {phrase.positionLabel} — {lick.name}
        </div>
        <p className="text-xs leading-relaxed text-[var(--cream)]">
          {lick.note}
        </p>
      </section>

      {/* 鍵盤 */}
      <section>
        <Keyboard
          scale={phrase.scale}
          lick={lick.seq}
          hot={hot}
          range={phrase.range}
        />
      </section>

      {/* 度数チップ列（再生と同期） */}
      <section>
        <div className="mb-1.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
          度数の流れ
        </div>
        <div className="flex flex-wrap gap-1.5">
          {lick.seq.map((n, i) => {
            const active = hot === i;
            const color = roleColor(n.deg, n.resolve);
            return (
              <span
                key={i}
                className="rounded-md border px-2 py-1 font-mono text-xs transition-all"
                style={{
                  borderColor: active ? "var(--amber)" : "var(--line)",
                  background: active ? "var(--amber)" : "transparent",
                  color: active ? "var(--bg)" : color,
                  fontWeight: active ? 700 : 500,
                }}
              >
                {n.deg}
              </span>
            );
          })}
        </div>
      </section>

      {/* 再生コントロール */}
      <section className="flex flex-wrap items-center gap-3 rounded-md border border-[var(--line)] bg-[var(--surface)] p-3">
        <button
          type="button"
          onClick={playing ? stop : play}
          className="rounded-full bg-[var(--amber)] px-5 py-2 text-sm font-bold text-[var(--bg)] transition-colors hover:bg-[var(--amber-hi)]"
        >
          {playing ? "■ 停止" : "▶ 再生"}
        </button>
        <div className="flex items-center gap-2 text-xs text-[var(--cream)]">
          <span className="text-[var(--muted)]">テンポ</span>
          <input
            type="range"
            min={40}
            max={180}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-32 accent-[var(--amber)]"
          />
          <span className="font-mono">{bpm} BPM</span>
        </div>
      </section>

      {/* 解説 */}
      <section className="rounded-md border border-[var(--line)] bg-[var(--surface)] p-4">
        <div className="mb-1.5 text-[10px] uppercase tracking-wider text-[var(--amber)]">
          ここがポイント
        </div>
        <p className="text-sm leading-relaxed text-[var(--cream)]">
          {phrase.point}
        </p>
      </section>

      {/* 凡例 */}
      <section className="text-[10px] text-[var(--muted)]">
        <span style={{ color: "var(--red)" }}>●</span> コードトーン &nbsp;
        <span style={{ color: "var(--pink)" }}>●</span> テンション &nbsp;
        <span style={{ color: "var(--blue)" }}>●</span> 解決音 &nbsp;
        <span style={{ color: "var(--amber)" }}>●</span> 再生中
      </section>
    </div>
  );
}
