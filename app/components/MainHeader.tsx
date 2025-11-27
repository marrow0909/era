// app/components/MainHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function MainHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // 組織サイトでは一般ヘッダーを出さない
  if (pathname.startsWith("/shadow")) {
    return null;
  }

  const items = [
    { href: "/products", label: "PRODUCTS" },
    { href: "/about", label: "ABOUT" },
    { href: "/account", label: "ACCOUNT" },
    { href: "/cart", label: "CART" },
  ];

  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  return (
    <header
      style={{
        height: 72,
        borderBottom: "1px solid #0b1120",
        background:
          "linear-gradient(to bottom, rgba(2,6,23,0.95), rgba(2,6,23,0.98))",
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* 左ロゴ */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            border: "1px solid #facc15",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "#facc15",
          }}
        >
          ERA
        </div>
        <span
          style={{
            fontSize: 13,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
          }}
        >
          ERA
        </span>
      </Link>

      {/* 右：メニュー＋顔アイコン */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  position: "relative",
                  textDecoration: "none",
                  paddingBottom: 4,
                  color: active ? "#facc15" : "#e5e7eb",
                }}
              >
                {item.label}
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 2,
                      borderRadius: 999,
                      backgroundColor: "#facc15",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 顔マーク */}
        <button
          type="button"
          onClick={toggleMenu}
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            border: "1px solid #1f2937",
            background:
              "radial-gradient(circle at top, #020617, #020617 70%, #020617)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={{ fill: "#e5e7eb" }}
          >
            <circle cx="12" cy="9" r="3.2" />
            <path d="M6.2 18.5c0-2.4 2.1-4.3 5.8-4.3s5.8 1.9 5.8 4.3v0.5H6.2z" />
          </svg>
        </button>
      </div>

      {/* 顔マークのドロップダウン */}
      {open && (
        <>
          <div
            onClick={closeMenu}
            style={{ position: "fixed", inset: 0, zIndex: 29 }}
          />
          <div
            style={{
              position: "absolute",
              right: 40,
              top: 72,
              zIndex: 31,
              borderRadius: 16,
              border: "1px solid #1f2937",
              background:
                "linear-gradient(to bottom right, #020617, #020617, #020617)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.9)",
              padding: "10px 10px 8px",
              minWidth: 180,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
            }}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                style={{
                  display: "block",
                  padding: "8px 10px",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: pathname === item.href ? "#facc15" : "#e5e7eb",
                  backgroundColor:
                    pathname === item.href
                      ? "rgba(250,204,21,0.04)"
                      : "transparent",
                }}
              >
                {item.label}
              </Link>
            ))}

            <div
              style={{
                marginTop: 6,
                paddingTop: 6,
                borderTop: "1px solid #111827",
                color: "#6b7280",
                fontSize: 10,
                letterSpacing: "0.14em",
              }}
            >
              ERA ACCOUNT MENU
            </div>
          </div>
        </>
      )}
    </header>
  );
}
