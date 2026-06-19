// /a/<affiliate> — affiliate sales page, no explicit vertical.
// e.g. meterbolic.com/a/eos (SCRUM-8 AC 4.1). Case-insensitive lookup;
// falls back to the affiliate's default vertical.
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SalesFunnel from '@/components/SalesFunnel';
import { getAffiliate, AFFILIATE_TIERS } from '@/lib/affiliates';

interface PageProps {
  params: Promise<{ affiliate: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const first = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { affiliate } = await params;
  const entry = getAffiliate(affiliate);
  if (!entry) return {};
  return {
    title: `${entry.name} × Meo — Metabolic Intelligence`,
    description: `Exclusive ${entry.name} partnership. Meo turns a 3-minute finger-prick into a complete metabolic picture — interpreted by AI, actionable the same day.`,
    robots: { index: false, follow: false },
  };
}

export default async function AffiliateRootPage({ params, searchParams }: PageProps) {
  const { affiliate } = await params;
  const entry = getAffiliate(affiliate);
  if (!entry) notFound();

  const sp = await searchParams;
  return (
    <SalesFunnel
      affiliate={entry}
      vertical={entry.defaultVertical}
      tiers={AFFILIATE_TIERS}
      utm={{
        source: first(sp.utm_source)?.toLowerCase() ?? entry.slug.toLowerCase(),
        intent: first(sp.utm_intent),
        hint: first(sp.utm_hint)?.toLowerCase(),
      }}
    />
  );
}
