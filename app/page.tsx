import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
// import BlogPreviewSection from '@/components/sections/blog-preview-section'
// import CTASection from '@/components/sections/cta-section'
// import FilterSection from '@/components/sections/filter-section'
// import LowestRatedSection from '@/components/sections/lowest-rated-section'
// import PeopleSection from '@/components/sections/people-section'
// import TapWaterSection from '@/components/sections/tap-water-section'
import RankingList from '@/components/shared/ranking-list'
import Typography from '@/components/typography'

export default async function Home() {
  return (
    <SubpageLayout>
      <div className="flex h-full flex-col pt-20">
        <div className="flex flex-col w-full items-center justify-center gap-y-6">
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

        <RankingList />

        {/* <div className="flex w-full justify-center">
          <div className="flex flex-row gap-2 justify-start mt-3 pb-2 max-w-md overflow-x-scroll whitespace-nowrap hide-scrollbar">
            {CATEGORIES.map((category) => (
              <Link
                key={category.title}
                className="flex flex-row justify-center items-center gap-1 bg-transparent border rounded-lg w-full px-3 max-w-56 h-8 hover:shadow-md hover:cursor-pointer inline-block"
                href={category.href}
              >
                {category.logo}
                <Typography size="xs" fontWeight="normal" className="text-slate-600">
                  {category.title}
                </Typography>
              </Link>
            ))}
          </div>
        </div> */}
      </div>
    </SubpageLayout>
  )
}
