// ─────────────────────────────────────────────────────────────────────
// /services — what's actually included in a Meo Starter purchase.
// Replaces the previous content (migrated from diff/site) which sold
// 6 generic metabolic-health services that don't correspond to the
// £149 storefront product. Visitors clicking "Services" in the nav
// now see the concrete deliverables that ship with their order.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Brain,
  BookOpen,
  BarChart2,
  RefreshCw,
  Heart,
} from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';

export const metadata: Metadata = {
  title: "What's included",
  description:
    "Every Meo Starter ships with the lipid meter, six months of Meo AI access, the action manual, your Biological Age Score, a free retest at month six, and a 30-day money-back guarantee.",
};

const INCLUDED = [
  {
    icon: Activity,
    title: 'Digital Lipid Meter',
    body:
      'Lab-grade at-home meter cleared for Home Use in the UK & EU. Reads Total Cholesterol, HDL, LDL, Triglycerides, the TC/HDL ratio, and a Kraft-style insulin response from a single finger-prick. Ships with 20 strips, lancets, and a carry case.',
  },
  {
    icon: Brain,
    title: '6 months of Meo AI',
    body:
      'Plain-English interpretation of every reading. Compares to your own baseline, surfaces patterns across sleep / diet / travel logs, flags drift before it becomes a trend. The piece that turns numbers into next steps.',
  },
  {
    icon: BookOpen,
    title: 'The Thin Book of Fat (digital)',
    body:
      "Marina Young's action manual — the source Meo AI references when it talks to you. Ask the author your questions directly through Meo; answers come back in chat. Yours to keep.",
  },
  {
    icon: BarChart2,
    title: 'Biological Age Score + Target',
    body:
      "Calculated from your fasting lipid panel + your age, sex, weight, height and waist. Also surfaces a Kraft Deep Fat Score in kg. Both update with every reading; your Target Score is set alongside so the direction of travel is always visible.",
  },
  {
    icon: RefreshCw,
    title: 'Free retest at month 6',
    body:
      'A second fasting reading at month six to measure progress against your baseline. Personalised report with findings and lifestyle recommendations.',
  },
  {
    icon: Heart,
    title: '30-day money-back guarantee',
    body:
      "Use Meo for 30 days. If the system isn't for you, send the device back for a full refund on the device, no questions asked. Statutory rights within 14 days are unaffected by this voluntary guarantee.",
  },
] as const;

export default function ServicesPage() {
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
          What you get for £149
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
          Everything in the <span style={{ color: C.primary }}>Meo Starter</span>.
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          One bundle, one price. The hardware, the AI, the action manual, and the score — six months of weekly metabolic visibility.
        </p>
      </section>

      {/* Six included items */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INCLUDED.map((it) => {
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
                  <h2 className="font-bold text-lg mb-3" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
                    {it.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                    {it.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-6 py-20">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <h2
            className="font-extrabold mb-4 leading-tight text-center w-full"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
          >
            Six months. <span style={{ color: C.primary }}>One bundle</span>.
          </h2>
          <p className="text-base mb-8 text-center w-full" style={{ color: C.muted }}>
            See the trend, not just the number.
          </p>
          <div className="w-full flex flex-col items-center justify-center gap-3">
            <Link
              href="/checkout"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4d65e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c4a40]"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Get Meo · £149 <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs" style={{ color: C.muted, opacity: 0.75 }}>
              30-day money-back · Free returns
            </p>
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
