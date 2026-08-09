// ─────────────────────────────────────────────────────────────────────
// The metabolic coaching programme page (Dr Arup Sen · EoS Longevity).
//
// Rendered at TWO routes, deliberately:
//
//   • /coaching — canonical. The durable, category-level URL, and the
//     document that OWNS the programme prices (lib/programmes.ts is
//     where the numbers live; this page is where they are published).
//   • /eos      — partner-brand alias. Same page, rel=canonical points
//     at /coaching.
//
// Neither path redirects to the other, and that is load-bearing rather
// than lazy. A permanent 308 /coaching → /eos shipped on 2026-08-06 and
// is cached in browsers; reversing it to /eos → /coaching would leave
// those clients ping-ponging between the two until the cache expired —
// the "retrying but never coming up" failure. Serving both and
// canonicalising one is the only loop-free way to get /coaching back.
//
// Also shared here (not duplicated per route): the page's section
// order. The section components live in components/coaching/.
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
//   9. Data protection
//  10. Closing CTA
// ─────────────────────────────────────────────────────────────────────
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
import {
  EOS_PROGRAMMES,
  formatProgrammePrice,
  EOS_PRINCIPAL,
} from '@/lib/programmes';

/**
 * Shared page metadata. Both routes spread this and set their own
 * canonical — /coaching to itself, /eos to /coaching.
 *
 * The price range in the description is read from the programme SSOT so
 * a repricing cannot leave a stale figure in a search-results snippet.
 */
export const COACHING_METADATA = {
  title: 'Metabolic coaching — Meo × EoS',
  description:
    `Meo's CE-marked at-home lipid testing system, paired with 1:1 wellness ` +
    `coaching from ${EOS_PRINCIPAL}, founder of EoS Longevity. Understand your ` +
    `metabolic trends and build habits that last. Introductory programmes from ` +
    `${formatProgrammePrice(EOS_PROGRAMMES[0])}.`,
} as const;

export default function CoachingProgrammePage() {
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
          closing CTA: this page asks for a four-figure commitment and a
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
