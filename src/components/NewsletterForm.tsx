'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Mail, ArrowRight, Check, MessageSquare } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const SUBSCRIBED_KEY = 'meo_subscribed';

export function NewsletterSection() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  // Detect returning subscriber on mount (client-only — localStorage isn't available during SSR).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem(SUBSCRIBED_KEY) === '1') setAlreadySubscribed(true);
    } catch {
      /* private mode */
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState('submitting');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: [firstName, lastName].filter(Boolean).join(' '), _hp: honeypot }),
      });
      if (!res.ok) throw new Error('Failed');
      try {
        window.fbq?.('track', 'Lead', {
          content_name: 'newsletter',
          content_category: 'inline-section',
        });
      } catch {
        /* ignore tracking failures */
      }
      try {
        localStorage.setItem(SUBSCRIBED_KEY, '1');
      } catch {
        /* ignore */
      }
      setState('done');
    } catch {
      setState('error');
    }
  };

  // Returning subscriber — show a compact thank-you state, hide the rest.
  if (alreadySubscribed) {
    return (
      <section
        id="newsletter"
        className="py-6 sm:py-8 px-5 sm:px-6"
        style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}` }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-3 text-sm" style={{ color: C.muted }}>
          <Check className="h-4 w-4 flex-shrink-0" style={{ color: C.primary }} />
          <span>You&apos;re subscribed — thanks for being on the list.</span>
        </div>
      </section>
    );
  }

  return (
    <section
      id="newsletter"
      className="py-14 sm:py-20 px-5 sm:px-6"
      style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}` }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
          style={{ background: C.pill, color: C.pillFg }}
        >
          <Mail className="h-3.5 w-3.5" />
          Free for subscribers
        </div>
        <h2
          className="font-extrabold mb-4 leading-tight"
          style={{
            color: C.fg,
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(32px, 5.2vw, 52px)',
            textWrap: 'balance',
          }}
        >
          Free trial access to the world&apos;s first{' '}
          <span style={{ color: C.primary }}>Metabolic Conversational AI</span>.
        </h2>
        <p
          className="font-semibold mb-3 max-w-2xl mx-auto leading-snug"
          style={{ color: C.fg, fontSize: 'clamp(18px, 2.4vw, 22px)' }}
        >
          Talk to Meo — plain-English answers about your metabolic health, on demand.
        </p>
        <p className="text-base mb-2 max-w-xl mx-auto" style={{ color: C.muted }}>
          Plus the opening chapter of <em>The Thin Book of Fat</em> by Marina Young — free.
        </p>
        <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: C.muted }}>
          Join the Meo newsletter. No spam, ever.
        </p>

        {/* Lead magnets — branded cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto text-left">
          <div
            className="flex gap-4 rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}` }}
          >
            <div
              className="relative flex-shrink-0 w-16 h-[88px] rounded-md overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <Image
                src="/ebook-cover.jpg"
                alt="The Thin Book of Fat — Marina Young"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight" style={{ color: C.fg }}>
                Free extract
              </p>
              <p className="text-xs mt-0.5 font-semibold" style={{ color: C.primary }}>
                The Thin Book of Fat
              </p>
              <p className="text-xs mt-1 leading-snug" style={{ color: C.muted }}>
                By Marina Young — the chapter that reframes metabolic health.
              </p>
            </div>
          </div>

          <div
            className="flex gap-4 rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}` }}
          >
            <div
              className="flex-shrink-0 w-16 h-[88px] rounded-md flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${C.primary}26, ${C.primary}0a)`,
                border: `1px solid ${C.primary}33`,
              }}
            >
              <MessageSquare className="h-7 w-7" style={{ color: C.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight" style={{ color: C.fg }}>
                Ask Meo AI anything
              </p>
              <p className="text-xs mt-0.5 font-semibold" style={{ color: C.primary }}>
                Conversational AI
              </p>
              <p className="text-xs mt-1 leading-snug" style={{ color: C.muted }}>
                The world&apos;s only Metabolic Conversational AI — plain-English answers.
              </p>
            </div>
          </div>
        </div>

        {state === 'done' ? (
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <Check className="h-4 w-4" /> Check your inbox — your free access is on its way.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 max-w-md mx-auto"
          >
            <input
              type="text"
              name="_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                className="rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid ${C.border}`,
                  color: C.fg,
                }}
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                className="rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid ${C.border}`,
                  color: C.fg,
                }}
              />
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="sm:col-span-2 rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: `1px solid ${C.border}`,
                  color: C.fg,
                }}
              />
            </div>
            <button
              type="submit"
              disabled={state === 'submitting'}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: C.primary, color: C.primaryFg }}
            >
              {state === 'submitting' ? (
                'Sending…'
              ) : (
                <>
                  Get free access <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
        {state === 'error' && (
          <p className="mt-3 text-sm" style={{ color: '#f87171' }}>
            Something went wrong — please try again.
          </p>
        )}
      </div>
    </section>
  );
}
