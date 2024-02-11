import { getFilters } from '@/app/actions/filters'
import FilterList from './components/filter-list'
import SubpageLayout from '@/components/home-layout'

export default async function FiltersPage() {
  const filters = await getFilters()

  return (
    <SubpageLayout>
      <div className="md:px-4">
        <FilterList filters={filters} />
      </div>
    </SubpageLayout>
  )
}
