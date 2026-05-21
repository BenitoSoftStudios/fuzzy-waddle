# Backlog

Features deliberately deferred from the MVP. Build these only after the MVP is generating revenue.

## Tier 1 — High value, moderate effort

- **Saved estimates** (requires Supabase + auth): Let users save and re-edit estimates. Build when users ask for it.
- **Monthly subscription** ($9/month unlimited): Add Stripe subscription billing once pay-per-download is validated.
- **Estimate history**: Dashboard showing past estimates. Requires auth first.
- **Logo upload**: Contractor uploads their logo, appears on the PDF estimate.
- **Trade-specific landing pages**: Separate /roofing, /plumbing, /electrical pages with trade-specific copy and sample line items.

## Tier 2 — Moderate value, moderate effort

- **Email delivery**: Send the PDF to client's email directly (requires an email provider like Resend or SendGrid).
- **Estimate acceptance**: Share a link, client views and accepts/declines online.
- **Pre-built line item templates**: "Common roofing items", "Common plumbing items" — one-click to populate line items.
- **Custom terms templates**: Save and reuse standard terms and conditions.
- **Multiple currencies**: Support GBP, EUR, CAD, AUD (just a formatting change, but needs testing).

## Tier 3 — Nice to have, lower priority

- **Custom domain PDF header**: White-label the PDF footer.
- **Estimate notes per line item**: Expandable notes on each line.
- **Photo attachments**: Add job site photos to the PDF.
- **Client CRM**: Store client contact info for reuse. (Slippery slope toward full CRM — avoid.)
- **Integrations**: QuickBooks sync, Google Drive export.
- **Mobile app**: Native iOS/Android app. Not needed while web app is mobile-friendly.

## Deliberately Not Building

These were considered and rejected:

- **Team/multi-user accounts**: Adds auth complexity, permission layers, billing per seat. Most contractors are solo or small teams who don't share accounts.
- **Invoice generation**: Different product, different audience intent. A separate tool.
- **Payment acceptance**: Let the contractor collect their own payment — scope creep.
- **AI line item suggestions**: Adds AI dependency and cost. Not the value prop.
- **Contractor marketplace**: Fundamentally different product requiring network effects.
