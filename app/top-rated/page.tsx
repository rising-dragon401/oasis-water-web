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
            {CATEGORIES.map((category) => (
              <Link
                href={`/top-rated/${category.id}`}
                key={category.id}
                className="flex flex-col justify-center items-center w-full md:h-56 h-40 bg-card border rounded-lg hover:shadow-md cursor-pointer"
              >
                <div className="md:w-48 w-28 h-18 flex justify-center items-center object-contain">
                  <Image
                    src={category.image || ''}
                    alt={category.title}
                    width={200}
                    height={200}
                    className="w-full h-full"
                  />
                </div>

                {/* <div className="card-logo">{category.logo}</div> */}
                <Typography size="xl" fontWeight="bold" className="text-center">
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
