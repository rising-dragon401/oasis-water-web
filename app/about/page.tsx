import ManifestoSection from './components/about-section'
import SubpageLayout from '@/components/home-layout'

export const metadata = {
  openGraph: {
    title: 'About Oaisys',
    description: '.',
    images: [
      {
        url:
          'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/manifesto/maia_manifesto_opengraph.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default async function ManifestoPage() {
  return (
    <SubpageLayout>
      <ManifestoSection />
    </SubpageLayout>
  )
}
