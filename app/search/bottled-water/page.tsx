import SubpageLayout from '@/components/home-layout'
import RankingList from '@/components/shared/ranking-list'

export default async function BottledWater() {
  return (
    <SubpageLayout>
      <RankingList defaultTab="bottled_water" />
    </SubpageLayout>
  )
}
