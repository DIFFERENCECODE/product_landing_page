'use client';

// ─── Coaching Hero ────────────────────────────────────────────────────
//
// Hero for the /coaching programme page (Dr Arup Sen · Eos Longevity).
// Matches the flagship marketing hero treatment: full-screen centered
// layout over the liquid-metal video background with a dark overlay for
// legibility, primary-accented serif-weight headline, muted subhead, a
// smaller supporting line, and a single primary CTA that scrolls to the
// pricing tiers further down the page.
// ──────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { C } from '@/lib/design-tokens';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Pause the background video when the hero scrolls out of view — same
  // perf/attention behaviour as the homepage hero.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 sm:pb-16 px-5 sm:px-6 overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* Background video + dark overlay for headline/CTA legibility. */}
      <video
        ref={videoRef}
        aria-hidden
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 w-full h-full object-cover"
        src="/liquid-metal.mp4"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.55)' }}
      />

      <div className="relative max-w-5xl mx-auto w-full text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold tracking-wide mb-5"
          style={{ color: C.pillFg }}
        >
          Metabolic coaching
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-bold leading-[1.05] mb-6 sm:mb-8"
          style={{
            color: C.fg,
            fontSize: 'clamp(36px, 6.5vw, 76px)',
            letterSpacing: '-0.02em',
            textWrap: 'balance',
          }}
        >
          Metabolic coaching, backed by{' '}
          <span style={{ color: C.primary }}>lab-grade monitoring</span>.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-base sm:text-lg mx-auto mb-4 max-w-2xl"
          style={{ color: C.muted }}
        >
          Meo&rsquo;s CE-marked at-home lipid testing system, paired with 1:1
          wellness coaching from Dr Arup Sen, founder of Eos Longevity, to help
          you understand your metabolic trends and build habits that last.
        </motion.p>

        {/* Supporting line */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm mx-auto mb-8 sm:mb-10"
          style={{ color: C.muted, opacity: 0.85 }}
        >
          Two introductory programmes. Limited launch pricing.
        </motion.p>

        {/* Primary CTA — scrolls to the pricing tiers on this page. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col items-center gap-2.5"
        >
          <button
            type="button"
            onClick={() =>
              document
                .getElementById('pricing')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl font-semibold transition-opacity hover:opacity-90 px-10 py-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4d65e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1c4a40]"
            style={{ background: C.primary, color: C.primaryFg }}
          >
            See the programmes <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
