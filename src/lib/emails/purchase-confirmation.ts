export function purchaseConfirmationHtml({
  name,
  email,
  orderId,
}: {
  name: string;
  email: string;
  orderId: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e5e5e5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">
        <tr><td style="background:#00c896;padding:32px 40px;">
          <p style="margin:0;font-size:24px;font-weight:700;color:#000;letter-spacing:-0.5px;">Meterbolic</p>
          <p style="margin:4px 0 0;font-size:13px;color:#005a44;">Order Confirmation</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:#fff;">Thank you, ${name || email}!</h1>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#aaa;">
            Your Meo Starter System is confirmed. You will receive a shipping notification once your kit is dispatched, typically within 2–3 business days.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:8px;padding:24px;margin-bottom:32px;">
            <tr>
              <td style="font-size:13px;color:#888;padding-bottom:8px;">Order reference</td>
              <td style="font-size:13px;color:#888;padding-bottom:8px;text-align:right;">What's next</td>
            </tr>
            <tr>
              <td style="font-size:14px;font-weight:600;color:#00c896;">${orderId}</td>
              <td style="font-size:14px;color:#e5e5e5;text-align:right;">Download the Meo app</td>
            </tr>
          </table>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#aaa;">
            While you wait for your kit, set up your Meo account to be ready when your test strips arrive.
          </p>
          <a href="https://app.meterbolic.com" style="display:inline-block;background:#00c896;color:#000;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">Set Up Meo Account</a>
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #2a2a2a;">
          <p style="margin:0;font-size:12px;color:#555;line-height:1.6;">
            This confirmation was sent to ${email}.<br>
            Questions about your order? <a href="mailto:support@meterbolic.com" style="color:#00c896;">support@meterbolic.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function purchaseConfirmationText({
  name,
  email,
  orderId,
}: {
  name: string;
  email: string;
  orderId: string;
}): string {
  return [
    `Thank you for your order, ${name || email}!`,
    "",
    "Your Meo Starter System is confirmed.",
    `Order reference: ${orderId}`,
    "",
    "You will receive a shipping notification once your kit is dispatched (2–3 business days).",
    "",
    "Set up your Meo account now: https://app.meterbolic.com",
    "",
    `Questions? support@meterbolic.com`,
  ].join("\n");
}
