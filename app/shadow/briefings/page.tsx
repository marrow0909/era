"use client";

import { useEffect, useState } from "react";

const NAME_KEY = "era-shadow-display-name";

export default function BriefingsPage() {
  const [displayName, setDisplayName] = useState<string | null>(null);

  // Console で設定した名前を読む（なければ UNKNOWN）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(NAME_KEY);
    if (stored) setDisplayName(stored);
  }, []);

  const label = (displayName || "UNKNOWN AGENT").toUpperCase();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2.2fr) minmax(0, 1.3fr)",
        gap: 18,
      }}
    >
      {/* 左：今日のブリーフィング */}
      <div
        style={{
          borderRadius: 24,
          border: "1px solid #1f2937",
          background:
            "linear-gradient(to bottom right, rgba(15,23,42,0.98), rgba(2,6,23,0.98))",
          padding: "20px 22px 22px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.9)",
          fontSize: 13,
        }}
      >
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "#9ca3af",
                margin: 0,
              }}
            >
              Daily Briefing
            </p>
            <h2
              style={{
                fontSize: 16,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                margin: "6px 0 0",
              }}
            >
              Surface Movements
            </h2>
          </div>

          <div
            style={{
              fontSize: 9,
              textAlign: "right",
              color: "#6b7280",
            }}
          >
            <div>Visible as:</div>
            <div
              style={{
                marginTop: 2,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </div>
          </div>
        </div>

        <p
          style={{
            color: "#d1d5db",
            margin: "4px 0 10px",
            lineHeight: 1.7,
            fontSize: 13,
          }}
        >
          This channel carries notices that can be seen by all actors in this
          layer. Nothing here reveals who is reading, only that someone is.
        </p>

        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px dashed #1f2937",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* ダミー通達：後で本物に変えればOK */}
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#9ca3af",
                margin: "0 0 4px",
              }}
            >
              BRF-001 // ENTRY CONDUCT
            </p>
            <p
              style={{
                margin: 0,
                color: "#e5e7eb",
                lineHeight: 1.7,
              }}
            >
              Treat every interaction as if it can be replayed later. No one
              sees your tier, but your patterns are recorded as “quiet signals”.
              Surface identity and internal presence must never conflict.
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#9ca3af",
                margin: "4px 0 4px",
              }}
            >
              BRF-002 // INFORMATION FLOW
            </p>
            <p
              style={{
                margin: 0,
                color: "#e5e7eb",
                lineHeight: 1.7,
              }}
            >
              Anything important for the whole structure appears here first,
              then quietly shapes what you see in other sections. You don&apos;t
              request access. Access requests you.
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#9ca3af",
                margin: "4px 0 4px",
              }}
            >
              BRF-003 // SILENCE RULE
            </p>
            <p
              style={{
                margin: 0,
                color: "#e5e7eb",
                lineHeight: 1.7,
              }}
            >
              Do not speak of this layer on the surface. If you must refer to
              it, call it “logistics” or “back office”. Never call it by its
              real name.
            </p>
          </div>
        </div>
      </div>

      {/* 右：メモ・ログ風パネル */}
      <div
        style={{
          borderRadius: 24,
          border: "1px solid #1f2937",
          background:
            "linear-gradient(to bottom right, rgba(15,23,42,0.98), rgba(2,6,23,0.98))",
          padding: "18px 18px 20px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.9)",
          fontSize: 11,
        }}
      >
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#9ca3af",
            margin: "0 0 6px",
          }}
        >
          Layer Notes
        </p>
        <p
          style={{
            margin: "0 0 10px",
            color: "#d1d5db",
            lineHeight: 1.7,
          }}
        >
          Some notices will only exist for a short time. If something feels
          important, write it down outside this console in your own way.
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            color: "#9ca3af",
            lineHeight: 1.7,
          }}
        >
          <li>• Briefings are shared to all tiers at once.</li>
          <li>• No one here can see who else is reading.</li>
          <li>• Your response is measured by action, not reply.</li>
        </ul>

        <p
          style={{
            marginTop: 10,
            color: "#6b7280",
            fontSize: 10,
          }}
        >
          If the console needs you to act, you&apos;ll feel it in{" "}
          <span style={{ textTransform: "uppercase" }}>Operations</span> first.
        </p>
      </div>
    </div>
  );
}
