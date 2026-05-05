// ─────────────────────────────────────────────────────────────────────
// /how-it-works — Migrated from legacy diff/site/public_html/how-it-
// works.html. Original copy preserved verbatim. Legacy CSS, FontAwesome,
// Meta Pixel scripts, and decorative SVG/PNG icons stripped — replaced
// with lucide icons. Image references intentionally not wired in this
// pass (assets live in diff/site/public_html/assets/ and would need
// to be copied into product_landing_page/public/ separately).
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Sparkles,
  TrendingUp,
  Microscope,
  ClipboardList,
  Brain,
  RefreshCw,
  Quote,
} from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';

export const metadata: Metadata = {
  title: 'How it works — Meterbolic',
  description:
    'Discover our science-backed approach to preventing chronic disease. Continuous glucose monitoring + advanced AI for real-time insights into how your body responds to food, exercise, sleep and stress.',
};

const TECH = [
  {
    icon: Eye,
    title: 'Advanced Pattern Recognition',
    body:
      'Our algorithms detect subtle metabolic patterns humans often miss, identifying your unique responses to different foods and activities.',
  },
  {
    icon: Sparkles,
    title: 'Hyper-Personalization',
    body:
      'We go beyond generic advice to provide recommendations tailored to your biology, lifestyle, and goals.',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Analytics',
    body:
      'Our system forecasts how different choices will likely affect your metabolic health before you make them.',
  },
  {
    icon: Microscope,
    title: 'Research-Backed',
    body:
      'Every recommendation is grounded in the latest peer-reviewed metabolic science from leading institutions.',
  },
] as const;

const STEPS = [
  {
    icon: ClipboardList,
    n: 1,
    title: 'Comprehensive Assessment',
    items: [
      'Detailed health questionnaire covering medical history, lifestyle, and goals',
      'Integration with wearables (Apple Health, Fitbit, Oura, etc.)',
      'Optional lab work analysis (HbA1c, lipid panel, etc.)',
      'Baseline metabolic health score calculation',
    ],
  },
  {
    icon: Brain,
    n: 2,
    title: 'Personalized Plan Creation',
    items: [
      'AI analysis of 100+ metabolic markers',
      'Custom nutrition recommendations tailored to your glucose responses',
      'Personalized exercise and activity guidance',
      'Sleep and stress optimization strategies',
      'Optional continuous glucose monitoring integration',
    ],
  },
  {
    icon: RefreshCw,
    n: 3,
    title: 'Continuous Optimization',
    items: [
      'Real-time feedback on your metabolic responses',
      'Weekly check-ins with your health coach',
      'Monthly comprehensive progress reports',
      'Ongoing plan adjustments based on your data',
      'Access to latest metabolic research updates',
    ],
  },
] as const;

const RESULTS = [
  { value: '2.3%', label: 'Average reduction in HbA1c levels' },
  { value: '87%', label: 'Of users improve key metabolic markers' },
  { value: '3.6×', label: 'More effective than standard approaches' },
  { value: '94%', label: 'User satisfaction rating' },
] as const;

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    quote:
      "Meterbolic helped me understand how different foods affect my energy levels. I've lost 25 pounds and reversed my prediabetes in just 4 months.",
  },
  {
    name: 'Michael T.',
    quote:
      "As a busy executive, I needed solutions that fit my lifestyle. Meterbolic's personalized approach gave me back control of my health without drastic changes.",
  },
  {
    name: 'Priya M.',
    quote:
      'After years of struggling with energy crashes, Meterbolic identified the specific foods causing my glucose spikes. Life-changing insights!',
  },
] as const;

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen" style={{ background: C.bg, color: C.fg }}>
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
          How it works
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
          Your metabolic health, <span style={{ color: C.primary }}>optimized</span>.
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          Discover our science-backed approach to preventing chronic disease.
        </p>
      </section>

      {/* Science */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            The science
          </p>
          <h2
            className="font-extrabold mb-6 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            How metabolic optimization <span style={{ color: C.primary }}>works</span>.
          </h2>
          <div className="space-y-5 text-base sm:text-lg" style={{ color: C.muted }}>
            <p>
              Meterbolic combines continuous glucose monitoring with advanced AI to provide real-time insights into how your body responds to food, exercise, sleep and stress. Our platform identifies your unique metabolic patterns and provides personalized recommendations to optimize your health.
            </p>
            <p>
              Unlike traditional one-size-fits-all approaches, we create a customized plan based on your individual biology and lifestyle. Our methods are grounded in the latest peer-reviewed research from leading metabolic scientists.
            </p>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            Our technology
          </p>
          <h2
            className="font-extrabold mb-3 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Cutting-edge metabolic <span style={{ color: C.primary }}>AI</span>.
          </h2>
          <p className="text-center text-base mb-12 max-w-2xl mx-auto" style={{ color: C.muted }}>
            Meterbolic&apos;s proprietary platform combines the latest metabolic research with machine learning to deliver insights no other system can provide.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TECH.map((t) => {
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

      {/* Process — 3 steps */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            Our process
          </p>
          <h2
            className="font-extrabold mb-3 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Simple yet <span style={{ color: C.primary }}>powerful</span>.
          </h2>
          <p className="text-center text-base mb-12" style={{ color: C.muted }}>
            Three steps to better metabolic health.
          </p>
          <div className="space-y-5">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className="rounded-2xl p-7"
                  style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
                >
                  <div className="flex items-center gap-4 mb-5">
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
                  <ul className="space-y-2 pl-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm" style={{ color: C.muted }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.primary }} aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            Proven results
          </p>
          <h2
            className="font-extrabold mb-3 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Real people, real <span style={{ color: C.primary }}>transformations</span>.
          </h2>
          <p className="text-center text-base mb-12" style={{ color: C.muted }}>
            The measurable impact of metabolic optimization.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {RESULTS.map((r) => (
              <div
                key={r.label}
                className="rounded-2xl p-6 text-center"
                style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
              >
                <div
                  className="font-extrabold mb-2 tabular-nums"
                  style={{ color: C.primary, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 44px)' }}
                >
                  {r.value}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
            Success stories
          </p>
          <h2
            className="font-extrabold mb-3 text-center leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Hear from our <span style={{ color: C.primary }}>community</span>.
          </h2>
          <p className="text-center text-base mb-12" style={{ color: C.muted }}>
            What members say about their experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl p-6 flex flex-col"
                style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
              >
                <Quote className="h-5 w-5 mb-3" style={{ color: C.primary }} aria-hidden />
                <p className="text-sm italic mb-4 flex-1" style={{ color: C.fg }}>{t.quote}</p>
                <p className="text-xs font-semibold" style={{ color: C.pillFg }}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-extrabold mb-4 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
          >
            Ready to transform your <span style={{ color: C.primary }}>metabolic health?</span>
          </h2>
          <p className="text-base mb-8" style={{ color: C.muted }}>
            Join thousands who&apos;ve taken control of their health with our science-backed approach.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            Start your journey today <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
