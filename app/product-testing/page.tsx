import SubpageLayout from '@/components/home-layout'
import { OG_IMAGE } from '@/lib/constants/images'
import TestingBlock from './components/testing-block'
export const metadata = {
  title: 'Product Testing | Oasis',
  description: 'Track the latest products being independently tested on Oasis.',
  openGraph: {
    title: 'Product Testing | Oasis',
    description: 'Track the latest products being independently tested on Oasis.',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/product-testing`,
    type: 'website',
    locale: 'en_US',
    images: [OG_IMAGE],
  },
  twitter: {
    title: 'Product Testing | Oasis',
    description: 'Track the latest products being independently tested on Oasis.',
    images: [OG_IMAGE],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.oasiswater.app/'),
}

export default function ProductTestingPage() {
  return (
    <SubpageLayout>
      <TestingBlock />
    </SubpageLayout>
  )
}
