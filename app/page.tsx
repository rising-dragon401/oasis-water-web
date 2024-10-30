import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import BlogPreviewSection from '@/components/sections/blog-preview-section'
import PeopleSection from '@/components/sections/people-section'
import Typography from '@/components/typography'
import { CATEGORIES } from '@/lib/constants/categories'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  return (
    <SubpageLayout>
      <div className="flex h-full flex-col md:pt-10 pt-6 w-full md:px-0 px-2">
        <div className="flex flex-col w-full items-center justify-center gap-y-4">
          <div className="flex flex-col items-center text-center gap-1">
            <Typography size="4xl" fontWeight="bold" className="max-w-3xl">
              What&apos;s in your water?
            </Typography>

            <Typography
              size="lg"
              fontWeight="normal"
              className="md:max-w-xl max-w-xs text-secondary"
            >
              90% of water contains toxins most filters don&apos;t remove them
            </Typography>
          </div>

          <BasicSearch showSearch={true} size="large" />
        </div>

        {/* <div className="md:mt-14 mt-10 w-full">
          <MostRecentSection />
        </div> */}

        <div className="flex flex-col md:mt-14 md:mb-24 mt-10 mb-20 gap-y-4 w-full">
          <div className="flex flex-row items-center justify-between">
            <Typography size="2xl" fontWeight="normal">
              Top waters and filters
            </Typography>
            <Link href="/top-rated" className="flex flex-row items-center gap-x-2">
              <Typography size="base" fontWeight="normal" className="italic text-secondary">
                see all
              </Typography>
              <ArrowRight className="w-4 h-4 text-secondary" />
            </Link>
          </div>
          <div className="relative w-full">
            <div className="absolute left-0 right-0 overflow-x-auto hide-scrollbar">
              <div className="flex flex-nowrap gap-x-4 pb-4 w-max">
                {CATEGORIES.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0)).map(
                  (category) => (
                    <Link
                      key={category.id}
                      href={`/top-rated/${category.id}`}
                      className="relative flex flex-col gap-2 w-[180px] h-full md:w-[240px] md:h-full  pt-2 pb-2 rounded-lg bg-card border justify-end cursor-pointer hover:shadow-lg flex-shrink-0 px-4"
                    >
                      {category.is_new && (
                        <span className="absolute z-10 top-2 right-2 bg-secondary text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                      <div className="flex flex-col items-center justify-center">
                        <Image
                          src={category.image}
                          alt={category.title}
                          width={100}
                          height={200}
                          className="md:w-24 md:h-full w-20 h-full"
                        />
                      </div>
                      <Typography size="sm" fontWeight="normal" className="text-center">
                        {category.title}
                      </Typography>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:mt-24 mt-20 w-full">
          <PeopleSection />
        </div>

        <div className="md:mt-10 mt-6 w-full">
          <BlogPreviewSection />
        </div>
      </div>
    </SubpageLayout>
  )
}
