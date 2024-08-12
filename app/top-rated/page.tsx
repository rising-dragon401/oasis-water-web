import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import { CATEGORIES } from '@/lib/constants/categories'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function TopRatedPage() {
  return (
    <SubpageLayout>
      <Suspense fallback={<div />}>
        <div className="flex flex-col md:pt-14 pt-10 md:px-0 px-2 w-full">
          <div className="flex flex-col items-center text-center gap-2 md:pb-14 pb-8">
            <Typography size="4xl" fontWeight="bold" className="max-w-lg">
              Top Rated Products
            </Typography>
            <Typography size="base" fontWeight="normal" className="md:max-w-lg max-w-xs">
              Discover the healthiest water and hydration options based on science.
            </Typography>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full ">
            {CATEGORIES.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0)).map((category) => (
              <Link
                href={`/top-rated/${category.id}`}
                key={category.id}
                className="relative flex flex-col justify-center items-center w-full md:h-56 h-40 bg-card border rounded-lg hover:shadow-md cursor-pointer"
              >
                {category.is_new && (
                  <span className="absolute z-50 top-2 right-2 bg-secondary text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
                <div className="md:w-48 w-42 h-18 flex justify-center items-center object-contain">
                  <Image
                    src={category.image || ''}
                    alt={category.title}
                    width={200}
                    height={200}
                    className="w-full h-full"
                  />
                </div>

                <Typography size="xl" fontWeight="normal" className="text-center mt-2">
                  {category.title}
                </Typography>
              </Link>
            ))}
          </div>
          {/* <RankingList /> */}
        </div>
      </Suspense>
    </SubpageLayout>
  )
}
