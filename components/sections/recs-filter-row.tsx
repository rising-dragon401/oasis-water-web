'use client'

import Typography from '@/components/typography'
import React from 'react'
import { getTopFilters } from '@/app/actions/filters'
import { useEffect, useState } from 'react'
import ItemPreviewCard from '@/components/shared/item-preview-card'

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
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Top filters
        </Typography>
      </div>

      <div className="flex flex-row gap-8 hide-scrollbar overflow-x-scroll">
        {ranked && ranked.map((item: any) => <ItemPreviewCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
