import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meterbolic — Know your Metabolic Health in Minutes",
  description:
    "One finger-prick. Five biomarkers. Your complete lipid picture at home — plus a personalised plan, the eBook, and 3 months of your MeO AI coach.",
  openGraph: {
    title: "Meterbolic — Know your Metabolic Health in Minutes",
    description:
      "One finger-prick. Five biomarkers. Your complete lipid picture at home.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
