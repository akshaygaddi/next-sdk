// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar/Navbar";
import { Providers } from "@/providers/providers";
import React, { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import ErrorBoundary from "@/components/ErrorBoundary";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Domora - Rooms and Community",
    template: "%s | Domora"
  },
  description: "Join the next generation of social engagement where communities come alive through interactive battles, trust-based validation, and micro-learning.",
};

// Add viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020817' }, // Using your dark mode background color
  ],
  colorScheme: 'light dark',
  // Ensure proper display on iOS devices
  viewportFit: 'cover',
  // Improve interaction on iOS
  interactiveWidget: 'resizes-visual',
};

const NavbarWrapper = async () => {
  try {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Auth error:', error);
      return <Navbar user={null} />;
    }

    return <Navbar user={user} />;
  } catch (error) {
    console.error('Failed to load user:', error);
    return <Navbar user={null} />;
  }
};

const NavbarLoading = () => (
  <div className="fixed top-0 w-full z-50 safe-area-inset">
    <div className="h-16 bg-background/80 backdrop-blur-lg border-b">
      <div className="container-responsive h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-muted animate-pulse" />
            <div className="w-20 sm:w-24 h-6 sm:h-8 rounded-xl bg-muted animate-pulse" />
          </div>

          <div className="hidden md:flex items-center gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 sm:w-20 h-6 sm:h-8 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-muted animate-pulse" />
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:rounded-xl"
  >
    Skip to main content
  </a>
);

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={ibmPlexSans.variable}>
    <body className="font-sans min-h-screen flex flex-col bg-background text-foreground antialiased">
    <Providers>
      <SkipToContent />

      <header className="relative z-50">
        <ErrorBoundary fallback={<NavbarLoading />}>
          <Suspense fallback={<NavbarLoading />}>
            <NavbarWrapper />
          </Suspense>
        </ErrorBoundary>
      </header>

      <main
        id="main-content"
        className="flex-1 relative z-0 w-full pt-16 safe-area-inset"
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-background via-accent to-muted animate-gradient-x"
          style={{ backgroundSize: '400% 400%' }}
          aria-hidden="true"
        />

        <div className="relative w-full min-h-[calc(100vh-4rem)] pt-16">
          {children}
        </div>
      </main>

      <div className="relative z-50">
        <Toaster />
      </div>
    </Providers>
    </body>
    </html>
  );
}