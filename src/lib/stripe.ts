import Stripe from 'stripe';

// Lazy proxy: only instantiate (and only require STRIPE_SECRET_KEY) when a
// Stripe method is actually invoked, not at module load. Next.js evaluates
// every route module during `next build` to collect page data, so a
// top-level throw breaks the production build on any host that hasn't yet
// added the Stripe secret to .env.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  _stripe = new Stripe(key);
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    const client = getStripe() as unknown as Record<string | symbol, unknown>;
    const value = client[prop as string];
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
}) as Stripe;
