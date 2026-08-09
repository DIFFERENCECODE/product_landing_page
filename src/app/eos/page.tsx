// ─────────────────────────────────────────────────────────────────────
// /eos — Metabolic coaching programme (Dr Arup Sen · EoS Longevity).
//
// Was /coaching until 2026-08-06; next.config.mjs holds a permanent
// redirect from the old path so anything already shared keeps working.
// The section components still live in components/coaching/.
//
// Page structure (top to bottom):
//   1. Hero
//   2. Your coach — portrait + credentials
//   3. Trust strip
//   4. How it works (3 steps)
//   5. What arrives with your programme — the Meo kit, unpacked
//   6. Pricing tiers (2 cards, live email enquiry)
//   7. Compliance panel
//   8. FAQ
//   9. Closing CTA
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import { C } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';
import Hero from '@/components/coaching/Hero';
import Coach from '@/components/coaching/Coach';
import TrustStrip from '@/components/coaching/TrustStrip';
import HowItWorks from '@/components/coaching/HowItWorks';
import WhatsIncluded from '@/components/coaching/WhatsIncluded';
import Pricing from '@/components/coaching/Pricing';
import Compliance from '@/components/coaching/Compliance';
import Faq from '@/components/coaching/Faq';
import CtaClosing from '@/components/coaching/CtaClosing';
import TrustBadge from '@/components/TrustBadge';

export const metadata: Metadata = {
  title: 'Metabolic coaching — Meo × EoS',
  description:
    "Meo's CE-marked at-home lipid testing system, paired with 1:1 wellness coaching from Dr Arup Sen, founder of EoS Longevity. Understand your metabolic trends and build habits that last. Limited launch pricing.",
  alternates: { canonical: '/eos' },
};

export default function EosCoachingPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: C.bg, color: C.fg }}>
      <Navbar />
      <Hero />
      <Coach />
      <TrustStrip />
      <HowItWorks />
      <WhatsIncluded />
      <Pricing />
      <Compliance />
      <Faq />
      {/* Data protection sits directly after the FAQ and before the
          closing CTA: this page asks for a £850–£1,450 commitment and a
          clinician's involvement, so "what happens to my data" is a
          live objection at exactly this point in the page. */}
      <section className="px-5 sm:px-6 pb-4">
        <div className="max-w-3xl mx-auto">
          <TrustBadge variant="panel" audience="user" />
        </div>
      </section>
      <CtaClosing />
      <Footer />
    </main>
  );
}
