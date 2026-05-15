// Fire-and-forget Beehiiv subscription sync.
// Failures are logged but never thrown — the form must succeed even if
// Beehiiv is rate-limited or down.

interface BeehiivSubscribePayload {
  email: string;
  reactivate_existing?: boolean;
  send_welcome_email?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referring_site?: string;
  custom_fields?: Array<{ name: string; value: string }>;
}

export async function pushToBeehiiv(
  email: string,
  opts: {
    firstName?: string | null;
    lastName?: string | null;
    ip?: string | null;
    source?: string;
  } = {},
): Promise<{ ok: boolean; status?: number; error?: string }> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) {
    return { ok: false, error: 'BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID missing' };
  }

  const customFields: BeehiivSubscribePayload['custom_fields'] = [];
  if (opts.firstName) customFields.push({ name: 'First Name', value: opts.firstName });
  if (opts.lastName) customFields.push({ name: 'Last Name', value: opts.lastName });
  if (opts.ip) customFields.push({ name: 'IP Address', value: opts.ip });

  const payload: BeehiivSubscribePayload = {
    email,
    reactivate_existing: true,
    send_welcome_email: false,
    utm_source: opts.source ?? 'meterbolic.com',
    referring_site: 'https://meterbolic.com',
    ...(customFields.length > 0 ? { custom_fields: customFields } : {}),
  };

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8_000),
      },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { ok: false, status: res.status, error: text.slice(0, 300) };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
