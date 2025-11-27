"use client";

import { useState } from "react";

type ArchiveFile = {
  id: string;
  label: string;
  status: "OPEN" | "SEALED" | "DORMANT";
  summary: string;
  detail: string;
};

const FILES: ArchiveFile[] = [
  {
    id: "A-01",
    label: "Initial Surface Alignment",
    status: "OPEN",
    summary:
      "Notes from the first alignment between surface projects and the shadow layer.",
    detail:
      "Recorded as a baseline document. Describes how public-facing ERA activity and internal structures should never contradict each other, only mirror in different depth. Some sections are intentionally left vague to allow quiet adjustment over time.",
  },
  {
    id: "B-12",
    label: "Silent Admission Protocol",
    status: "OPEN",
    summary:
      "Procedure for how someone is quietly admitted into this layer without public signals.",
    detail:
      "Admission is never announced as membership. Instead, access simply begins to exist. Individuals are given a way in, usually through a simple pattern or small test. No one is told explicitly that they are now “inside”; they notice when the console reacts to them.",
  },
  {
    id: "C-27",
    label: "Obsolete Channels",
    status: "DORMANT",
    summary:
      "Log of methods and channels that are no longer used but remain documented.",
    detail:
      "Some older contact points and habits have been moved away from. They are kept here for reference only, not for reuse. Any channel listed under this file is considered unstable and must not be revived unless a new directive explicitly calls for it.",
  },
  {
    id: "X-41",
    label: "Unresolved Patterns",
    status: "SEALED",
    summary:
      "A partially redacted file containing patterns that did not fully resolve.",
    detail:
      "This file holds fragments: half-finished signals, ideas that were never pushed to the surface, or connections that did not mature. Parts of it may unlock later. For now, it exists as a reminder that not every path has to be completed to be useful.",
  },
];

export default function ArchivePage() {
  const [openId, setOpenId] = useState<string | null>(FILES[0]?.id ?? null);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 2.1fr) minmax(0, 1.4fr)",
        gap: 18,
      }}
    >
      {/* 左：ファイル一覧 */}
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
            marginBottom: 12,
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
              Archive Chamber
            </p>
            <h2
              style={{
                fontSize: 16,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                margin: "6px 0 0",
              }}
            >
              Stored Records
            </h2>
          </div>
          <div
            style={{
              fontSize: 10,
              textAlign: "right",
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            <div>Files in this chamber record</div>
            <div>what was once important enough to keep.</div>
          </div>
        </div>

        <p
          style={{
            color: "#d1d5db",
            margin: "4px 0 14px",
            lineHeight: 1.7,
            fontSize: 13,
          }}
        >
          Each file represents a decision, method, or idea that shouldn&apos;t
          disappear completely. Some are open, some are dormant, some are
          sealed until needed again.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FILES.map((file) => (
            <ArchiveFileRow
              key={file.id}
              file={file}
              open={openId === file.id}
              onToggle={() => handleToggle(file.id)}
            />
          ))}
        </div>
      </div>

      {/* 右：アーカイブの説明パネル */}
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
          Archive Logic
        </p>

        <p
          style={{
            margin: "0 0 10px",
            color: "#d1d5db",
            lineHeight: 1.7,
          }}
        >
          The chamber is not for nostalgia. It is for reference. Anything stored
          here once had enough weight that erasing it would be a mistake.
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
          <li>
            • <strong>OPEN</strong> files can be read freely inside this layer.
          </li>
          <li>
            • <strong>DORMANT</strong> files describe things that are no longer
            used, but still matter.
          </li>
          <li>
            • <strong>SEALED</strong> files are deliberately incomplete. They
            may unlock later.
          </li>
        </ul>

        <p
          style={{
            marginTop: 14,
            color: "#6b7280",
            fontSize: 10,
          }}
        >
          If you ever create documents for this layer, imagine how they would
          look here before you write them.
        </p>
      </div>
    </div>
  );
}

function ArchiveFileRow({
  file,
  open,
  onToggle,
}: {
  file: ArchiveFile;
  open: boolean;
  onToggle: () => void;
}) {
  const statusColor =
    file.status === "OPEN"
      ? "#facc15"
      : file.status === "SEALED"
      ? "#f97373"
      : "#9ca3af";

  return (
    <div
      onClick={onToggle}
      style={{
        borderRadius: 14,
        border: "1px solid #111827",
        background: open
          ? "linear-gradient(to right, rgba(15,23,42,0.98), rgba(15,23,42,0.94))"
          : "linear-gradient(to right, rgba(15,23,42,0.94), rgba(15,23,42,0.9))",
        padding: "10px 12px 8px",
        cursor: "pointer",
        transition: "background 0.15s ease, border-color 0.15s ease",
      }}
    >
      {/* 上段：ID + 状態 + ラベル */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          marginBottom: open ? 4 : 2,
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#9ca3af",
            minWidth: 70,
          }}
        >
          {file.id}
        </span>

        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: statusColor,
          }}
        >
          {file.status}
        </span>

        <span
          style={{
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#e5e7eb",
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file.label}
        </span>

        {/* 矢印 */}
        <span
          style={{
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          {open ? "−" : "+"}
        </span>
      </div>

      {/* 中段：サマリー */}
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: "#9ca3af",
          lineHeight: 1.6,
        }}
      >
        {file.summary}
      </p>

      {/* 詳細（開いているときだけ） */}
      {open && (
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 11,
            color: "#d1d5db",
            lineHeight: 1.7,
          }}
        >
          {file.detail}
        </p>
      )}
    </div>
  );
}
