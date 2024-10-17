import { getRandomFilters } from '@/app/actions/filters'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import Link from 'next/link'

export default async function FilterSection() {
  const filters = await getRandomFilters()

  return (
    <div>
      <div className="flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Filters
        </Typography>

        <Link href="/search/filters" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-8 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        {filters &&
          filters
            ?.slice(0, 5)
            .map((filter) => <ItemPreviewCard key={filter.name} item={filter} alwaysShow />)}
      </div>
    </div>
  )
}
