import { getFilters } from '@/app/actions/filters'
import FilterList from './components/filter-list'
import SubpageLayout from '@/components/home-layout'

export default async function FiltersPage() {
  const filters = await getFilters()

  return (
    <SubpageLayout>
      <FilterList filters={filters} />
    </SubpageLayout>
  )
}
