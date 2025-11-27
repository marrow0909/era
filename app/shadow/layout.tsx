// app/shadow/layout.tsx
import React from "react";
import Link from "next/link";

export default function ShadowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        minHeight: "calc(100vh - 80px)",
        padding: "32px 24px 48px",
        display: "flex",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #020617 0, #020617 40%, #020617 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1040px",
        }}
      >
        {/* ここが組織メニュー */}
        <header
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#9ca3af",
                margin: 0,
              }}
            >
              ERA SHADOW AUTHORITY
            </p>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#6b7280",
                margin: "4px 0 0",
              }}
            >
              Layer // SILENT MONARCH
            </p>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 20,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            <Link href="/shadow">Console</Link>
            <Link href="/shadow/briefings">Briefings</Link>
            <Link href="/shadow/operations">Operations</Link>
            <Link href="/shadow/archive">Archive</Link>
            <Link href="/">Exit Surface</Link>
          </nav>
        </header>

        {/* ここに /shadow の各ページ内容が入る */}
        {children}
      </div>
    </section>
  );
}
