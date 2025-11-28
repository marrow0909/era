// app/components/MainHeader.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseClient } from "../lib/supabaseClient";

export function MainHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setIsLoggedIn(!!data?.user);
      } catch (e) {
        console.error(e);
        setIsLoggedIn(false);
      }
    };
    check();
  }, [supabase]);

  const goAccountOrAuth = () => {
    if (isLoggedIn) {
      router.push("/account");
    } else {
      router.push("/auth");
    }
  };

  const goCart = () => {
    router.push("/cart");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(14px)",
        background:
          "linear-gradient(to bottom, rgba(2,6,23,0.94), rgba(2,6,23,0.88), transparent)",
        borderBottom: "1px solid #020617",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        {/* 左：ERA ロゴ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                border: "1px solid #facc15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#facc15",
              }}
            >
              E
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.1,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                }}
              >
                ERA
              </span>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                NEW AGE OF LUXURY
              </span>
            </div>
          </Link>
        </div>

        {/* 中央ナビ */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          <HeaderLink href="/" label="Home" active={isActive("/")} />
          <HeaderLink href="/products" label="Products" active={isActive("/products")} />
          <HeaderLink href="/about" label="About" active={isActive("/about")} />
        </nav>

        {/* 右：カート / アカウント */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* カート */}
          <button
            type="button"
            onClick={goCart}
            style={{
              borderRadius: 999,
              border: "1px solid #111827",
              background: "rgba(15,23,42,0.9)",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: 16,
              }}
            >
              🛒
            </span>
          </button>

          {/* アカウント / ログイン */}
          <button
            type="button"
            onClick={goAccountOrAuth}
            style={{
              borderRadius: 999,
              border: "1px solid #111827",
              background: "rgba(15,23,42,0.9)",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: 17,
              }}
            >
              👤
            </span>

            {/* ログイン済みなら右下にゴールドの点 */}
            {isLoggedIn && (
              <span
                style={{
                  position: "absolute",
                  right: 3,
                  bottom: 3,
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  backgroundColor: "#facc15",
                  boxShadow: "0 0 8px rgba(250,204,21,0.8)",
                }}
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function HeaderLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: active ? "#facc15" : "#e5e7eb",
        opacity: active ? 1 : 0.8,
      }}
    >
      {label}
    </Link>
  );
}
