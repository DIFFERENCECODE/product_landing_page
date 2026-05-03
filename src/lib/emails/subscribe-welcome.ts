export function subscribeWelcomeHtml({ email }: { email: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#143730;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#143730;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1c4a40;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.10);">
        <tr><td style="background:#a4d65e;padding:28px 40px;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#1a3a2a;letter-spacing:-0.5px;">Meo · Metabolic Intelligence</p>
          <p style="margin:4px 0 0;font-size:13px;color:#3a6a2a;">Welcome to the series</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#ffffff;">You're in.</h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.75);">
            Thank you for joining the Meo community. You'll be first to hear about new products in the Metabolic Health Tracker Series — starting with the Cholesterol Tracker you've seen, through to the Insulin Tracker and beyond.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(164,214,94,0.12);border-radius:10px;border:1px solid rgba(164,214,94,0.3);padding:24px;margin-bottom:28px;">
            <tr><td>
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#a4d65e;text-transform:uppercase;letter-spacing:0.05em;">Your free extract</p>
              <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#ffffff;"><em>The Thin Book of Fat</em> — Marina Young</p>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.75);">
                Chapter 1: The 7 lipid-moving habits the peer-reviewed research actually supports — and 3 popular ones that don't move the needle at all.
              </p>
              <a href="https://shop.meterbolic.com/?ref=welcome-email" style="display:inline-block;background:#a4d65e;color:#1a3a2a;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;">Read the extract →</a>
            </td></tr>
          </table>

          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.62);">
            When you're ready for the full system — the Digital Lipid Meter, 6 months of Meo AI, and the complete book — it's waiting at the link below.
          </p>
          <a href="https://shop.meterbolic.com/?ref=welcome-email" style="display:inline-block;background:rgba(164,214,94,0.15);color:#a4d65e;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none;border:1px solid rgba(164,214,94,0.4);">See the Metabolic Health Tracker →</a>
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;">
            This email was sent to ${email}. You're receiving it because you subscribed at shop.meterbolic.com.<br>
            Questions? <a href="mailto:hello@meterbolic.com" style="color:rgba(164,214,94,0.8);">hello@meterbolic.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function subscribeWelcomeText({ email }: { email: string }): string {
  return [
    "You're in — welcome to the Meo community.",
    "",
    "You'll be first to hear about new products in the Metabolic Health Tracker Series.",
    "",
    "Your free extract: The Thin Book of Fat — Marina Young",
    "Chapter 1: The 7 lipid-moving habits the research actually supports.",
    "Read it at: https://shop.meterbolic.com/?ref=welcome-email",
    "",
    "Ready for the full system? https://shop.meterbolic.com/?ref=welcome-email",
    "",
    `Sent to ${email}. Questions? hello@meterbolic.com`,
  ].join("\n");
}
