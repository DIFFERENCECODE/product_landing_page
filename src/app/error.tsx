// ─────────────────────────────────────────────────────────────────────
// Root error boundary — Migrated from legacy diff/site/public_html/
// error.html. Original: 5-second auto-redirect to / with countdown.
// Same behaviour, rebuilt in the master design system.
//
// Next.js convention: this file is the runtime error boundary for any
// rendering error that escapes a route's own boundary. The legacy
// site's /error route (a static destination) is therefore unnecessary
// — Next.js will route to this automatically when something throws.
// ─────────────────────────────────────────────────────────────────────
'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

const REDIRECT_SECONDS = 5;

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds === 0) window.location.href = '/';
  }, [seconds]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 text-center"
      style={{ background: C.bg, color: C.fg }}
    >
      <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.danger }}>
        Something went wrong
      </p>
      <h1
        className="font-extrabold mb-4 leading-tight"
        style={{
          color: C.fg,
          fontFamily: FONT_SERIF,
          fontSize: 'clamp(36px, 6vw, 56px)',
          textWrap: 'balance',
        }}
      >
        Try that <span style={{ color: C.primary }}>again</span>.
      </h1>
      <p className="text-base mb-8 max-w-md mx-auto" style={{ color: C.muted }}>
        We hit a temporary problem. Heading home in {seconds}s — or retry now.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl font-semibold px-8 py-3.5 text-base transition-opacity hover:opacity-90"
          style={{ background: C.primary, color: C.primaryFg }}
        >
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm hover:underline"
          style={{ color: C.muted }}
        >
          Return home <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </main>
  );
}
