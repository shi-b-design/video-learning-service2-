import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Video Code Review Service',
  description: 'Learn why developers make certain decisions in coding tutorials',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}