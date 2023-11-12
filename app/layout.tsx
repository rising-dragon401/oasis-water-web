import { lato } from './fonts'
import cn from 'classnames'

import '@/styles/globals.css'

export const metadata = {
  title: 'Oaisys',
  description: 'Your source of clean water.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(lato.className, 'bg-background mx-auto max-w-6xl')}>
      <body>{children}</body>
    </html>
  )
}
