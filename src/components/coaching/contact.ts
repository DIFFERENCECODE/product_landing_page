// ─── Coaching · Enquiry inbox ─────────────────────────────────────────
//
// Kept as a re-export so the coaching section components can carry on
// importing a local name, but the address itself now lives with the
// programmes in lib/programmes.ts — next to the prices and the subject
// helpers that also have to reach /checkout and /pricing.
//
// Do not reintroduce a literal address here: one inbox, one definition.
// ──────────────────────────────────────────────────────────────────────
export { EOS_ENQUIRY_EMAIL as ENQUIRY_EMAIL } from '@/lib/programmes';
