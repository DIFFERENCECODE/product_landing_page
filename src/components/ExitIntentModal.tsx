'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Mail, Check, X, ArrowRight, MessageSquare } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = 'meo_exit_intent_v1';
const SUBSCRIBED_KEY = 'meo_subscribed';
const ARM_DELAY_MS = 15_000;

export default function ExitIntentModal() {
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Subscribed users should never see this modal again.
    if (localStorage.getItem(SUBSCRIBED_KEY) === '1') return;
    if (sessionStorage.getItem(STORAGE_KEY) === 'shown') return;
    if (localStorage.getItem(STORAGE_KEY) === 'dismissed') return;
    const t = window.setTimeout(() => setArmed(true), ARM_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!armed) return;
    if (typeof window === 'undefined') return;

    const trigger = () => {
      sessionStorage.setItem(STORAGE_KEY, 'shown');
      setOpen(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = now - lastT;
      if (lastY > 600 && dy < -120 && dt < 250) trigger();
      lastY = window.scrollY;
      lastT = now;
    };

    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, [armed]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState('submitting');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, _hp: honeypot }),
      });
      if (!res.ok) throw new Error('failed');
      try {
        window.fbq?.('track', 'Lead', {
          content_name: 'newsletter',
          content_category: 'exit-intent',
        });
      } catch {
        /* ignore */
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

  const handleClose = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      /* private mode etc. */
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      onClick={handleClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm"
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl"
        style={{
          background: C.bgDeep,
          border: `1px solid ${C.border}`,
        }}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-70"
          style={{ background: 'rgba(255,255,255,0.08)', color: C.muted }}
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: C.pill, color: C.pillFg }}
        >
          <Mail className="h-3 w-3" />
          Wait — before you go
        </div>

        <h2
          id="exit-intent-title"
          className="font-extrabold mb-2 leading-tight"
          style={{
            color: C.fg,
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(22px, 3.4vw, 28px)',
          }}
        >
          Two things, on the house.
        </h2>
        <p className="text-sm mb-5" style={{ color: C.muted }}>
          Subscribers get instant access to:
        </p>

        {/* Lead magnet #1 — Free chapter with cover image */}
        <div
          className="flex gap-4 rounded-xl p-3 mb-3"
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
              Free extract — The Thin Book of Fat
            </p>
            <p className="text-xs mt-1 leading-snug" style={{ color: C.muted }}>
              By Marina Young. The chapter that reframes how you think about metabolic health.
            </p>
          </div>
        </div>

        {/* Lead magnet #2 — Ask Meo AI */}
        <div
          className="flex gap-4 rounded-xl p-3 mb-5"
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
            <p className="text-xs mt-1 leading-snug" style={{ color: C.muted }}>
              The world&apos;s only Metabolic Conversational AI. Plain-English answers, anytime.
            </p>
          </div>
        </div>

        {state === 'done' ? (
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ background: C.pill, color: C.pillFg }}
          >
            <Check className="h-4 w-4 flex-shrink-0" />
            Check your inbox — your free access is on its way.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
            <input
              type="text"
              autoFocus
              placeholder="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="given-name"
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
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
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: `1px solid ${C.border}`,
                color: C.fg,
              }}
            />
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
            <button
              type="button"
              onClick={handleClose}
              className="text-xs underline hover:opacity-70 mt-1 mx-auto"
              style={{ color: C.muted }}
            >
              No thanks, take me back
            </button>
          </form>
        )}

        {state === 'error' && (
          <p className="mt-3 text-xs" style={{ color: '#f87171' }}>
            Something went wrong — please try again.
          </p>
        )}
      </div>
    </div>
  );
}
