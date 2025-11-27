"use client";

import React, { useEffect, useState } from "react";

const NAME_KEY = "era-shadow-display-name";
const PHOTO_KEY = "era-shadow-photo-url";

export default function ShadowHome() {
  // 表示用
  const [displayName, setDisplayName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // 編集用
  const [inputName, setInputName] = useState("");
  const [inputPhotoUrl, setInputPhotoUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [editingIdentity, setEditingIdentity] = useState(false);

  // 初回ロード時に localStorage から読み込み
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedName = window.localStorage.getItem(NAME_KEY);
    const storedPhoto = window.localStorage.getItem(PHOTO_KEY);

    if (storedName) {
      setDisplayName(storedName);
      setInputName(storedName);
    }
    if (storedPhoto) {
      setPhotoUrl(storedPhoto);
      setInputPhotoUrl(storedPhoto);
    }
  }, []);

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = inputName.trim();
    const trimmedPhoto = inputPhotoUrl.trim();

    // 名前クリアしたら UNKNOWN に戻す
    if (!trimmedName) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(NAME_KEY);
      }
      setDisplayName("");
    } else {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(NAME_KEY, trimmedName);
      }
      setDisplayName(trimmedName);
    }

    // 写真URL
    if (!trimmedPhoto) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(PHOTO_KEY);
      }
      setPhotoUrl(null);
    } else {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(PHOTO_KEY, trimmedPhoto);
      }
      setPhotoUrl(trimmedPhoto);
    }

    setStatusMessage("Identity updated in this console.");
    setEditingIdentity(false); // ← 保存したら編集フォームを隠す
    setTimeout(() => setStatusMessage(""), 2500);
  };

  const codenameLabel = (displayName || "UNKNOWN AGENT").toUpperCase();
  const initials =
    displayName
      ?.trim()
      .split(/\s+/)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "EA";

  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px solid #1f2937",
        background:
          "radial-gradient(circle at top, rgba(2,6,23,0.96) 0, rgba(2,6,23,0.98) 40%, rgba(2,6,23,0.99) 100%)",
        padding: "24px 24px 28px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
        color: "#e5e7eb",
      }}
    >
      {/* ヘッダー行 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
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
          <h1
            style={{
              fontSize: 20,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              margin: "8px 0 0",
            }}
          >
            Internal Console
          </h1>
        </div>

        <div
          style={{
            fontSize: 10,
            textAlign: "right",
            color: "#6b7280",
          }}
        >
          <div>Layer: SILENT MONARCH</div>
          <div>Visibility: Off-Record</div>
        </div>
      </div>

      {/* メインカード（上段） */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.5fr)",
          gap: 18,
        }}
      >
        {/* 左：コードネーム＋プロフィール */}
        <div
          style={{
            borderRadius: 18,
            border: "1px solid #111827",
            background:
              "linear-gradient(to bottom right, rgba(15,23,42,0.96), rgba(15,23,42,0.98))",
            padding: "16px 18px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            {/* プロフィール写真 or イニシャル */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                border: "1px solid #1f2937",
                backgroundColor: "#020617",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#e5e7eb",
              }}
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                initials
              )}
            </div>

            <div>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                  margin: "0 0 4px",
                }}
              >
                Assigned Codename
              </p>
              <p
                style={{
                  fontSize: 18,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {codenameLabel}
              </p>
            </div>

            {/* 設定ボタン */}
            <button
              type="button"
              onClick={() => setEditingIdentity((v) => !v)}
              style={{
                marginLeft: "auto",
                borderRadius: 999,
                border: "1px solid #1f2937",
                padding: "5px 10px",
                backgroundColor: "transparent",
                color: "#9ca3af",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {editingIdentity ? "Close" : "Edit"}
            </button>
          </div>

          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Your codename and profile image exist only inside this layer.
            Nothing here is visible on the surface.
          </p>

          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: "1px dashed #1f2937",
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              fontSize: 11,
            }}
          >
            <div>
              <div style={{ color: "#9ca3af", marginBottom: 2 }}>Tier</div>
              <div style={{ textTransform: "uppercase" }}>Not Disclosed</div>
            </div>
            <div>
              <div style={{ color: "#9ca3af", marginBottom: 2 }}>Evaluation</div>
              <div style={{ textTransform: "uppercase" }}>In Progress</div>
            </div>
            <div>
              <div style={{ color: "#9ca3af", marginBottom: 2 }}>Status</div>
              <div style={{ textTransform: "uppercase" }}>Active</div>
            </div>
          </div>
        </div>

        {/* 右：構造説明 */}
        <div
          style={{
            borderRadius: 18,
            border: "1px solid #111827",
            background:
              "linear-gradient(to bottom right, rgba(15,23,42,0.96), rgba(2,6,23,0.98))",
            padding: "16px 18px 18px",
            fontSize: 11,
            lineHeight: 1.7,
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
            Internal Structure (Simplified)
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              color: "#d1d5db",
            }}
          >
            <li>• Surface: Public-facing ERA projects.</li>
            <li>• Layer 1: Silent logistics and information flow.</li>
            <li>• Layer 2: Decision circles &amp; closed operations.</li>
            <li>• Core: A very small number of holders.</li>
          </ul>

          <p
            style={{
              marginTop: 10,
              color: "#9ca3af",
            }}
          >
            Your current access shows only what is necessary for your role. If
            the system decides you need to see more, more will quietly appear.
          </p>
        </div>
      </div>

      {/* 下：Identity 設定カード（編集モードのときだけ詳しく見える感じ） */}
      <div
        style={{
          marginTop: 20,
          borderRadius: 18,
          border: "1px solid #111827",
          background:
            "linear-gradient(to right, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
          padding: "16px 18px 18px",
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
          Identity Layer
        </p>

        {!editingIdentity && (
          <>
            <p
              style={{
                margin: "0 0 6px",
                color: "#d1d5db",
                lineHeight: 1.7,
              }}
            >
              Console name and profile image are set. Use{" "}
              <span style={{ textTransform: "uppercase" }}>Edit</span> to
              change them.
            </p>
            <div
              style={{
                marginTop: 4,
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                color: "#9ca3af",
              }}
            >
              <span>
                Current console name:{" "}
                <strong>
                  {displayName ? displayName : "not set (UNKNOWN AGENT)"}
                </strong>
              </span>
              <span>
                Profile image:{" "}
                <strong>{photoUrl ? "set" : "not set (initials only)"}</strong>
              </span>
            </div>
          </>
        )}

        {editingIdentity && (
          <>
            <p
              style={{
                margin: "0 0 10px",
                color: "#d1d5db",
                lineHeight: 1.7,
              }}
            >
              This name and image are used only inside the shadow console. Leave
              either field empty to clear it.
            </p>
            <form
              onSubmit={handleSaveIdentity}
              style={{
                marginTop: 6,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <label
                style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                }}
              >
                Console Name
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="How this console calls you"
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 999,
                    border: "1px solid #1f2937",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                    fontSize: 12,
                  }}
                />
              </label>

              <label
                style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                  marginTop: 6,
                }}
              >
                Profile Image URL
                <input
                  type="text"
                  value={inputPhotoUrl}
                  onChange={(e) => setInputPhotoUrl(e.target.value)}
                  placeholder="https://example.com/your-image.jpg"
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 999,
                    border: "1px solid #1f2937",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                    fontSize: 12,
                  }}
                />
              </label>

              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setEditingIdentity(false);
                    setInputName(displayName);
                    setInputPhotoUrl(photoUrl || "");
                  }}
                  style={{
                    borderRadius: 999,
                    border: "1px solid #1f2937",
                    padding: "6px 14px",
                    background: "transparent",
                    color: "#9ca3af",
                    fontSize: 11,
                    letterSpacing: "0.14em",
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
                    padding: "6px 18px",
                    background:
                      "linear-gradient(to right, #facc15, #eab308, #facc15)",
                    color: "#111827",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Save Identity
                </button>
              </div>
            </form>
          </>
        )}

        {statusMessage && (
          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
            }}
          >
            {statusMessage}
          </div>
        )}
      </div>

      {/* 下の注意文（もともとのやつ） */}
      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: "1px dashed #111827",
          fontSize: 10,
          color: "#6b7280",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>
          Note: members are not informed of their exact tier. All actors are
          treated as equal on the surface.
        </span>
        <span
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          Visibility: Need-to-Know Only
        </span>
      </div>
    </div>
  );
}
