// app/components/ShadowGate.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SECRET_NUMBER = "729104"; // 本番で好きに変えてOK
const SECRET_PHRASE = "silent-monarch";

export function ShadowGate() {
  const [clickCount, setClickCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

  const router = useRouter();

  const handleTriggerClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 3) {
      setOpen(true);
      setClickCount(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (number === SECRET_NUMBER && phrase === SECRET_PHRASE) {
      setError(null);
      document.cookie =
        "shadow_member=1; path=/; max-age=31536000; secure; samesite=lax";
      setOpen(false);
      router.push("/shadow");
    } else {
      setError("ACCESS DENIED");
    }
  };

  return (
    <>
      {/* フッター右端の「消えかけ ERA」 */}
      <span
        onClick={handleTriggerClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        role="button"
        aria-label="internal access"
        style={{
          fontSize: "10px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          cursor: "default",
          color: hover ? "#e5e7eb" : "#6b7280",
          textDecoration: "line-through",
          textDecorationColor: "#4b5563",
          textDecorationThickness: "1px",
          userSelect: "none",
        }}
      >
        ERA
      </span>

      {/* モーダル */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: "24px",
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              borderRadius: "16px",
              border: "1px solid #1f2937",
              backgroundColor: "rgba(0,0,0,0.9)",
              padding: "24px",
              color: "#e5e7eb",
              boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#6b7280",
                marginBottom: "8px",
              }}
            >
              ACCESS GATE // SOVEREIGN LAYER
            </p>
            <h2
              style={{
                fontSize: "18px",
                letterSpacing: "0.15em",
                marginBottom: "8px",
              }}
            >
              ENTER SILENT MONARCH
            </h2>
            <p
              style={{
                fontSize: "11px",
                color: "#9ca3af",
                marginBottom: "16px",
              }}
            >
              You are attempting to enter a detached operational layer of ERA.
              The next door opens only if the number and phrase match.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#9ca3af",
                    marginBottom: "4px",
                  }}
                >
                  Secret number
                </label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    border: "1px solid #374151",
                    backgroundColor: "#000",
                    padding: "8px 10px",
                    fontSize: "13px",
                    color: "#e5e7eb",
                    fontFamily: "monospace",
                  }}
                  placeholder="6 digits"
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#9ca3af",
                    marginBottom: "4px",
                  }}
                >
                  Pass phrase
                </label>
                <input
                  type="password"
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    border: "1px solid #374151",
                    backgroundColor: "#000",
                    padding: "8px 10px",
                    fontSize: "13px",
                    color: "#e5e7eb",
                  }}
                  placeholder="lowercase phrase"
                />
              </div>

              {error && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#f87171",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginTop: "6px",
                  }}
                >
                  {error}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "16px",
                  marginBottom: "4px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{
                    fontSize: "11px",
                    padding: "5px 10px",
                    borderRadius: "999px",
                    border: "1px solid #374151",
                    background: "transparent",
                    color: "#e5e7eb",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    fontSize: "11px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: "1px solid #f9fafb",
                    background: "transparent",
                    color: "#f9fafb",
                    cursor: "pointer",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Enter
                </button>
              </div>
            </form>

            <p
              style={{
                fontSize: "10px",
                color: "#6b7280",
                marginTop: "8px",
              }}
            >
              The existence of this gate does not need to be mentioned to anyone
              outside this layer.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
