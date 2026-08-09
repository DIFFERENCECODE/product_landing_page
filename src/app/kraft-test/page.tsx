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
  CalendarClock,
  Check,
  Droplet,
  Home,
  LineChart,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { C, FONT_SERIF, cardSurface } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';
import { KraftCurve } from '@/components/Visuals';
import { MeoEnterpriseBonus } from '@/components/MeoEnterpriseBonus';
import { SelectableCard, SelectableCardGroup } from '@/components/SelectableCard';
import {
  KRAFT_ENQUIRY_EMAIL,
  KRAFT_FROM_PRICE,
  KRAFT_TEST_MAILTO,
  KRAFT_TIERS,
  enquiryMailto,
  kraftEnquirySubject,
} from '@/lib/kitProducts';

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
          The insulin-response test behind the science — Dr Joseph Kraft&apos;s method, run outside
          the lab.
        </p>

        {/* By-appointment + from-price, stated before the fold so nobody
            reaches the cards expecting a checkout. */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: C.pill, color: C.pillFg, border: `1px solid ${C.primary}40` }}
          >
            <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            By appointment only
          </span>
          <span className="text-sm" style={{ color: C.muted }}>
            From <strong style={{ color: C.fg }}>{KRAFT_FROM_PRICE}</strong>
          </span>
          <MeoEnterpriseBonus variant="inline" />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4d65e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c4a40]"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            See the two options <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a href={KRAFT_TEST_MAILTO} className="text-sm hover:underline" style={{ color: C.muted }}>
            or enquire now
          </a>
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

      {/* Pricing — two appointment-based options. Mirrors the /coaching
          programme cards: equal visual weight, the fuller option carries
          a primary-tinted border rather than a "most popular" badge, and
          both CTAs are mailto rather than checkout. */}
      <section id="pricing" className="scroll-mt-24 px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            The two options
          </p>
          <h2
            className="font-extrabold mb-4 text-center leading-tight"
            style={{
              color: C.fg,
              fontFamily: FONT_SERIF,
              fontSize: 'clamp(28px, 4vw, 38px)',
              textWrap: 'balance',
            }}
          >
            The test, or the test and a plan
          </h2>
          <p className="text-center text-sm sm:text-base mb-10 max-w-2xl mx-auto" style={{ color: C.muted }}>
            Both are booked by appointment — there is no online checkout. Email us and we&apos;ll
            arrange a slot and confirm the right route for you.
          </p>

          {/* Shared selectable-card mechanism (components/SelectableCard)
              — same behaviour as the /eos programme cards. */}
          <SelectableCardGroup
            className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch"
            defaultSelected={KRAFT_TIERS.find((t) => t.accent)?.id ?? KRAFT_TIERS[0].id}
          >
            {KRAFT_TIERS.map((t) => (
              <SelectableCard
                key={t.id}
                id={t.id}
                className="rounded-2xl p-7 flex flex-col"
                style={cardSurface(t.accent)}
              >
                <span
                  className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide mb-4"
                  style={{ background: C.pill, color: C.pillFg }}
                >
                  <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  By appointment
                </span>

                <h3 className="font-bold text-xl mb-1" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
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

                <p className="text-sm italic leading-relaxed mb-6" style={{ color: C.muted }}>
                  {t.tagline}
                </p>

                {/* The complimentary Meo Enterprise offer, identical to
                    the one on the EoS coaching cards. */}
                <div className="mb-6">
                  <MeoEnterpriseBonus />
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

                {/* Subject names the tier, its price and whether it is
                    the coached variant — the inbox triages on subject
                    alone (kraftEnquirySubject in lib/kitProducts). */}
                <a
                  href={enquiryMailto(kraftEnquirySubject(t))}
                  aria-label={`Enquire about ${t.name} (${t.price}) by email`}
                  className="w-full inline-flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    background: t.accent ? C.primary : 'transparent',
                    color: t.accent ? C.primaryFg : C.primary,
                    border: t.accent ? 'none' : `1px solid ${C.primary}`,
                  }}
                >
                  Enquire and book
                </a>
              </SelectableCard>
            ))}
          </SelectableCardGroup>

          <p className="text-center text-xs mt-10 max-w-2xl mx-auto leading-relaxed" style={{ color: C.muted }}>
            Prices in GBP. The KRAFT Test is not sold online — every booking is arranged by
            appointment with our team, who will confirm availability and the right route for you
            before anything is paid.
          </p>
        </div>
      </section>

      {/* Where you take it */}
      <section className="px-5 sm:px-6 pb-16 sm:pb-24" style={{ background: C.bgDeep }}>
        <div className="max-w-5xl mx-auto pt-16 sm:pt-24">
          <h2
            className="font-extrabold mb-3 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 42px)' }}
          >
            Where you take it
          </h2>
          <p className="text-center text-sm sm:text-base mb-10 max-w-2xl mx-auto" style={{ color: C.muted }}>
            Both options above can be run either way. Which route is open to you depends on where
            you are — we&apos;ll confirm when you enquire.
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
            Book your KRAFT Test
          </h2>
          <p className="text-sm sm:text-base mb-6" style={{ color: C.muted }}>
            The KRAFT Test is by appointment — arranged directly with our team rather than bought
            off the shelf. Email us and we&apos;ll confirm a slot, the right route for you
            (certified clinic or home kit), and which of the two options fits.
          </p>
          <div className="mb-7 flex justify-center">
            <MeoEnterpriseBonus variant="inline" />
          </div>
          <a
            href={KRAFT_TEST_MAILTO}
            className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4d65e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c4a40]"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            <Mail className="h-4 w-4" aria-hidden /> Email {KRAFT_ENQUIRY_EMAIL}
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
