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
  title: "Your App Title",
  description: "Your App Description for SEO",
  keywords: "next.js, app, dark mode, authentication",
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
              <main className="flex-1 pt-24  bg-gradient-to-b from-white via-orange-50/30 to-amber-50/30 dark:from-gray-950 dark:via-orange-900/5 dark:to-amber-900/5">
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
