# Build Notes

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF (client-side, no server needed for PDF)
- **Payments**: Stripe Checkout (hosted checkout page)
- **Deployment**: Vercel (zero config with Next.js)
- **Database**: None required for MVP

## Architecture Decisions

### Why no database?
The MVP doesn't need saved estimates. The user fills the form, previews, pays, downloads. All data lives in the browser session (React state + localStorage). This eliminates infrastructure cost, auth complexity, and maintenance burden.

### Why client-side PDF?
jsPDF runs in the browser. No server process needed to generate PDFs. This keeps infrastructure costs at $0 and eliminates a potential failure point.

### Payment flow
1. User fills estimate → data saved to `localStorage` under `estimly_estimate`
2. User clicks "Download Clean PDF ($4.99)"
3. Browser POSTs to `/api/checkout` → returns Stripe Checkout URL
4. User pays on Stripe's hosted page
5. Stripe redirects to `/success?session_id=cs_xxx`
6. Success page calls `/api/verify?session_id=cs_xxx` to confirm payment
7. If confirmed, page renders "Generate PDF" button
8. User clicks → jsPDF generates clean PDF from localStorage data → downloads

### Why Stripe Checkout (not Elements)?
Hosted checkout handles PCI compliance, card UI, and international payments. No extra code to maintain. Users trust Stripe's payment page.

## Key Files

```
app/page.tsx              — Landing page
app/pricing/page.tsx      — Pricing page
app/builder/page.tsx      — Estimate builder form
app/preview/page.tsx      — Estimate preview + pay CTA
app/success/page.tsx      — Post-payment download page
app/api/checkout/route.ts — Creates Stripe Checkout session
app/api/verify/route.ts   — Verifies Stripe payment
components/EstimateForm.tsx    — The estimate input form
components/EstimatePreview.tsx — Visual preview of the estimate
components/NavBar.tsx          — Top navigation
lib/pdf.ts                — PDF generation logic (jsPDF)
lib/stripe.ts             — Stripe client helpers
types/estimate.ts         — TypeScript types
```

## Environment Variables

See `.env.example` for required variables.

## Running Locally

```bash
npm install
cp .env.example .env.local
# Fill in Stripe keys
npm run dev
```

## Deployment

Deploy to Vercel:
1. Connect GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

No additional configuration needed.

## Stripe Setup

1. Create a Stripe account
2. Get test/live keys from dashboard
3. Create a product + price in Stripe dashboard (or let the checkout session handle it dynamically)
4. Add webhook for `checkout.session.completed` (optional for MVP — verification uses session lookup)
