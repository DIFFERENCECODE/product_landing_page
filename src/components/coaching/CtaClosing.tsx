// ─── Coaching · Closing CTA ───────────────────────────────────────────
//
// Final section of the /coaching page. Primary button sends the reader
// to the programme cards (#pricing, same target as the Hero CTA); the
// secondary plain-text link opens an enquiry email. No checkout is wired
// for the coaching programmes yet, so the primary is an in-page anchor
// rather than a purchase route.
//
// Copy is fixed marketing-reviewed text — do not paraphrase.
// ──────────────────────────────────────────────────────────────────────
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { C } from '@/lib/design-tokens';

export default function CtaClosing() {
  return (
    <section className="px-5 sm:px-6 py-20 text-center" style={{ background: C.bgDeep }}>
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <Link
          href="#pricing"
          className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90"
          style={{ background: C.primary, color: C.primaryFg }}
        >
          Start your programme <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <a
          href="mailto:info@meterbolic.com?subject=Metabolic%20coaching%20enquiry"
          className="mt-4 text-sm hover:underline"
          style={{ color: C.muted }}
        >
          Questions first? Get in touch
        </a>
      </div>
    </section>
  );
}
