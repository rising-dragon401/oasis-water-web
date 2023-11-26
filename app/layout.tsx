import { lato } from './fonts'
import cn from 'classnames'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from '@/components/ui/toaster'
import { CSPostHogProvider } from './providers'

import '@/styles/globals.css'

const meta = {
  title: 'Oaisys',
  description: 'Your source of clean water.',
  cardImage:
    'https://inruqrymqosbfeygykdx.supabase.co/storage/v1/object/public/website/oaisys_open_graph.jpg',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://oaisys.ai',
  type: 'website',
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://oaisys.com'),
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
        alt: 'train your ai agent',
      },
    ],

    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(lato.className, 'bg-background mx-auto max-w-6xl')}>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon?<generated>" type="image/<generated>" sizes="<generated>" />
      <link
        rel="apple-touch-icon"
        href="/apple-icon?<generated>"
        type="image/<generated>"
        sizes="<generated>"
      />

      {/* <CSPostHogProvider> */}
      <body>
        {children}
        <Analytics />
        <Toaster />
      </body>
      {/* </CSPostHogProvider> */}
    </html>
  )
}
