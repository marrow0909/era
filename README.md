# ERA — Official Site (Starter)

Minimal & luxury starter for the ERA brand.
Tech: Next.js (App Router).

## Local Development
```bash
npm install
npm run dev
# http://localhost:3000
```

## Deploy to Vercel
1. Create a new GitHub repo and push this project.
2. Import the repo in Vercel (New Project → import).
3. Set the project name e.g. `era-official-lll`.
4. Deploy.

## Connect Custom Domain (era-official-lll.com)
After the first deploy:
- In Vercel → Project → Settings → Domains → Add `era-official-lll.com`
- At your domain registrar, set:
  - Apex (root) A record → 76.76.21.21
  - `www` CNAME → cname.vercel-dns.com

> Then you can choose to redirect `www` → apex in Vercel.

## Stripe (later)
- Create a Stripe account
- In Vercel → Settings → Environment Variables set:
  - `STRIPE_SECRET_KEY=...`
  - `STRIPE_PUBLISHABLE_KEY=...`
- Implement Stripe Checkout in `/app/checkout`

## Notes
- Replace placeholder product data in `/app/products/page.tsx` and `/app/products/[id]/page.tsx`
- Replace `/public/logo.jpg` with your preferred logo file.
