# BuildQuote — Contractor Estimate Generator

Professional estimates for contractors, in minutes. Fill in your details, add line items, and download a clean PDF.

**Live at**: buildquote.app *(configure your own domain)*

---

## What It Does

1. Contractor fills out a form (their info, client info, project, line items)
2. Sees a live preview with auto-calculated subtotal, tax, and total
3. Downloads a watermarked PDF (free) or a clean PDF ($4.99 via Stripe)

No login. No database. No account required.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| PDF generation | jsPDF (client-side) |
| Payments | Stripe Checkout |
| Deployment | Vercel |

---

## Local Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd buildquote

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Stripe keys

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (sk_test_... or sk_live_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `NEXT_PUBLIC_BASE_URL` | Yes | Your site URL, no trailing slash |
| `STRIPE_PRICE_AMOUNT` | No | Price in cents (default: 499 = $4.99) |

Get Stripe keys from [dashboard.stripe.com](https://dashboard.stripe.com/apikeys).

---

## Deployment (Vercel)

1. Push the repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from the table above
4. Deploy — done

No build configuration needed. Vercel auto-detects Next.js.

---

## How Payment Works

1. User fills form → estimate saved to `localStorage`
2. User clicks "Download Clean PDF ($4.99)" on the preview page
3. Browser calls `POST /api/checkout` → gets a Stripe Checkout URL
4. User pays on Stripe's hosted page
5. Stripe redirects to `/success?session_id=cs_xxx`
6. Page calls `GET /api/verify?session_id=cs_xxx` to confirm payment
7. If confirmed, user clicks "Download PDF" → jsPDF generates clean PDF in browser

No webhook required for the MVP.

---

## Project Structure

```
app/
  page.tsx              Landing page
  pricing/page.tsx      Pricing page
  builder/page.tsx      Estimate builder form
  preview/page.tsx      Estimate preview + pay CTA
  success/page.tsx      Post-payment download page
  api/
    checkout/route.ts   Creates Stripe Checkout session
    verify/route.ts     Verifies Stripe payment

components/
  NavBar.tsx            Top navigation
  EstimateForm.tsx      Estimate input form (all fields)
  EstimatePreview.tsx   Visual preview component
  PricingCard.tsx       Pricing card UI

lib/
  pdf.ts                PDF generation logic (jsPDF)
  stripe.ts             Stripe server helpers

types/
  estimate.ts           TypeScript types + utility functions

docs/
  product-brief.md      Product research and rationale
  build-notes.md        Architecture decisions
  database-notes.md     Schema (and why there isn't one)
  monetization-notes.md Revenue model and growth
  backlog.md            Features deliberately not built
  buyer-handoff.md      For future owner/acquirer
```

---

## Customization

**Change the price**: Update `STRIPE_PRICE_AMOUNT` in your `.env.local` (value is in cents).

**Change the PDF layout**: Edit `lib/pdf.ts`. The PDF is built with [jsPDF](https://artskydj.github.io/jsPDF/docs/).

**Change colors**: The brand color is `blue-700` throughout. Find/replace `blue-700` in components.

**Add analytics**: Uncomment the analytics script in `app/layout.tsx` and add your tracking ID.

---

## Docs

See the `/docs` folder for:
- `product-brief.md` — research, scoring, and why this idea was chosen
- `build-notes.md` — architecture decisions
- `database-notes.md` — data model and future DB recommendations
- `monetization-notes.md` — pricing strategy and revenue projections
- `backlog.md` — features deferred from MVP
- `buyer-handoff.md` — everything a new owner needs to know

---

## License

MIT
