import type { Phrase } from "../types";

// C7alt → Fmaj7（V7alt → Imaj7）ピアノ右手フレーズ
// 右手の実音（廣嶋さん採譜）：E4 E♭4 E4 A♭4 E♭5 D♭5 A♭4 B♭4 C5
// 度数は C7alt 基準（C=R）。Cオルタード構成音：C D♭ E♭ E(=F♭) F♯/G♭ A♭ B♭
//   R=C(60) ♭9=D♭(61) ♯9=E♭(63) △3=E(64) ♯11=F♯/G♭(66) ♭13=A♭(68) ♭7=B♭(70)
export const c7alt: Phrase = {
  id: "c7alt",
  title: "C7alt → Fmaj7（ピアノ右手）",
  subtitle: "V7alt → Imaj7 を鍵盤で — テンションから戻る",
  key: "F",
  progression: "V-I (to F major)",
  technique: ["altered"],
  range: [60, 84], // C4〜C6
  positionLabel: "C オルタード（右手単音）",
  // Cオルタードの構成音（代表オクターブ。鍵盤上に度数で表示）
  scale: [
    { midi: 60, deg: "R" },    // C4
    { midi: 61, deg: "♭9" },   // D♭4
    { midi: 63, deg: "♯9" },   // E♭4
    { midi: 64, deg: "△3" },   // E4 (=F♭)
    { midi: 66, deg: "♯11" },  // F♯4/G♭4
    { midi: 68, deg: "♭13" },  // A♭4
    { midi: 70, deg: "♭7" },   // B♭4
    { midi: 72, deg: "R" },    // C5（オクターブ上）
  ],
  licks: [
    {
      name: "本リック",
      note: "テンションを織り込みつつ下降〜上行し Fmaj7 手前まで（採譜どおり）",
      // E4 E♭4 E4 A♭4 E♭5 D♭5 A♭4 B♭4 C5
      seq: [
        { midi: 64, deg: "△3" },  // E4
        { midi: 63, deg: "♯9" },  // E♭4
        { midi: 64, deg: "△3" },  // E4
        { midi: 68, deg: "♭13" }, // A♭4
        { midi: 75, deg: "♯9" },  // E♭5
        { midi: 73, deg: "♭9" },  // D♭5
        { midi: 68, deg: "♭13" }, // A♭4
        { midi: 70, deg: "♭7" },  // B♭4
        { midi: 72, deg: "R", resolve: true }, // C5 = C7alt の R（Fmaj7 では 5th になる）
      ],
    },
  ],
  point:
    "C7alt（V7alt）のテンションを通り、最後の C へ着地。この C は V7alt ではR（緊張の核）だが、Fmaj7 に変わると 5th（収まりどころ）になる——同じ音が、コードの変化で役割を変える。テンションをどれだけ外しても、コード内の音へ戻れば収まる「外して、戻る」が、一音の機能転換で起きる好例。鍵盤では、黒鍵に多いテンションから白鍵へ戻る流れが目で追える。",
};
