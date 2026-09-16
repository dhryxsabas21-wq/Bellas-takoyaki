import type { Metadata, Viewport } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";
import { BUSINESS, isUnset } from "@/lib/business";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// The full tagline is too long for a <title>; keep that for the footer and
// use a search-friendly line here instead.
const title = `${BUSINESS.name} — Authentic Japanese Street Food in ${BUSINESS.address.locality}`;
const description = BUSINESS.pitch;

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.siteUrl),
  title: {
    default: title,
    template: `%s | ${BUSINESS.name}`,
  },
  description,
  keywords: [
    "takoyaki",
    "Japanese street food",
    `takoyaki ${BUSINESS.address.locality}`,
    BUSINESS.address.locality,
    BUSINESS.address.region,
    "okonomiyaki",
    "yakisoba",
    "GCash",
  ],
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: BUSINESS.siteUrl,
    siteName: BUSINESS.name,
    title,
    description,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${BUSINESS.name} — freshly griddled takoyaki`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image.jpg"],
  },
  icons: {
    // A 180px copy of the logo — favicons are served raw, so the full-size
    // logo.png would be a wasted 398 KB on every page load.
    icon: "/images/logo-icon.png",
    apple: "/images/logo-icon.png",
  },
  alternates: { canonical: BUSINESS.siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#d21f1f",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: BUSINESS.name,
  description,
  url: BUSINESS.siteUrl,
  image: `${BUSINESS.siteUrl}/images/og-image.jpg`,
  telephone: BUSINESS.phoneTel,
  priceRange: BUSINESS.priceRange,
  servesCuisine: ["Japanese", "Street Food"],
  foundingDate: String(BUSINESS.since),
  sameAs: [BUSINESS.facebookUrl],
  address: {
    "@type": "PostalAddress",
    // Omit the street line entirely until a real one is set — a placeholder
    // in structured data is worse than no line at all.
    ...(isUnset(BUSINESS.address.street)
      ? {}
      : { streetAddress: BUSINESS.address.street }),
    addressLocality: BUSINESS.address.locality,
    addressRegion: BUSINESS.address.region,
    addressCountry: "PH",
  },
  openingHoursSpecification: BUSINESS.hours.schema.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: slot.days,
    opens: slot.opens,
    closes: slot.closes,
  })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PH" className={`${fredoka.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
