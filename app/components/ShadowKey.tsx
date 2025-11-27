// app/components/ShadowKey.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SECRET_NUMBER = "729104";       // ← 好きに変えてOK
const SECRET_PHRASE = "silent-monarch"; // ← 好きに変えてOK

export function ShadowKey() {
  const [clicks, setClicks] = useState(0);
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleTriggerClick = () => {
    const next = clicks + 1;
    if (next >= 3) {
      setOpen(true);
      setClicks(0);
    } else {
      setClicks(next);
      // 一定時間でリセット（連打防止）
      setTimeout(() => setClicks(0), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (number === SECRET_NUMBER && phrase === SECRET_PHRASE) {
      setError("");
      setOpen(false);
      setNumber("");
      setPhrase("");
      router.push("/shadow");
    } else {
      setError("Access denied.");
    }
  };

  return (
    <>
      {/* 右下の小さいトリガー */}
      <button
        type="button"
        onClick={handleTriggerClick}
        style={{
          border: "none",
          background: "transparent",
          color: "#6b7280",
          fontSize: 10,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          cursor: "default",
        }}
      >
        E R A*
      </button>

      {/* モーダル */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 20,
              border: "1px solid #1f2937",
              background:
                "radial-gradient(circle at top, rgba(15,23,42,0.98), rgba(2,6,23,0.98))",
              boxShadow: "0 30px 90px rgba(0,0,0,0.9)",
              padding: "20px 22px 22px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "#9ca3af",
                margin: 0,
              }}
            >
              ERA SHADOW AUTHORITY
            </p>
            <h2
              style={{
                fontSize: 16,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: "8px 0 14px",
              }}
            >
              Internal Gate
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <label
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "#9ca3af",
                }}
              >
                Secret Number
                <input
                  type="password"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #1f2937",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                    fontSize: 13,
                  }}
                />
              </label>

              <label
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "#9ca3af",
                  marginTop: 4,
                }}
              >
                Phrase
                <input
                  type="password"
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid #1f2937",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                    fontSize: 13,
                  }}
                />
              </label>

              {error && (
                <p
                  style={{
                    fontSize: 11,
                    color: "#f97373",
                    margin: "4px 0 0",
                  }}
                >
                  {error}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{
                    borderRadius: 999,
                    border: "1px solid #1f2937",
                    padding: "6px 14px",
                    background: "transparent",
                    color: "#9ca3af",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    borderRadius: 999,
                    border: "1px solid #facc15",
                    padding: "6px 16px",
                    background:
                      "linear-gradient(to right, #facc15, #eab308, #facc15)",
                    color: "#111827",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
