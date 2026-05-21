import Stripe from 'stripe';

// Server-side Stripe instance (used in API routes only)
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key, { apiVersion: '2026-04-22.dahlia' });
}

export function getPriceAmount(): number {
  return Number(process.env.STRIPE_PRICE_AMOUNT ?? '499');
}
