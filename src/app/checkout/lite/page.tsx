// ─────────────────────────────────────────────────────────────────────
// /checkout/lite — focused Lite-tier checkout.
//
// Standalone path because the main /checkout flow is Starter-shaped
// (glucose selection, hardware add-ons, optional coach) and Lite is
// digital-only (eBook + 7-day AI trial, no device). Conditionally
// hiding half the Starter UI was messier than a tight dedicated page.
//
// Backend: posts to /api/kit-checkout with `{ plan: 'lite' }` so the
// server side can pick the KIT_LITE Stripe price ID. The merchant
// needs to wire the route handler to read `plan` and route to the
// right Stripe Checkout Session — this page declares its intent;
// the server enforces it.
// ─────────────────────────────────────────────────────────────────────
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Lock, Shield } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { KIT_LITE, formatGBP } from '@/lib/kitProducts';
import { Navbar, Footer } from '@/components/MarketingLandingPage';

const FEATURES = [
  'The Thin Book of Fat (digital)',
  '7-day Meo AI trial — full plain-English interpretation',
  'Manual entry of past blood results',
  'Credit £29 toward Starter within 30 days',
] as const;

export default function LiteCheckoutPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = () => {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch('/api/kit-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'lite' }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Checkout failed (${res.status})`);
        }
        const { url } = await res.json();
        if (!url) throw new Error('No redirect URL returned');
        window.location.href = url;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
      }
    });
  };

  return (
    <main className="min-h-screen flex flex-col" style={{ background: C.bg, color: C.fg }}>
      <Navbar />
      <div className="px-5 sm:px-6 pt-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm hover:underline"
          style={{ color: C.muted }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Meo
        </Link>
      </div>

      <section className="flex-1 px-5 sm:px-6 pt-12 sm:pt-16 pb-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Meo Lite
          </p>
          <h1
            className="font-extrabold mb-3 leading-tight"
            style={{
              color: C.fg,
              fontFamily: FONT_SERIF,
              fontSize: 'clamp(32px, 5vw, 48px)',
              textWrap: 'balance',
            }}
          >
            Start with the <span style={{ color: C.primary }}>book</span>.
          </h1>
          <p className="text-base sm:text-lg max-w-xl mb-10" style={{ color: C.muted }}>
            eBook + 7-day Meo AI trial. No device. If you upgrade to the full Starter system within 30 days, we credit the £29 against it.
          </p>

          {/* Order summary card */}
          <div
            className="rounded-2xl p-7 mb-6"
            style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
          >
            <div className="flex items-baseline justify-between mb-5 pb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: C.fg }}>Meo Lite</p>
                <p className="text-xs" style={{ color: C.muted }}>One-time purchase · digital delivery</p>
              </div>
              <p className="font-extrabold tabular-nums" style={{ color: C.fg, fontSize: 28 }}>
                {formatGBP(KIT_LITE.price)}
              </p>
            </div>
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: C.fg }}>
                  <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pay */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl font-semibold px-8 py-4 text-base transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            <Lock className="h-4 w-4" />
            {isPending ? 'Redirecting…' : `Pay ${formatGBP(KIT_LITE.price)}`}
            {!isPending && <ArrowRight className="h-4 w-4" />}
          </button>
          {error && (
            <p className="mt-3 text-sm" style={{ color: '#f87171' }}>
              {error}
            </p>
          )}
          <p className="text-xs mt-4 text-center" style={{ color: C.muted }}>
            Secured by Stripe · Email and address collected on the next step.
          </p>

          {/* Reassurance */}
          <div
            className="mt-10 rounded-2xl p-5 sm:p-6 flex items-start gap-4"
            style={{
              background: `linear-gradient(140deg, ${C.bgCard}, rgba(164,214,94,0.10))`,
              border: `1px solid ${C.primary}`,
            }}
          >
            <Shield className="h-5 w-5 shrink-0 mt-0.5" style={{ color: C.primary }} aria-hidden />
            <div>
              <p className="font-semibold mb-1" style={{ color: C.fg }}>
                Want the full system instead?
              </p>
              <p className="text-sm mb-3" style={{ color: C.muted }}>
                Meo Starter (£149) ships with the lipid meter + 6 months of Meo AI + everything you need to read your own metabolism. Or upgrade later — your £29 Lite payment counts toward it.
              </p>
              <Link
                href="/checkout"
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                style={{ color: C.primary }}
              >
                Switch to Meo Starter <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
