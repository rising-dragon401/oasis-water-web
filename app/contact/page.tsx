'use client'

import SubpageLayout from '@/components/home-layout'
import { Button } from '@/components/ui/button'
import { H1, P } from '@/components/ui/typography'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import FAQs from '../faqs/components/faqs'

export default function ContactPage() {
  const router = useRouter()

  return (
    <SubpageLayout>
      <div className="flex flex-col w-full px-4 py-10 items-left">
        <div className="relative">
          <Image
            src="https://connect.live-oasis.com/storage/v1/object/public/website/images/about/contact/Boat%20in%20water.jpg?t=2024-10-17T18%3A40%3A19.048Z"
            alt="Contact Oasis"
            width={800}
            height={600}
            className="rounded-xl h-96 w-full mx-auto object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center p-8 rounded-lg">
            <H1 className="text-stone-200">Contact Us</H1>
            <P className="text-center mb-6 max-w-md mt-2 text-stone-200">
              We may be in the lab or out traveling searching for the best water but we will get
              back to you as soon as possible. Email hello@live-oasis.com for the quickest response.
            </P>
            <Button variant="secondary" onClick={() => router.push('mailto:hello@live-oasis.com')}>
              Send email
            </Button>
          </div>
        </div>

        <FAQs />
      </div>
    </SubpageLayout>
  )
}
