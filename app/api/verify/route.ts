import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ paid: false, error: 'Invalid session ID' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';
    return NextResponse.json({ paid });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Verification failed';
    return NextResponse.json({ paid: false, error: message }, { status: 500 });
  }
}
