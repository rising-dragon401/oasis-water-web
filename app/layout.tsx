import { Toaster } from '@/components/ui/sonner'
import { ModalProvider } from '@/providers/ModalProvider'
import UserProvider from '@/providers/UserProvider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import cn from 'classnames'
import SupabaseProvider from '../providers/SupabaseProvider'
import { lato } from './fonts'
import { CSPostHogProvider } from './providers'

import '@/styles/globals.css'

export const metadata = {
  title: 'Oasis',
  description: 'Science-backed water ratings',
  robots: 'follow, index',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Oasis',
    description: 'Science-backed water ratings',
    url: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://oasiswater.app'),
    siteName: 'Oasis',
    images: [
      {
        url: 'https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/oaisys_open_graph.jpg',
        width: 800,
        height: 600,
      },
      {
        url: 'https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/oaisys_open_graph.jpg',
        width: 1800,
        height: 1600,
        alt: 'water ratings',
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
                <ModalProvider>{children}</ModalProvider>
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
