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
      {/* How It Works Section */}

      <H1 className="text-center mb-4">Strengthed by people like you</H1>
      <p className="text-center text-gray-600 mb-12 text-xl">
        Our scoring system and data sources are open source so anyone in the community can
        contribute, provide feedback or submit new reports income
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
              Let us know what we should add next. If you're a brand, submit your product
              information along with any lab reports.
            </P>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <H2 className="mb-4">Provide updates</H2>
            <P className="text-lg text-gray-600 mb-4">
              See something wrong Provide feedback on that item and we'll update it.
            </P>
            <P className="text-lg text-gray-600 mb-4">
              The goal is to build trust through transparency and open feedback
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
            <H2 className="mb-4">Join the community</H2>
            <P className="text-lg text-gray-600 mb-4">
              Hydrate healthy with 40,000+ other like-minded people all dedicate to healthy living.
            </P>
          </div>
        </div>
      </div>
    </div>
  )
}
