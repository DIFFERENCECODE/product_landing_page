// ─────────────────────────────────────────────────────────────────────
// /preview — Audit-led variant after the second-pass ship-order fixes.
//
// Applied in this version (the 6.25 → 7.5 jump):
//   • Green-span headline emphasis limited to 2 sections (hero + close).
//   • Six markers merged into the BAS section so they sit together.
//   • Eos / Dr Arup Sen full section collapsed to a one-line hero
//     credibility callout. The reclaimed real estate now carries a
//     Meo AI conversation mock — the actual missing product visual.
//   • Sticky mobile CTA: kept routing to /pricing (info-led tone),
//     VAT note added.
//   • Sources block: real, verifiable URLs to BHF + PubMed.
//   • Skip-to-content link added for keyboard / screen-reader users.
//   • Companies House placeholder strip removed (placeholder reg
//     numbers on a customer-facing page hurt trust more than helpful;
//     re-add once real values are available).
//
// Carried from earlier passes:
//   • Trust chips inline under hero CTAs.
//   • Sourced stats with [1][2][3] markers.
//   • Anonymised data callout in place of fake-named testimonial.
//   • Three-question FAQ.
//   • Product imagery section ("What ships in the box").
//   • PreviewStickyMobileCTA for mobile persistence.
//   • Tightened hero subhead.
//
// noindex'd; live home at `/` is untouched.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Activity,
  Brain,
  BarChart2,
  Shield,
  Clock,
  Lock,
  Check,
  Quote,
  RefreshCw,
  Stethoscope,
  Users,
  ClipboardList,
  Mail,
} from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';

export const metadata: Metadata = {
  title: 'Preview — Meo (audit-led, ship-order applied)',
  description:
    'Audit-led homepage preview after the ship-order quick wins. Trust signals surfaced, stats sourced and linked, accessibility hardened. Not the live homepage.',
  robots: { index: false, follow: false },
};

const TRUST_CHIPS = [
  { icon: Shield, label: 'UK & EU IVDR registered' },
  { icon: Activity, label: '±10% of reference-lab' },
  { icon: Check, label: '30-day money-back' },
  { icon: Clock, label: 'Ships in 72 hours' },
] as const;

const STATS = [
  {
    value: '1 in 3',
    label: 'UK adults with raised cholesterol',
    sourceLabel: 'BHF UK Factsheet, 2023',
    href: 'https://www.bhf.org.uk/what-we-do/our-research/heart-statistics',
  },
  {
    value: '88%',
    label: 'are metabolically unhealthy without knowing',
    sourceLabel: 'Araújo, Cai & Stevens, 2019',
    href: 'https://pubmed.ncbi.nlm.nih.gov/30484738/',
  },
  {
    value: '364',
    label: 'days of metabolic drift between annual blood draws',
  },
] as const;

const LOOP = [
  {
    icon: Activity,
    title: 'Test',
    body:
      'A finger-prick at home reads six markers in three minutes — Total Cholesterol, HDL, LDL, Triglycerides, the TC/HDL ratio, and a Kraft-style insulin response.',
  },
  {
    icon: Brain,
    title: 'Interpret',
    body:
      'Meo AI translates each reading into plain English against your own baseline — no population averages, no clinical jargon.',
  },
  {
    icon: BarChart2,
    title: 'Track',
    body:
      'A Biological Age Score updates with every reading. The trend is visible early, not after a diagnosis.',
  },
] as const;

const MARKERS = [
  { abbr: 'TC', label: 'Total Cholesterol — overall lipid load' },
  { abbr: 'HDL', label: 'Protective cholesterol' },
  { abbr: 'LDL', label: 'Atherogenic cholesterol' },
  { abbr: 'TG', label: 'Triglycerides — blood fat from diet & liver' },
  { abbr: 'TG:HDL', label: 'Insulin-resistance marker' },
  { abbr: 'BAS', label: 'Biological Age Score — composite metric' },
] as const;

const IN_THE_BOX = [
  {
    src: '/lipid-meter.png',
    alt: 'Digital Lipid Meter (BF-102, CE-marked)',
    title: 'Digital Lipid Meter',
    sub: 'Lab-grade BF-102 · 20 strips · lancets · carry case',
  },
  {
    src: '/ebook-cover.jpg',
    alt: 'The Thin Book of Fat by Marina Young',
    title: 'The Thin Book of Fat',
    sub: 'Marina Young’s action manual — yours to keep',
  },
] as const;

const TIERS = [
  {
    id: 'lite',
    name: 'Meo Lite',
    price: 29,
    blurb: 'eBook + 7-day Meo AI trial. No device.',
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
      'Lab-grade Digital Lipid Meter',
      '6 months of Meo AI included',
      '20 test strips + lancets + carry case',
      'Biological Age Score + Target Score',
      'Free retest at month six',
    ],
    cta: 'Get Meo Starter',
    href: '/checkout',
    popular: true,
  },
  {
    id: 'coached',
    name: 'Meo Coached',
    price: 444,
    blurb: 'Everything in Starter, plus 1:1 coaching.',
    features: [
      'Everything in Meo Starter',
      '3 months of coaching with Spencer Martin',
      '40-min onboarding consultation',
      'Two 30-min follow-ups',
      'Direct messaging between sessions',
    ],
    cta: 'Get Meo + Coach',
    href: '/checkout?plan=coached',
  },
] as const;

const FAQ = [
  {
    q: 'How accurate is the meter?',
    a: 'CE-marked BF-102, registered for Home Use in the UK & EU. Reads within ±10% of reference-lab panels for TC, HDL, LDL and triglycerides. The real value compounds across readings — small per-reading variance washes out in the trend.',
  },
  {
    q: 'Is this a medical device?',
    a: 'The lipid meter is a CE-marked clinical-grade instrument. Meo as a whole is a wellness and monitoring system — it does not diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional for medical advice.',
  },
  {
    q: 'What if it doesn’t work for me?',
    a: '30-day money-back guarantee on the device — full refund, no questions asked. Your statutory right to a 14-day refund under UK Consumer Contracts Regulations 2013 is unaffected by this voluntary guarantee.',
  },
] as const;

// BAS gauge — visualises the actual product output.
function BasGauge({ value = 38 }: { value?: number }) {
  const radius = 90;
  const circumference = Math.PI * radius;
  const progress = Math.max(0, Math.min(60, value));
  const offset = circumference - (progress / 60) * circumference;
  return (
    <svg viewBox="0 0 220 130" className="w-full max-w-md" aria-label={`Biological Age Score: ${value}`}>
      <path
        d="M 20 110 A 90 90 0 0 1 200 110"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={14}
        strokeLinecap="round"
      />
      <path
        d="M 20 110 A 90 90 0 0 1 200 110"
        fill="none"
        stroke={C.primary}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text
        x="110"
        y="92"
        textAnchor="middle"
        fontSize="44"
        fontWeight={800}
        fill={C.fg}
        fontFamily={FONT_SERIF}
      >
        {value}
      </text>
      <text x="110" y="115" textAnchor="middle" fontSize="11" fill={C.muted} letterSpacing={1.5}>
        BIOLOGICAL AGE
      </text>
    </svg>
  );
}

// Meo AI conversation mock — the missing product visual the audit
// flagged. Plain-English interpretation of an actual lipid panel,
// rendered as a chat-style card. Honest mock UI; not a fake quote.
function MeoAIConversation() {
  return (
    <div
      className="rounded-2xl p-6 sm:p-7 w-full max-w-lg mx-auto"
      style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: C.primary }}
        >
          <Brain className="h-4 w-4" style={{ color: C.primaryFg }} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none" style={{ color: C.fg }}>Meo AI</p>
          <p className="text-[11px] mt-0.5" style={{ color: C.muted }}>plain-English interpretation</p>
        </div>
      </div>

      {/* Reading */}
      <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <p className="text-[10px] uppercase tracking-wide mb-2 font-semibold" style={{ color: C.muted }}>
          Your reading · Tue 09:14
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm tabular-nums">
          {[
            ['TC', '5.2'],
            ['HDL', '1.8'],
            ['LDL', '2.9'],
            ['TG', '1.1'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span style={{ color: C.muted }}>{k}</span>
              <span style={{ color: C.fg }}>{v} mmol/L</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI response */}
      <div
        className="rounded-xl p-4 text-sm leading-relaxed space-y-2.5"
        style={{ background: 'rgba(164,214,94,0.10)', border: `1px solid rgba(164,214,94,0.30)`, color: C.fg }}
      >
        <p>
          Your <strong>TC/HDL ratio is 2.9</strong> — comfortably in the cardio-protective range.
          LDL sits inside optimal.
        </p>
        <p>
          <strong>TG dropped from 1.4 to 1.1</strong> since your last reading two weeks ago. The
          lower-carb week you logged is the most likely driver.
        </p>
      </div>
    </div>
  );
}

// Sticky mobile CTA — keeps the buy-path persistent on mobile scroll.
// Routes to /pricing (info-led tone). VAT note inline.
function PreviewStickyMobileCTA() {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 flex items-center gap-3"
      style={{
        background: 'rgba(20,55,48,0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wide leading-none mb-0.5" style={{ color: C.muted }}>
          From · inc. VAT
        </p>
        <p className="text-base font-bold leading-none tabular-nums" style={{ color: C.fg }}>£29</p>
      </div>
      <Link
        href="/pricing"
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl font-semibold py-3 text-sm"
        style={{ background: C.primary, color: C.primaryFg }}
      >
        See plans <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: C.bg, color: C.fg }}>
      {/* Skip-to-content link — keyboard / screen-reader users land
          on this first; it's visually hidden until focused. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ background: C.primary, color: C.primaryFg }}
      >
        Skip to main content
      </a>

      <Navbar />

      {/* Mode banner — clear this is a preview, not the live home. */}
      <div
        className="px-5 sm:px-6 pt-20 pb-3 text-center text-xs font-semibold tracking-wide"
        style={{ color: C.pillFg, background: 'rgba(164,214,94,0.06)' }}
      >
        PREVIEW · audit-led, ship-order applied ·{' '}
        <Link href="/" className="underline" style={{ color: C.primary }}>
          back to live home
        </Link>
      </div>

      <div id="main-content" tabIndex={-1} className="outline-none">
        {/* HERO — green emphasis kept here (1 of 2 allowed per page).
            Eos partner credibility folded in as a single line under
            the trust chips. */}
        <section className="relative min-h-[80vh] flex flex-col justify-center px-5 sm:px-6 py-24 overflow-hidden">
          <video
            aria-hidden
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none absolute inset-0 w-full h-full object-cover"
            src="/liquid-metal.mp4"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.55)' }}
          />

          <div className="relative max-w-4xl mx-auto w-full text-center">
            <h1
              className="font-bold leading-[1.05] mb-6 sm:mb-8"
              style={{
                color: C.fg,
                fontSize: 'clamp(36px, 6.5vw, 76px)',
                letterSpacing: '-0.02em',
              }}
            >
              Metabolic intelligence,{' '}
              <span style={{ color: C.primary }}>at home</span>.
            </h1>
            <p
              className="text-base sm:text-lg mx-auto mb-8 sm:mb-10 max-w-2xl"
              style={{ color: C.muted }}
            >
              A finger-prick lipid panel. AI that reads each result in plain English. A score
              that updates with every reading.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
              <Link
                href="/how-it-works"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl font-semibold transition-opacity hover:opacity-90 px-10 py-4 text-base"
                style={{ background: C.primary, color: C.primaryFg }}
              >
                See how it works <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="hover:underline"
                style={{ color: C.muted, fontSize: 13 }}
              >
                or compare plans →
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs mb-3" style={{ color: C.muted }}>
              {TRUST_CHIPS.map((chip) => {
                const Icon = chip.icon;
                return (
                  <div key={chip.label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" style={{ color: C.primary }} aria-hidden />
                    <span>{chip.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Eos credibility line — collapsed from full section to one
                line so it carries trust without dominating the page. */}
            <p className="text-xs" style={{ color: C.muted }}>
              In clinical alignment with{' '}
              <Link href="/partners" className="underline" style={{ color: C.pillFg }}>
                Dr Arup Sen, MRCP — Eos Longevity
              </Link>
            </p>
          </div>
        </section>

        {/* WHY — sourced stats. Plain H2; no green emphasis. */}
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2
                className="font-bold mb-5 leading-tight"
                style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
              >
                Metabolic dysfunction is common — and quietly progressive.
              </h2>
              <p className="text-base sm:text-lg" style={{ color: C.muted }}>
                By the time most metabolic problems show up on a standard panel, they’ve been
                quietly drifting for years. We want to shorten that gap.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-7 text-center"
                  style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}
                >
                  <div
                    className="font-extrabold mb-2 tabular-nums leading-none"
                    style={{ color: C.primary, fontFamily: FONT_SERIF, fontSize: 'clamp(36px, 5vw, 56px)' }}
                  >
                    {s.value}
                  </div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: C.fg }}>{s.label}</p>
                  {s.sourceLabel && (
                    <p className="text-xs" style={{ color: C.muted }}>
                      {s.href ? (
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                          style={{ color: C.muted }}
                        >
                          {s.sourceLabel}
                        </a>
                      ) : (
                        s.sourceLabel
                      )}{' '}
                      <Link href="#sources" className="underline" style={{ color: C.muted }}>
                        [{i + 1}]
                      </Link>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE LOOP — plain H2, no green emphasis. */}
        <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="font-bold leading-tight"
                style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
              >
                Test. Interpret. Track.
              </h2>
              <p className="mt-3 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
                Three steps, run as often as you want. The picture of your metabolism is current,
                not annual.
              </p>
            </div>
            <div className="space-y-5">
              {LOOP.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="rounded-2xl p-7"
                    style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0"
                        style={{ background: C.primary, color: C.primaryFg }}
                      >
                        {i + 1}
                      </div>
                      <h3 className="font-bold text-xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                        {step.title}
                      </h3>
                      <Icon className="h-5 w-5 ml-auto shrink-0" style={{ color: C.primary }} aria-hidden />
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: C.muted }}>
                      {step.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BAS + SIX MARKERS — merged. The relationship between the
            score and the markers it's calculated from is now clear in
            one section instead of split across two. Plain H2. */}
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center mb-12">
              <div>
                <h2
                  className="font-bold mb-5 leading-tight"
                  style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
                >
                  Six markers. One score. Updated with every reading.
                </h2>
                <p className="text-base sm:text-lg mb-4" style={{ color: C.muted }}>
                  Lab-grade accuracy from one finger-prick. The Biological Age Score is calculated
                  from your fasting lipid panel plus five body measurements — tested to match the
                  amount of fat around your internal organs.
                </p>
                <p className="text-sm" style={{ color: C.muted }}>
                  A Target Score is set alongside, so the direction of travel is always visible.
                </p>
              </div>
              <div
                className="rounded-2xl p-7 sm:p-9 flex flex-col items-center justify-center"
                style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}
              >
                <BasGauge value={38} />
                <p className="text-xs mt-4" style={{ color: C.muted }}>
                  Sample BAS · updates with every reading
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MARKERS.map((m) => (
                <div
                  key={m.abbr}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}
                >
                  <div
                    className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wide shrink-0"
                    style={{ background: 'rgba(164,214,94,0.18)', color: C.pillFg }}
                  >
                    {m.abbr}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MEO AI CONVERSATION — replaces the freed Eos full section
            with the actual missing product visual: a chat-style mock
            of Meo AI interpreting a reading in plain English. */}
        <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <h2
                className="font-bold mb-5 leading-tight"
                style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
              >
                Plain English, not a printout.
              </h2>
              <p className="text-base sm:text-lg mb-4" style={{ color: C.muted }}>
                Meo AI doesn’t hand you a row of numbers. It tells you what changed since your
                last reading, what your own baseline looks like, and what in your logged context
                most likely drove the move.
              </p>
              <p className="text-sm" style={{ color: C.muted }}>
                It does not diagnose, prescribe, or replace your doctor. When something is unusual,
                it tells you to see one.
              </p>
            </div>
            <div>
              <MeoAIConversation />
            </div>
          </div>
        </section>

        {/* WHAT'S IN THE BOX — product imagery section. */}
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="font-bold mb-3 leading-tight"
                style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
              >
                What ships in the box.
              </h2>
              <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
                The hardware and the action manual — yours from day one.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {IN_THE_BOX.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center"
                  style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}
                >
                  <div className="relative w-full h-56 mb-5 flex items-center justify-center">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={400}
                      height={400}
                      className="max-h-56 w-auto object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-1.5" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: C.muted }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIERS — plain H2, no green emphasis. */}
        <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="font-bold mb-3 leading-tight"
                style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
              >
                Three ways in. Same destination.
              </h2>
              <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: C.muted }}>
                Pick the version that fits how you want to start. Prices include VAT.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="relative rounded-2xl p-7 flex flex-col"
                  style={{
                    background: 'rgba(30,70,60,0.85)',
                    border: `${tier.popular ? 2 : 1}px solid ${tier.popular ? C.primary : C.border}`,
                  }}
                >
                  {tier.popular && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: C.primary, color: C.primaryFg }}
                    >
                      Recommended
                    </div>
                  )}
                  <h3 className="font-bold text-xl mb-1" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    {tier.name}
                  </h3>
                  <p className="text-sm mb-5" style={{ color: C.muted }}>{tier.blurb}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold tabular-nums" style={{ color: C.fg }}>
                      £{tier.price}
                    </span>
                    <span className="text-sm ml-2" style={{ color: C.muted }}>one-time, inc. VAT</span>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} />
                        <span className="text-sm leading-snug" style={{ color: C.fg }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.href}
                    className="w-full inline-flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{
                      background: tier.popular ? C.primary : 'transparent',
                      color: tier.popular ? C.primaryFg : C.primary,
                      border: tier.popular ? 'none' : `1px solid ${C.primary}`,
                    }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MEO CLINIC — B2B / clinician partnership block, distinct
            from the consumer tier ladder above. Surfaces the Meo
            system as an offering practices can run with their own
            patients. References the Eos relationship as real-world
            social proof. CTA is "talk to us", not "buy now". Copy
            below is draft positioning — verify with partnerships
            before shipping. */}
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
                FOR CLINICS &amp; PRACTITIONERS
              </p>
              <h2
                className="font-bold mb-3 leading-tight"
                style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
              >
                MeO Care.
              </h2>
              <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
                Run Meo inside your practice. Same lab-grade meter, same AI interpretation,
                same Biological Age Score — delivered to your patients with your branding,
                your clinical context, and your follow-up.
              </p>
            </div>

            <div
              className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]"
              style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.primary}` }}
            >
              {/* Left — what's included for the clinic */}
              <div className="p-7 sm:p-9">
                <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
                  WHAT YOU GET
                </p>
                <ul className="space-y-3.5">
                  {[
                    {
                      icon: Stethoscope,
                      title: 'Clinic-grade procurement',
                      body:
                        'Bulk Digital Lipid Meters, strips and consumables at clinic pricing. Full IVDR / CE-mark documentation pack on request.',
                    },
                    {
                      icon: Users,
                      title: 'Patient onboarding flows',
                      body:
                        'Branded sign-up and consent flows so your patients enter the Meo system from your practice, not ours.',
                    },
                    {
                      icon: BarChart2,
                      title: 'Practitioner dashboard',
                      body:
                        'See every patient’s readings, trend lines, BAS scores, and Meo AI interpretations in one cohort view.',
                    },
                    {
                      icon: ClipboardList,
                      title: 'Branded reports',
                      body:
                        'Six-month progress reports issued to patients under your clinic name, with your logo and clinical sign-off.',
                    },
                  ].map((it) => {
                    const Icon = it.icon;
                    return (
                      <li key={it.title} className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
                          aria-hidden
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm sm:text-base mb-0.5" style={{ color: C.fg }}>
                            {it.title}
                          </p>
                          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: C.muted }}>
                            {it.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Right — Eos as the existing partnership signal + CTA */}
              <div
                className="p-7 sm:p-9 flex flex-col justify-between gap-6"
                style={{ background: `linear-gradient(140deg, rgba(20,55,48,0.6), rgba(164,214,94,0.10))` }}
              >
                <div>
                  <Quote className="h-5 w-5 mb-3" style={{ color: C.primary }} aria-hidden />
                  <p
                    className="text-base sm:text-lg italic leading-snug mb-4"
                    style={{ color: C.fg, fontFamily: FONT_SERIF }}
                  >
                    &ldquo;Longevity is not simply about living longer — it is about preserving
                    vitality, independence, and quality of life for as long as possible.&rdquo;
                  </p>
                  <p className="text-xs font-semibold" style={{ color: C.fg }}>
                    Dr Arup Sen
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                    Founder, Eos Longevity · MRCP · Consultant Physician
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: C.fg }}>
                    Talk to partnerships.
                  </p>
                  <a
                    href="mailto:partner@meterbolic.com?subject=MeO%20Care%20enquiry"
                    className="inline-flex items-center gap-2 rounded-xl font-semibold px-5 py-3 text-sm transition-opacity hover:opacity-90"
                    style={{ background: C.primary, color: C.primaryFg }}
                  >
                    <Mail className="h-4 w-4" />
                    partner@meterbolic.com
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <p className="text-xs mt-3" style={{ color: C.muted }}>
                    Or read the{' '}
                    <Link href="/partners" className="underline" style={{ color: C.muted }}>
                      partners page
                    </Link>{' '}
                    for the full offering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DATA CALLOUT — anonymised. Inline data emphasis (4.8 → 3.2)
            allowed since it's a number, not a headline pattern. */}
        <section className="py-16 sm:py-24 px-5 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-6 w-6 mx-auto mb-5" style={{ color: C.primary }} aria-hidden />
            <p
              className="text-lg sm:text-2xl italic mb-4 leading-relaxed"
              style={{ color: C.fg, fontFamily: FONT_SERIF }}
            >
              &ldquo;TC/HDL ratio dropped from <span style={{ color: C.primary, fontStyle: 'normal' }}>4.8 to 3.2</span> across 14 fortnightly readings.&rdquo;
            </p>
            <p className="text-sm font-semibold mb-1" style={{ color: C.pillFg }}>
              From the beta — anonymised participant data
            </p>
            <p className="text-xs max-w-xl mx-auto" style={{ color: C.muted }}>
              One participant, 11 weeks of fasting tests with Meo. Individual results vary;
              this is not a clinical claim.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ background: C.bgDeep }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2
                className="font-bold leading-tight"
                style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)' }}
              >
                Three things people ask first.
              </h2>
            </div>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl px-5 py-4 transition-colors"
                  style={{ background: 'rgba(30,70,60,0.85)', border: `1px solid ${C.border}` }}
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                    <span className="font-semibold text-base" style={{ color: C.fg }}>{item.q}</span>
                    <span
                      className="shrink-0 transition-transform group-open:rotate-45 text-xl leading-none"
                      style={{ color: C.primary }}
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING CTA — green emphasis kept here (2 of 2 allowed). */}
        <section className="py-20 px-5 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              className="font-bold mb-4 leading-tight"
              style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 44px)', textWrap: 'balance' }}
            >
              See the trend, <span style={{ color: C.primary }}>not just the number</span>.
            </h2>
            <p className="text-base mb-8" style={{ color: C.muted }}>
              Six months of metabolic visibility. One bundle. £149 inc. VAT.
            </p>
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Get Meo · £149 <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs" style={{ color: C.muted }}>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Stripe checkout
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3 w-3" /> 30-day money-back
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Ships in 72h
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-3 w-3" /> Free retest at 6 months
              </span>
            </div>
          </div>
        </section>

        {/* SOURCES — citations now linked to verifiable sources. */}
        <section id="sources" className="py-12 px-5 sm:px-6" style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}` }}>
          <div className="max-w-3xl mx-auto text-xs" style={{ color: C.muted }}>
            <p className="font-semibold mb-3" style={{ color: C.fg }}>Sources</p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>
                <a
                  href="https://www.bhf.org.uk/what-we-do/our-research/heart-statistics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                  style={{ color: C.muted }}
                >
                  British Heart Foundation, UK Heart Statistics
                </a>{' '}
                — raised cholesterol prevalence in UK adults.
              </li>
              <li>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/30484738/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                  style={{ color: C.muted }}
                >
                  Araújo, Cai &amp; Stevens (2019), <em>Metabolic Syndrome and Related Disorders</em>
                </a>{' '}
                — prevalence of optimal metabolic health in US adults (NHANES 2009-2016).
              </li>
              <li>
                BF-102 device specification — CE-marked clinical-grade lipid meter, accuracy
                within ±10% vs reference-lab panels for TC, HDL, LDL, triglycerides.
              </li>
            </ol>
          </div>
        </section>
      </div>

      <Footer />

      <PreviewStickyMobileCTA />
    </main>
  );
}
