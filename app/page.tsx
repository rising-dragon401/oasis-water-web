import SubpageLayout from '@/components/home-layout'

import RecentlyTestedRow from '@/components/recently-tested-row'
import ContributeSection from '@/components/sections/contribute-section'
import FundingRowsSection from '@/components/sections/funding-rows-section'
import TapWaterSection from '@/components/sections/tap-water-section'
import TopProductsSection from '@/components/sections/top-products-section'
import AppDownloadCta from '@/components/shared/app-download-cta'

import DownloadAppButton from '@/components/shared/download-app-button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { H1, H2, Muted } from '@/components/ui/typography'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || ''),
  title: 'Oasis',
  description: 'Science-backed water and filter ratings',
  openGraph: {
    title: 'Oasis',
    description: 'Science-backed water and filter ratings',
    siteName: 'Oasis',
    images: [
      {
        url: 'https://connect.live-oasis.com/storage/v1/object/public/website/images/og/Oasis%20App%20Open%20Graph.png?t=2024-11-20T05%3A35%3A10.978Z',
        width: 800,
        height: 600,
      },
      {
        url: 'https://connect.live-oasis.com/storage/v1/object/public/website/images/og/Oasis%20App%20Open%20Graph.png?t=2024-11-20T05%3A35%3A10.978Z',
        width: 1800,
        height: 1600,
        alt: 'water ratings',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

const FAQ_LIST = [
  {
    value: 'testing',
    trigger: 'Do you test products yourselves?',
    content:
      'We use a combination of verified brand lab reports in addition to internally funded tests and community contributions',
  },
  {
    value: 'what-is-oasis',
    trigger: 'What is Oasis?',
    content:
      'Oasis is a project we started to help find a healthier, cleaner source of water. We collect all the hard to find scientific data surrounding water, brands and filters and put it into one searchable website. Long-term we are on a mission to source the cleanest and healthiest source of water to you. ',
  },
  {
    value: 'why-do-you-charge',
    trigger: 'Why do I need to pay for ratings?',
    content:
      'Lab testing is very expensive and our aim is to independently test as many products as possible to ensure the most accurate and unbiased ratings. Funds go to further testing/research in addition to improving the product.',
  },
  {
    value: 'do-you-get-paid-to-promote-brands',
    trigger: 'Do you get paid to promote brands?',
    content:
      'Nope. We never do paid sponsorships, ads or any type of paid promotion. All data and marketing is purely based off the lab and research and funded by us.',
  },
  {
    value: 'how-scoring-works',
    trigger: 'How does the scoring work?',
    content:
      "Scoring for waters and filters is based on a comprehensive analysis of the scientific data and elements from the lab reports. Please see the 'How Scoring Works' page on our website for more details.",
  },
  // {
  //   value: 'tap-water-rated-higher',
  //   trigger: 'Why is some tap water rated higher than bottled waters?',
  //   content:
  //     'Tap water ratings are scored on a different scale than bottled water ratings. And should not be direclty compared.',
  // },
  {
    value: 'data',
    trigger: 'Where do you get your data from?',
    content:
      'We get our data from science-backed research papers, official water testing reports, non-profit research centers like EWG and from leading scientific experts.',
  },
  {
    value: 'affiliate-links',
    trigger: 'Do you use affilite links?',
    content:
      'We do add affiliate links to help fund this project and to help direct people to where to buy each product.',
  },
  {
    value: 'testing',
    trigger: 'Can I get my water tested?',
    content:
      'We partner with Tapscore to provide testing kits and analyze toxins in water. You can learn more on the Lab testing page',
  },
]

export default function HomePage() {
  return (
    <SubpageLayout>
      <div className="flex flex-col space-y-16 pb-10">
        <div className="md:pt-16 pt-12">
          <div className="mx-auto max-w-6xl px-4 lg:px-8 text-center flex flex-col items-center">
            <H1 className="md:text-5xl text-3xl md:max-w-none max-w-sm font-bold tracking-tight mb-2">
              What&apos;s in your water?
            </H1>
            <Muted className="md:text-base sm:text-sm max-w-xl">
              Uncover hidden contaminants in your water and choose the healthiest options for you
              and your family based on science and unbiased ratings.
            </Muted>

            <div className="md:mt-6 mt-4 flex gap-4 md:flex-row justify-center flex-col-reverse items-center w-full">
              <Link href="/product-testing">
                <Button className="h-10 px-6 rounded-lg" variant="outline">
                  Contribute
                </Button>
              </Link>
              <DownloadAppButton showIcon className="h-10 px-6" overrideText="Check your water" />
            </div>
            <div className="md:mt-10 mt-8 flex justify-center">
              <Image
                alt="Oasis water scanner"
                src="https://connect.live-oasis.com/storage/v1/object/public/website/images/landing/acqua-pann-scan-light.png?t=2024-11-19T00%3A22%3A59.079Z"
                width={400}
                height={800}
                className="md:w-48 w-44 h-auto rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col items-center md:mt-6 mt-4 max-w-screen overflow-hidden">
            <RecentlyTestedRow />
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-10">
          <FundingRowsSection />
        </div>

        <div className="w-screen md:pb-10 py-0 pt-14 md:px-0 px-4 bg-backgroundTertiary">
          <TapWaterSection />
        </div>

        <div className="max-w-4xl mx-auto py-10 w-full">
          <TopProductsSection />
        </div>

        <ContributeSection />

        <div className="md:pt-8 md:pb-16 pt-8 pb-8 mt-10">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <H2 className="text-center font-normal mb-10">Frequently Asked Questions</H2>
            <div className="space-y-6">
              <Accordion type="single" collapsible className="">
                {FAQ_LIST.map((faq) => (
                  <AccordionItem key={faq.value} value={faq.value}>
                    <AccordionTrigger className="text-primary font-bold hover:bg-secondary hover:underline-none rounded-t-lg px-2 text-left">
                      {faq.trigger}
                    </AccordionTrigger>
                    <AccordionContent className="text-primary rounded-b-lg px-2">
                      {faq.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:mx-0 mx-4 mb-10 mt-14">
          <AppDownloadCta />
        </div>
      </div>
    </SubpageLayout>
  )
}
