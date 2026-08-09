// ═══════════════════════════════════════════════════════════════════
// trust.ts — single source of truth for verifiable trust credentials.
//
// The ICO registration reference appears on /trust, on the footer of
// every page, on /partners and inside the reusable <TrustBadge>. A
// registration number restated in four JSX files WILL diverge — and
// this one has an expiry date (10 November 2026), so there is a known
// future edit. One file, one edit.
//
// EVERY value below is transcribed from the ICO's own certificate PDF,
// which is served from `certificatePath` so any reader can check it:
//   public/docs/meterbolic-ico-registration-certificate-zc039400.pdf
//
// Do not add a credential here that we cannot evidence. This file is
// read as fact by user-facing copy — an unsourced entry becomes a
// published claim.
// ═══════════════════════════════════════════════════════════════════

export const ICO = {
  /** Registered data controller, exactly as printed on the certificate. */
  controller: 'Meterbolic Health Ltd',
  reference: 'ZC039400',
  registered: '11 November 2025',
  expires: '10 November 2026',
  /** Registered address as printed on the certificate. */
  address: 'Number 2, 2 Barons Pastures, Kirby Muxloe, Leicester, LE9 2BG',
  /** Served from /public — the invocable document itself. */
  certificatePath: '/docs/meterbolic-ico-registration-certificate-zc039400.pdf',
  /** The ICO's own public register entry — independent verification. */
  registerUrl: 'https://ico.org.uk/ESDWebPages/Entry/ZC039400',
  /** Where a data subject complains if we get it wrong. */
  complaintsUrl: 'https://ico.org.uk/concerns/',
} as const;

// ─────────────────────────────────────────────────────────────────────
// Contact routes. Both addresses are already in use on the site —
// privacy@ on /cookies, partner@ on /partners and the affiliate funnel.
// Do not invent a new inbox here without confirming it is deliverable.
// ─────────────────────────────────────────────────────────────────────
export const PRIVACY_EMAIL = 'privacy@meterbolic.com';
export const PARTNER_EMAIL = 'partner@meterbolic.com';

/** Canonical absolute URL — used by the Meo app (app.meterbolic.com),
 *  which cannot link to /trust with a relative path. */
export const TRUST_URL = 'https://meterbolic.com/trust';
