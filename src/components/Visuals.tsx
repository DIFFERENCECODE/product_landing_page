'use client';

/**
 * Reusable SVG illustrations for the Meo landing page.
 * All values are inline so the SVGs render server-side (no client JS,
 * no extra HTTP requests, no flash). They use the brand palette
 * directly so they swap in/out anywhere on the page.
 *
 * Components:
 *   - BioAgeDial   — donut/dial visual for the Biological Age Score
 *                    section. Animates the arc on enter via Framer
 *                    Motion's pathLength.
 *   - KraftCurve   — small line chart showing the typical insulin
 *                    response pattern with two scenarios overlaid.
 *   - EbookCover   — stylised book mock with brand colours.
 *   - LipidDroplet — decorative droplet with rings for the hero.
 *   - PhoneMockup  — phone frame wrapping a chat-mockup shape.
 */

import React from 'react';
import { motion } from 'motion/react';

const PRIMARY = '#a4d65e';
const PRIMARY_DARK = '#7fb344';
const BG_DEEP = '#0f2a24';
const BG = '#143730';
const FG = '#ffffff';
const MUTED = 'rgba(255,255,255,0.55)';

// ─── Biological Age Score dial ──────────────────────────────────────
//
// Donut chart with a dramatic arc, the score in the middle, and a
// "↓ 2.4 yrs in 30 days" caption to imply movement. Single-source-of-
// truth values via props so the section can render with realistic
// or aspirational numbers.
export function BioAgeDial({
  score = 38,
  delta = -2.4,
  size = 280,
}: {
  score?: number;
  delta?: number;
  size?: number;
}) {
  const radius = 110;
  const stroke = 16;
  const c = 2 * Math.PI * radius;
  // Map score 25..70 to arc fill 0..1 (younger biological age = more
  // green; the inverse is intuitive — better score, more arc filled).
  const ratio = Math.min(1, Math.max(0, (70 - score) / 45));
  const dash = c * ratio;
  const isBetter = delta < 0;
  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Biological Age Score ${score}, ${isBetter ? 'down' : 'up'} ${Math.abs(
        delta,
      )} years in 30 days`}
    >
      <svg viewBox="0 0 280 280" width={size} height={size}>
        <defs>
          <linearGradient id="dialGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={PRIMARY} stopOpacity="0.95" />
            <stop offset="100%" stopColor={PRIMARY_DARK} stopOpacity="0.85" />
          </linearGradient>
          <filter id="dialShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Glow under arc */}
        <circle
          cx="140"
          cy="140"
          r={radius}
          stroke={PRIMARY}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeDashoffset={c * 0.25}
          fill="none"
          opacity={0.3}
          filter="url(#dialShadow)"
        />

        {/* Foreground arc */}
        <motion.circle
          cx="140"
          cy="140"
          r={radius}
          stroke="url(#dialGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeDashoffset={c * 0.25}
          initial={{ strokeOpacity: 0 }}
          whileInView={{ strokeOpacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />

        {/* Score */}
        <text
          x="140"
          y="135"
          textAnchor="middle"
          fill={FG}
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="68"
          fontWeight={600}
        >
          {score}
        </text>
        <text
          x="140"
          y="162"
          textAnchor="middle"
          fill={MUTED}
          fontSize="12"
          letterSpacing="0.2em"
        >
          BIO AGE
        </text>

        {/* Delta pill */}
        <g transform="translate(140, 200)">
          <rect
            x="-46"
            y="-14"
            width="92"
            height="28"
            rx="14"
            fill={isBetter ? 'rgba(164,214,94,0.15)' : 'rgba(245,158,11,0.18)'}
          />
          <text
            x="0"
            y="5"
            textAnchor="middle"
            fill={isBetter ? PRIMARY : '#f59e0b'}
            fontSize="13"
            fontWeight={600}
          >
            {isBetter ? '↓' : '↑'} {Math.abs(delta).toFixed(1)} yrs · 30d
          </text>
        </g>
      </svg>
    </div>
  );
}

// ─── Kraft-style insulin pattern preview ────────────────────────────
//
// Tiny dual-line chart. The "drift" line shows an insulin response
// pattern that is concerning (slow recovery, second peak); the
// "healthy" line shows fast recovery. Used in the InsulinPattern
// section to give the abstract concept a visual anchor.
export function KraftCurve({ width = 480, height = 220 }: { width?: number; height?: number }) {
  // Time on x: 0, 30, 60, 90, 120, 150, 180 minutes
  const xs = [0, 30, 60, 90, 120, 150, 180];
  const healthy = [10, 35, 55, 40, 22, 14, 11]; // unit-less
  const concerning = [10, 50, 78, 88, 80, 65, 50];

  const padX = 36;
  const padY = 24;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const xMax = 180;
  const yMax = 100;

  const toPath = (data: number[]) =>
    data
      .map((y, i) => {
        const px = padX + (xs[i] / xMax) * innerW;
        const py = padY + innerH - (y / yMax) * innerH;
        return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
      })
      .join(' ');

  const healthyPath = toPath(healthy);
  const concerningPath = toPath(concerning);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="auto"
      role="img"
      aria-label="Insulin response curves: a fast-recovery healthy curve vs. a sustained-elevation concerning curve"
    >
      <defs>
        <linearGradient id="kraftHealthyFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PRIMARY} stopOpacity="0.25" />
          <stop offset="100%" stopColor={PRIMARY} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="kraftConcerningFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padX}
          x2={width - padX}
          y1={padY + innerH * t}
          y2={padY + innerH * t}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Concerning area */}
      <path
        d={`${concerningPath} L ${width - padX} ${height - padY} L ${padX} ${height - padY} Z`}
        fill="url(#kraftConcerningFill)"
      />
      {/* Healthy area */}
      <path
        d={`${healthyPath} L ${width - padX} ${height - padY} L ${padX} ${height - padY} Z`}
        fill="url(#kraftHealthyFill)"
      />

      {/* Concerning line */}
      <motion.path
        d={concerningPath}
        stroke="#f59e0b"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3 }}
      />
      {/* Healthy line */}
      <motion.path
        d={healthyPath}
        stroke={PRIMARY}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, delay: 0.15 }}
      />

      {/* X-axis labels */}
      {xs.filter((_, i) => i % 2 === 0).map((t) => (
        <text
          key={t}
          x={padX + (t / xMax) * innerW}
          y={height - 4}
          textAnchor="middle"
          fontSize="10"
          fill={MUTED}
        >
          {t}m
        </text>
      ))}

      {/* Legend */}
      <g transform={`translate(${padX}, 8)`}>
        <circle cx="6" cy="6" r="4" fill={PRIMARY} />
        <text x="16" y="9" fontSize="11" fill={FG}>
          Fast recovery
        </text>
        <circle cx="120" cy="6" r="4" fill="#f59e0b" />
        <text x="130" y="9" fontSize="11" fill={FG}>
          Sustained elevation
        </text>
      </g>
    </svg>
  );
}

// ─── eBook cover mock ───────────────────────────────────────────────
export function EbookCover({ width = 200 }: { width?: number }) {
  const height = (width * 4) / 3;
  return (
    <div
      className="relative mx-auto"
      style={{
        width,
        height,
        transform: 'perspective(900px) rotateY(-12deg) rotateX(2deg)',
        transformStyle: 'preserve-3d',
        filter: 'drop-shadow(8px 14px 30px rgba(0,0,0,0.45))',
      }}
    >
      <svg viewBox="0 0 200 267" width={width} height={height}>
        <defs>
          <linearGradient id="bookCover" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1f5246" />
            <stop offset="100%" stopColor="#0c2a23" />
          </linearGradient>
          <linearGradient id="bookSpine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a1f1a" />
            <stop offset="100%" stopColor="#162e27" />
          </linearGradient>
        </defs>

        {/* Spine */}
        <rect x="0" y="0" width="10" height="267" fill="url(#bookSpine)" />
        {/* Cover */}
        <rect x="10" y="0" width="190" height="267" fill="url(#bookCover)" />
        {/* Subtle inner border */}
        <rect
          x="22"
          y="14"
          width="166"
          height="239"
          rx="4"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
        />
        {/* Brand mark — droplet */}
        <g transform="translate(36, 38)">
          <path
            d="M14 0C14 0 4 14 4 22C4 28.4183 8.4 33 14 33C19.6 33 24 28.4183 24 22C24 14 14 0 14 0Z"
            fill={PRIMARY}
          />
        </g>
        {/* Title */}
        <text
          x="36"
          y="120"
          fill={FG}
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="22"
          fontWeight={600}
        >
          Lower
        </text>
        <text
          x="36"
          y="144"
          fill={FG}
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="22"
          fontWeight={600}
        >
          your
        </text>
        <text
          x="36"
          y="168"
          fill={PRIMARY}
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="22"
          fontWeight={600}
        >
          biology.
        </text>
        {/* Subtitle */}
        <text x="36" y="200" fill={MUTED} fontSize="9" letterSpacing="0.18em">
          A 6-WEEK PROTOCOL
        </text>
        {/* Author block */}
        <text x="36" y="240" fill={MUTED} fontSize="9">
          by the Meo team
        </text>
      </svg>
    </div>
  );
}

// ─── Hero decorative droplet ────────────────────────────────────────
export function LipidDroplet({ size = 120 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id="dropletGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={PRIMARY} stopOpacity="0.45" />
          <stop offset="100%" stopColor={PRIMARY} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dropletFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdf08a" />
          <stop offset="100%" stopColor={PRIMARY} />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#dropletGlow)" />
      <path
        d="M60 16C60 16 30 50 30 72C30 92 44 104 60 104C76 104 90 92 90 72C90 50 60 16 60 16Z"
        fill="url(#dropletFill)"
      />
      {/* Highlight */}
      <ellipse cx="50" cy="55" rx="6" ry="14" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}
