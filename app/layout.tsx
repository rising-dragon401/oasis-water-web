import { lato } from './fonts'
import cn from 'classnames'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from '@/components/ui/sonner'
import { CSPostHogProvider } from './providers'
import SupabaseProvider from '../providers/SupabaseProvider'
import UserProvider from '@/providers/UserProvider'
import { SpeedInsights } from '@vercel/speed-insights/next'

import '@/styles/globals.css'

const meta = {
  title: 'Oasis',
  description: 'Your source of clean water.',
  cardImage:
    'https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/oaisys_open_graph.jpg',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://oasis.ai',
  type: 'website',
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://oasis.com'),
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: meta.url,
    siteName: meta.title,
    images: [
      {
        url: meta.cardImage,
        width: 800,
        height: 600,
      },
      {
        url: meta.cardImage,
        width: 1800,
        height: 1600,
        alt: 'water health checker',
      },
    ],

    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(lato.className, 'bg-background mx-auto')}>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon?<generated>" type="image/<generated>" sizes="<generated>" />
      <link
        rel="apple-touch-icon"
        href="/apple-icon?<generated>"
        type="image/<generated>"
        sizes="<generated>"
      />

      <CSPostHogProvider>
        <body>
          <SupabaseProvider>
            <UserProvider>
              <main id="skip" className="h-[calc(100dvh)]">
                {children}
                <SpeedInsights />
              </main>

              <Analytics />
              <Toaster />
            </UserProvider>
          </SupabaseProvider>
        </body>
      </CSPostHogProvider>
    </html>
  )
}
