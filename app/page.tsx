import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="hero">
      <div>
        <div style={{display:'grid', placeItems:'center', marginBottom:24}}>
          <Image src="/logo.jpg" alt="ERA" width={160} height={160} priority style={{borderRadius:4}} />
        </div>
        <h1 style={{letterSpacing:'.18em', fontWeight:500, margin:0}}>ERA</h1>
        <p className="gold" style={{marginTop:8, letterSpacing:'.08em'}}>MINIMAL&nbsp;&nbsp;LUXURY</p>
        <div style={{marginTop:24}}>
          <Link className="btn" href="/products">Shop Now</Link>
        </div>
      </div>
    </section>
  );
}
// ページテスト
