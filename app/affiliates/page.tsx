import SubpageLayout from '@/components/home-layout'
import { Button } from '@/components/ui/button'
import { kAffiliatePortal } from '@/lib/constants/socials'
import { ArrowRight } from 'lucide-react'

export default function AffiliatesPage() {
  return (
    <SubpageLayout>
      <div className="relative isolate">
        <div className="overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 pb-32 pt-24 lg:px-8">
            <div className="mx-auto w-full gap-x-14 lg:mx-0 flex md:flex-row flex-col justify-center">
              <div className="lg:shrink-0 xl:max-w-2xl md:w-2/5 w-full">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Help people drink healthier water
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                  Make passive income while helping people live healthier. Educate your followers
                  about the toxic water industry and how to choose water that is safe to drink while
                  also making money everytime you refer someone to Oasis.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a href={kAffiliatePortal}>
                    <Button>
                      Get started <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
              <div className="mt-14 flex justify-end md:w-3/5 w-full gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                <div className="ml-auto w-1/3 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                  <div className="relative">
                    <img
                      alt=""
                      src="https://connect.live-oasis.com/storage/v1/object/public/website/images/Palm%20Heights%20Wellness.jpg"
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
                <div className="mr-auto w-1/3 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                  <div className="relative">
                    <img
                      alt=""
                      src="https://connect.live-oasis.com/storage/v1/object/public/website/images/MMmood.jpg"
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="relative">
                    <img
                      alt=""
                      src="https://connect.live-oasis.com/storage/v1/object/public/website/images/acqua%20panna.JPG"
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
                <div className="w-1/3 flex-none space-y-8 pt-32 sm:pt-0">
                  <div className="relative">
                    <img
                      alt=""
                      src="https://connect.live-oasis.com/storage/v1/object/public/website/images/April%202021%20calendar.jpg"
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="relative">
                    <img
                      alt=""
                      src="https://connect.live-oasis.com/storage/v1/object/public/website/images/water%20bottle%20legs.JPG"
                      className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}
