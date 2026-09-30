// ─────────────────────────────────────────────────────────────────────
// MeoEnterpriseBonus — the "complimentary 3 months of Meo Enterprise"
// flash that rides along with every appointment-based programme.
//
// One component, used by both surfaces so the offer looks identical
// wherever it appears:
//   • /kraft-test        — KRAFT Test and KRAFT Test + Coaching cards
//   • /coaching          — the Eos Longevity programme cards
//
// Design notes: built entirely from existing design tokens, so it
// inherits the site palette rather than introducing a second accent.
// The gift mark is a lucide icon in a primary-tinted rounded square —
// the same icon-chip pattern used across /services, /kraft-test and the
// homepage feature grids — rather than a literal emoji, which would be
// the only emoji on the site and would read as a different typeface.
//
// `variant`:
//   'card'   — full-width block that sits inside a pricing card
//   'inline' — single compact line, for tighter contexts
// ─────────────────────────────────────────────────────────────────────
import { Gift } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

/** Months of complimentary Meo Enterprise included with every programme. */
export const MEO_ENTERPRISE_MONTHS = 3;

const HEADLINE = `${MEO_ENTERPRISE_MONTHS} months of Meo Enterprise`;

export function MeoEnterpriseBonus({ variant = 'card' }: { variant?: 'card' | 'inline' }) {
  if (variant === 'inline') {
    return (
      <span
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{ background: C.pill, color: C.pillFg, border: `1px solid ${C.primary}40` }}
      >
        <Gift className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Includes {HEADLINE}, free — the professionally-supported tier
      </span>
    );
  }

  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3.5"
      style={{
        // Soft primary wash so the block lifts off the card without
        // competing with the price or the CTA button.
        background:
          'linear-gradient(135deg, rgba(164,214,94,0.16) 0%, rgba(164,214,94,0.06) 100%)',
        border: `1px dashed ${C.primary}66`,
      }}
    >
      <div
        className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
        style={{ background: 'rgba(164,214,94,0.20)', color: C.primary }}
        aria-hidden
      >
        <Gift className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p
          className="text-[11px] font-semibold tracking-wide uppercase mb-1"
          style={{ color: C.pillFg }}
        >
          Included, complimentary
        </p>
        <p
          className="font-bold text-base leading-snug mb-1"
          style={{ color: C.fg, fontFamily: FONT_SERIF }}
        >
          {HEADLINE}
        </p>
        {/* No "for the length of your programme" — the Eos Continuum
            programme runs six months, so that clause contradicted the
            three months this actually grants. */}
        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
          The Meo tier for working alongside a professional — a clinician, practitioner or coach —
          which is exactly how a coached programme runs. Full access to the Meo AI platform:
          plain-English interpretation of every reading, trend tracking, and your Biological Age
          Score.
        </p>
      </div>
    </div>
  );
}
