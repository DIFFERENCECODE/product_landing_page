// ─────────────────────────────────────────────────────────────────────
// /chat — Entry point for the Meo chatbot UI imported from
// meo-frontend. The full MeOApp shell (chat panel, three-panel
// layout, analysis content, solution content, vendor/practitioner
// modes) is rendered here.
//
// Status: STAGED but not yet fully wired. The component imports
// resolve, but several features depend on infrastructure not yet
// configured in product_landing_page:
//   - Cognito auth (id token storage, login/logout URLs)
//   - chatbot-rag backend at api.meo.meterbolic.com
//   - bang-api backend at api.meterbolic.org
//   - Per-vendor theme env vars (NEXT_PUBLIC_VENDOR_*)
// Until those land via the API-route migration + env-var setup, the
// page renders the LandingPage / sign-in CTA branch of MeOApp rather
// than the authenticated chat interface.
//
// Style refactor to use the master C palette (src/lib/design-tokens.ts)
// is queued as a follow-up: meo-frontend's ThemeProvider currently
// applies its own palette via inline CSS variables. The two design
// systems coexist for now; unification needs a deliberate refactor
// of ThemeProvider.tsx.
// ─────────────────────────────────────────────────────────────────────
'use client';

// ThemeProvider is supplied by the (meo) route-group layout.
import MeOApp from '@/components/meo/MeOApp';

export default function ChatPage() {
  return <MeOApp />;
}
