// app/auth/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);

    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }

    try {
      setSending(true);

      const origin =
        typeof window !== "undefined" ? window.location.origin : "";

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/account`, // ログイン後に飛ばす場所
        },
      });

      if (error) {
        console.error(error);
        setErrorMessage("Failed to send sign-in email. Please try again.");
      } else {
        setMessage(
          "We’ve sent a sign-in link to your email. Open it to continue to ERA."
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Unexpected error while sending sign-in email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 24,
          border: "1px solid #111827",
          background:
            "radial-gradient(circle at top, #020617, #020617 60%, #020617)",
          padding: 24,
        }}
      >
        {/* ロゴ / タイトル */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#9ca3af",
            }}
          >
            ERA ACCESS
          </div>
          <h1
            style={{
              margin: "8px 0 0",
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Sign in / Create account
          </h1>
          <p
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            Use your email (Gmail recommended). We’ll send you a sign-in link
            from ERA.
          </p>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSendLink}>
          <label
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#9ca3af",
              display: "block",
              marginBottom: 6,
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 999,
              border: "1px solid #111827",
              background: "rgba(15,23,42,0.9)",
              padding: "8px 12px",
              color: "#e5e7eb",
              fontSize: 13,
              outline: "none",
            }}
          />

          <button
            type="submit"
            disabled={sending}
            style={{
              marginTop: 14,
              width: "100%",
              borderRadius: 999,
              border: "1px solid #facc15",
              background: sending ? "#eab308" : "#facc15",
              color: "#111827",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              padding: "8px 14px",
              cursor: sending ? "default" : "pointer",
            }}
          >
            {sending ? "Sending..." : "Send sign-in link"}
          </button>
        </form>

        {/* メッセージ表示 */}
        {message && (
          <p
            style={{
              marginTop: 12,
              fontSize: 12,
              color: "#bbf7d0",
            }}
          >
            {message}
          </p>
        )}

        {errorMessage && (
          <p
            style={{
              marginTop: 12,
              fontSize: 12,
              color: "#f97373",
            }}
          >
            {errorMessage}
          </p>
        )}

        {/* 戻るリンク */}
        <button
          type="button"
          onClick={() => router.push("/")}
          style={{
            marginTop: 18,
            border: "none",
            background: "transparent",
            fontSize: 12,
            color: "#9ca3af",
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Back to ERA home
        </button>
      </div>
    </div>
  );
}
