// ─────────────────────────────────────────────────────────────────────
// (meo) route group layout — wraps every chatbot-area route in
// ThemeProvider so meo-frontend's vendor/practitioner theme system
// has its context available. Marketing routes (/, /about, /partners
// etc.) deliberately stay outside this group so they continue to use
// the master design tokens directly without theme-context overhead.
// ─────────────────────────────────────────────────────────────────────
'use client';

import { ThemeProvider } from '@/theme/ThemeProvider';

export default function MeoGroupLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
