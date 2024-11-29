import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/darkMode/theme-provider";
import Navbar from "@/components/navbar/Navbar";
import { Providers } from "@/providers/providers";

const ibm_plex_sans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"], // Optional: specify font weights you'll use
  subsets: ["latin"], // Specify the character set
  variable: "--font-ibm-plex-sans", // CSS variable to use in your styles
  display: "swap", // Recommended for performance
});

export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your App Description for SEO",
  keywords: "next.js, app, dark mode, authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ibm_plex_sans.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
