import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import BasicSearch from '@/components/basic-search'
import TopRatedSection from '@/components/sections/top-rated-section'
import LowestRatedSection from '@/components/sections/lowest-rated-section'
import TapWaterSection from '@/components/sections/tap-water-section'
import FilterSection from '@/components/sections/filter-section'
import BlogPreviewSection from '@/components/sections/blog-preview-section'
import CTASection from '@/components/sections/cta-section'

export default async function Home() {
  return (
    <SubpageLayout>
      <div className="flex h-full flex-col pt-28 max-w-full">
        <div className="mb-14 flex flex-col w-full items-center justify-center gap-14">
          <div className="flex flex-col items-center text-center gap-2 ">
            <Typography size="5xl" fontWeight="bold">
              Do you know what&apos;s in your water?
            </Typography>
            <Typography size="lg" fontWeight="normal" className="max-w-md">
              90% of your water sources contain toxins, microplastics, and other contaminants.
            </Typography>
          </div>

          <BasicSearch showSearch={true} paddingY="6" />
        </div>

        <div className="flex flex-col mt-14 mb-10">
          <TopRatedSection />
        </div>

        <div className="flex flex-col mt-10 mb-10">
          <LowestRatedSection />
        </div>

        <div className="flex flex-col mt-10 mb-10">
          <TapWaterSection />
        </div>

        <div className="flex flex-col mt-10 mb-20">
          <FilterSection />
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
