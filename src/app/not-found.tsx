// ─────────────────────────────────────────────────────────────────────
// 404 — Migrated from legacy diff/site/public_html/404.html.
// Original behaviour: 3-second auto-redirect to /, with a countdown
// and an Escape-key shortcut. Same behaviour preserved here, rebuilt
// in the master design system (C palette + Bricolage type + brand
// trust voice). No legacy CSS, no Meta Pixel — those live in the
// site-wide layout where appropriate.
// ─────────────────────────────────────────────────────────────────────
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

const REDIRECT_SECONDS = 3;

export default function NotFound() {
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.location.href = '/';
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearInterval(t);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (seconds === 0) window.location.href = '/';
  }, [seconds]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 text-center"
      style={{ background: C.bg, color: C.fg }}
    >
      <p className="text-xs font-semibold tracking-wide mb-4" style={{ color: C.pillFg }}>
        404
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
        That page <span style={{ color: C.primary }}>doesn&apos;t exist</span>.
      </h1>
      <p className="text-base mb-8 max-w-md mx-auto" style={{ color: C.muted }}>
        The link might be old or mistyped. Heading you back home in {seconds}s.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-8 py-3.5 text-base transition-opacity hover:opacity-90"
        style={{ background: C.primary, color: C.primaryFg }}
      >
        Return home now <ArrowRight className="h-4 w-4" />
      </Link>
      <p className="text-xs mt-5" style={{ color: C.muted }}>
        Press Esc to skip the wait.
      </p>
    </main>
  );
}
