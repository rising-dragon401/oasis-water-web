import SubpageLayout from '@/components/home-layout'
import RankingList from '@/components/shared/ranking-list'

export default async function TopRatedItems({ params }: { params: any }) {
  const id = params.id

  return (
    <SubpageLayout>
      <RankingList categoryId={id} />
    </SubpageLayout>
  )
}
