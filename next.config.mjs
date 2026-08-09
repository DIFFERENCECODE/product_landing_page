/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // No redirects.
  //
  // There WAS a permanent `/coaching → /eos` here (2026-08-06). It has
  // been removed: /coaching is the canonical coaching page again, and
  // /eos now serves the same page as a partner-brand alias with a
  // rel=canonical back to /coaching.
  //
  // Do NOT replace it with the reverse redirect. That 308 was cached
  // permanently by every browser that saw it, so `/eos → /coaching`
  // would send those clients round in a loop: /coaching → (cache) /eos
  // → /coaching → … which is exactly the "keeps retrying, never comes
  // up" symptom. Two 200s and one canonical is the loop-free fix.
  // See components/coaching/CoachingProgrammePage.tsx.

  //
  // Cache headers: temporarily set HTML to `no-store` to force-bust
  // every browser that has an old `s-maxage=31536000` HTML cached
  // (Next.js's pre-fix default). Once a few days have passed and
  // every visitor has seen at least one no-store response, switch
  // back to `must-revalidate` for performance.
  //
  // Static assets (/_next/...) and API responses keep their default
  // cache directives — only HTML routes are affected here.
  async headers() {
    return [
      {
        source: '/:path((?!_next|api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
