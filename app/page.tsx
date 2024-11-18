import SubpageLayout from '@/components/home-layout'
import RecentlyTestedRow from '@/components/recently-tested-row'
import AppDownloadCta from '@/components/shared/app-download-cta'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { H1, H2, Muted, P } from '@/components/ui/typography'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const appPreviewImage =
  'https://connect.live-oasis.com/storage/v1/object/public/website/images/landing/oasis-scan-cards.png?t=2024-11-18T02%3A40%3A43.880Z'

// export const metadata = {
//   title: 'Oasis Affiliates',
//   description: 'Get paid 💸 to share healthy water',
//   openGraph: {
//     title: 'Oasis Affiliates',
//     description: 'Get paid 💸 to share healthy water',
//     siteName: 'Oasis',
//     images: [
//       {
//         url: 'https://connect.live-oasis.com/storage/v1/object/public/website/landing/oasis%20affiliate%20open%20graph.png?t=2024-09-30T21%3A25%3A15.413Z',
//         width: 800,
//         height: 600,
//       },
//       {
//         url: 'https://connect.live-oasis.com/storage/v1/object/public/website/landing/oasis%20affiliate%20open%20graph.png?t=2024-09-30T21%3A25%3A15.413Z',
//         width: 1800,
//         height: 1600,
//       },
//     ],
//     locale: 'en_US',
//     type: 'website',
//   },
// }

const FAQ_LIST = [
  {
    value: 'max-payout',
    trigger: 'Is there a max payout cap?',
    content:
      'There is no limit to your payout potential.  As you gain more subscribers, your earnings will increase!',
  },
  {
    value: 'currency',
    trigger: 'What currency are payouts made in?',
    content: 'Payouts are made in USD.',
  },
  {
    value: 'how-will-you-get-paid',
    trigger: 'How will you pay me?',
    content:
      'We can pay you in Cashapp, Venmo, PayPal, Crypto, Zelle, Bank Transfer, or Carrier Pigeon, just let us know!',
  },
]

export default function NewLandingPage() {
  return (
    <SubpageLayout>
      <div className="flex flex-col space-y-16 pb-10">
        {/* Hero Section */}
        <div className="relative isolate py-24">
          <div className="overflow-hidden">
            <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center flex flex-col items-center">
              <h1 className="text-5xl max-w-2xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                Trusted water ratings based on science
              </h1>
              <p className="text-xl leading-8 text-gray-600">
                Products we drink and consume everyday are filled with toxins and chemicals that
                degrade our health and lead to disease. Brands cannot be trusted to inform
                consumers. Oasis is an open-source 100% independent platform that collects lab
                reports and rates products based on science and community input.
              </p>
              <div className="mt-10 flex gap-4 flex-row">
                <Link href="/auth/signin">
                  <Button className=" rounded-lg" variant="outline">
                    Contribute
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button className=" rounded-lg" variant="default">
                    Download app <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="mt-14 flex justify-center">
                {/* Mock-up mobile image of influencer */}
                <Image
                  alt="Oasis Page"
                  // src="https://connect.live-oasis.com/storage/v1/object/public/website/landing/cormac%20oasis%20page.png?t=2024-09-30T19%3A51%3A43.668Z"
                  src="https://connect.live-oasis.com/storage/v1/object/public/website/images/landing/Oasis%20App%20Screen.png"
                  // src="https://connect.live-oasis.com/storage/v1/object/public/website/images/landing/oasis-scan-cards.png?t=2024-11-17T20%3A10%3A18.687Z"
                  width={400}
                  height={800}
                  className="w-80 h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <RecentlyTestedRow />

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto p-8">
          <H1 className="text-center mb-4">Get started in 3 easy steps</H1>
          <p className="text-center text-gray-600 mb-12 text-xl">
            Earning and sharing with Oasis is simple, follow the steps below to kickstart your
            affiliate income
          </p>

          <div className="space-y-36">
            {/* Step 1: Create */}
            <div className="flex flex-col md:flex-row gap-20 items-center">
              <div className="relative w-full md:w-1/2">
                <Image
                  src="https://connect.live-oasis.com/storage/v1/object/public/website/landing/save%20products%20example.png?t=2024-09-30T19%3A55%3A04.448Z"
                  alt="Oasis save products example"
                  height={600}
                  width={300}
                  className="w-full h-auto object-contain rounded-lg shadow-lg"
                />
              </div>
              <div className="w-full md:w-1/2">
                <Muted>Step 1</Muted>
                <H2 className="mb-2">Save your products</H2>
                <P className="text-lg text-gray-600 mb-4">
                  Create an Oasis account and start saving your favorite waters, filters and tap
                  water that you drink.
                </P>
              </div>
            </div>

            {/* Step 2: Share */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 order-2 md:order-1 flex flex-col justify-center">
                <Muted>Step 2</Muted>
                <H2 className=" mb-4">Share your Oasis</H2>
                <p className="text-lg text-gray-600 mb-4">
                  Copy your Oasis page link and share it with your friends or create content for
                  your audience.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  Remember the main goal is to help people drink healthy water so please be genuine.
                </p>
              </div>
              <Image
                src="https://connect.live-oasis.com/storage/v1/object/public/website/landing/share%20oasis%20page.png"
                alt="Sharing Oasis Page"
                height={600}
                width={300}
                className="w-full md:w-1/2 h-auto object-contain order-1 md:order-2 rounded-lg shadow-lg"
              />
            </div>

            {/* Step 3: Get paid */}
            <div className="flex flex-col md:flex-row gap-20 items-center">
              <Image
                src="https://connect.live-oasis.com/storage/v1/object/public/website/landing/getting%20paid%20with%20oasis.png?t=2024-09-30T20%3A38%3A37.298Z"
                alt="Getting paid with Oasis"
                height={600}
                width={400}
                className="w-full h-auto object-contain"
              />
              <div className="w-full md:w-1/2">
                <Muted>Step 3</Muted>
                <H2 className="mb-4">Get paid</H2>
                <P className="text-lg text-gray-600 mb-4">
                  We offer 20% of each Oasis member referred. Payouts are send each month.
                </P>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <H2 className="text-center font-normal mb-10">Questions, answered!</H2>
            <div className="space-y-6">
              <Accordion type="single" collapsible className="">
                {FAQ_LIST.map((faq) => (
                  <AccordionItem key={faq.value} value={faq.value}>
                    <AccordionTrigger className="text-primary font-bold hover:bg-muted hover:underline-none rounded-t-lg px-2">
                      {faq.trigger}
                    </AccordionTrigger>
                    <AccordionContent className="text-secondary bg-muted rounded-b-lg px-2">
                      {faq.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        <AppDownloadCta />
      </div>
    </SubpageLayout>
  )
}
