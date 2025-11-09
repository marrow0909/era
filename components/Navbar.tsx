import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="container">
      <nav className="nav">
        <Link href="/" style={{display:'flex', alignItems:'center', gap:12}}>
          <Image src="/logo.jpg" alt="ERA" width={36} height={36} style={{borderRadius:2}} />
          <span style={{letterSpacing:'.2em'}}>ERA</span>
        </Link>
        <div style={{flex:1}} />
        <Link href="/products">Products</Link>
        <Link href="/about">About</Link>
        <Link href="/account/login">Account</Link>
        <Link href="/cart">Cart</Link>
      </nav>
    </header>
  );
}
