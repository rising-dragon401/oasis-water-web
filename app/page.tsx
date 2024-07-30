import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import BlogPreviewSection from '@/components/sections/blog-preview-section'
import Typography from '@/components/typography'
import { CATEGORIES } from '@/lib/constants/categories'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  return (
    <SubpageLayout>
      <div className="flex h-full flex-col pt-14 w-full md:px-0 px-2">
        <div className="flex flex-col w-full items-center justify-center gap-y-4">
          <div className="flex flex-col items-center text-center gap-2">
            <Typography size="4xl" fontWeight="bold" className="max-w-3xl">
              What are you drinking?
            </Typography>

            <Typography size="lg" fontWeight="normal" className="md:max-w-lg max-w-xs">
              Find the best water brands based on science
            </Typography>
          </div>

          <BasicSearch showSearch={true} size="large" />
        </div>

        <div className="flex flex-col md:mt-14 md:mb-24 mt-10 mb-20 gap-y-4 w-full">
          <div className="flex flex-row items-center justify-between">
            <Typography size="3xl" fontWeight="normal">
              Product categories
            </Typography>
            <Link href="/top-rated">
              <Typography size="base" fontWeight="normal" className="underline">
                see all
              </Typography>
            </Link>
          </div>
          <div className="relative w-full">
            <div className="absolute left-0 right-0 overflow-x-auto hide-scrollbar">
              <div className="flex flex-nowrap gap-x-4 pb-4 w-max">
                {CATEGORIES.map((category) => (
                  <Link
                    key={'category.name'}
                    href={`/top-rated/${category.id}`}
                    className="flex flex-col gap-2 w-[140px] h-24 md:w-[200px] md:h-full md:pt-6 pt-4 pb-2 rounded-lg bg-muted border justify-end cursor-pointer hover:shadow-lg flex-shrink-0 px-4"
                  >
                    <div className="flex flex-col items-center justify-center ">
                      <Image
                        src={category.image}
                        alt={category.title}
                        width={100}
                        height={100}
                        className="md:w-24 md:h-16 w-16 h-12"
                      />
                    </div>
                    <Typography size="base" fontWeight="normal" className="text-center">
                      {category.title}
                    </Typography>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:mt-24 mt-14 mb-10 w-full">
          <BlogPreviewSection />
        </div>
      </div>
    </SubpageLayout>
  )
}
