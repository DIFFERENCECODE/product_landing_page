// Fire-and-forget push of a website lead to the GoHighLevel (Meterbolic)
// location so it lands in the GHL unified inbox alongside chat + calendar.
// Mirrors the Beehiiv integration pattern: never throws, never blocks the
// user response. No-ops safely if GHL_PIT / GHL_LOCATION are unset.

type GhlLead = {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  source?: string;
};

type GhlResult = { ok: boolean; status?: number; error?: string };

export async function pushToGhl(email: string, lead: GhlLead = {}): Promise<GhlResult> {
  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION;
  if (!token || !locationId) {
    return { ok: false, error: "GHL env not configured" };
  }

  const body: Record<string, unknown> = {
    locationId,
    email: email.toLowerCase().trim(),
    source: lead.source || "Website",
  };
  if (lead.firstName) body.firstName = lead.firstName;
  if (lead.lastName) body.lastName = lead.lastName;
  if (lead.phone) body.phone = lead.phone;

  try {
    const res = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, status: res.status, error: text.slice(0, 200) };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
