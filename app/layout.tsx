// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { MainHeader } from "./components/MainHeader";
import { ShadowKey } from "./components/ShadowKey";
import { CartProvider } from "./context/cart-context"; // ★ 追加

export const metadata: Metadata = {
  title: "ERA — Minimal Luxury",
  description: "ERA official site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}
      >
        {/* ここから下を CartProvider で包むだけでOK */}
        <CartProvider>
          {/* 上：共通ヘッダー（スクショと同じやつ） */}
          <MainHeader />

          {/* 中身 */}
          <main>{children}</main>

          {/* 下：フッター＋秘密ゲートトリガー */}
          <footer
            style={{
              borderTop: "1px solid #111827",
              padding: "10px 24px",
              fontSize: 11,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#6b7280",
            }}
          >
            <span>© 2025 ERA</span>
            {/* 右下の「E R A*」を3回クリックでゲート呼び出し */}
            <ShadowKey />
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
