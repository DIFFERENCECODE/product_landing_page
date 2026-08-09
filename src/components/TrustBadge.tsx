// ─────────────────────────────────────────────────────────────────────
// TrustBadge — the one entry point to /trust, reused everywhere.
//
// Same construction as components/coaching/TrustStrip and the /checkout
// trust strip: single card surface, C-palette tokens, lucide icon in
// C.primary, no new colours.
//
// Two variants, because the two audiences form their decision in
// different places:
//
//   'strip'  — one compact line. Goes where someone is about to hand
//              over data or money (/checkout, /quiz) and at the foot of
//              the affiliate funnel. Must not compete with the CTA.
//   'panel'  — a card with the ICO reference spelled out and a direct
//              link to the certificate PDF. Goes where a partner or
//              clinician is deciding whether to put their name to us
//              (/partners, /eos).
//
// Every claim rendered here is stated in full on /trust and evidenced by
// the certificate in src/lib/trust.ts. Do NOT add a claim to this badge
// that /trust does not make — a badge is the worst place to introduce an
// unsourced assertion, because it appears on many pages at once.
// ─────────────────────────────────────────────────────────────────────
import Link from 'next/link';
import { ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { C } from '@/lib/design-tokens';
import { ICO } from '@/lib/trust';

interface Props {
  variant?: 'strip' | 'panel';
  /** Tunes the one line of framing copy. Facts are identical. */
  audience?: 'user' | 'partner';
  className?: string;
}

const LEDE: Record<'user' | 'partner', string> = {
  user:
    'Your health data is special-category data under UK GDPR, and we treat it that way.',
  partner:
    'When you put your name to Meterbolic, you are putting it to a registered data controller.',
};

export default function TrustBadge({
  variant = 'strip',
  audience = 'user',
  className = '',
}: Props) {
  if (variant === 'strip') {
    return (
      <Link
        href="/trust"
        className={`group flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-2xl px-4 sm:px-5 py-3.5 text-sm transition-colors ${className}`}
        style={{ background: C.bgCard, border: `1px solid ${C.border}`, color: C.fg }}
      >
        <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: C.primary }} aria-hidden />
        <span className="leading-snug">
          ICO-registered data controller ·{' '}
          <span style={{ color: C.pillFg }}>{ICO.reference}</span>
        </span>
        <span
          className="inline-flex items-center gap-1 leading-snug group-hover:underline"
          style={{ color: C.muted }}
        >
          How we protect your data
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </Link>
    );
  }

  return (
    <div
      className={`rounded-2xl p-6 sm:p-7 ${className}`}
      style={{ background: C.bgCard, border: `1px solid ${C.primary}` }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: C.pill }}
          aria-hidden
        >
          <ShieldCheck className="h-5 w-5" style={{ color: C.primary }} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold mb-1.5" style={{ color: C.fg }}>
            ICO-registered data controller
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: C.muted }}>
            {/* NOTE: {' '} after an expression is REQUIRED when the text that
                follows wraps onto another line — JSX trims the leading space
                of a multi-line text node and you get "Ltdis registered". */}
            {LEDE[audience]} {ICO.controller}{' '}
            is registered with the UK Information Commissioner&rsquo;s Office
            under reference{' '}
            <span style={{ color: C.pillFg }}>{ICO.reference}</span>. You do not
            have to take our word for it — read the certificate, or look us up on
            the ICO&rsquo;s own register.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <a
              href={ICO.certificatePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl font-semibold px-4 py-2.5 transition-opacity hover:opacity-90"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              <FileText className="h-4 w-4" aria-hidden />
              View certificate (PDF)
            </a>
            <Link
              href="/trust"
              className="inline-flex items-center gap-1.5 hover:underline"
              style={{ color: C.fg }}
            >
              Trust &amp; data protection
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
