import Link from 'next/link'
import Typography from '@/components/typography'
import React from 'react'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import { getFilters } from '@/app/actions/filters'

export default async function FilterSection() {
  const filters = await getFilters()

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Filters
        </Typography>

        <Link href="/search/filters" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-8 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        {filters &&
          filters?.slice(0, 5).map((filter) => <ItemPreviewCard key={filter.name} item={filter} />)}
      </div>
    </div>
  )
}
