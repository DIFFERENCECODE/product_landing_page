import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { KIT_PRODUCT, KIT_ADDONS, KIT_LITE } from '@/lib/kitProducts';

interface AddonItem {
  priceId: string;
  quantity: number;
}

type Plan = 'lite' | 'starter' | 'coached';

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
    const plan: Plan =
      body.plan === 'lite' ? 'lite' : body.plan === 'coached' ? 'coached' : 'starter';
    const addons: AddonItem[] = Array.isArray(body.addons) ? body.addons : [];

    // Collect any UTM params forwarded from the frontend
    const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
    const utmMeta: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const val = body[key];
      if (typeof val === 'string' && val.trim()) {
        utmMeta[key] = val.trim().slice(0, 500);
      }
    }

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
      req.headers.get('origin') || 'https://meterbolic.com';

    // Base SKU depends on plan:
    //   lite     → eBook + 7-day AI trial (£29, digital, no shipping)
    //   starter  → full Meo Starter bundle (£149, physical)
    //   coached  → starter base + coaching addon; the UI auto-locks the
    //              Spencer addon priceId into body.addons for this plan
    const baseSku = plan === 'lite' ? KIT_LITE : KIT_PRODUCT;
    const lineItems: { price: string; quantity: number }[] = [
      { price: baseSku.priceId, quantity: 1 },
    ];

    for (const item of addons) {
      if (item.quantity > 0) {
        lineItems.push({ price: item.priceId, quantity: item.quantity });
      }
    }

    const hasRecurring = lineItems.some((li) =>
      RECURRING_PRICE_IDS.has(li.price),
    );
    const mode: 'payment' | 'subscription' = hasRecurring
      ? 'subscription'
      : 'payment';

    // Lite is digital — skip shipping address + shipping fee entirely.
    const shippingConfig = plan === 'lite'
      ? {}
      : {
          shipping_address_collection: {
            allowed_countries: ['GB', 'US', 'CA', 'AU', 'IE', 'NL', 'DE', 'FR', 'ES', 'IT'] as Array<'GB'|'US'|'CA'|'AU'|'IE'|'NL'|'DE'|'FR'|'ES'|'IT'>,
          },
          shipping_options: [
            {
              shipping_rate_data: {
                type: 'fixed_amount' as const,
                fixed_amount: { amount: 999, currency: 'gbp' },
                display_name: 'Standard Shipping',
                delivery_estimate: {
                  minimum: { unit: 'business_day' as const, value: 2 },
                  maximum: { unit: 'business_day' as const, value: 5 },
                },
              },
            },
          ],
        };

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      ...shippingConfig,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout${plan === 'starter' ? '' : `?plan=${plan}`}`,
      metadata: {
        product: 'meo_system',
        plan,
        mode_used: mode,
        ...utmMeta,
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
