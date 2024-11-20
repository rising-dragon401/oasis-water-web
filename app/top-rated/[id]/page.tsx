import SubpageLayout from '@/components/home-layout'
import RankingList from '@/components/shared/ranking-list'

export const metadata = {
  title: 'Top Rated Products | Oasis',
  description: 'Explore the top water products in each category',
}

export default async function TopRatedItems({ params }: { params: any }) {
  const id = params.id

  return (
    <SubpageLayout>
      <div className="md:px-0 px-2 ">
        <RankingList categoryId={id} />
      </div>
    </SubpageLayout>
  )
}
