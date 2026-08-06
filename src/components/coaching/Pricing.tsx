// ─── Coaching · Pricing tiers ─────────────────────────────────────────
//
// Section 3 of the /eos page. Two programme cards side by side
// (Metabolic Optimisation · Metabolic Continuum), of EQUAL visual
// weight — no "most popular" badge. Continuum carries a subtle
// primary-tinted border and a slightly deeper card tone to read as the
// fuller programme without breaking the balance. Both cards show an
// "Introductory pricing" tag so prices can be revised later without
// implying a reduction. Centred small-print footnote below.
//
// Each card also carries an "at a glance" chip row (session count,
// span, kit, messaging). Those chips are DERIVED from the `includes`
// bullets below them — 1×60min + 5×30min = 6 sessions for Optimisation,
// +3×45min = 9 for Continuum — so they must be kept in step with the
// bullets if the bullets ever change.
//
// id="pricing" is the scroll target for the Hero CTA. Copy is fixed
// marketing/compliance-reviewed text — do not paraphrase.
// ──────────────────────────────────────────────────────────────────────
import { Check, CalendarDays, Mail, MessageCircle, Package, UserRound } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { ENQUIRY_EMAIL } from '@/components/coaching/contact';

const CHIP_ICONS = {
  sessions: UserRound,
  span: CalendarDays,
  kit: Package,
  messaging: MessageCircle,
} as const;

type Chip = { kind: keyof typeof CHIP_ICONS; label: string };

type Tier = {
  id: string;
  name: string;
  duration: string;
  price: string;
  tagline: string;
  chips: readonly Chip[];
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
    chips: [
      { kind: 'sessions', label: '6 coaching sessions' },
      { kind: 'span', label: '12 weeks' },
      { kind: 'kit', label: 'Meo kit included' },
      { kind: 'messaging', label: 'Messaging support' },
    ],
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
    chips: [
      { kind: 'sessions', label: '9 coaching sessions' },
      { kind: 'span', label: '6 months' },
      { kind: 'kit', label: 'Meo kit included' },
      { kind: 'messaging', label: 'Priority messaging' },
    ],
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
                className="text-sm italic leading-relaxed mb-5"
                style={{ color: C.muted }}
              >
                {t.tagline}
              </p>

              {/* At a glance — the shape of the programme in one scan,
                  before the full includes list. */}
              <div className="flex flex-wrap gap-2 mb-6">
                {t.chips.map((chip) => {
                  const Icon = CHIP_ICONS[chip.kind];
                  return (
                    <span
                      key={chip.label}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: `1px solid ${C.border}`,
                        color: C.fg,
                      }}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: C.primary }} aria-hidden />
                      {chip.label}
                    </span>
                  );
                })}
              </div>

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

              {/* Live enquiry button — no checkout is wired for the
                  coaching programmes, so both cards open an email to
                  the Eos programme inbox with the tier pre-filled. */}
              <a
                href={`mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(
                  `${t.name} enquiry`,
                )}&body=${encodeURIComponent(
                  `Hi,\n\nI'd like to know more about the ${t.name} (${t.duration}, ${t.price}).\n\nThank you,\n`,
                )}`}
                aria-label={`Enquire about the ${t.name} programme by email`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: t.accent ? C.primary : 'transparent',
                  color: t.accent ? C.primaryFg : C.primary,
                  border: t.accent ? 'none' : `1px solid ${C.primary}`,
                }}
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
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
