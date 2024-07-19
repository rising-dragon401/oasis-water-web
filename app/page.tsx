import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import BlogPreviewSection from '@/components/sections/blog-preview-section'
import Typography from '@/components/typography'
import Image from 'next/image'
import Link from 'next/link'

const CATEGORIES = [
  {
    name: 'Bottled water',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/bottle%20water%20illustration.jpg',
    tab: 'bottled_water',
  },
  {
    name: 'Water filters',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/water%20filter%20illustration.png',
    tab: 'filter',
  },
  {
    name: 'Flavored water',
    image:
      'https://connect.live-oasis.com/storage/v1/object/public/website/images/flavored%20water%20illustration.png',
    tab: 'flavored_water',
  },
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

        <div className="flex flex-col mt-10 gap-y-2 justify-start items-start md:w-full w-[88vw]">
          <Typography size="3xl" fontWeight="normal">
            Top rated
          </Typography>
          <div className="w-full overflow-hidden">
            <div className="flex flex-row md:gap-6 gap-4 overflow-x-scroll">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.name}
                  href={`/top-rated?tab=${category.tab}`}
                  className="flex flex-col gap-2 md:w-full md:h-40 w-56 h-28 rounded-lg bg-card border justify-center items-center cursor-pointer hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 md:w-24 md:h-24 w-14 h-14">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={100}
                      height={100}
                      className="rounded-lg w-full h-full"
                    />
                  </div>
                  <Typography size="lg" fontWeight="bold">
                    {category.name}
                  </Typography>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="my-10">
          <BlogPreviewSection />
        </div>
      </div>
    </SubpageLayout>
  )
}
