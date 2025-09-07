import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RouteWise - Book Bus Tickets Online',
  description: 'Find and book bus tickets across India. Compare prices, choose seats, and travel comfortably with RouteWise.',
  keywords: ['bus booking', 'travel', 'transportation', 'tickets', 'route planning', 'online booking'],
  authors: [{ name: 'RouteWise Team' }],
  openGraph: {
    title: 'RouteWise - Book Bus Tickets Online',
    description: 'Find and book bus tickets across India. Compare prices, choose seats, and travel comfortably.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RouteWise - Book Bus Tickets Online',
    description: 'Find and book bus tickets across India. Compare prices, choose seats, and travel comfortably.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
