import Link from 'next/link'
import Typography from '@/components/typography'
import React, { useMemo } from 'react'
import { Filter } from '@/types/custom'
import ItemPreviewCard from '@/components/item-preview-card'

type Props = {
  filters: Filter[] | null
}

export default function FilterSection({ filters }: Props) {
  const topFilters = useMemo(() => {
    return filters?.sort((a, b) => (b.score || 0) - (a.score || 0))
  }, [filters])

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Filter ratings
        </Typography>

        <Link href="/filters" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6 hide-scrollbar">
        {topFilters &&
          topFilters?.slice(0, 3).map((filter) => (
            <div key={filter.id} className="flex-shrink-0" style={{ minWidth: '20%' }}>
              <ItemPreviewCard
                key={filter.name}
                item={filter}
                href={`/filter/${filter.id}?id=${filter.name.toLowerCase().replace(/ /g, '-')}`}
              />
            </div>
          ))}
      </div>
    </div>
  )
}
