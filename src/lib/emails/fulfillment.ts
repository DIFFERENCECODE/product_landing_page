// Plan-specific fulfillment emails sent from the Stripe webhook on
// `checkout.session.completed`. Each renders both HTML and plain text.

type Plan = 'lite' | 'starter' | 'coached';

interface FulfillmentInput {
  plan: Plan;
  firstName: string;
  email: string;
  orderId: string;
}

const EBOOK_URL = process.env.EBOOK_URL ?? 'https://smplu.link/BAS';
const EBOOK_USERNAME = process.env.EBOOK_USERNAME ?? 'meterbolic';
const EBOOK_PASSWORD = process.env.EBOOK_PASSWORD ?? 'rises';
const APP_URL = 'https://app.meterbolic.com';
const SUPPORT_EMAIL = 'hello@meterbolic.com';

const PLAN_COPY: Record<Plan, { subject: string; subtitle: string; appBlurb: string }> = {
  lite: {
    subject: "You're in — your Meo Lite access",
    subtitle: 'Your 7-day trial of Meo AI is ready, plus your free book extract below.',
    appBlurb:
      "<strong>Your 7-day Meo AI trial</strong> is active. Sign in at app.meterbolic.com with the temporary password we just sent in a separate email from AWS Cognito. You'll be prompted to set your own password on first login.",
  },
  starter: {
    subject: 'Your Meo Starter System is on its way',
    subtitle:
      'Your kit ships within 72 hours. Meanwhile, your Meo AI account is ready and your free book extract is below.',
    appBlurb:
      "<strong>Your full 6-month Meo AI access</strong> is active. Sign in at app.meterbolic.com with the temporary password we just sent in a separate email from AWS Cognito. You'll be prompted to set your own password on first login.",
  },
  coached: {
    subject: 'Welcome to Meo Coached — Spencer will be in touch',
    subtitle:
      'Your kit ships within 72 hours. Spencer Martin will reach out within 48 hours to book your onboarding session.',
    appBlurb:
      "<strong>Your full 6-month Meo AI access</strong> is active. Spencer Martin (your coach) will email you within 48 hours to schedule your 40-minute onboarding. Sign in at app.meterbolic.com with the temporary password we just sent in a separate email from AWS Cognito.",
  },
};

export function fulfillmentSubject(plan: Plan): string {
  return PLAN_COPY[plan].subject;
}

export function fulfillmentHtml({ plan, firstName }: FulfillmentInput): string {
  const c = PLAN_COPY[plan];
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#0e3128;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#f0ede6;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;padding:10px 14px;background:rgba(164,214,94,0.18);color:#a4d65e;border-radius:999px;font-size:12px;font-weight:600;">
        Order confirmed
      </div>
    </div>
    <h1 style="font-size:24px;line-height:1.25;margin:0 0 12px;color:#fff;">${hi}</h1>
    <p style="font-size:15px;line-height:1.55;margin:0 0 24px;color:rgba(255,255,255,0.78);">${c.subtitle}</p>

    <div style="background:rgba(30,70,60,0.85);border:1px solid rgba(255,255,255,0.10);border-radius:14px;padding:20px;margin-bottom:18px;">
      <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#a4d65e;font-weight:700;">App access</p>
      <p style="margin:0 0 12px;font-size:14px;line-height:1.55;color:rgba(255,255,255,0.78);">${c.appBlurb}</p>
      <a href="${APP_URL}" style="display:inline-block;padding:10px 18px;background:#a4d65e;color:#1a3a2a;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;">Open Meo AI →</a>
    </div>

    <div style="background:rgba(30,70,60,0.85);border:1px solid rgba(255,255,255,0.10);border-radius:14px;padding:20px;margin-bottom:18px;">
      <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:#a4d65e;font-weight:700;">The Thin Book of Fat — free extract</p>
      <p style="margin:0 0 12px;font-size:14px;line-height:1.55;color:rgba(255,255,255,0.78);">By Marina Young. The chapter that pairs with Meo AI.</p>
      <p style="margin:0 0 4px;font-size:14px;color:rgba(255,255,255,0.78);">Link: <a href="${EBOOK_URL}" style="color:#a4d65e;">${EBOOK_URL}</a></p>
      <p style="margin:0 0 4px;font-size:14px;color:rgba(255,255,255,0.78);">Username: <code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;">${EBOOK_USERNAME}</code></p>
      <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.78);">Password: <code style="background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;">${EBOOK_PASSWORD}</code></p>
    </div>

    <p style="font-size:13px;line-height:1.5;color:rgba(255,255,255,0.55);margin:24px 0 0;">
      Questions? Reply to this email or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:#a4d65e;">${SUPPORT_EMAIL}</a>.<br>
      — The Meo team
    </p>
  </div>
</body></html>`;
}

export function fulfillmentText({ plan, firstName }: FulfillmentInput): string {
  const c = PLAN_COPY[plan];
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  return [
    hi,
    '',
    c.subtitle,
    '',
    '— APP ACCESS —',
    `Sign in at: ${APP_URL}`,
    'Your temporary password arrives in a separate email from AWS Cognito.',
    '',
    '— THE THIN BOOK OF FAT — FREE EXTRACT —',
    `Link:     ${EBOOK_URL}`,
    `Username: ${EBOOK_USERNAME}`,
    `Password: ${EBOOK_PASSWORD}`,
    '',
    `Questions? ${SUPPORT_EMAIL}`,
    '',
    '— The Meo team',
  ].join('\n');
}
