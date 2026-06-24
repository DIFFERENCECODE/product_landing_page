import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAffiliate, isValidVertical, VERTICALS } from '@/lib/affiliates';
import AffiliateLandingPage from '@/components/AffiliateLandingPage';

interface PageProps {
  params: Promise<{ affiliate: string; vertical: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { affiliate: slug, vertical } = await params;
  const entry = getAffiliate(slug);
  if (!entry || !isValidVertical(vertical)) return {};

  const verticalLabel = VERTICALS[vertical] || vertical;
  return {
    title: `${entry.name} x Meo — ${verticalLabel}`,
    description: `Exclusive ${entry.name} partnership. Meo turns a 3-minute finger-prick into a complete metabolic picture — interpreted by AI, actionable the same day.`,
    robots: { index: false, follow: false },
  };
}

export default async function AffiliatePage({ params, searchParams }: PageProps) {
  const { affiliate: slug, vertical } = await params;
  const sp = await searchParams;

  const entry = getAffiliate(slug);
  if (!entry) notFound();
  if (!isValidVertical(vertical)) notFound();

  const utmSource = (typeof sp.utm_source === 'string' ? sp.utm_source : slug).toLowerCase();
  const utmIntent = typeof sp.utm_intent === 'string' ? sp.utm_intent : undefined;

  return (
    <AffiliateLandingPage
      affiliate={entry}
      vertical={vertical}
      utmSource={utmSource}
      utmIntent={utmIntent}
    />
  );
}
