import { getItems } from '@/app/actions/items'
import SubpageLayout from '@/components/home-layout'
import RankingList from '@/components/shared/ranking-list'

export default async function BottledWater() {
  const items = await getItems()

  return (
    <SubpageLayout>
      <RankingList />
    </SubpageLayout>
  )
}
