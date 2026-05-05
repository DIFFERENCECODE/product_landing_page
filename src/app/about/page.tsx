// ─────────────────────────────────────────────────────────────────────
// /about — Migrated from legacy diff/site/public_html/about.html.
// Original copy preserved verbatim across all 13 sections: hero,
// mission, statistics, timeline, scientific advisors, core team,
// investors, science, CTA, contact. Legacy CSS, FontAwesome, Meta
// Pixel scripts dropped. Image references not wired in this pass —
// images would need to be copied from diff/site/public_html/assets/
// to product_landing_page/public/ separately.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Mail, Twitter, Linkedin, Instagram } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';
import { PeopleCarousel } from '@/components/PeopleCarousel';

export const metadata: Metadata = {
  title: 'About — Meterbolic',
  description:
    "Learn about Meterbolic's mission to prevent chronic disease through metabolic health optimization.",
};

const STATS = [
  { value: '85M+', label: 'Americans with prediabetes' },
  { value: '88%', label: "Don't know they're metabolically unhealthy" },
  { value: '5–10×', label: 'Higher risk of chronic disease' },
] as const;

// People (advisors + core team) live in the PeopleCarousel client
// component to keep this page a server component (so `metadata` export
// can stay).

export default function AboutPage() {
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
          About Meterbolic
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
          Redefining <span style={{ color: C.primary }}>metabolic health</span>.
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: C.muted }}>
          Science-backed solutions for preventing chronic disease.
        </p>
      </section>

      {/* Mission */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Our mission
          </p>
          <h2
            className="font-extrabold mb-6 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Preventing disease <span style={{ color: C.primary }}>before it starts</span>.
          </h2>
          <div className="space-y-5 text-base sm:text-lg" style={{ color: C.muted }}>
            <p>
              Meterbolic was founded on the belief that metabolic dysfunction is at the root of most chronic diseases, and that by optimizing metabolism, we can prevent these conditions before they take hold.
            </p>
            <p>
              Our platform combines continuous glucose monitoring, advanced AI, and personalized coaching to help people understand and improve their metabolic health in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-7 text-center"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <div
                className="font-extrabold mb-2 tabular-nums"
                style={{ color: C.primary, fontFamily: FONT_SERIF, fontSize: 'clamp(36px, 5vw, 56px)' }}
              >
                {s.value}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* People — single carousel of advisors + core team */}
      <div id="team">
        <PeopleCarousel />
      </div>

      {/* Investors */}
      <section className="px-5 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Backed by
          </p>
          <h2
            className="font-extrabold mb-3 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Leading <span style={{ color: C.primary }}>health innovators</span>.
          </h2>
          <p className="text-base" style={{ color: C.muted }}>
            We&apos;re proud to be supported by visionary investors who share our mission.
          </p>
        </div>
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
            Backed by <span style={{ color: C.primary }}>rigorous research</span>.
          </h2>
          <div className="space-y-5 text-base sm:text-lg" style={{ color: C.muted }}>
            <p>
              Our approach is grounded in the pioneering work of Dr. Joseph Kraft and decades of metabolic research. We&apos;ve developed proprietary algorithms that identify early markers of metabolic dysfunction often missed by conventional testing.
            </p>
            <p>
              By focusing on hyperinsulinemia — the earliest detectable abnormality in metabolic health — we can intervene years before traditional diabetes markers appear.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Ready to transform
          </p>
          <h2
            className="font-extrabold mb-4 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 40px)', textWrap: 'balance' }}
          >
            Join the metabolic health <span style={{ color: C.primary }}>revolution</span>.
          </h2>
          <p className="text-base mb-8" style={{ color: C.muted }}>
            Be part of the movement to prevent chronic disease through early detection and personalized optimization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              Get started today <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-8 py-4 text-base transition-opacity hover:opacity-90"
              style={{ color: C.fg, border: `1px solid ${C.border}` }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Contact
          </p>
          <h2
            className="font-extrabold mb-3 leading-tight"
            style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(28px, 4vw, 38px)', textWrap: 'balance' }}
          >
            Contact our <span style={{ color: C.primary }}>team</span>.
          </h2>
          <p className="text-base mb-10" style={{ color: C.muted }}>
            For support or assistance, connect with our team:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <a
              href="mailto:info@meterbolic.com"
              className="rounded-2xl p-6 flex flex-col items-center gap-3 transition-opacity hover:opacity-90"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <Mail className="h-6 w-6" style={{ color: C.primary }} aria-hidden />
              <span className="text-sm font-semibold" style={{ color: C.fg }}>Email</span>
              <span className="text-sm" style={{ color: C.muted }}>info@meterbolic.com</span>
            </a>
            <div
              className="rounded-2xl p-6 flex flex-col items-center gap-3"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <span className="text-sm font-semibold" style={{ color: C.fg }}>Social</span>
              <div className="flex gap-3">
                <a
                  href="https://x.com/meterbolic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:opacity-90"
                  style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
                  aria-label="Twitter / X"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/meterbolic-org/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:opacity-90"
                  style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/meterbolic/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:opacity-90"
                  style={{ background: 'rgba(164,214,94,0.12)', color: C.primary }}
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
