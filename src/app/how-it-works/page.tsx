// ─────────────────────────────────────────────────────────────────────
// /how-it-works — focused walkthrough of how Meo specifically works.
// Replaces the previous content (migrated from diff/site) which sold
// generic "6 metabolic-health services" (CGM, nutrition, coaching,
// lab analysis, supplements, lifestyle) — none of which is what
// shop.meterbolic.com actually sells. Visitors clicking "How it works"
// in the nav now learn the actual Meo loop: meter → AI → BAS score.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Brain,
  BarChart2,
  Quote,
  Check,
} from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';

export const metadata: Metadata = {
  title: 'How Meo works',
  description:
    'A finger-prick draws six metabolic markers. Meo AI interprets every reading in plain English. Your Biological Age Score updates with every test. Here is the full loop.',
};

const STEPS = [
  {
    n: 1,
    icon: Activity,
    title: 'Test at home',
    body:
      'A finger-prick onto a strip. The Digital Lipid Meter reads Total Cholesterol, HDL, LDL, Triglycerides, the TC/HDL ratio, and a Kraft-style insulin response. Three minutes, no clinic, no fasting morning.',
  },
  {
    n: 2,
    icon: Brain,
    title: 'AI explains the reading',
    body:
      'Meo AI takes the raw numbers and translates them into plain English — what each value means against YOUR baseline (not a population average), how it compares to your last 30 days, and whether anything in your sleep / travel / diet logs correlates with the move.',
  },
  {
    n: 3,
    icon: BarChart2,
    title: 'Your scores update',
    body:
      'Every reading recalculates your Biological Age Score and KRAFT Deep Fat Score. You watch them drift toward (or away from) your Target Score over weeks and months — not years between annual blood draws.',
  },
] as const;

const MARKERS = [
  { abbr: 'TC', label: 'Total Cholesterol — overall lipid load' },
  { abbr: 'HDL', label: 'Protective cholesterol' },
  { abbr: 'LDL', label: 'Atherogenic cholesterol' },
  { abbr: 'TG', label: 'Triglycerides — blood fat from diet & liver' },
  { abbr: 'TG:HDL', label: 'Insulin-resistance marker' },
  { abbr: 'BAS', label: 'Biological Age Score — your composite metric' },
] as const;

const WHY = [
  {
    title: 'Daily visibility, not yearly',
    body:
      "An annual blood test gives you one snapshot per year — 364 days of metabolic drift between readings. Meo runs as often as you want, so the trend is visible early, not after a diagnosis.",
  },
  {
    title: 'Your baseline, not the median',
    body:
      "A standard panel benchmarks you against the median 50-year-old. Meo benchmarks every reading against YOUR own previous readings — what's normal for you, what's not.",
  },
  {
    title: 'Pattern detection across context',
    body:
      'Meo AI cross-references your lipid trends with anything else you log — sleep, steps, diet, travel, stress. It flags when LDL drifts in step with a sleep collapse or a restaurant-heavy week, before either reading looks alarming on its own.',
  },
] as const;

export default function HowItWorksPage() {
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

      {/* Hero */}
      <section className="px-5 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
        <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.pillFg }}>
          How Meo works
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
          A finger-prick. <span style={{ color: C.primary }}>AI interpretation.</span> A score that tracks over time.
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          The full loop, end to end — what you do, what you get back, and why the trend matters more than any single number.
        </p>
      </section>

      {/* 3-step process */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            The 3-step loop
          </p>
          <h2
            className="font-extrabold mb-12 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Test → <span style={{ color: C.primary }}>interpret</span> → track.
          </h2>
          <div className="space-y-5">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className="rounded-2xl p-7"
                  style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0"
                      style={{ background: C.primary, color: C.primaryFg }}
                      aria-hidden
                    >
                      {s.n}
                    </div>
                    <h3 className="font-bold text-xl" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                      {s.title}
                    </h3>
                    <Icon className="h-5 w-5 ml-auto shrink-0" style={{ color: C.primary }} aria-hidden />
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: C.muted }}>
                    {s.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Meo measures */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            One drop of blood
          </p>
          <h2
            className="font-extrabold mb-3 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Six markers, every reading.
          </h2>
          <p className="text-center text-base mb-12 max-w-2xl mx-auto" style={{ color: C.muted }}>
            Lab-grade accuracy from one finger-prick — every test gives Meo enough signal to update your full metabolic picture.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKERS.map((m) => (
              <div
                key={m.abbr}
                className="rounded-2xl p-5 flex items-start gap-3"
                style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
              >
                <div
                  className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wide shrink-0"
                  style={{ background: C.pill, color: C.pillFg }}
                >
                  {m.abbr}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this beats annual blood draws */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            Why this matters
          </p>
          <h2
            className="font-extrabold mb-12 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            What an annual blood draw <span style={{ color: C.primary }}>can&apos;t do</span>.
          </h2>
          <div className="space-y-5">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="rounded-2xl p-6 flex items-start gap-4"
                style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
              >
                <Check className="h-5 w-5 mt-1 shrink-0" style={{ color: C.primary }} aria-hidden />
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    {w.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: C.muted }}>
                    {w.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice from the beta */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="h-6 w-6 mx-auto mb-5" style={{ color: C.primary }} aria-hidden />
          <p className="text-lg sm:text-xl italic mb-4 leading-relaxed" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
            &ldquo;My ratios have improved for 11 weeks straight. It&apos;s not the device — it&apos;s finally seeing what I&apos;m doing.&rdquo;
          </p>
          <p className="text-sm font-semibold" style={{ color: C.pillFg }}>
            — Marcus T., Manchester (beta tester)
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-6 py-20 text-center" style={{ background: C.bgDeep }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-extrabold mb-4 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
          >
            Start your <span style={{ color: C.primary }}>own loop</span>.
          </h2>
          <p className="text-base mb-8" style={{ color: C.muted }}>
            Six months of weekly readings is enough for the trend to be visible — and yours to act on.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Get Meo · £149 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="text-sm hover:underline"
              style={{ color: C.muted }}
            >
              or compare plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
