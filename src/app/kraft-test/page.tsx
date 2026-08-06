// ─────────────────────────────────────────────────────────────────────
// /kraft-test — SCRUM-18. Puts Meterbolic's original diagnostic, the
// KRAFT Test, back on the public site as a listed product.
//
// Positioning (Eric, 2026-06-14): the Lipid Meter / Meo Starter is the
// LEADING product; the KRAFT Test is LEGACY but still on offer. This
// page therefore reads as "the deeper clinical test we also run", and
// every route out of it either goes to the enquiry form or back to the
// £149 bundle — it never competes with the bundle head-on.
//
// The KRAFT Test is NOT purchasable online (Eric, 2026-08-06): no
// price, no Stripe button. Every CTA is a `mailto:` to
// info@meterbolic.com, matching the /coaching programme pattern
// (components/coaching/Pricing.tsx, CtaClosing.tsx).
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Building2,
  Droplet,
  Home,
  LineChart,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';
import { KraftCurve } from '@/components/Visuals';
import { KRAFT_TEST, KRAFT_TEST_MAILTO } from '@/lib/kitProducts';

export const metadata: Metadata = {
  title: 'The KRAFT Test — Meterbolic',
  description:
    'Dr Joseph Kraft’s insulin-response test, run outside the lab. A glucose challenge with serial insulin readings that reveals insulin resistance years before a fasting glucose test does. Available through certified clinics and as a home kit.',
};

// What the test actually is — the four things a visitor needs to
// understand before they enquire.
const EXPLAINER = [
  {
    icon: Droplet,
    title: 'A glucose challenge, measured properly',
    body:
      'A standard fasting glucose test takes one snapshot on one morning. The KRAFT Test gives you a measured glucose load and then reads your insulin response across the hours that follow — the part almost nobody measures.',
  },
  {
    icon: LineChart,
    title: 'Insulin, not just glucose',
    body:
      'Insulin rises to hold glucose down, so glucose can look normal for years while insulin is quietly working overtime. Reading the insulin curve is what surfaces that compensation while it is still reversible.',
  },
  {
    icon: Activity,
    title: 'Your curve, against Kraft’s patterns',
    body:
      'Dr Joseph Kraft ran insulin-response surveys on more than 14,000 people and grouped the results into distinct response patterns. Your curve is read against that framework and returned as a plain-English pattern, not a wall of numbers.',
  },
  {
    icon: ShieldCheck,
    title: 'Clinical-grade analysis',
    body:
      'Run on Meterbolic’s proprietary lateral-flow analyser, CE-IVD marked and manufactured in an FDA-approved facility. Results are reviewed before they reach you.',
  },
] as const;

// The two delivery channels. Kept deliberately light on operational
// promises (turnaround, geography) until fulfilment is signed off.
const CHANNELS = [
  {
    icon: Building2,
    name: 'Through a certified clinic',
    body:
      'Your appointment is run by a practitioner in the Meterbolic network. They take the readings, we analyse the curve, and you get the report and a follow-up conversation.',
  },
  {
    icon: Home,
    name: 'As a home kit',
    body:
      'The mail-in route for people who aren’t near a clinic. The kit arrives with everything needed for the challenge and the samples; you post it back and the results come to your account.',
  },
] as const;

export default function KraftTestPage() {
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
      <section className="px-5 sm:px-6 pt-4 sm:pt-6 pb-10 text-center">
        <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.pillFg }}>
          The original Meterbolic diagnostic
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
          The <span style={{ color: C.primary }}>KRAFT Test</span>.
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          {KRAFT_TEST.tagline}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={KRAFT_TEST_MAILTO}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4d65e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c4a40]"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            Enquire about the KRAFT Test <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <Link href="/pricing" className="text-sm hover:underline" style={{ color: C.muted }}>
            or see the Meo Starter bundle
          </Link>
        </div>
      </section>

      {/* The curve */}
      <section className="px-5 sm:px-6 pb-16">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-5 sm:p-7"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-xs tracking-wide" style={{ color: C.muted }}>
              Insulin response · 3 hours
            </p>
            <p className="text-xs" style={{ color: C.muted }}>
              Illustrative
            </p>
          </div>
          <div className="overflow-x-auto">
            <KraftCurve width={640} height={240} />
          </div>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: C.muted }}>
            Two people can share the same fasting glucose number and have completely different
            curves. The shape — how high insulin climbs, and how long it stays there — is the
            signal.
          </p>
        </div>
      </section>

      {/* What it is */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-extrabold mb-10 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 42px)' }}
          >
            What the test actually measures
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {EXPLAINER.map((it) => {
              const Icon = it.icon;
              return (
                <div
                  key={it.title}
                  className="rounded-2xl p-7"
                  style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
                >
                  <div
                    className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center"
                    style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg mb-3" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    {it.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                    {it.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Two ways to take it */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-extrabold mb-3 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 42px)' }}
          >
            Two ways to take it
          </h2>
          <p className="text-center text-sm sm:text-base mb-10 max-w-2xl mx-auto" style={{ color: C.muted }}>
            Which route is open to you depends on where you are. Ask us and we&apos;ll confirm
            what&apos;s available.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CHANNELS.map((ch) => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.name}
                  className="rounded-2xl p-7"
                  style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
                >
                  <div
                    className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center"
                    style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg mb-3" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    {ch.name}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                    {ch.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Where it sits next to Meo — keeps the £149 bundle the lead */}
      <section className="px-5 sm:px-6 pb-16 sm:pb-24">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-7 sm:p-9"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          <h2
            className="font-bold mb-4 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(22px, 3vw, 30px)' }}
          >
            Where this sits next to Meo
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: C.muted }}>
            <strong style={{ color: C.fg }}>Meo Starter (£149)</strong> is where most people begin.
            It is the at-home system: the lipid meter, six months of Meo AI, and a Biological Age
            Score that updates every time you take a reading. It is designed to be run again and
            again, so you watch a trend rather than a snapshot.
          </p>
          <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: C.muted }}>
            <strong style={{ color: C.fg }}>The KRAFT Test</strong> is the deeper, one-off
            diagnostic underneath it — a direct measurement of your insulin response rather than a
            pattern inferred from lipids over time. It is the test the science of Meterbolic was
            built on, and it remains available for people who want the full picture in one sitting.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            style={{ color: C.primary }}
          >
            Compare the Meo plans <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Closing enquiry CTA — mailto, same pattern as /coaching. */}
      <section id="enquire" className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div
          className="max-w-2xl mx-auto rounded-2xl p-7 sm:p-10 text-center"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          <h2
            className="font-extrabold mb-3 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(26px, 4vw, 38px)' }}
          >
            Enquire about the KRAFT Test
          </h2>
          <p className="text-sm sm:text-base mb-7" style={{ color: C.muted }}>
            The KRAFT Test is arranged directly with our team rather than bought off the shelf.
            Email us and we&apos;ll confirm the right route for you — certified clinic or home kit
            — along with availability and cost.
          </p>
          <a
            href={KRAFT_TEST_MAILTO}
            className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4d65e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c4a40]"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            <Mail className="h-4 w-4" aria-hidden /> Email {KRAFT_TEST.enquiryEmail}
          </a>
          <p className="mt-5 text-xs leading-relaxed" style={{ color: C.muted }}>
            Prefer to talk it through?{' '}
            <Link href="/book-a-call" className="underline" style={{ color: C.muted }}>
              Book a call
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Medical disclaimer — this page describes a diagnostic test, so
          it carries the caveat explicitly rather than relying on the
          footer boilerplate alone. */}
      <section className="px-5 sm:px-6 py-10">
        <p className="max-w-3xl mx-auto text-xs leading-relaxed text-center" style={{ color: C.muted }}>
          The KRAFT Test is an insulin-response assessment intended to inform you and your
          healthcare professional. It is not a diagnosis of diabetes or any other condition, and it
          does not replace testing or advice from your GP. Always consult a qualified healthcare
          professional about your results.
        </p>
      </section>

      <Footer />
    </main>
  );
}
