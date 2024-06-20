import { getFilters } from '@/app/actions/filters'
import SubpageLayout from '@/components/home-layout'
import RankingList from '@/components/shared/ranking-list'

export default async function FiltersPage() {
  const filters = await getFilters()

  return (
    <SubpageLayout>
      <RankingList />
    </SubpageLayout>
  )
}
