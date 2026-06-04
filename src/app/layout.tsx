import type { Metadata } from "next";
import { JetBrains_Mono, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const display = Zen_Maru_Gothic({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "piano-phrase",
  description:
    "ピアノ右手フレーズを度数とサウンドで辿る — V7alt → Imaj7 を鍵盤で見る",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-display">{children}</body>
    </html>
  );
}
