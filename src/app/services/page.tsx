// ─────────────────────────────────────────────────────────────────────
// /services — Migrated from legacy diff/site/public_html/services.html.
// Original copy preserved verbatim. Legacy CSS, FontAwesome, Meta Pixel
// scripts and decorative SVG/PNG icons stripped — replaced with lucide
// icons in the master design system. Image references could be wired
// in later; for now the content (titles, descriptions) is what matters.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Apple,
  MessageCircle,
  FlaskConical,
  Pill,
  Moon,
  Microscope,
  Sparkles,
  Shield,
  Cpu,
} from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar } from '@/components/MarketingLandingPage';

export const metadata: Metadata = {
  title: 'Services — Meterbolic',
  description:
    'Comprehensive metabolic health solutions tailored to your needs. Continuous Glucose Monitoring, Personalized Nutrition, Health Coaching, Advanced Lab Analysis, Supplement Protocols, and Lifestyle Optimization.',
};

const SERVICES = [
  {
    icon: Activity,
    title: 'Continuous Glucose Monitoring',
    body: 'Real-time tracking of your glucose levels with professional interpretation and actionable insights.',
  },
  {
    icon: Apple,
    title: 'Personalized Nutrition',
    body: 'Custom meal plans designed to stabilize your blood sugar and optimize metabolic function.',
  },
  {
    icon: MessageCircle,
    title: 'Health Coaching',
    body: 'One-on-one guidance from certified metabolic health specialists.',
  },
  {
    icon: FlaskConical,
    title: 'Advanced Lab Analysis',
    body: 'Comprehensive interpretation of blood work with personalized recommendations.',
  },
  {
    icon: Pill,
    title: 'Supplement Protocols',
    body: 'Evidence-based supplement recommendations tailored to your metabolic profile.',
  },
  {
    icon: Moon,
    title: 'Lifestyle Optimization',
    body: 'Sleep, stress, and exercise plans to support metabolic health.',
  },
] as const;

const DIFFERENTIATORS = [
  {
    icon: Microscope,
    title: 'Science-Backed',
    body: 'Our recommendations are based on the latest metabolic research and clinical evidence.',
  },
  {
    icon: Sparkles,
    title: 'Personalized',
    body: 'No one-size-fits-all approaches. Your plan is tailored to your unique biology.',
  },
  {
    icon: Shield,
    title: 'Preventive Focus',
    body: 'We help prevent metabolic disorders before they develop into serious conditions.',
  },
  {
    icon: Cpu,
    title: 'Technology-Enabled',
    body: 'Our platform makes advanced metabolic health accessible and easy to understand.',
  },
] as const;

export default function ServicesPage() {
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
          What we offer
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
          Our <span style={{ color: C.primary }}>services</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          Comprehensive metabolic health solutions tailored to your needs.
        </p>
      </section>

      {/* Solutions grid */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-extrabold mb-3 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Metabolic health <span style={{ color: C.primary }}>solutions</span>
          </h2>
          <p className="text-center text-base mb-12 max-w-2xl mx-auto" style={{ color: C.muted }}>
            We offer a range of services to help you optimize your metabolic health.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
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
                  <h3 className="font-bold text-lg mb-2" style={{ color: C.fg }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-extrabold mb-12 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            What makes Meterbolic <span style={{ color: C.primary }}>different</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DIFFERENTIATORS.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.title}
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
                  <h3 className="font-bold text-base mb-2" style={{ color: C.fg }}>{d.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{d.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-6 py-20 text-center" style={{ background: C.bgDeep }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-extrabold mb-4 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
          >
            Ready to transform your <span style={{ color: C.primary }}>metabolic health?</span>
          </h2>
          <p className="text-base mb-8" style={{ color: C.muted }}>
            Get started with Meterbolic today and take control of your wellbeing.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            Begin your journey <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
