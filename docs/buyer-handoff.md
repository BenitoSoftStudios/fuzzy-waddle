# Buyer Handoff Notes

Welcome. This document explains everything you need to own and operate QuoteKit.

## What You're Buying

A contractor estimate PDF generator. Users fill out a form, see a preview, and pay $4.99 to download a clean PDF. Free users get a watermarked version.

- No employees required
- No customer support beyond a simple contact email
- No database to manage
- No server infrastructure beyond Vercel (free tier works)
- Monthly cost at low scale: ~$0 (Vercel free + Stripe fees only)

## Revenue

- **Source**: Stripe payments, $4.99 per clean PDF download
- **Stripe dashboard**: All revenue, payouts, and disputes are managed at dashboard.stripe.com
- **Payout**: Stripe pays out to your bank account on a rolling 2-day basis

## Tech Stack

| Layer | Tool | Cost |
|-------|------|------|
| Frontend + Backend | Next.js on Vercel | Free tier |
| PDF generation | jsPDF (client-side) | Free (library) |
| Payments | Stripe | 2.9% + $0.30 per transaction |
| Domain | Your choice | ~$12/year |
| Analytics | Plausible or Fathom | ~$9/month optional |

## Setup Steps After Transfer

1. **Stripe**: Create a new Stripe account (or transfer the existing one). Update `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in Vercel.
2. **Vercel**: Transfer the Vercel project or redeploy from the GitHub repo.
3. **Domain**: Point your domain to Vercel. Update `NEXT_PUBLIC_BASE_URL` in Vercel env vars.
4. **Analytics**: Add your Plausible/Fathom/Google Analytics snippet (see analytics section in build notes).

## Environment Variables (Required)

```
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
STRIPE_PRICE_AMOUNT=499
```

## Codebase Overview

The codebase is intentionally small. A developer can understand it in 30 minutes.

```
app/              — All pages (Next.js App Router)
components/       — Reusable UI components
lib/              — Business logic (PDF generation, Stripe)
types/            — TypeScript types
docs/             — This folder
```

Key files:
- `lib/pdf.ts` — All PDF generation logic. Change the PDF layout here.
- `app/api/checkout/route.ts` — Creates Stripe session. Change price here.
- `app/api/verify/route.ts` — Verifies payment. 

## Common Maintenance Tasks

**Change the price**: Update `STRIPE_PRICE_AMOUNT` env var (in cents). No code change needed.

**Change PDF layout**: Edit `lib/pdf.ts`. The PDF is generated with jsPDF — see jspdf.com for docs.

**Add a trade-specific landing page**: Copy `app/page.tsx`, update the copy, add the route.

**Add Google Analytics**: Add the GA script tag to `app/layout.tsx`.

## Support

The app is simple enough that support emails will be rare. Expected issues:
- "I paid but can't download" — Stripe session verification issue. Check the Stripe dashboard for the payment and manually verify.
- "The PDF looks wrong" — Usually a font or browser compatibility issue. jsPDF works in all modern browsers.

## Growth Opportunities

1. Trade-specific SEO pages (roofing, plumbing, electrical estimate generators)
2. Add $9/month subscription tier for unlimited downloads
3. Add logo upload to the estimate form
4. Submit to AlternativeTo, Product Hunt, G2

## What It Is NOT

- Not a CRM
- Not an invoicing platform
- Not an accounting tool

Scope creep is the enemy of a simple, sellable product. Keep it focused.

## Contact

Original developer: available for questions during handoff period. Reach out through the transaction platform.
