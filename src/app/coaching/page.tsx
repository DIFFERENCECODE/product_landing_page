// ─────────────────────────────────────────────────────────────────────
// /coaching — CANONICAL page for the metabolic coaching programmes.
//
// This is the document that publishes the EoS programme prices; every
// other surface that quotes them (/checkout's Coached plan, the
// homepage tier card, /pricing, /a/EoS) reads them from
// lib/programmes.ts rather than restating them.
//
// The path is category-level on purpose. It survives a change of
// coaching partner, which a brand path like /eos does not — partner-
// branded entry points belong under /a/<Affiliate>.
//
// /eos serves the same page as an alias. See CoachingProgrammePage for
// why neither path redirects to the other.
// ─────────────────────────────────────────────────────────────────────
import type { Metadata } from 'next';
import CoachingProgrammePage, {
  COACHING_METADATA,
} from '@/components/coaching/CoachingProgrammePage';
import { EOS_PROGRAMME_URL } from '@/lib/programmes';

export const metadata: Metadata = {
  ...COACHING_METADATA,
  alternates: { canonical: EOS_PROGRAMME_URL },
};

export default function CoachingPage() {
  return <CoachingProgrammePage />;
}
