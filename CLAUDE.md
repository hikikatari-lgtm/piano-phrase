# piano-phrase

ピアノ右手フレーズを**鍵盤上の度数とサウンドで辿る**アプリ。
phrase-lab（ギター版）の設計をそのまま流用し、視覚表現だけ「フレットボード→鍵盤」に差し替えたピアノ版。
廣嶋さんのチャンネル文脈（ピアノ→作曲→ギター）の入口を担う。

v1 は C7alt → Fmaj7（V7alt → Imaj7）の右手単音フレーズ1枚（`/c7alt`）。

## 技術スタック
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Web Audio API（Tone.js 等は使わない、ライブラリ無し）
- localStorage 不使用、state は useState のみ

## プロジェクト構成
```
src/
  app/
    layout.tsx               # フォント・テーマ
    page.tsx                 # redirect("/c7alt")
    [id]/page.tsx            # getPhrase で取得 → PhraseView
    globals.css              # 深煎りテーマのデザイントークン
  components/
    Keyboard.tsx             # ★ピアノ固有：鍵盤レンダラ
    PhraseView.tsx           # ヘッダ/鍵盤/度数チップ/再生/解説
  lib/
    types.ts                 # Phrase 型（MIDI+度数）
    music.ts                 # MIDI→周波数、Web Audio playNote、度数色
    phrases.ts               # 全フレーズ集約・getPhrase
    data/
      c7alt.ts               # C7alt → Fmaj7 データ
```

## データの考え方

ギター版が `{s, f, deg}`（弦・フレット・度数）だったのに対し、ピアノ版は **`{midi, deg}`** に正規化。
将来ギター版と同じ `{midi, deg}` 形式に揃えれば、同一リックデータを楽器トグルで両対応できる。

## サウンド設計

phrase-lab と同じ：triangle + sawtooth ×2(detune ±4) → lowpass(2600→900) → AD envelope。
iOS Safari は最初のユーザー操作で `resumeAudio()` を呼んで AudioContext を resume。

## デプロイ
`git push origin main` で Vercel が自動デプロイ。

## 将来（今回はやらない）
- 左手コード表示（ボイシング鍵盤下段）
- 同一リックのギター/ピアノ切替（{midi,deg} 共有）
- メニューページ（フレーズが溜まってから分類軸を決める）

## 関連プロジェクト
- phrase-lab（ギター版）— 同じ設計の前身

@AGENTS.md
