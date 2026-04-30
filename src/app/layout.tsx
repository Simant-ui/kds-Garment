import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "@/components/layout/RootLayoutClient";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Best Garment Company in Nepal | KDS Readymade Udhyog Bardibas",
    template: "%s | KDS Readymade Udhyog",
  },
  description: "KDS Readymade Udhyog is the best garment company in Nepal, located near Bardibas, Mahottari. Specializing in high-quality uniforms and corporate wear in the Terai region.",
  keywords: [
    "Best garment company in Nepal", 
    "Garment near Bardibas", 
    "Garment near Mahottari", 
    "Garment manufacturer in Terai",
    "Clothing factory Mahottari",
    "School Uniforms Nepal", 
    "Corporate Wear Nepal", 
    "KDS Garment", 
    "Lalgadh Garment Factory"
  ],
  authors: [{ name: "KDS Readymade Udhyog" }],
  creator: "KDS Readymade Udhyog",
  publisher: "KDS Readymade Udhyog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kdsreadymadeudhyog.com.np"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Best Garment Company in Nepal | KDS Readymade Udhyog Mahottari",
    description: "Looking for a garment near Bardibas or Mahottari? KDS Readymade Udhyog is the premier choice for custom apparel in the Terai region of Nepal.",
    url: "https://kdsreadymadeudhyog.com.np",
    siteName: "KDS Readymade Udhyog",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "KDS Readymade Udhyog Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Garment Company in Nepal | KDS Bardibas",
    description: "Premier garment manufacturer near Bardibas and Mahottari. High-quality custom clothing in Terai, Nepal.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "KDS Readymade Udhyog",
              "image": "https://kdsreadymadeudhyog.com.np/logo.png",
              "@id": "https://kdsreadymadeudhyog.com.np",
              "url": "https://kdsreadymadeudhyog.com.np",
              "telephone": "+977-9855073550",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Lalgadh",
                "addressLocality": "Lalgadh",
                "addressRegion": "Madesh Province",
                "postalCode": "45600",
                "addressCountry": "NP"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 26.9667,
                "longitude": 85.9167
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Sunday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://facebook.com/kdsgarment",
                "https://instagram.com/kdsgarment"
              ]
            }),
          }}
        />
      </body>
    </html>
  );
}
