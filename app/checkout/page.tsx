export default function CheckoutPage() {
  return (
    <section style={{padding:'24px 0 40px'}}>
      <h2 style={{letterSpacing:'.1em'}}>CHECKOUT</h2>
      <p className="muted">
        Stripe will be integrated here. After you create a Stripe account, we'll set the secret keys in Vercel
        environment variables and redirect to Stripe Checkout.
      </p>
    </section>
  );
}
