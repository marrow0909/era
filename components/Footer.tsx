export default function Footer() {
  return (
    <footer>
      <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{opacity:.7}}>© {new Date().getFullYear()} ERA</div>
        <div style={{opacity:.7}}>Minimal Luxury</div>
      </div>
    </footer>
  );
}
