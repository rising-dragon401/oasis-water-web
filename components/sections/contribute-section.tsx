'use client'

import { H1, H2, P } from '@/components/ui/typography'
import Image from 'next/image'

const communityBgImage =
  'https://connect.live-oasis.com/storage/v1/object/public/website/images/elements/hand-above-water.jpeg?t=2024-11-18T22%3A26%3A39.923Z'

const requestNewProductsImage =
  'https://connect.live-oasis.com/storage/v1/object/public/website/images/landing/new-item-graphic.png'

const submitToOasisImage =
  'https://connect.live-oasis.com/storage/v1/object/public/website/images/landing/submit-to-oasis.jpg?t=2024-11-19T22%3A29%3A28.108Z'

export default function ContributeSection() {
  return (
    <div className="w-full p-8 max-w-4xl mx-auto">
      <H1 className="text-center mb-4">Powered by People Like You</H1>
      <p className="text-center text-gray-600 mb-12 text-xl">
        Our open-source rating algorithm lets you contribute, provide feedback, and share new lab
        reports.
      </p>

      <div className="space-y-36">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="relative w-full md:w-1/2">
            <Image
              src={requestNewProductsImage}
              alt="Request new products for Oasis"
              height={600}
              width={300}
              className="w-full h-auto object-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2">
            <H2 className="mb-2">Request new products</H2>
            <P className="text-lg text-gray-600 mb-4">
              Suggest new products or, if you are a brand, submit your product details and lab
              reports for review.
            </P>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <H2 className="mb-4">Help us improve</H2>
            <P className="text-lg text-gray-600 mb-4">
              Found an error? Share your feedback to help us update the data and maintain
              transparency
            </P>
            <P className="text-lg text-gray-600 mb-4">
              Your feedback keeps us accurate and transparent—submit updates to improve trust
            </P>
          </div>
          <div className="relative w-full md:w-1/2 order-1 md:order-2">
            <Image
              src={submitToOasisImage}
              alt="Submit new reports and studies to Oasis"
              height={600}
              width={300}
              className="w-full h-auto object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="relative w-full md:w-1/2">
            <Image
              src={communityBgImage}
              alt="Oasis community"
              height={600}
              width={300}
              className="w-full h-auto object-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2">
            <H2 className="mb-4">Be Part of a Healthier Future</H2>
            <P className="text-lg text-gray-600 mb-4">
              Join over 40,000 health enthusiasts committed to better hydration and living
            </P>
          </div>
        </div>
      </div>
    </div>
  )
}
