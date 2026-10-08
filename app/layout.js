import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const play = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-play",
  display: "swap",
});
export const metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    images: [{ url: "/karima.jpg", width: 900, height: 1400, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/karima.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#a3174f",
};
const ld = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Karima Reda",
  alternateName: "كريمة رضا",
  jobTitle: "UGC Creator & Influencer",
  url: site.url,
  image: site.url + "/karima.jpg",
  sameAs: [site.instagram, site.tiktok],
  knowsAbout: ["UGC", "Skincare", "Perfume", "Fashion", "Food"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${play.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
        {children}
      </body>
    </html>
  );
}
