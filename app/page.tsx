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
            <Typography size="5xl" fontWeight="bold" className="max-w-lg">
              Find the healthiest products for you
            </Typography>

            <Typography size="lg" fontWeight="normal" className="max-w-lg">
              Search bottled waters, filters, tap water, and more 👇
            </Typography>
          </div>

          <BasicSearch showSearch={true} size="large" />
        </div>

        <RankingList />
      </div>
    </SubpageLayout>
  )
}
