// ─────────────────────────────────────────────────────────────────────
// /pricing — Top-level marketing pricing page. Replaces the previous
// (meo)/pricing route which was wrapped in the chatbot AppShell. This
// version uses the same Navbar/Footer chrome as /about, /services, and
// /how-it-works, with no auth, no chat sidebar, and no Stripe status
// fetch. Three tiers — Lite / Starter / Coached — each linking to the
// checkout page with the appropriate query param.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';

export const metadata: Metadata = {
  title: 'Pricing — Meo',
  description:
    'Three ways in. Same destination. Meo Lite (£29), Meo Starter (£149), and Meo Coached (£444).',
};

interface Plan {
  id: string;
  name: string;
  price: number;
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'lite',
    name: 'Meo Lite',
    price: 29,
    blurb: 'Start with the book and a week of Meo AI.',
    features: [
      'The Thin Book of Fat (digital)',
      '7-day Meo AI trial',
      'Manual entry of past blood results',
      'Credit £29 toward Starter within 30 days',
    ],
    cta: 'Start with the book',
    href: '/checkout?plan=lite',
  },
  {
    id: 'starter',
    name: 'Meo Starter',
    price: 149,
    blurb: 'The full bundle — meter, AI, score, six months.',
    features: [
      'Lab-grade lipid meter (UK & EU registered)',
      '6 months of Meo AI included',
      '20 test strips + lancets + carry case',
      'Biological Age Score + Target Score',
      '30-day money-back guarantee on the device',
    ],
    cta: 'Get Meo Starter',
    href: '/checkout',
    popular: true,
  },
  {
    id: 'coached',
    name: 'Meo Coached',
    price: 444,
    blurb: 'Everything in Starter, plus a metabolic coach.',
    features: [
      'Everything in Meo Starter',
      '3 months of 1:1 metabolic coaching with Spencer Martin',
      '40-min onboarding consultation',
      'Two 30-min follow-ups',
      'Direct messaging between sessions',
    ],
    cta: 'Get Meo + Coach',
    href: '/checkout?plan=coached',
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: C.bg, color: C.fg }}>
      <Navbar />
      <div className="px-5 sm:px-6 pt-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm hover:underline"
          style={{ color: C.muted }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>

      {/* Hero */}
      <section className="px-5 sm:px-6 pt-4 sm:pt-6 pb-8 text-center">
        <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.pillFg }}>
          Pricing
        </p>
        <h1
          className="font-extrabold mb-5 leading-tight max-w-3xl mx-auto"
          style={{
            color: C.fg,
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(36px, 6vw, 60px)',
            textWrap: 'balance',
          }}
        >
          Three ways in. <span style={{ color: C.primary }}>Same destination</span>.
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          Pick the version that fits how you want to start.
        </p>
      </section>

      {/* Tier grid */}
      <section className="px-5 sm:px-6 pb-28 sm:pb-40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="relative rounded-2xl p-7 flex flex-col"
              style={{
                background: C.bgCard,
                border: `${plan.popular ? 2 : 1}px solid ${plan.popular ? C.primary : C.border}`,
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
                  style={{ background: C.primary, color: C.primaryFg }}
                >
                  Most popular
                </div>
              )}

              <h2
                className="font-bold text-xl mb-2"
                style={{ color: C.fg, fontFamily: FONT_SERIF }}
              >
                {plan.name}
              </h2>
              <p className="text-sm mb-5" style={{ color: C.muted }}>{plan.blurb}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold" style={{ color: C.fg }}>
                  £{plan.price}
                </span>
                <span className="text-sm ml-2" style={{ color: C.muted }}>one-time</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} />
                    <span className="text-sm" style={{ color: C.fg }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="w-full inline-flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: plan.popular ? C.primary : 'transparent',
                  color: plan.popular ? C.primaryFg : C.primary,
                  border: plan.popular ? 'none' : `1px solid ${C.primary}`,
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-10" style={{ color: C.muted }}>
          One-time purchases. Prices in GBP. Shipping calculated at checkout.
        </p>
      </section>

      <Footer />
    </main>
  );
}
