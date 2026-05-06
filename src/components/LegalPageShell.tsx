// ─────────────────────────────────────────────────────────────────────
// LegalPageShell — shared wrapper for /privacy, /terms, /cookies.
// Gives each legal page the same chrome (Navbar + Footer), tighter
// typography than the global heading scale (legal copy needs density,
// not heroic h1s), and the master C palette so the pages stop feeling
// like a different site.
//
// Body text: 14px (text-sm) leading-relaxed.
// h1: clamp(28px, 3.5vw, 36px) — far below the global h1's 60px max.
// h2 helper: 16px semibold — replaces the global h2 scale entirely
// inside this shell.
// ─────────────────────────────────────────────────────────────────────
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';

export function LegalPageShell({
  eyebrow,
  title,
  lastUpdated,
  children,
}: {
  eyebrow?: string;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: C.bg, color: C.fg }}>
      <Navbar />
      <article
        className="flex-1 max-w-3xl w-full mx-auto px-5 sm:px-6 pt-32 pb-20 text-sm leading-relaxed"
        style={{ color: C.muted }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 hover:underline mb-8 text-xs"
          style={{ color: C.muted }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Meo
        </Link>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            {eyebrow}
          </p>
        )}
        <h1
          className="font-extrabold mb-3 leading-tight"
          style={{
            color: C.fg,
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(28px, 3.5vw, 36px)',
            textWrap: 'balance',
          }}
        >
          {title}
        </h1>
        <p className="text-xs mb-10" style={{ color: C.muted }}>
          Last updated: {lastUpdated}
        </p>
        <div className="space-y-6">{children}</div>
        <p
          className="mt-12 pt-8 text-xs"
          style={{ color: C.muted, borderTop: `1px solid ${C.border}` }}
        >
          This page is provided in good faith. For binding legal guidance specific to your jurisdiction, consult a qualified solicitor.
        </p>
      </article>
      <Footer />
    </main>
  );
}

export function LegalH2({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-semibold mt-7 mb-2"
      style={{ color: C.fg, fontSize: 16, lineHeight: 1.3 }}
    >
      {children}
    </h2>
  );
}

export function LegalH3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-semibold mt-4 mb-1"
      style={{ color: C.fg, fontSize: 14, lineHeight: 1.3 }}
    >
      {children}
    </h3>
  );
}
