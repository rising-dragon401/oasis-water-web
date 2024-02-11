import AboutSection from './components/about-section'
import SubpageLayout from '@/components/home-layout'

export const metadata = {
  // metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://oaisys.com'),
  // openGraph: {
  //   title: 'About Oaisys',
  //   description: '.',
  //   images: [
  //     {
  //       url:
  //         'https://dcsladfmohmhomyxvhzz.supabase.co/storage/v1/object/public/general/website/manifesto/maia_manifesto_opengraph.png',
  //       width: 800,
  //       height: 600,
  //     },
  //   ],
  //   locale: 'en_US',
  //   type: 'website',
  // },
}

export default async function MissionPage() {
  return (
    <SubpageLayout>
      <AboutSection />
    </SubpageLayout>
  )
}
