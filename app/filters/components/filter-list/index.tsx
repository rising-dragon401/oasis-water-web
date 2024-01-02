import Typography from '@/components/typography'
import React, { useMemo } from 'react'
import { WaterFilter } from '@/types/custom'
import ItemPreviewCard from '@/components/item-preview-card'

type Props = {
  filters: WaterFilter[] | null
}

export default function FilterList({ filters }: Props) {
  const sorted = useMemo(() => {
    return filters?.sort((a, b) => a.name.localeCompare(b.name))
  }, [filters])

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          All water filters
        </Typography>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-6">
        {sorted && sorted.map((item) => <ItemPreviewCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
