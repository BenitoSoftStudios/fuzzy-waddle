# Monetization Notes

## Current Model: Pay-Per-Download

**Price**: $4.99 per clean PDF download  
**Free tier**: Watermarked PDF (promotes the brand, shows value)  
**Payment**: Stripe Checkout (hosted)

### Why pay-per-download?
- Zero friction to start — no signup, no subscription commitment
- User sees value (preview) before paying
- $4.99 is low enough to be an impulse buy for a contractor billing $500–$5,000 per job
- No churn to manage

### Conversion logic
- Free watermarked PDF drives SEO (PDFs get shared, watermark links back to site)
- Preview-first → pay-to-download creates a natural "try before you buy" moment
- Target 3–8% of previewers to convert

## Revenue Projections

| Monthly visitors | Preview rate | Pay rate | Revenue |
|-----------------|-------------|---------|---------|
| 1,000 | 40% | 5% | $100 |
| 5,000 | 40% | 5% | $500 |
| 10,000 | 40% | 5% | $1,000 |
| 25,000 | 40% | 5% | $2,500 |

At 10K monthly visitors (achievable via SEO + Reddit), this generates ~$1K/month with near-zero operating costs.

## Upgrade Path (not built yet, in backlog)

### Monthly Subscription ($9/month)
- Unlimited clean PDF downloads
- Good for contractors who send 5+ estimates/week
- Stripe subscription billing, requires auth (Supabase)

### Pack pricing ($14.99 for 5 downloads)
- Middle tier for occasional users
- Implement via Stripe credits or pre-purchased tokens in localStorage

### Custom branding tier ($19/month)
- Upload logo, set brand colors
- Saved contractor profile

## Acquisition Strategy

### SEO (primary)
- Target: "contractor estimate template", "free estimate PDF", "roofing estimate template", "plumbing estimate generator"
- Create separate landing pages per trade (roofing, electrical, plumbing) — same tool, trade-specific copy
- The watermarked free PDFs act as link bait

### Communities
- r/Contractors, r/selfemployed, r/smallbusiness
- Facebook Groups: "Contractor Tips and Tricks", trade-specific groups
- Post "I made a free contractor estimate generator" — genuine utility gets traction

### Directories
- Submit to tool directories: Product Hunt, Indie Hackers, AlternativeTo
- "Free tools" roundup posts get picked up by blogs

### Content
- "How to write a professional contractor estimate" blog post
- "Free contractor estimate template (PDF)" downloadable — drives organic traffic

## Stripe Configuration

```env
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_PRICE_AMOUNT=499   # in cents
```

Change `STRIPE_PRICE_AMOUNT` to adjust pricing without code changes.

## Tax Notes

Stripe handles tax collection if you enable Stripe Tax. For a digital product sold globally, this is recommended once revenue exceeds ~$10K/year.

## Valuation Notes (for future sale)

A simple SaaS/tool with $1K/month revenue typically sells for 24–36x monthly revenue on Acquire.com or MicroAcquire. At $1K/month, that's a $24K–$36K exit.

The no-database, no-auth architecture makes due diligence fast and transfer easy — a major advantage for buyers.
