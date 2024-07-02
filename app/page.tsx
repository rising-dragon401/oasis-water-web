import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import RankingList from '@/components/shared/ranking-list'
import Typography from '@/components/typography'

export default async function Home() {
  return (
    <SubpageLayout>
      <div className="flex h-full flex-col pt-14">
        <div className="flex flex-col w-full items-center justify-center gap-y-4">
          <div className="flex flex-col items-center text-center gap-2">
            <Typography size="5xl" fontWeight="bold">
              What&apos;s in your water?
            </Typography>

            <Typography size="lg" fontWeight="normal" className="max-w-lg">
              90% of water contains toxins, microplastics and contaminants. Find the best hydration
              products for you 👇
            </Typography>
          </div>

          <BasicSearch showSearch={true} size="large" />
        </div>

        <RankingList />
      </div>
    </SubpageLayout>
  )
}
