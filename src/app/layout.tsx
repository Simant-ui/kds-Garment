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
    default: "KDS Readymade Udhyog | Nepal's Premier Garment Manufacturer",
    template: "%s | KDS Readymade Udhyog",
  },
  description: "Nepal's leading garment manufacturer specializing in corporate wear, school uniforms, and high-quality custom apparel. Quality you can trust since 2018.",
  keywords: ["Garment Manufacturer Nepal", "School Uniforms Nepal", "Corporate Wear Nepal", "Custom T-shirts Nepal", "KDS Garment", "Lalgadh Garment Factory", "Wholesale Clothing Nepal", "Nepal Textiles"],
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
    title: "KDS Readymade Udhyog | Nepal's Premier Garment Manufacturer",
    description: "High-quality corporate wear, school uniforms, and custom garments delivered across Nepal. Established in 2018.",
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
    title: "KDS Readymade Udhyog | Nepal's Premier Garment Manufacturer",
    description: "Nepal's leading garment manufacturer specializing in corporate wear, school uniforms, and custom apparel.",
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
