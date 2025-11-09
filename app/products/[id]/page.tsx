import Link from "next/link";

const db: Record<string, { name: string; price: number; description: string }> = {
  tshirt: { name: "ERA T‑Shirt", price: 6500, description: "Minimal embroidered logo. Premium cotton." },
  hoodie: { name: "ERA Hoodie", price: 14800, description: "Oversized silhouette with embroidered chest logo." },
  sweatpants: { name: "ERA Wide Sweatpants", price: 13800, description: "Wide fit. Structured fleece. Embroidery." },
  cap: { name: "ERA Cap", price: 5200, description: "Curved brim. E symbol front, ERA on side." },
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  const p = db[params.id];
  if (!p) return <div>Not found.</div>;
  return (
    <section style={{padding:'24px 0 40px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
      <div style={{aspectRatio:'1/1', background:'rgba(255,255,255,.06)'}} />
      <div>
        <h1 style={{marginTop:0}}>{p.name}</h1>
        <div className="gold" style={{marginBottom:12}}>¥{p.price.toLocaleString()}</div>
        <p className="muted">{p.description}</p>
        <form action="/cart" method="get" style={{marginTop:18}}>
          <button className="btn" type="submit">Add to cart</button>
        </form>
        <div style={{marginTop:18}}>
          <Link href="/products" className="muted">← Back to products</Link>
        </div>
      </div>
    </section>
  );
}
