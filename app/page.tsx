import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import BasicSearch from '@/components/basic-search'
import { getItems } from '@/app/actions/items'
import TopRatedSection from '@/components/top-rated-section'
import LowestRatedSection from '@/components/lowest-rated-section'
import TapWaterSection from '@/components/tap-water-section'
import { getLocations } from '@/app/actions/locations'
import { getFilters } from '@/app/actions/filters'
import FilterSection from '@/components/filter-section'

export default async function Home() {
  const items = await getItems()
  const locations = await getLocations()
  const filters = await getFilters()

  return (
    <SubpageLayout>
      <div className="flex h-full flex-col pt-28 md:px-8 ">
        <div className="mb-14 flex flex-col w-full items-center justify-center gap-14">
          <Typography size="5xl" fontWeight="bold">
            Do you know what&apos;s in your water?
          </Typography>

          <BasicSearch showSearch={true} />
        </div>

        {/* <div className="md:mt-56 mt-32  mb-32">
          <BlogPreviewSection />
        </div> */}

        <div className="flex flex-col mt-14 mb-10">
          <TopRatedSection items={items} />
        </div>

        <div className="flex flex-col mt-10 mb-10">
          <LowestRatedSection items={items} />
        </div>

        <div className="flex flex-col mt-10 mb-10">
          <TapWaterSection locations={locations} />
        </div>

        <div className="flex flex-col mt-10 mb-20">
          <FilterSection filters={filters} />
        </div>
      </div>
    </SubpageLayout>
  )
}
