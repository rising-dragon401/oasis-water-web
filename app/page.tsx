import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import BlogPreviewSection from '@/components/sections/blog-preview-section'
import Typography from '@/components/typography'
import { Beaker, CupSoda, Filter, GlassWater, Milk, ShowerHead } from 'lucide-react'
import Link from 'next/link'

const ICON_CLASSNAME = 'text-secondary md:w-8 md:h-8 w-6 h-6'

const CATEGORIES = [
  {
    name: 'Bottled water',
    icon: <GlassWater className={ICON_CLASSNAME} />,
    tab: 'bottled_water',
  },
  {
    name: 'Water filters',
    icon: <Filter className={ICON_CLASSNAME} />,
    tab: 'filter',
  },
  {
    name: 'Flavored water',
    icon: <CupSoda className={ICON_CLASSNAME} />,
    tab: 'flavored_water',
  },
  {
    name: 'Water gallons',
    icon: <Milk className={ICON_CLASSNAME} />,
    tab: 'gallons',
  },
  {
    name: 'Shower filters',
    icon: <ShowerHead className={ICON_CLASSNAME} />,
    tab: 'shower_filter',
  },
  {
    name: 'Bottle filters',
    icon: <Beaker className={ICON_CLASSNAME} />,
    tab: 'bottle_filter',
  },
  // {
  //   name: 'Tap water',
  //   icon: <Droplet className={ICON_CLASSNAME} />,
  //   tab: 'tap_water',
  // },
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
      <div className="flex h-full flex-col pt-14 w-full md:px-0 px-4">
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

        <div className="flex flex-col md:mt-20 mt-14 gap-y-4 md:mb-32 mb-20 w-full">
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
                    href={`/top-rated/${category.tab}`}
                    className="flex flex-col gap-2 w-[140px] md:w-[200px] md:pt-6 pt-4 pb-2 rounded-lg bg-muted border justify-end
                   items-start cursor-pointer hover:shadow-lg flex-shrink-0 px-4"
                  >
                    <div className="flex flex-col items-center justify-center">{category.icon}</div>
                    <Typography size="lg" fontWeight="normal">
                      {category.name}
                    </Typography>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 mb-10 w-full">
          <BlogPreviewSection />
        </div>
      </div>
    </SubpageLayout>
  )
}
