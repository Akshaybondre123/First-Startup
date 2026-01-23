import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wampin - Discover the Best Food & Vibes",
  description:
    "Find the best restaurants, cafes, and party places around you. Search by tags, price, rating, and distance. Read reviews, view photos, and discover your next favorite dining spot.",
  keywords:
    "restaurants, food delivery, best cafes, party places, restaurant discovery, food near me, food guide",

  // ✅ Google Search Console Verification
  verification: {
    google: "SKEuV2OaFanEIr8WHZXw6wE8mmfIXQ5hf4nSBAgukmA",
  },

  openGraph: {
    title: "Wampin - Discover the Best Food & Vibes",
    description: "Find the best restaurants, cafes, and party places around you.",
    type: "website",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Wampin - Discover the Best Food & Vibes",
    description: "Find the best restaurants, cafes, and party places around you.",
  },

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wampin",
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },

  icons: {
    icon: "/wampin.ico",
    shortcut: "/wampin.ico",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/wampin.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/wampin.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
