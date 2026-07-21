// ─────────────────────────────────────────────────────────────────────
// /coaching — Metabolic coaching programme (Dr Arup Sen · Eos Longevity).
//
// Dedicated landing page for the coaching + at-home lipid monitoring
// programmes. Page structure (top to bottom):
//   1. Hero            ← built
//   2. How it works (3 steps)
//   3. Pricing tiers (2 cards)
//   4. Compliance panel
//   5. FAQ
//   6. CTA
// Sections 2–6 slot in between <Hero /> and <Footer /> as they're built.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import { C } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';
import Hero from '@/components/coaching/Hero';
import HowItWorks from '@/components/coaching/HowItWorks';
import Pricing from '@/components/coaching/Pricing';
import Compliance from '@/components/coaching/Compliance';
import Faq from '@/components/coaching/Faq';
import CtaClosing from '@/components/coaching/CtaClosing';

export const metadata: Metadata = {
  title: 'Metabolic coaching — Meo × Eos Longevity',
  description:
    "Meo's CE-marked at-home lipid testing system, paired with 1:1 wellness coaching from Dr Arup Sen, founder of Eos Longevity. Understand your metabolic trends and build habits that last. Limited launch pricing.",
};

export default function CoachingPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: C.bg, color: C.fg }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Pricing />
      <Compliance />
      <Faq />
      <CtaClosing />
      <Footer />
    </main>
  );
}
