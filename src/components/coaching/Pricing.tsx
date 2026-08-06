// ─── Coaching · Pricing tiers ─────────────────────────────────────────
//
// Section 3 of the /coaching page. Two programme cards side by side
// (Metabolic Optimisation · Metabolic Continuum), of EQUAL visual
// weight — no "most popular" badge. Continuum carries a subtle
// primary-tinted border and a slightly deeper card tone to read as the
// fuller programme without breaking the balance. Both cards show an
// "Introductory pricing" tag so prices can be revised later without
// implying a reduction. Centred small-print footnote below.
//
// id="pricing" is the scroll target for the Hero CTA. Copy is fixed
// marketing/compliance-reviewed text — do not paraphrase.
// ──────────────────────────────────────────────────────────────────────
import { Check } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

type Tier = {
  id: string;
  name: string;
  duration: string;
  price: string;
  tagline: string;
  includes: readonly string[];
  accent: boolean;
};

const TIERS: readonly Tier[] = [
  {
    id: 'optimisation',
    name: 'Metabolic Optimisation',
    duration: '3-month programme',
    price: '£850',
    tagline:
      'A focused 12-week programme to build sustainable metabolic habits, with regular 1:1 coaching from Dr Arup Sen.',
    includes: [
      'Meo Starter: CE-marked digital lipid meter, 10 test strips + lancets + carry case',
      '6 months of Meo AI plain-English interpretation',
      'Your metabolic trend score, tracked from your lipids and body measurements',
      'Free retest at month six',
      '1 × 60-minute onboarding coaching session with Dr Arup Sen',
      '5 × 30-minute fortnightly 1:1 coaching sessions across the 12-week programme',
      'Messaging support between sessions',
    ],
    accent: false,
  },
  {
    id: 'continuum',
    name: 'Metabolic Continuum',
    duration: '6-month programme',
    price: '£1,450',
    tagline:
      'Sustained 1:1 coaching across 6 months — frequent support while you build new habits, then ongoing maintenance to keep them.',
    includes: [
      'Everything in Metabolic Optimisation',
      '3 additional × 45-minute monthly maintenance coaching sessions (months 4–6)',
      'Continued Meo monitoring and trend tracking across the full 6 months',
      'Priority messaging support throughout',
      'A personalised, evolving lifestyle plan covering nutrition, movement, sleep and stress',
    ],
    accent: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bg }}>
      <div className="max-w-4xl mx-auto">
        <p
          className="text-xs font-semibold tracking-wide mb-3 text-center"
          style={{ color: C.pillFg }}
        >
          The programmes
        </p>
        <h2
          className="font-extrabold mb-12 text-center leading-tight"
          style={{
            color: C.fg,
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(28px, 4vw, 38px)',
            textWrap: 'balance',
          }}
        >
          Choose your programme
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {TIERS.map((t) => (
            <div
              key={t.id}
              className="relative rounded-2xl p-7 flex flex-col"
              style={{
                background: t.accent ? C.bgCardHover : C.bgCard,
                border: `1px solid ${t.accent ? 'rgba(164,214,94,0.45)' : C.border}`,
              }}
            >
              {/* Introductory-pricing tag — keeps future price changes from
                  implying a reduction. */}
              <span
                className="self-start px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide mb-4"
                style={{ background: C.pill, color: C.pillFg }}
              >
                Introductory pricing
              </span>

              <h3
                className="font-bold text-xl mb-1"
                style={{ color: C.fg, fontFamily: FONT_SERIF }}
              >
                {t.name}
              </h3>
              <p className="text-sm mb-5" style={{ color: C.muted }}>
                {t.duration}
              </p>

              <div className="mb-4">
                <span className="text-4xl font-extrabold" style={{ color: C.fg }}>
                  {t.price}
                </span>
              </div>

              <p
                className="text-sm italic leading-relaxed mb-6"
                style={{ color: C.muted }}
              >
                {t.tagline}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {t.includes.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} aria-hidden />
                    <span className="text-sm leading-relaxed" style={{ color: C.fg }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:info@meterbolic.com?subject=${encodeURIComponent(
                  `${t.name} enquiry`,
                )}`}
                className="w-full inline-flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: t.accent ? C.primary : 'transparent',
                  color: t.accent ? C.primaryFg : C.primary,
                  border: t.accent ? 'none' : `1px solid ${C.primary}`,
                }}
              >
                Enquire about this programme
              </a>
            </div>
          ))}
        </div>

        {/* Pricing footnote — small print, centred, below both cards. */}
        <p className="text-center text-xs mt-10 max-w-2xl mx-auto leading-relaxed" style={{ color: C.muted }}>
          Introductory launch pricing. Prices include the Meo device, AI monitoring and
          all listed coaching sessions with Dr Arup Sen. Coaching is wellness-focused and
          does not constitute medical care.
        </p>
      </div>
    </section>
  );
}
