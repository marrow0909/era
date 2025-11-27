export default function BriefingsPage() {
  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px solid #1f2937",
        background:
          "linear-gradient(to bottom right, rgba(15,23,42,0.98), rgba(2,6,23,0.98))",
        padding: "20px 22px 24px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.9)",
        fontSize: 13,
      }}
    >
      <h2
        style={{
          fontSize: 16,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          margin: "0 0 12px",
        }}
      >
        Briefings
      </h2>
      <p style={{ color: "#9ca3af", margin: 0 }}>
        Shared notices and operations visible to all members in this layer.
        Content will be added here later.
      </p>
    </div>
  );
}
