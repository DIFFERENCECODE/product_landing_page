'use client';

// ─────────────────────────────────────────────────────────────────────
// KraftPricingCards — the two appointment-based KRAFT options.
//
// These were static cards with the fuller option permanently lit. That
// was wrong: the highlight read as a selection but never moved, so
// picking the £397 card left the £897 card still lit and the page
// showed two "chosen" states at once. The highlight now follows the
// selection — exactly one card is lit at any moment.
//
// Implemented as a real radiogroup: click or keyboard (arrows, Home/End,
// Space/Enter) moves the selection, and the CTA inside each card keeps
// working as an ordinary mailto link.
// ─────────────────────────────────────────────────────────────────────

import { useRef, useState } from 'react';
import { CalendarClock, Check, CheckCircle2 } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { MeoEnterpriseBonus } from '@/components/MeoEnterpriseBonus';
import { KRAFT_TIERS, enquiryMailto } from '@/lib/kitProducts';

// The card lit on first paint. `defaultSelected` on the tier record.
const INITIAL = KRAFT_TIERS.find((t) => t.defaultSelected)?.id ?? KRAFT_TIERS[0].id;

export function KraftPricingCards() {
  const [selected, setSelected] = useState<string>(INITIAL);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Roving tabindex: DOM focus must travel with the selection. Without
  // this, arrowing to the £397 card left focus on the £897 card, so the
  // next Tab landed on the wrong tier's "Enquire and book" button and
  // the change was never announced to a screen reader.
  const select = (id: string) => {
    setSelected(id);
    cardRefs.current[id]?.focus();
  };

  const move = (delta: number) => {
    const i = KRAFT_TIERS.findIndex((t) => t.id === selected);
    const next = (i + delta + KRAFT_TIERS.length) % KRAFT_TIERS.length;
    select(KRAFT_TIERS[next].id);
  };

  const onKeyDown = (e: React.KeyboardEvent, id: string) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        move(1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        move(-1);
        break;
      case 'Home':
        e.preventDefault();
        select(KRAFT_TIERS[0].id);
        break;
      case 'End':
        e.preventDefault();
        select(KRAFT_TIERS[KRAFT_TIERS.length - 1].id);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        select(id);
        break;
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="KRAFT Test options"
      className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch"
    >
      {KRAFT_TIERS.map((t) => {
        const isSelected = selected === t.id;
        return (
          <div
            key={t.id}
            ref={(el) => {
              cardRefs.current[t.id] = el;
            }}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => select(t.id)}
            onKeyDown={(e) => onKeyDown(e, t.id)}
            className="relative rounded-2xl p-7 flex flex-col cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4d65e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c4a40]"
            style={{
              background: isSelected ? C.bgCardHover : C.bgCard,
              border: `1px solid ${isSelected ? 'rgba(164,214,94,0.45)' : C.border}`,
            }}
          >
            {/* Selection mark — makes it legible that the lit border is a
                choice the visitor made, not a "recommended" badge. */}
            {isSelected && (
              <CheckCircle2
                className="absolute top-5 right-5 h-5 w-5"
                style={{ color: C.primary }}
                aria-hidden
              />
            )}

            <span
              className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide mb-4"
              style={{ background: C.pill, color: C.pillFg }}
            >
              <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              By appointment
            </span>

            <h3 className="font-bold text-xl mb-1" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
              {t.name}
            </h3>
            <p className="text-sm mb-5" style={{ color: C.muted }}>
              {t.duration}
            </p>

            <div className="mb-4">
              <span className="text-4xl font-extrabold" style={{ color: C.fg }}>
                {t.price}
              </span>
            </div>

            <p className="text-sm italic leading-relaxed mb-6" style={{ color: C.muted }}>
              {t.tagline}
            </p>

            {/* The complimentary Meo Enterprise offer, identical to the
                one on the Eos coaching cards. */}
            <div className="mb-6">
              <MeoEnterpriseBonus />
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {t.includes.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: C.primary }} aria-hidden />
                  <span className="text-sm leading-relaxed" style={{ color: C.fg }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={enquiryMailto(t.enquirySubject)}
              onClick={(e) => e.stopPropagation()}
              className="w-full inline-flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                background: isSelected ? C.primary : 'transparent',
                color: isSelected ? C.primaryFg : C.primary,
                border: isSelected ? 'none' : `1px solid ${C.primary}`,
              }}
            >
              Enquire and book
            </a>
          </div>
        );
      })}
    </div>
  );
}
