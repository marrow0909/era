// app/about/page.tsx
import React from "react";

export default function AboutPage() {
  return (
    <div
      style={{
        flex: 1,
        padding: "56px 32px 72px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#9ca3af",
            marginBottom: "6px",
          }}
        >
          About ERA
        </p>
        <h1
          style={{
            fontSize: "26px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            margin: "0 0 20px",
          }}
        >
          Minimal Luxury
        </h1>

        <p
          style={{
            fontSize: "13px",
            color: "#d1d5db",
            lineHeight: 1.7,
            marginBottom: "16px",
          }}
        >
          ERA is a minimal luxury line built on black, gold, and controlled
          silhouettes. The intention is not to be loud, but to feel inevitable –
          the piece you reach for without thinking.
        </p>

        <p
          style={{
            fontSize: "13px",
            color: "#9ca3af",
            lineHeight: 1.7,
            marginBottom: "20px",
          }}
        >
          From core jersey tees and fleece hoodies to structured outerwear,
          every item is designed to live in the same universe: clean,
          understated, and quietly sharp. No seasonal logos, no unnecessary
          noise – just consistent language across fabric, cut, and hardware.
        </p>

        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#9ca3af",
              marginBottom: "8px",
            }}
          >
            Design Principles
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: "13px",
              color: "#d1d5db",
              lineHeight: 1.7,
            }}
          >
            <li>• Black as the base, gold as the accent.</li>
            <li>• Silhouettes kept clean, slightly relaxed, never sloppy.</li>
            <li>• Details hidden until you are close enough to notice.</li>
            <li>• Pieces built to connect – not compete – with each other.</li>
          </ul>
        </div>

        <div>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#9ca3af",
              marginBottom: "8px",
            }}
          >
            Behind the Surface
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#9ca3af",
              lineHeight: 1.7,
            }}
          >
            ERA is also a layer. The public face is the collection you see here.
            Beyond that, there are quieter structures, private spaces, and
            circles that do not need to be spoken about. If you&apos;re meant to
            step into those, you will know.
          </p>
        </div>
      </div>
    </div>
  );
}
