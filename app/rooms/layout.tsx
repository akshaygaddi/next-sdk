// app/rooms/layout.tsx
import type { Viewport } from 'next'

// Static viewport configuration for rooms
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 3,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
  // Set interactive widget behavior
  interactiveWidget: 'resizes-visual',
}

// Server Component Layout
export default function RoomsLayout({
                                      children,
                                    }: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[100dvh] overflow-hidden">
      {children}
    </div>
  )
}