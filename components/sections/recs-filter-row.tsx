'use client'

import { getTopFilters } from '@/app/actions/filters'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import { useEffect, useState } from 'react'

export default function RecommendedFiltersRow() {
  const [ranked, setRanked] = useState<any>([])

  const fetchRecommendedFilters = async () => {
    const recommended = await getTopFilters()
    setRanked(recommended)
  }

  useEffect(() => {
    fetchRecommendedFilters()
  }, [])

  if (!ranked || ranked.length === 0) {
    return null
  }

  return (
    <div className="mb-10">
      <div className="pt-4 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Other filters
        </Typography>
      </div>

      <div className="flex flex-row gap-8 hide-scrollbar overflow-x-scroll">
        {ranked && ranked.map((item: any) => <ItemPreviewCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
