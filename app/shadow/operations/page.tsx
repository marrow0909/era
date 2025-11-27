"use client";

import { useEffect, useState } from "react";

const NAME_KEY = "era-shadow-display-name";

export default function OperationsPage() {
  const [displayName, setDisplayName] = useState<string | null>(null);

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
      {/* ======================== 左：任務リスト =========================== */}
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
              Operations
            </p>
            <h2
              style={{
                fontSize: 16,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                margin: "6px 0 0",
              }}
            >
              Assigned Tasks
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
            margin: "4px 0 20px",
            lineHeight: 1.7,
            fontSize: 13,
          }}
        >
          These operations are visible to all actors in this layer. Your actions
          are recorded silently.
        </p>

        {/* === 任務カード === */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Mission A */}
          <MissionCard
            id="OP-117"
            title="Signal Observation"
            status="ACTIVE"
            detail="A quiet monitoring task. Observe patterns on the surface and note any unusual connections. No reporting necessary unless instructed."
          />

          {/* Mission B */}
          <MissionCard
            id="OP-204"
            title="Silent Relay"
            status="PENDING"
            detail="Standby for instructions. This relay activates only when another member indirectly triggers it through system behavior."
          />

          {/* Mission C */}
          <MissionCard
            id="OP-306"
            title="Deep Layer Access"
            status="LOCKED"
            detail="This mission becomes visible only when the console decides you require deeper access. There is no action you can take to unlock it manually."
          />
        </div>
      </div>

      {/* ======================== 右：任務説明 =========================== */}
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
          Task Logic
        </p>

        <p
          style={{
            margin: "0 0 12px",
            color: "#d1d5db",
            lineHeight: 1.7,
          }}
        >
          Operations here are not assigned manually. The system evaluates silent
          factors and shows only what is necessary for your role.
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
          <li>• ACTIVE tasks can be influenced immediately.</li>
          <li>• PENDING tasks activate when the system detects a trigger.</li>
          <li>• LOCKED tasks are not your concern until they appear.</li>
        </ul>

        <p
          style={{
            marginTop: 14,
            color: "#6b7280",
            fontSize: 10,
          }}
        >
          If something shifts, you will feel it here before anywhere else.
        </p>
      </div>
    </div>
  );
}

/* =================================================== */
/* 任務カード（MissionCardコンポーネント）            */
/* =================================================== */

function MissionCard({
  id,
  title,
  status,
  detail,
}: {
  id: string;
  title: string;
  status: "ACTIVE" | "PENDING" | "LOCKED";
  detail: string;
}) {
  const color =
    status === "ACTIVE"
      ? "#facc15"
      : status === "PENDING"
      ? "#60a5fa"
      : "#9ca3af";

  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid #111827",
        padding: "14px 18px 16px",
        background:
          "linear-gradient(to bottom right, rgba(2,6,23,0.9), rgba(2,6,23,0.92))",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 4,
          color,
        }}
      >
        {id} // {status}
      </div>

      <div
        style={{
          fontSize: 14,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "#d1d5db",
          lineHeight: 1.6,
        }}
      >
        {detail}
      </p>
    </div>
  );
}
