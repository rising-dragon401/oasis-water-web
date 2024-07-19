import SubpageLayout from '@/components/home-layout'
import RankingList from '@/components/shared/ranking-list'
import Typography from '@/components/typography'

export default async function TopRatedPage() {
  return (
    <SubpageLayout>
      <div className="flex h-full flex-col pt-14">
        <div className="flex flex-col w-full items-center justify-center gap-y-4">
          <div className="flex flex-col items-center text-center gap-2">
            <Typography size="5xl" fontWeight="bold" className="max-w-lg">
              Top Rated Products
            </Typography>
          </div>
        </div>

        <RankingList />
      </div>
    </SubpageLayout>
  )
}
