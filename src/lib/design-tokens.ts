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
  // Decorative card borders — visual rhythm only, not functional UI.
  // 14% alpha sits at ~1.5:1 against bg (decorative borders are exempt
  // from WCAG 1.4.11). Don't use this for form inputs or anything
  // that conveys interactive state — use `borderInteractive` instead.
  border: 'rgba(255,255,255,0.14)',
  // Functional UI border — form inputs, buttons that aren't filled,
  // selected card states, anything that conveys "this is interactive
  // / this is the current focus". 40% alpha hits ~3.0:1 on bg, the
  // WCAG 1.4.11 minimum for non-text UI contrast.
  borderInteractive: 'rgba(255,255,255,0.40)',
  primary: '#a4d65e',
  primaryFg: '#0f2a1f',
  fg: '#f0ede6',
  muted: '#c4bfb8',
  pill: 'rgba(164,214,94,0.18)',
  pillFg: '#cdf08a',
  danger: '#f59e0b',
} as const;

export const FONT_SERIF =
  'var(--font-serif), -apple-system, BlinkMacSystemFont, sans-serif';

export const FONT_SANS =
  'var(--font-sans), -apple-system, BlinkMacSystemFont, sans-serif';
