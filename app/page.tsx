import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import BasicSearch from '@/components/basic-search'
import { getItems } from '@/app/actions/items'
import TopRatedSection from '@/components/top-rated-section'
import LowestRatedSection from '@/components/lowest-rated-section'

export default async function Home() {
  const items = await getItems()

  return (
    <SubpageLayout>
      <div className="flex h-full flex-col justify-center pt-36 md:px-24">
        <div className="mb-14 max-w-lg">
          <Typography size="5xl" fontWeight="bold">
            Do you know what&apos;s in your water?
          </Typography>
        </div>

        <BasicSearch showSearch={true} />

        {/* <div className="md:mt-56 mt-32  mb-32">
          <BlogPreviewSection />
        </div> */}

        <div className="flex flex-col mt-32 mb-10">
          <TopRatedSection items={items} />
        </div>

        <div className="flex flex-col mt-10 mb-20">
          <LowestRatedSection items={items} />
        </div>
      </div>
    </SubpageLayout>
  )
}
