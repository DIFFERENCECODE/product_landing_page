import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Cabinet Grotesk is the primary face for the whole site. It is
// hosted on Fontshare (not Google Fonts), so we load it via an
// @import inside globals.css rather than next/font/google.
//
// Geist stays loaded as a system fallback that next/font sets up
// behind the scenes — used if Cabinet Grotesk fails to load and the
// system fallback chain in globals.css's :root rule is still
// crawling. Geist Mono is reserved for any future numeric/monospaced
// runs.
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://shop.meterbolic.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Meo — Metabolic Intelligence System",
    template: "%s · Meo",
  },
  description:
    "See what your cholesterol is actually telling you. Meo turns a 3-minute finger-prick into a complete metabolic picture — interpreted by AI, framed for longevity, actionable the same day.",
  keywords: [
    "at-home cholesterol test",
    "lipid meter",
    "metabolic health",
    "biological age",
    "Kraft test",
    "Meo AI",
    "cholesterol monitoring",
    "longevity",
    "HDL LDL TG",
  ],
  authors: [{ name: "Meterbolic" }],
  creator: "Meterbolic",
  publisher: "Meterbolic",
  category: "health",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Meo — Metabolic Intelligence System",
    description:
      "Digital lipid meter + Meo AI + eBook. At-home lipid tracking with AI interpretation. 30-day money-back.",
    type: "website",
    siteName: "Meo",
    url: SITE_URL,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meo — Metabolic Intelligence System",
    description:
      "Your cholesterol, read back to you. 3 minutes, at home, interpreted by Meo AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

// JSON-LD structured data — Organization + Product schema. Helps
// Google show rich results (price, star rating once we have reviews,
// brand info) and gives social platforms more to work with.
const ORG_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Meterbolic",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    "Meo is the Metabolic Intelligence System by Meterbolic — at-home lipid testing, AI interpretation, and an action manual.",
  sameAs: ["https://meterbolic.com"],
};

const PRODUCT_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Metabolic Health Cholesterol Tracker",
  description:
    "6 months of Meo AI + Digital Lipid Meter (bundled free) + The Thin Book of Fat by Marina Young. At-home cholesterol monitoring with AI-powered interpretation, a Biological Age Score, and a free retest at 6 months.",
  image: [`${SITE_URL}/lipid-meter.png`],
  brand: { "@type": "Brand", name: "Meo" },
  category: "Health & Wellness Monitoring Tools",
  offers: {
    "@type": "Offer",
    priceCurrency: "GBP",
    price: "149.00",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/checkout`,
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0",
        currency: "GBP",
      },
      shippingDestination: [
        { "@type": "DefinedRegion", addressCountry: "GB" },
        { "@type": "DefinedRegion", addressCountry: "US" },
        { "@type": "DefinedRegion", addressCountry: "CA" },
        { "@type": "DefinedRegion", addressCountry: "AU" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Analytics — env-var driven so the same code supports either
  // Plausible (privacy-friendly, GDPR-compliant by default, no
  // cookie banner needed) or GA4. Set ONE of:
  //   NEXT_PUBLIC_PLAUSIBLE_DOMAIN  e.g. shop.meterbolic.com
  //   NEXT_PUBLIC_GA_ID             e.g. G-XXXXXXXXXX
  // and the corresponding script tag lights up at next build.
  // Leaving both unset = no analytics tags, no third-party
  // requests = no cookie banner needed.
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        {/* Privacy-friendly analytics. Defer + async means it never
            blocks LCP. Plausible is the recommended choice for an
            EU-customer audience because it doesn't drop any tracking
            cookies and exempts the site from cookie-banner law. */}
        {plausibleDomain && (
          <script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', { anonymize_ip: true });
                `,
              }}
            />
          </>
        )}
        {/* Typography — two faces, two CDNs:
              - Cabinet Grotesk (Fontshare) for body
              - Bricolage Grotesque (Google Fonts) for headings
            Preconnect first so each TLS handshake is paid once. */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap"
        />

        {/* Meta Pixel — fires PageView on every navigation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '639378155283159');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=639378155283159&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* Inject JSON-LD as inline scripts so Google can ingest at first paint. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_LD) }}
        />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
