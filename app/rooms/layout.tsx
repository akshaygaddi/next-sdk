
"use client";
// app/rooms/layout.tsx
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export default function RoomsLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
