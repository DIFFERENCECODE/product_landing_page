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
  name: "Meo Starter System",
  description:
    "Digital lipid meter + 1 month of Meo AI + eBook. At-home cholesterol monitoring with AI-powered interpretation and a Biological Age Score.",
  image: [`${SITE_URL}/sejoy_1.png`],
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
  return (
    <html lang="en">
      <head>
        {/* Cabinet Grotesk — hosted on Fontshare. Preconnect first so
            the TLS handshake to api.fontshare.com is paid for once,
            then the stylesheet load is fast. */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap"
        />

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
