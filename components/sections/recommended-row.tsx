'use client'

import Typography from '@/components/typography'
import React from 'react'
import { getTopItems } from '@/app/actions/items'
import { useEffect, useState } from 'react'
import ItemPreviewCard from '@/components/item-preview-card'

export default function RecommendedRow() {
  const [ranked, setRanked] = useState<any>([])

  const fetchRecommendedItems = async () => {
    const recommended = await getTopItems()
    const ranked_ = recommended.sort((a, b) => (b.score || 0) - (a.score || 0))

    setRanked(ranked_)
  }

  useEffect(() => {
    fetchRecommendedItems()
  }, [])

  return (
    <div className="mb-10">
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Top bottled waters
        </Typography>
      </div>

      <div className="flex overflow-x-auto gap-6 hide-scrollbar">
        {ranked &&
          ranked.map((item: any) => (
            <div key={item.id} className="flex-shrink-0" style={{ minWidth: '20%' }}>
              <ItemPreviewCard item={item} />
            </div>
          ))}
      </div>
    </div>
  )
}
