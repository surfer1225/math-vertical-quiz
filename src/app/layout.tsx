import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "竖式数学闯关",
  description: "互动式两位数加减法竖式数学题闯关游戏",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
