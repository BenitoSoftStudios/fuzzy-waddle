import { NextRequest, NextResponse } from 'next/server';
import { getStripe, getPriceAmount } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const amount = getPriceAmount();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amount,
            product_data: {
              name: 'Contractor Estimate PDF (Clean)',
              description: 'Professional, watermark-free PDF download',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/preview`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
