// ─────────────────────────────────────────────────────────────────────
// /chat — Public-facing entry point for the Meo chatbot.
//
// The full meo-frontend MeOApp shell is staged in src/components/meo/
// and reachable from here, BUT it requires Cognito auth + chatbot-rag
// + bang-api env vars that aren't configured in product_landing_page.
// Rendering MeOApp directly would show visitors a broken sign-in
// loop. Until the env wiring lands, this page is an honest "early
// access" landing that points at /checkout, /quiz, and the newsletter
// — three real conversion paths the visitor can actually act on.
//
// To re-enable the live chatbot once Cognito + backends are wired:
//   1. import MeOApp from '@/components/meo/MeOApp'
//   2. replace the JSX below with `<MeOApp />`
//   3. ensure env vars from meocombined/meo-frontend/README are set
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Mail } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';
import { Navbar, Footer } from '@/components/MarketingLandingPage';

export const metadata: Metadata = {
  title: 'Meo AI — Early access',
  description:
    "Meo's metabolic-health AI chat is in closed access for kit owners. Buy a Meo Starter, take the quiz, or join the newsletter for sign-in details when the public chat opens.",
  robots: { index: false, follow: true },
};

export default function ChatPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: C.bg, color: C.fg }}>
      <Navbar />
      <section className="flex-1 flex items-center justify-center px-5 sm:px-6 py-24">
        <div className="max-w-2xl w-full text-center">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: C.pill }}
            aria-hidden
          >
            <MessageCircle className="h-7 w-7" style={{ color: C.primary }} />
          </div>
          <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.pillFg }}>
            Early access
          </p>
          <h1
            className="font-extrabold mb-4 leading-tight"
            style={{
              color: C.fg,
              fontFamily: FONT_SERIF,
              fontSize: 'clamp(32px, 5vw, 48px)',
              textWrap: 'balance',
            }}
          >
            Meo AI is <span style={{ color: C.primary }}>opening up gradually</span>.
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto mb-10" style={{ color: C.muted }}>
            Right now, Meo&apos;s metabolic-health chat ships with the Meo Starter kit and to coached members. Pick any of these to get going:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <Link
              href="/checkout"
              className="rounded-2xl p-6 transition-opacity hover:opacity-90"
              style={{ background: C.bgCard, border: `1px solid ${C.primary}` }}
            >
              <p className="text-xs font-semibold tracking-wide mb-2" style={{ color: C.primary }}>
                Get Meo Starter
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: C.fg }}>
                Lipid kit + 6 months of Meo AI
              </p>
              <p className="text-xs" style={{ color: C.muted }}>
                £149 one-time. Sign-in details ship with the kit.
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: C.primary }}>
                Buy a kit <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <Link
              href="/quiz"
              className="rounded-2xl p-6 transition-opacity hover:opacity-90"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <p className="text-xs font-semibold tracking-wide mb-2" style={{ color: C.pillFg }}>
                Take the quiz
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: C.fg }}>
                7 questions, 2 minutes
              </p>
              <p className="text-xs" style={{ color: C.muted }}>
                We&apos;ll match you to the right starting kit.
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: C.muted }}>
                Start <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <a
              href="mailto:hello@meterbolic.com?subject=Meo%20AI%20early%20access"
              className="rounded-2xl p-6 transition-opacity hover:opacity-90"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              <p className="text-xs font-semibold tracking-wide mb-2" style={{ color: C.pillFg }}>
                Get notified
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: C.fg }}>
                Email when public chat opens
              </p>
              <p className="text-xs" style={{ color: C.muted }}>
                We&apos;ll write the moment public access lands.
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: C.muted }}>
                <Mail className="h-3.5 w-3.5" /> Email us
              </span>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
