// app/page.tsx
import React from "react";

const popularItems = [
  { name: "ERA Tee", tag: "CORE / JERSEY", status: "INCOMING" },
  { name: "ERA Hoodie", tag: "CORE / FLEECE", status: "INCOMING" },
  { name: "Wide Sweatpant", tag: "CORE / RELAXED", status: "INCOMING" },
];

export default function HomePage() {
  return (
    <div
      className="era-hero-root"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 24px 72px",
      }}
    >
      {/* ===== HERO ===== */}
      <section
        style={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "40px",
          marginBottom: "64px",
        }}
      >
        {/* ロゴカード（三本ライン） */}
        <div
          className="era-hero-logo"
          style={{
            height: "240px",
            width: "240px",
            borderRadius: "28px",
            border: "1px solid rgba(245, 158, 11, 0.8)",
            background:
              "radial-gradient(circle at top, #020617 0, #020617 20%, #000000 70%)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="era-logo-mark">
            <div className="era-logo-line" />
            <div className="era-logo-line" />
            <div className="era-logo-line" />
          </div>
        </div>

        {/* タイトル + タグライン */}
        <div className="era-hero-text">
          <h1
            style={{
              fontSize: "32px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              margin: "0 0 8px",
              color: "#f9fafb",
            }}
          >
            ERA
          </h1>

          <p
            className="era-hero-tagline"
            style={{
              fontSize: "12px",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "#facc15",
              margin: "0 0 4px",
            }}
          >
            Minimal Luxury
          </p>
        </div>

        {/* ボタン */}
        <div
          className="era-hero-buttons"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <a
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "999px",
              border: "1px solid #fbbf24",
              padding: "10px 32px",
              fontSize: "12px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#fbbf24",
              background:
                "radial-gradient(circle at top, rgba(250,204,21,0.18), transparent 60%)",
            }}
          >
            Shop now
          </a>

          <a
            href="/about"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "999px",
              border: "1px solid #4b5563",
              padding: "10px 32px",
              fontSize: "12px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#d1d5db",
              background:
                "radial-gradient(circle at top, rgba(148,163,184,0.18), transparent 60%)",
            }}
          >
            About ERA
          </a>
        </div>
      </section>

      {/* ===== 人気商品 ===== */}
      <section
        style={{
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#9ca3af",
              marginBottom: "4px",
            }}
          >
            Popular
          </p>
          <h2
            style={{
              fontSize: "16px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              margin: 0,
              color: "#f9fafb",
            }}
          >
            Selected Items
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {popularItems.map((item) => (
            <a
              key={item.name}
              href="/products"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: "16px",
                border: "1px solid #1f2937",
                background:
                  "linear-gradient(to right, rgba(15,23,42,0.9), rgba(15,23,42,0.98))",
                textDecoration: "none",
                color: "#e5e7eb",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    margin: "0 0 2px",
                  }}
                >
                  {item.name}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    margin: 0,
                  }}
                >
                  {item.tag}
                </p>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#facc15",
                }}
              >
                {item.status}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
