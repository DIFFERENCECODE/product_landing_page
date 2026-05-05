// ─────────────────────────────────────────────────────────────────────
// PeopleCarousel — single horizontally-scrolling carousel of every
// person who works on Meterbolic. Combines the previous "Scientific
// Advisors" and "Core Team" sections into one gallery. Uses the same
// CSS scroll-snap + arrow/dot pattern as MarketingLandingPage's
// PartnersSection so behaviour is consistent across the site.
// ─────────────────────────────────────────────────────────────────────
'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { C, FONT_SERIF } from '@/lib/design-tokens';

type Person = { photo: string; name: string; role: string; bio: string };

const PEOPLE: readonly Person[] = [
  {
    photo: '/team-tim-noakes.png',
    name: 'Prof. Tim Noakes',
    role: 'Scientific Advisor',
    bio: "Emeritus Professor at UCT's Division of Exercise Science and Sports Medicine. Renowned for pioneering research in exercise physiology, nutrition, and low-carbohydrate science. Author and endurance athlete with 70+ marathons and ultramarathons.",
  },
  {
    photo: '/team-robbert-slingerland.png',
    name: 'Dr. Robbert Slingerland',
    role: 'Scientific Advisor',
    bio: 'Chair of Clinical Chemistry Laboratories at Isala Klinieken, Zwolle (Netherlands) and Chair of the European Reference Laboratory. Specialist in clinical chemistry and biostatistics with extensive research into metabolic biomarkers.',
  },
  {
    photo: '/team-david-jehring.png',
    name: 'David Jehring',
    role: 'Technology Advisor',
    bio: 'CEO and Founder of Black Pear Software. Healthcare technology leader with a background as CTO at Apollo Medical Systems Ltd, specialising in digital health integration.',
  },
  {
    photo: '/team-isabella-cooper.png',
    name: 'Dr. Isabella Cooper',
    role: 'Research Advisor',
    bio: 'PhD in Biochemistry, Physiology and Pathophysiology. Researcher in hyperinsulinemia and ketogenic science, advising on metabolic disease mechanisms and nutritional interventions.',
  },
  {
    photo: '/team-eric-smith.jpg',
    name: 'Dr. Eric Smith',
    role: 'Founder',
    bio: 'Innovative engineer and medical doctor who founded Meterbolic to revolutionize metabolic health diagnostics.',
  },
  {
    photo: '/team-andy.png',
    name: 'Andy Taylor',
    role: 'Clinic Lead',
    bio: 'Former professional footballer turned metabolic health expert and UKSCA-accredited coach.',
  },
  {
    photo: '/team-spencer.png',
    name: 'Spencer Martin',
    role: 'Sales Manager',
    bio: "Over 25 years in pharmaceutical sales, specialising in diabetes therapies and coaching. Driving Meterbolic's commercial outreach and partner growth.",
  },
  {
    photo: '/team-saad.jpg',
    name: 'Saad Naeem',
    role: 'AI Specialist · CTO',
    bio: 'Building the intelligence layer behind Meo — architecture, backend systems, and the data that turns a finger-prick into a metabolic picture.',
  },
  {
    photo: '/team-leonard.png',
    name: 'Leonard Lin',
    role: 'Product Supervisor',
    bio: 'Overseeing product direction and ensuring every feature of Meo delivers real metabolic insight — from hardware integration to the AI conversation layer.',
  },
  {
    photo: '/team-gabor.png',
    name: 'Prof. Gabor Erdosi',
    role: 'Chief Metabolic Scientist',
    bio: 'Molecular biologist focused on metabolic dysfunction and sweetener science, advancing evidence-based innovation in diagnostics.',
  },
  {
    photo: '/team-justin.png',
    name: 'Prof Justin Tondt',
    role: 'Chief Medical Officer',
    bio: "Medical professional guiding Meterbolic's clinical protocols and ensuring scientific rigour in metabolic health interventions.",
  },
  {
    photo: '/team-erik.jpg',
    name: 'Erik Kettschick',
    role: 'UX/UI Designer',
    bio: 'Specialises in visual identity and product design, creating user-friendly digital experiences and graphics that bring the Meterbolic brand to life.',
  },
  {
    photo: '/team-lech.jpeg',
    name: 'Lechenu Iyoko',
    role: 'AI Engineer',
    bio: 'Expert in machine learning algorithms and IT infrastructure, developing scalable AI solutions for personalised metabolic health.',
  },
  {
    photo: '/team-bhanu.jpeg',
    name: 'Bhanu Rangavazzala',
    role: 'DevSecOps',
    bio: "Improving data infrastructure, rebuilding dashboards and developing AI training pipelines to support the company's analytics and product innovation.",
  },
  {
    photo: '/team-helen.png',
    name: 'Helen MacGregor',
    role: 'Finance',
    bio: 'Trusted advisor who provides strategic insights, financial analysis, and risk management solutions to help organisations optimise performance and ensure compliance.',
  },
];

function PersonCard({ p }: { p: Person }) {
  // "Advisor" / "Team" chip — visitors should be able to tell at a
  // glance whether someone runs the company or advises it. Inferred
  // from the role string (any role containing "Advisor" is an advisor).
  const isAdvisor = /Advisor/i.test(p.role);
  return (
    <div
      className="rounded-2xl flex flex-col h-full overflow-hidden"
      style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
    >
      <div className="relative w-full shrink-0" style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
        <span
          className="absolute top-3 left-3 text-[10px] font-bold tracking-wide px-2 py-1 rounded-full z-10"
          style={{
            background: isAdvisor ? 'rgba(28, 74, 64, 0.85)' : C.primary,
            color: isAdvisor ? C.fg : C.primaryFg,
            border: isAdvisor ? `1px solid ${C.primary}` : 'none',
            backdropFilter: 'blur(4px)',
          }}
        >
          {isAdvisor ? 'Advisor' : 'Team'}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.photo}
          alt={p.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </div>
      <div className="p-6 flex flex-col flex-1" style={{ minHeight: 200 }}>
        <h3 className="font-bold text-lg mb-1" style={{ color: C.fg, fontFamily: FONT_SERIF }}>
          {p.name}
        </h3>
        <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: C.primary }}>
          {p.role}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
          {p.bio}
        </p>
      </div>
    </div>
  );
}

export function PeopleCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollByCards = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('[data-people-card]') as HTMLElement | null;
    if (!card) return;
    const cardW = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || '24');
    track.scrollBy({ left: dir * (cardW + gap), behavior: 'smooth' });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll('[data-people-card]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const i = cards.indexOf(e.target);
            if (i >= 0) setActiveIdx(i);
          }
        });
      },
      { root: track, threshold: [0.6, 0.9] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll('[data-people-card]');
    (cards[i] as HTMLElement | undefined)?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  };

  return (
    <section className="px-5 sm:px-6 py-16 sm:py-24" style={{ background: C.bgDeep }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold tracking-wide mb-3 text-center" style={{ color: C.pillFg }}>
          The team behind Meterbolic
        </p>
        <h2
          className="font-extrabold mb-3 text-center leading-tight"
          style={{
            color: C.fg,
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(28px, 4vw, 38px)',
            textWrap: 'balance',
          }}
        >
          The people <span style={{ color: C.primary }}>behind Meo</span>.
        </h2>
        <p className="text-center text-base mb-12 max-w-2xl mx-auto" style={{ color: C.muted }}>
          Scientific advisors and core team — the clinical, commercial, AI, and design expertise pointing every part of Meterbolic at one goal.
        </p>

        <div className="relative">
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-5 sm:-mx-6 px-5 sm:px-6"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {PEOPLE.map((p) => (
              <div
                key={p.name}
                data-people-card
                className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <PersonCard p={p} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => scrollByCards(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ background: C.bgCard, border: `1px solid ${C.border}`, color: C.fg }}
            aria-label="Previous people"
          >
            <ChevronDown className="h-5 w-5 rotate-90" />
          </button>
          <div className="flex gap-2 flex-wrap justify-center max-w-xs">
            {PEOPLE.map((p, i) => (
              <button
                key={p.name}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIdx ? 20 : 8,
                  height: 8,
                  background: i === activeIdx ? C.primary : C.border,
                }}
                aria-label={`Show ${p.name}`}
              />
            ))}
          </div>
          <button
            onClick={() => scrollByCards(1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ background: C.bgCard, border: `1px solid ${C.border}`, color: C.fg }}
            aria-label="Next people"
          >
            <ChevronDown className="h-5 w-5 -rotate-90" />
          </button>
        </div>
      </div>
    </section>
  );
}
