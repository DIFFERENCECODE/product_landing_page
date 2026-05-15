import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { KIT_PRODUCT, KIT_ADDONS } from '@/lib/kitProducts';

interface AddonItem {
  priceId: string;
  quantity: number;
}

// Build a lookup of recurring price IDs from the addon catalog so the
// handler can decide whether to use Stripe's `payment` or `subscription`
// mode. Stripe rejects a recurring price under `mode: payment` — that
// was the live error before this fix.
const RECURRING_PRICE_IDS = new Set<string>(
  KIT_ADDONS.filter((a) => a.recurring).map((a) => a.priceId),
);

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
      req.headers.get('origin') || 'https://shop.meterbolic.com';

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

    // If any selected price is recurring, the whole session must run as
    // a subscription. Stripe's `subscription` mode happily accepts a mix
    // of recurring and one-time prices in the same session — the
    // one-times become the first invoice's add-ons. Pure one-time
    // baskets stay in `payment` mode so we don't accidentally create a
    // subscription with a £0 recurring component.
    const hasRecurring = lineItems.some((li) =>
      RECURRING_PRICE_IDS.has(li.price),
    );
    const mode: 'payment' | 'subscription' = hasRecurring
      ? 'subscription'
      : 'payment';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU', 'IE', 'NL', 'DE', 'FR', 'ES', 'IT'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 999, currency: 'gbp' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      billing_address_collection: 'auto',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        product: 'meo_starter_system',
        mode_used: mode,
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
