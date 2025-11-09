import Link from "next/link";

const mock = [
  { id: "tshirt", name: "ERA T‑Shirt", price: 6500 },
  { id: "hoodie", name: "ERA Hoodie", price: 14800 },
  { id: "sweatpants", name: "ERA Wide Sweatpants", price: 13800 },
  { id: "cap", name: "ERA Cap", price: 5200 },
] as const;

export default function ProductsPage() {
  return (
    <section style={{padding:'24px 0 40px'}}>
      <h2 style={{letterSpacing:'.1em'}}>PRODUCTS</h2>
      <div className="grid" style={{marginTop:16}}>
        {mock.map(p => (
          <div className="card" key={p.id}>
            <div style={{aspectRatio:'1/1', background:'rgba(255,255,255,.06)', marginBottom:12}} />
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontWeight:500}}>{p.name}</div>
                <div className="muted">¥{p.price.toLocaleString()}</div>
              </div>
              <Link className="btn" href={`/products/${p.id}`}>View</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
