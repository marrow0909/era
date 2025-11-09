import Link from "next/link";

export default function CartPage() {
  return (
    <section style={{padding:'24px 0 40px'}}>
      <h2 style={{letterSpacing:'.1em'}}>CART</h2>
      <p className="muted">Cart functionality will be connected with Stripe Checkout later.</p>
      <div style={{marginTop:16}}>
        <Link className="btn" href="/checkout">Proceed to checkout</Link>
      </div>
    </section>
  );
}
