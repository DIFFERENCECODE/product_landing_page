// ─────────────────────────────────────────────────────────────────────
// /partners — Migrated from legacy diff/site/public_html/partners.html.
// Original copy preserved verbatim. Legacy CSS, FontAwesome, and Meta
// Pixel scripts dropped — page inherits the master design system via
// the C palette + brand fonts.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Stethoscope, Activity, Briefcase, Watch, FlaskConical, Mail, ArrowRight } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';

export const metadata: Metadata = {
  title: 'Partners — Meterbolic',
  description:
    "Powering Prevention, Insight and Outcomes — Together. Whether you're a doctor, clinic, health coach, PT, gym, corporate well-being provider, insurer, wearable tech company, pharma team, or research organization — Meterbolic helps you deliver preventative care earlier and generate real-world outcome data.",
};

const PARTNER_TYPES = [
  {
    icon: Stethoscope,
    title: 'Doctors & Clinics',
    body: 'Offer patients accessible at-home metabolic testing — detect risk early, not after diagnosis.',
  },
  {
    icon: Activity,
    title: 'Health coaches, PTs',
    body: 'Add outcome-grade data to your coaching — and introduce a new revenue stream.',
  },
  {
    icon: Briefcase,
    title: 'Corporate',
    body: 'Give staff private results — and give HR anonymised metabolic insights that show measurable impact.',
  },
  {
    icon: Watch,
    title: 'Wearables',
    body: 'Combine response testing with CGMs, trackers, or behaviour apps — complete metabolic picture.',
  },
  {
    icon: FlaskConical,
    title: 'Pharma & Insurers',
    body: 'Track real-world response to GLP-1s and metabolic interventions — not just theory.',
  },
] as const;

export default function PartnersPage() {
  return (
    <main className="min-h-screen" style={{ background: C.bg, color: C.fg }}>
      <Navbar />
      {/* Back to home */}
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
          For Partners
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
          Partner with <span style={{ color: C.primary }}>Meterbolic</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          Powering Prevention, Insight, and Outcomes — Together.
        </p>
      </section>

      {/* Intro */}
      <section className="px-5 sm:px-6 py-12 sm:py-16" style={{ background: C.bgDeep }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-extrabold mb-6 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Powering prevention, insight and outcomes — together.
          </h2>
          <div className="space-y-5 text-base sm:text-lg" style={{ color: C.muted }}>
            <p>
              Whether you&apos;re a doctor, clinic, health coach, PT, gym, corporate well-being provider, insurer, wearable tech company, pharma team, or research organization — Meterbolic enables you to deliver preventative care earlier, generate real-world outcome data, and create new value for the people you support.
            </p>
            <p>
              Our platform combines continuous glucose monitoring, advanced AI, and personalized coaching to help people understand and improve their metabolic health in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-extrabold mb-12 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Why partner with <span style={{ color: C.primary }}>Meterbolic?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARTNER_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.title}
                  className="rounded-2xl p-6"
                  style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                    style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: C.fg }}>{t.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{t.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2
              className="font-extrabold mb-4 leading-tight"
              style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(26px, 3.5vw, 34px)', textWrap: 'balance' }}
            >
              Not sure if your business fits?
            </h2>
            <p className="text-base sm:text-lg" style={{ color: C.muted }}>
              Just ask Meo. Our AI guide can help you identify whether Meterbolic fits your model — and which partnership type suits your goals.
            </p>
          </div>
          <div
            className="rounded-2xl p-7"
            style={{ background: C.bgCard, border: `1px solid ${C.primary}` }}
          >
            <h3 className="font-bold text-xl mb-3" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
              Ready to start?
            </h3>
            <p className="text-sm mb-5" style={{ color: C.muted }}>
              If you&apos;d like to set up a call or discuss partnership terms with one of our certified metabolic health specialists.
            </p>
            <a
              href="mailto:partner@meterbolic.com"
              className="inline-flex items-center gap-2 rounded-xl font-semibold px-5 py-3 text-sm transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              <Mail className="h-4 w-4" />
              partner@meterbolic.com
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
