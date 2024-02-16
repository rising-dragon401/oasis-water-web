import RecommendationsSection from './components/recommendations-section'
import SubpageLayout from '@/components/home-layout'

const meta = {
  title: 'Cleanest Bottled Water Brands | Oasis',
  description: 'The healthiest and cleanest bottled water brands.',
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://oasis.com'),
  openGraph: {
    title: meta.title,
    description: meta.description,
    locale: 'en_US',
    type: 'website',
  },
}

export default async function RecommendationsPage() {
  return (
    <SubpageLayout>
      <RecommendationsSection />
    </SubpageLayout>
  )
}
