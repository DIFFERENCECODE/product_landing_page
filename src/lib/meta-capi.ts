// Meta Conversions API — server-side companion to the browser Pixel.
// Sends the same Purchase event from our backend so iOS Safari, ad blockers,
// and any client that strips fbq still report the conversion to Meta.
//
// Setup needed:
//   META_PIXEL_ID         e.g. 639378155283159
//   META_CAPI_ACCESS_TOKEN — generate in Events Manager → Settings → Conversions API
//   META_CAPI_TEST_CODE    — optional, only set during testing in Events Manager

import { createHash } from 'node:crypto';

const PIXEL_ID = process.env.META_PIXEL_ID ?? '639378155283159';
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN ?? '';
const TEST_CODE = process.env.META_CAPI_TEST_CODE ?? '';

function sha256(input: string): string {
  return createHash('sha256').update(input.toLowerCase().trim()).digest('hex');
}

export interface PurchaseInput {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  value: number;        // in major units (e.g. 29 for £29.00)
  currency: string;     // ISO code, e.g. 'GBP'
  eventId: string;      // dedupe id — same value used in fbq browser call ideally
  fbp?: string | null;  // _fbp cookie value
  fbc?: string | null;  // _fbc cookie value (click ID)
}

export async function sendMetaPurchase(input: PurchaseInput): Promise<{ ok: boolean; error?: string }> {
  if (!ACCESS_TOKEN) return { ok: false, error: 'META_CAPI_ACCESS_TOKEN missing' };

  const userData: Record<string, unknown> = {
    em: [sha256(input.email)],
  };
  if (input.firstName) userData.fn = [sha256(input.firstName)];
  if (input.lastName) userData.ln = [sha256(input.lastName)];
  if (input.ip) userData.client_ip_address = input.ip;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: 'website',
        event_source_url: 'https://meterbolic.com/checkout/success',
        user_data: userData,
        custom_data: {
          value: input.value,
          currency: input.currency.toUpperCase(),
        },
      },
    ],
  };
  if (TEST_CODE) payload.test_event_code = TEST_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8_000),
      },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { ok: false, error: `Meta CAPI ${res.status}: ${text.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
