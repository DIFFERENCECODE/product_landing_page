'use client';

// ─────────────────────────────────────────────────────────────────────
// KraftTestEnquiry — lead capture for the legacy KRAFT Test (SCRUM-18).
//
// The KRAFT Test has no published price and no fulfilment path yet
// (blocked on Eric's pricing/shipping decisions), so the product page
// cannot show a buy button. This form is the interim CTA: it posts to
// the existing /api/waitlist route, which pushes the lead into
// GoHighLevel tagged `waitlist:kraft-test` so enquiries land in the
// same unified inbox as every other lead.
//
// Mirrors the submit/succeed/error states of NewsletterForm so the two
// forms feel identical to a visitor moving between pages.
// ─────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { KRAFT_TEST } from '@/lib/kitProducts';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function KraftTestEnquiry() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState('submitting');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: KRAFT_TEST.leadSource }),
      });
      if (!res.ok) throw new Error('Failed');
      try {
        window.fbq?.('track', 'Lead', {
          content_name: 'kraft-test',
          content_category: 'product-enquiry',
        });
      } catch {
        /* ignore tracking failures */
      }
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <section id="enquire" className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
      <div
        className="max-w-2xl mx-auto rounded-2xl p-7 sm:p-10 text-center"
        style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
      >
        <h2
          className="font-extrabold mb-3 leading-tight"
          style={{ color: C.fg, fontFamily: FONT_SERIF, fontSize: 'clamp(26px, 4vw, 38px)' }}
        >
          Request the <span style={{ color: C.primary }}>KRAFT Test</span>
        </h2>
        <p className="text-sm sm:text-base mb-7" style={{ color: C.muted }}>
          The KRAFT Test is arranged directly with our team rather than bought off the shelf —
          we confirm the right channel for you (certified clinic or home kit), your location,
          and current availability. Leave your email and we&apos;ll come back with pricing and
          the next available slot.
        </p>

        {state === 'done' ? (
          <div className="flex items-center justify-center gap-3 text-sm" style={{ color: C.fg }}>
            <Check className="h-5 w-5 flex-shrink-0" style={{ color: C.primary }} />
            <span>
              Thanks — you&apos;re on the list. We&apos;ll email you with KRAFT Test pricing and
              availability.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="kraft-email" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
                style={{ color: C.muted }}
                aria-hidden
              />
              <input
                id="kraft-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2"
                style={{
                  background: 'rgba(0,0,0,0.20)',
                  color: C.fg,
                  border: `1px solid ${C.borderInteractive}`,
                }}
              />
            </div>
            <button
              type="submit"
              disabled={state === 'submitting'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              {state === 'submitting' ? 'Sending…' : 'Request details'}
              {state !== 'submitting' && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        )}

        {state === 'error' && (
          <p className="mt-4 text-sm" style={{ color: C.danger }}>
            Something went wrong. Please try again, or email{' '}
            <a href="mailto:hello@meterbolic.com" className="underline">
              hello@meterbolic.com
            </a>
            .
          </p>
        )}

        <p className="mt-6 text-xs leading-relaxed" style={{ color: C.muted }}>
          Prefer to talk it through? <a href="/book-a-call" className="underline">Book a call</a> or
          email <a href="mailto:hello@meterbolic.com" className="underline">hello@meterbolic.com</a>.
        </p>
      </div>
    </section>
  );
}
