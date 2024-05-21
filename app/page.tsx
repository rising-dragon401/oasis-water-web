import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import BlogPreviewSection from '@/components/sections/blog-preview-section'
import CTASection from '@/components/sections/cta-section'
import FilterSection from '@/components/sections/filter-section'
import LowestRatedSection from '@/components/sections/lowest-rated-section'
import PeopleSection from '@/components/sections/people-section'
import TapWaterSection from '@/components/sections/tap-water-section'
import Typography from '@/components/typography'

export default function Home() {
  return (
    <SubpageLayout>
      <div className="flex h-full flex-col pt-28 max-w-full gap-y-14">
        <div className="mb-14 flex flex-col w-full items-center justify-center gap-y-6">
          <div className="flex flex-col items-center text-center gap-2">
            <Typography size="5xl" fontWeight="bold">
              Do you know what&apos;s in your water?
            </Typography>

            <Typography size="lg" fontWeight="normal" className="max-w-lg">
              90% of water contains toxins, microplastics and contaminants. Search what&apos;s
              inside your water 👇
            </Typography>
          </div>

          <BasicSearch showSearch={true} size="large" />
        </div>

        {/* <div className="flex flex-col mt-14 mb-10">
          <TopRatedSection />
        </div> */}

        <div className="flex flex-col">
          <LowestRatedSection />
        </div>

        <div className="flex flex-col">
          <TapWaterSection />
        </div>

        <div className="flex flex-col">
          <FilterSection />
        </div>

        <div className="flex flex-col">
          <PeopleSection />
        </div>

        <div className="mb-32">
          <BlogPreviewSection />
        </div>

        <div className="mb-32">
          <CTASection />
        </div>
      </div>
    </SubpageLayout>
  )
}
