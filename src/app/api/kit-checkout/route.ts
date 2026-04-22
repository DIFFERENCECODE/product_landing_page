import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { KIT_PRODUCT } from '@/lib/kitProducts';

interface AddonItem {
  priceId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const addons: AddonItem[] = Array.isArray(body.addons) ? body.addons : [];

    // Validate addon quantities (0-9 each, per the UI constraint)
    for (const item of addons) {
      if (
        !item.priceId ||
        typeof item.quantity !== 'number' ||
        item.quantity < 0 ||
        item.quantity > 9
      ) {
        return NextResponse.json(
          { error: 'Invalid addon item' },
          { status: 400 },
        );
      }
    }

    const origin =
      req.headers.get('origin') || 'https://app.meterbolic.com';

    // Base kit is always included (quantity 1)
    const lineItems: { price: string; quantity: number }[] = [
      { price: KIT_PRODUCT.priceId, quantity: 1 },
    ];

    // Append add-ons that have quantity > 0
    for (const item of addons) {
      if (item.quantity > 0) {
        lineItems.push({ price: item.priceId, quantity: item.quantity });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      // Collect shipping address via Stripe
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU', 'IE', 'NL', 'DE', 'FR', 'ES', 'IT'],
      },
      // Allow Stripe to collect email
      billing_address_collection: 'auto',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        product: 'metabolic_health_kit',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('[kit-checkout] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
    return NextResponse.json({
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email ?? null,
      customerName: session.customer_details?.name ?? null,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? 'gbp',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
