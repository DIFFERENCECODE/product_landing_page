// ─────────────────────────────────────────────────────────────────────
// / — Meo homepage.
//
// Renders the shared SalesFunnel. When the entry carries UTM attribution
// that resolves to a registered affiliate (utm_source=<slug>, or a
// utm_hint suffixed with an affiliate slug), the same funnel is served in
// its affiliate variant — so an affiliate campaign can land on the bare
// domain and still get the personalised page (SCRUM-8 AC 4.2/4.3).
// Fail-soft: unknown/absent UTM renders the default consumer funnel.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import SalesFunnel from '@/components/SalesFunnel';
import { getAffiliate, AFFILIATE_TIERS } from '@/lib/affiliates';

export const metadata: Metadata = {
  title: 'Meo — Metabolic Intelligence System',
  description:
    'Metabolic intelligence at home. A finger-prick lipid panel, AI that reads each result in plain English, and a Biological Age Score that updates with every reading. UK & EU IVDR registered. From £29.',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const first = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

export default async function HomePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const utm = {
    source: first(sp.utm_source)?.toLowerCase(),
    intent: first(sp.utm_intent),
    hint: first(sp.utm_hint)?.toLowerCase(),
  };

  // Resolve an affiliate from the UTM attribution. utm_source is the
  // primary signal; a utm_hint suffixed with an affiliate slug
  // (e.g. ai-coach-eos) is the fallback (docs/utm.md §6.5).
  let affiliate = getAffiliate(utm.source);
  if (!affiliate && utm.hint) {
    const suffix = utm.hint.match(/-([a-z0-9]+)$/)?.[1];
    affiliate = getAffiliate(suffix);
  }

  if (affiliate) {
    return (
      <SalesFunnel
        affiliate={affiliate}
        vertical={affiliate.defaultVertical}
        tiers={AFFILIATE_TIERS}
        utm={utm}
      />
    );
  }

  return <SalesFunnel utm={utm} />;
}
