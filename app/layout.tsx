import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/darkMode/theme-provider";
import Navbar from "@/components/navbar/Navbar";
import { Providers } from "@/providers/providers";
import React from "react";
import { createClient } from "@/utils/supabase/server";

const ibm_plex_sans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Domora - Rooms and Community",
  description: "Join the next generation of social engagement where communities come alive through interactive battles, trust-based validation, and micro-learning. Experience structured debates, fact-checking, and knowledge sharing in an innovative social ecosystem.",
  keywords: "social platform, community engagement, battle arena, knowledge validation, fact-checking, micro-learning, interactive discussions, trust system, smart rooms, community innovation, online debates, social learning",

  // Open Graph metadata (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: "Domora | Where Communities Come Alive",
    description: "Revolutionary social platform featuring interactive battles, trust-based validation, and micro-learning. Join the future of online community engagement.",
    type: "website",
    locale: "en_US",
    siteName: "Domora",
    images: [
      {
        url: "/images/og-image.jpg", // Replace with your actual image path
        width: 1200,
        height: 630,
        alt: "Domora - Community Battle Arena",
      }
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "https://x.com/akshay_gaddi", // Replace with your Twitter handle
    title: "Domora - Interactive Community Battle Arena",
    description: "Experience the future of social engagement with interactive battles, trust-based validation, and micro-learning. Join our innovative community platform.",
    images: ["/images/twitter-card.jpg"], // Replace with your actual image path
  },

  // Additional social media metadata
  other: {
    "pinterest:description": "Discover Domora - The revolutionary community platform for interactive learning and engagement",
    "pinterest:image": "/images/pinterest-image.jpg", // Replace with your actual image path
    "linkedin:image": "/images/linkedin-image.jpg", // Replace with your actual image path
    "instagram:image": "/images/instagram-image.jpg", // Replace with your actual image path
  },

  // Additional metadata
  authors: [{ name: "Domora Team" }],
  category: "Social Platform",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },

  // Additional tags for better SEO
  alternates: {
    canonical: "https://domora.vercel.app/", // Replace with your actual domain
  },

  verification: {
    google: "your-google-verification-code", // Replace with your verification code
    yandex: "your-yandex-verification-code", // Replace with your verification code
    other: {
      "facebook-domain-verification": "your-facebook-verification-code", // Replace with your verification code
    },
  },

  // Additional metadata for rich snippets
  applicationName: "Domora",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  creator: "Domora Team",
  publisher: "Domora",
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
};
export default async function RootLayout({
                                           children,
                                         }: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${ibm_plex_sans.className} bg-white dark:bg-gray-950`}>
    <Providers>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex flex-col">
          <Navbar user={user} />
          <main className="flex-1 pt-24 bg-gradient-to-b from-white via-orange-50/30 to-amber-50/30 dark:from-gray-950 dark:via-orange-900/5 dark:to-amber-900/5">
            {children}
          </main>
          <Toaster />
        </div>
      </ThemeProvider>
    </Providers>
    </body>
    </html>
  );
}