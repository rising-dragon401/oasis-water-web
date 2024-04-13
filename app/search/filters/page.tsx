import { getFilters } from '@/app/actions/filters'
import RankingList from '@/components/shared/ranking-list'
import SubpageLayout from '@/components/home-layout'

export default async function FiltersPage() {
  const filters = await getFilters()

  return (
    <SubpageLayout>
      <RankingList title="Water filters" items={filters} />
    </SubpageLayout>
  )
}
