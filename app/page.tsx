import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import BlogPreviewSection from '@/components/sections/blog-preview-section'
import Typography from '@/components/typography'
import { CupSoda, Droplet, Filter, GlassWater, Milk, ShowerHead } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  {
    name: 'Bottled water',
    icon: <GlassWater className="text-primary md:w-10 md:h-10 w-6 h-6" />,
    tab: 'bottled_water',
  },
  {
    name: 'Water filters',
    icon: <Filter className="text-primary md:w-10 md:h-10 w-6 h-6" />,
    tab: 'filter',
  },
  {
    name: 'Flavored water',
    icon: <CupSoda className="text-primary md:w-10 md:h-10 w-6 h-6" />,
    tab: 'flavored_water',
  },
  {
    name: 'Gallons',
    icon: <Milk className="text-primary md:w-10 md:h-10 w-6 h-6" />,
    tab: 'gallons',
  },
  {
    name: 'Shower filters',
    icon: <ShowerHead className="text-primary md:w-10 md:h-10 w-6 h-6" />,
    tab: 'shower_filter',
  },
  {
    name: 'Tap water',
    icon: <Droplet className="text-primary md:w-10 md:h-10 w-6 h-6" />,
    tab: 'tap_water',
  },
  // {
  //   name: 'Bottle filters',
  //   image:
  //     'https://connect.live-oasis.com/storage/v1/object/public/website/images/flavored%20water%20illustration.png',
  //   tab: 'bottle_filters',
  // },
]

export default async function Home() {
  return (
    <SubpageLayout>
      <div className="flex h-full flex-col pt-14">
        <div className="flex flex-col w-full items-center justify-center gap-y-4">
          <div className="flex flex-col items-center text-center gap-2 ">
            <Typography size="5xl" fontWeight="bold" className="max-w-3xl">
              Is your water healthy?
            </Typography>

            <Typography size="lg" fontWeight="normal" className="md:max-w-lg max-w-xs">
              Search science-backed rankings of bottled water, water filters and find healthier
              alternatives
            </Typography>
          </div>

          <BasicSearch showSearch={true} size="large" />
        </div>

        <div className="flex flex-col mt-14 gap-y-2 md:mb-40 mb-20">
          <Typography size="3xl" fontWeight="normal">
            Top rated
          </Typography>
          <div className="relative w-full">
            <div className="absolute left-0 right-0 overflow-x-auto hide-scrollbar">
              <div className="flex flex-nowrap gap-4 pb-4 w-max">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category.name}
                    href={`/top-rated?tab=${category.tab}`}
                    className="flex flex-col gap-2 w-[140px] md:w-[284px] h-20 md:h-40 rounded-lg bg-card border justify-center items-center cursor-pointer hover:shadow-lg flex-shrink-0"
                  >
                    <div className="flex flex-col items-center justify-center">{category.icon}</div>
                    <Typography size="lg" fontWeight="bold">
                      {category.name}
                    </Typography>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="my-14">
          <BlogPreviewSection />
        </div>
      </div>
    </SubpageLayout>
  )
}
