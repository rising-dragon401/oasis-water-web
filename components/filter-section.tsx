import Link from 'next/link'
import Typography from '@/components/typography'
import React from 'react'
import ItemPreviewCard from '@/components/item-preview-card'
import { getFilters } from '@/app/actions/filters'

export default async function FilterSection() {
  const filters = await getFilters()

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Filter ratings
        </Typography>

        <Link href="/search/filters" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        {filters &&
          filters?.slice(0, 3).map((filter) => (
            <div key={filter.id} className="flex-shrink-0" style={{ minWidth: '20%' }}>
              <ItemPreviewCard key={filter.name} item={filter} />
            </div>
          ))}
      </div>
    </div>
  )
}
