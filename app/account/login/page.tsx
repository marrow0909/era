export default function LoginPage() {
  return (
    <section style={{padding:'24px 0 40px', maxWidth:420}}>
      <h2 style={{letterSpacing:'.1em'}}>LOGIN</h2>
      <form style={{display:'grid', gap:12, marginTop:12}}>
        <input placeholder="Email" type="email" required style={{padding:10, background:'#111', border:'1px solid rgba(255,255,255,.12)', color:'#fff'}} />
        <input placeholder="Password" type="password" required style={{padding:10, background:'#111', border:'1px solid rgba(255,255,255,.12)', color:'#fff'}} />
        <button className="btn" type="submit">Sign in</button>
      </form>
      <p className="muted" style={{marginTop:12}}>Auth will be added later (Auth.js/Clerk).</p>
    </section>
  );
}
