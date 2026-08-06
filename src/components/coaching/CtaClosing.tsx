// ─── Coaching · Closing CTA ───────────────────────────────────────────
//
// Final section of the /eos page. No checkout is wired for the coaching
// programmes, so both actions here are live mailto links to the Eos
// programme inbox (see contact.ts) — the primary opens an enrolment
// email, the secondary a plain question. The primary used to be an
// in-page #pricing anchor, which read as a dead button.
//
// Copy is fixed marketing-reviewed text — do not paraphrase.
// ──────────────────────────────────────────────────────────────────────
import { Mail } from 'lucide-react';
import { C } from '@/lib/design-tokens';
import { ENQUIRY_EMAIL } from '@/components/coaching/contact';

const START_SUBJECT = encodeURIComponent('Metabolic coaching — starting a programme');
const START_BODY = encodeURIComponent(
  "Hi,\n\nI'd like to start a metabolic coaching programme. Please send me the next steps.\n\nThank you,\n",
);

export default function CtaClosing() {
  return (
    <section className="px-5 sm:px-6 py-20 text-center" style={{ background: C.bgDeep }}>
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <a
          href={`mailto:${ENQUIRY_EMAIL}?subject=${START_SUBJECT}&body=${START_BODY}`}
          aria-label="Email us to start your metabolic coaching programme"
          className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-10 py-4 text-base transition-opacity hover:opacity-90"
          style={{ background: C.primary, color: C.primaryFg }}
        >
          <Mail className="h-4 w-4 shrink-0" aria-hidden />
          Start your programme
        </a>
        <a
          href={`mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent('Metabolic coaching enquiry')}`}
          className="mt-4 text-sm hover:underline"
          style={{ color: C.muted }}
        >
          Questions first? Get in touch
        </a>
        <p className="mt-4 text-xs" style={{ color: C.muted }}>
          Both go straight to {ENQUIRY_EMAIL}.
        </p>
      </div>
    </section>
  );
}
