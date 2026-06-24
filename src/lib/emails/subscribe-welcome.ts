interface WelcomeArgs {
  email: string;
  firstName?: string | null;
}

const EBOOK_URL = process.env.EBOOK_URL ?? 'https://heyzine.com/flip-book/6e10d47710.html';
const EBOOK_USERNAME = process.env.EBOOK_USERNAME ?? 'meterbolic';
const EBOOK_PASSWORD = process.env.EBOOK_PASSWORD ?? 'rises';

// Own-hosted product imagery — stable URLs we control.
const IMG = {
  meter: 'https://meterbolic.com/lipid-meter.png',
  book:  'https://meterbolic.com/ebook-cover.jpg',
  app:   'https://meterbolic.com/meo-app-screenshot.png',
};

// Brand tokens — matches the website's pale-on-white aesthetic.
const C = {
  page:      '#eef3ea',     // page outside the card
  card:      '#ffffff',     // email card
  ink:       '#0f2c25',     // primary headline ink
  body:      '#3a5650',     // muted body text
  muted:     '#7a9590',     // small/meta text
  hairline:  '#dfe7e1',     // subtle border
  primary:   '#0f2c25',     // CTA fill
  primaryFg: '#ffffff',
  accent:    '#7fb55a',     // brand green
  accentSoft:'#eaf3da',     // soft pill background
  accentInk: '#3a6a2a',     // text on soft pill
  heroBg:    '#eef3ea',     // hero panel background
};

// Bricolage Grotesque — the brand display face, loaded from Google Fonts.
// Supporting email clients (Apple Mail, Gmail iOS/Android, etc.) will pick
// it up; the rest fall through cleanly to Helvetica/Arial.
const FONT_STACK = `'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const FONT_LINK = `<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap" rel="stylesheet">`;
const FONT_FALLBACK_STYLE = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap');`;

export function subscribeWelcomeHtml({ email, firstName }: WelcomeArgs): string {
  const greeting = firstName?.trim() ? `Hi ${firstName.trim()},` : 'Welcome.';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>You're in — your free extract of The Thin Guide to Fat</title>
  ${FONT_LINK}
  <style>${FONT_FALLBACK_STYLE}</style>
</head>
<body style="margin:0;padding:0;background:${C.page};font-family:${FONT_STACK};color:${C.ink};-webkit-font-smoothing:antialiased;">
  <!-- preheader -->
  <div style="display:none;font-size:1px;color:${C.page};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Your free extract of The Thin Guide to Fat is ready — plus a preview of the full metabolic system.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
    <tr><td align="center" style="padding:40px 16px;">

      <!-- card -->
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="background:${C.card};border-radius:12px;overflow:hidden;border:1px solid ${C.hairline};max-width:560px;">

        <!-- wordmark header -->
        <tr><td style="padding:24px 28px 18px;border-bottom:1px solid ${C.hairline};">
          <p style="margin:0;font-family:${FONT_STACK};font-weight:800;font-size:20px;color:${C.ink};letter-spacing:-0.02em;line-height:1;">
            Meterbolic<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${C.accent};vertical-align:baseline;margin-left:3px;"></span>
          </p>
        </td></tr>

        <!-- headline + intro -->
        <tr><td style="padding:24px 28px 16px;">
          <p style="margin:0 0 10px;font-family:${FONT_STACK};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">Welcome to Meo</p>
          <h1 style="margin:0 0 12px;font-family:${FONT_STACK};font-size:30px;line-height:1.2;font-weight:800;color:${C.ink};letter-spacing:-0.02em;">
            ${greeting} <span style="color:${C.accent};">You&rsquo;re in.</span>
          </h1>
          <p style="margin:0;font-family:${FONT_STACK};font-size:15px;line-height:1.6;font-weight:400;color:${C.body};">
            Your free extract of <strong style="color:${C.ink};font-weight:700;">The Thin Guide to Fat</strong> by Marina Young is ready &mdash; the same chapter we send to every Meo member.
          </p>
        </td></tr>

        <!-- book hero — left-aligned with copy -->
        <tr><td style="padding:8px 28px 4px;">
          <img src="${IMG.book}" alt="The Thin Guide to Fat — Marina Young" width="160" style="display:block;height:auto;width:100%;max-width:160px;border-radius:6px;box-shadow:0 8px 20px rgba(15,44,37,0.16);">
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:18px 28px 8px;">
          <a href="${EBOOK_URL}" style="display:inline-block;background:${C.primary};color:${C.primaryFg};font-family:${FONT_STACK};font-weight:600;font-size:14px;padding:12px 28px;border-radius:999px;text-decoration:none;letter-spacing:0.01em;">
            Open the book &rarr;
          </a>
        </td></tr>

        <!-- credentials -->
        <tr><td style="padding:14px 28px 0;">
          <p style="margin:0;font-family:${FONT_STACK};font-size:13px;color:${C.body};line-height:1.6;">
            <span style="color:${C.muted};">User</span>
            &nbsp;<code style="background:${C.accentSoft};padding:2px 7px;border-radius:4px;font-family:'SF Mono','Menlo','Consolas',monospace;font-size:12px;color:${C.ink};">${EBOOK_USERNAME}</code>
            &nbsp;&middot;&nbsp;
            <span style="color:${C.muted};">Pass</span>
            &nbsp;<code style="background:${C.accentSoft};padding:2px 7px;border-radius:4px;font-family:'SF Mono','Menlo','Consolas',monospace;font-size:12px;color:${C.ink};">${EBOOK_PASSWORD}</code>
          </p>
        </td></tr>

        <!-- divider -->
        <tr><td style="padding:24px 28px 4px;">
          <div style="border-top:1px solid ${C.hairline};font-size:0;line-height:0;">&nbsp;</div>
        </td></tr>

        <!-- section header -->
        <tr><td style="padding:16px 28px 0;">
          <p style="margin:0 0 4px;font-family:${FONT_STACK};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">The full system</p>
          <h2 style="margin:0;font-family:${FONT_STACK};font-size:22px;line-height:1.25;font-weight:800;color:${C.ink};letter-spacing:-0.015em;">
            When you&rsquo;re ready.
          </h2>
        </td></tr>

        <!-- product list — left-aligned, stacked, hairline-separated -->
        <tr><td style="padding:8px 28px 0;">

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding:20px 0 18px;border-bottom:1px solid ${C.hairline};">
              <img src="${IMG.meter}" alt="Digital Lipid Meter" width="90" style="display:block;height:auto;width:100%;max-width:90px;">
              <p style="margin:12px 0 4px;font-family:${FONT_STACK};font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.accentInk};">Step 1 &middot; The Device</p>
              <p style="margin:0 0 4px;font-family:${FONT_STACK};font-size:16px;font-weight:800;color:${C.ink};letter-spacing:-0.01em;line-height:1.25;">Digital Lipid Meter</p>
              <p style="margin:0;font-family:${FONT_STACK};font-size:13px;line-height:1.55;color:${C.body};">
                A finger-prick reading in 3 minutes. UK &amp; EU registered for home use.
              </p>
            </td></tr>
            <tr><td style="padding:20px 0 18px;border-bottom:1px solid ${C.hairline};">
              <img src="${IMG.app}" alt="Meo AI app" width="90" style="display:block;height:auto;width:100%;max-width:90px;border-radius:8px;">
              <p style="margin:12px 0 4px;font-family:${FONT_STACK};font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.accentInk};">Step 2 &middot; The Intelligence</p>
              <p style="margin:0 0 4px;font-family:${FONT_STACK};font-size:16px;font-weight:800;color:${C.ink};letter-spacing:-0.01em;line-height:1.25;">Meo AI</p>
              <p style="margin:0;font-family:${FONT_STACK};font-size:13px;line-height:1.55;color:${C.body};">
                Plain-English interpretation of every reading. Trends, targets, Biological Age Score.
              </p>
            </td></tr>
            <tr><td style="padding:20px 0 4px;">
              <img src="${IMG.book}" alt="The Thin Guide to Fat" width="80" style="display:block;height:auto;width:100%;max-width:80px;border-radius:6px;box-shadow:0 6px 14px rgba(15,44,37,0.12);">
              <p style="margin:12px 0 4px;font-family:${FONT_STACK};font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.accentInk};">Step 3 &middot; The Manual</p>
              <p style="margin:0 0 4px;font-family:${FONT_STACK};font-size:16px;font-weight:800;color:${C.ink};letter-spacing:-0.01em;line-height:1.25;">The Thin Guide to Fat</p>
              <p style="margin:0;font-family:${FONT_STACK};font-size:13px;line-height:1.55;color:${C.body};">
                Full book by Marina Young &mdash; the action manual that pairs with Meo AI.
              </p>
            </td></tr>
          </table>

        </td></tr>

        <!-- secondary CTA + summary line -->
        <tr><td style="padding:20px 28px 8px;">
          <p style="margin:0 0 14px;font-family:${FONT_STACK};font-size:14px;line-height:1.55;color:${C.body};">
            Six months, one bundle, <strong style="color:${C.ink};font-weight:700;">&pound;149</strong> &middot; 30-day money-back &middot; free retest at month six.
          </p>
          <a href="https://meterbolic.com/?ref=welcome-email" style="display:inline-block;background:transparent;color:${C.primary};font-family:${FONT_STACK};font-weight:600;font-size:13px;padding:10px 24px;border-radius:999px;text-decoration:none;border:1.5px solid ${C.primary};letter-spacing:0.01em;">
            See the system &rarr;
          </a>
        </td></tr>

        <!-- footer -->
        <tr><td style="padding:18px 28px;border-top:1px solid ${C.hairline};">
          <p style="margin:0;font-family:${FONT_STACK};font-size:11px;color:${C.muted};line-height:1.6;">
            Sent to <span style="color:${C.body};">${email}</span> &middot; <a href="mailto:hello@meterbolic.com" style="color:${C.ink};text-decoration:none;font-weight:600;">hello@meterbolic.com</a>
          </p>
        </td></tr>

      </table>

      <!-- outside meta -->
      <p style="margin:16px 28px 0;font-family:${FONT_STACK};font-size:10px;color:${C.muted};line-height:1.5;max-width:480px;">
        Meterbolic Ltd &middot; Metabolic Intelligence System &middot; Wellness monitoring, not a medical device for diagnosis.
      </p>

    </td></tr>
  </table>
</body>
</html>`;
}

export function subscribeWelcomeText({ email, firstName }: WelcomeArgs): string {
  const greeting = firstName?.trim() ? `Hi ${firstName.trim()},` : 'Hi,';
  return [
    greeting,
    '',
    "You're in — welcome to the Meo community.",
    '',
    'YOUR FREE EXTRACT — The Thin Guide to Fat (Marina Young)',
    `Open the book: ${EBOOK_URL}`,
    `Username: ${EBOOK_USERNAME}`,
    `Password: ${EBOOK_PASSWORD}`,
    '',
    'And when you are ready, here is what is waiting:',
    '· The Book — The Thin Guide to Fat by Marina Young',
    '· The Meter — UK & EU registered Digital Lipid Meter',
    '· Meo AI — plain-English interpretation of every reading',
    '',
    'Six months of metabolic visibility, one bundle, £149.',
    '30-day money-back guarantee, free retest at month six.',
    '',
    'See the system: https://meterbolic.com/?ref=welcome-email',
    '',
    `Sent to ${email}. Questions? hello@meterbolic.com`,
    '— Meterbolic Ltd, Metabolic Intelligence System',
  ].join('\n');
}

interface NotifyArgs {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  ip?: string | null;
  source: string;
}

export function subscribeNotificationHtml(args: NotifyArgs): string {
  const name = [args.firstName, args.lastName].filter(Boolean).join(' ').trim();
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;background:#f5f5f4;padding:24px;color:#1a1a1a;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;padding:24px;border:1px solid #e5e5e5;">
  <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:.06em;">New newsletter signup</p>
  <h2 style="margin:0 0 16px;font-size:18px;">${name || args.email}</h2>
  <table style="font-size:14px;line-height:1.6;border-collapse:collapse;">
    <tr><td style="color:#666;padding-right:12px;">Email</td><td><a href="mailto:${args.email}">${args.email}</a></td></tr>
    ${name ? `<tr><td style="color:#666;padding-right:12px;">Name</td><td>${name}</td></tr>` : ''}
    ${args.ip ? `<tr><td style="color:#666;padding-right:12px;">IP</td><td>${args.ip}</td></tr>` : ''}
    <tr><td style="color:#666;padding-right:12px;">Source</td><td>${args.source}</td></tr>
    <tr><td style="color:#666;padding-right:12px;">When</td><td>${new Date().toISOString()}</td></tr>
  </table>
  <p style="font-size:12px;color:#999;margin:20px 0 0;">Auto-sent by meterbolic.com /api/subscribe</p>
</div>
</body></html>`;
}

export function subscribeNotificationText(args: NotifyArgs): string {
  const name = [args.firstName, args.lastName].filter(Boolean).join(' ').trim();
  return [
    'New newsletter signup',
    '',
    `Email:  ${args.email}`,
    name ? `Name:   ${name}` : null,
    args.ip ? `IP:     ${args.ip}` : null,
    `Source: ${args.source}`,
    `When:   ${new Date().toISOString()}`,
  ].filter(Boolean).join('\n');
}
