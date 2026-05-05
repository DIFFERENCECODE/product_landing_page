// ═════════════════════════════════════════════════════════════════════
// design-tokens.ts — shared brand tokens, single source of truth.
//
// Used by both the existing marketing landing page AND every page
// migrated in from the legacy diff/site project (about, how-it-works,
// services, partners, etc.) plus the chatbot UI imported from
// meo-frontend. Keep additions surgical — design tokens that drift
// per-page are how style bleed starts.
//
// Foreground contrast measured against `bg` (#1c4a40):
//   fg     #f0ede6 ≈ 10.6 : 1  (AAA body, AAA large)
//   muted  #c4bfb8 ≈  6.0 : 1  (AA body, AAA large)
// Card surfaces lighten bg slightly so the same text still passes.
// ═════════════════════════════════════════════════════════════════════

export const C = {
  bg: '#1c4a40',
  bgDeep: '#143730',
  bgCard: 'rgba(30, 70, 60, 0.85)',
  bgCardHover: 'rgba(38, 80, 68, 0.95)',
  border: 'rgba(255,255,255,0.14)',
  primary: '#a4d65e',
  primaryFg: '#0f2a1f',
  fg: '#f0ede6',
  muted: '#c4bfb8',
  pill: 'rgba(164,214,94,0.18)',
  pillFg: '#cdf08a',
  danger: '#f59e0b',
} as const;

export const FONT_SERIF =
  'var(--font-serif), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif';

export const FONT_SANS =
  'var(--font-sans), "Cabinet Grotesk", -apple-system, BlinkMacSystemFont, sans-serif';
