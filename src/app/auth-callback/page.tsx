// ─────────────────────────────────────────────────────────────────────
// /auth-callback — Migrated from legacy diff/site/public_html/
// auth-callback.html. The original was wired to Auth0's SPA SDK; the
// unified app's authentication is Cognito (per meocombined). Auth0
// SDK calls are NOT carried forward — when Cognito Hosted-UI is
// wired into product_landing_page, the post-auth handler should go
// here. For now this is a brand-styled loading state with a default
// 4-second redirect to /.
// ─────────────────────────────────────────────────────────────────────
'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

const REDIRECT_MS = 4000;

export default function AuthCallbackPage() {
  useEffect(() => {
    // TODO(merchant): replace this stub with the real Cognito Hosted-UI
    // callback handler. The Auth0 path used in the legacy site is not
    // applicable here. Until wired, fall back to a delayed redirect
    // home so a user never gets stuck on this screen.
    const t = setTimeout(() => {
      window.location.replace('/');
    }, REDIRECT_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 text-center"
      style={{ background: C.bg, color: C.fg }}
    >
      <div
        className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
        style={{ background: C.pill }}
        aria-hidden
      >
        <Loader2 className="h-7 w-7 animate-spin" style={{ color: C.primary }} />
      </div>
      <h1
        className="font-extrabold mb-3 leading-tight"
        style={{
          color: C.fg,
          fontFamily: FONT_SERIF,
          fontSize: 'clamp(28px, 4vw, 36px)',
          textWrap: 'balance',
        }}
      >
        Completing sign-in…
      </h1>
      <p className="text-sm max-w-md mx-auto" style={{ color: C.muted }}>
        One moment — we&apos;re finalising your authentication.
      </p>
    </main>
  );
}
