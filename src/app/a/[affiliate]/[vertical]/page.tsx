// /a/<affiliate>/<vertical> — affiliate sales page for an explicit
// vertical (docs/utm.md §1.1, e.g. /a/EoS/longevity). Same funnel as the
// single-segment route; the vertical only tunes one hero line.
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SalesFunnel from '@/components/SalesFunnel';
import { getAffiliate, isValidVertical, VERTICALS, AFFILIATE_TIERS } from '@/lib/affiliates';

interface PageProps {
  params: Promise<{ affiliate: string; vertical: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const first = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { affiliate, vertical } = await params;
  const entry = getAffiliate(affiliate);
  if (!entry || !isValidVertical(vertical)) return {};
  return {
    title: `${entry.name} × Meo — ${VERTICALS[vertical]}`,
    description: `Exclusive ${entry.name} partnership. Meo turns a 3-minute finger-prick into a complete metabolic picture — interpreted by AI, actionable the same day.`,
    robots: { index: false, follow: false },
  };
}

export default async function AffiliateVerticalPage({ params, searchParams }: PageProps) {
  const { affiliate, vertical } = await params;
  const entry = getAffiliate(affiliate);
  if (!entry) notFound();
  if (!isValidVertical(vertical)) notFound();

  const sp = await searchParams;
  return (
    <SalesFunnel
      affiliate={entry}
      vertical={vertical}
      tiers={AFFILIATE_TIERS}
      utm={{
        source: first(sp.utm_source)?.toLowerCase() ?? entry.slug.toLowerCase(),
        intent: first(sp.utm_intent),
        hint: first(sp.utm_hint)?.toLowerCase(),
      }}
    />
  );
}
