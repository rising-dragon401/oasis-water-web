'use client'

import Typography from '@/components/typography'
import React from 'react'
import { getRecommendedFilter } from '@/app/actions/filters'
import { useEffect, useState } from 'react'
import ItemPreviewCard from '@/components/shared/item-preview-card'

type RecommendedFilterRowProps = {
  contaminants: any[]
}

// recommended filter based on contaminants
export default function RecommendedFilterRow({ contaminants }: RecommendedFilterRowProps) {
  const [recommended, setRecommended] = useState<any>([])

  const fetchRecommendedFilter = async () => {
    const recommended = await getRecommendedFilter(contaminants)

    setRecommended([recommended])
  }

  useEffect(() => {
    fetchRecommendedFilter()
  }, [])

  return (
    <div className="mb-10">
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Recommended filter for this tap water
        </Typography>
      </div>

      <div className="flex overflow-x-auto gap-6 hide-scrollbar">
        {recommended &&
          recommended.map((item: any) => (
            <div key={item.id} className="flex-shrink-0" style={{ minWidth: '20%' }}>
              <ItemPreviewCard item={item} />
            </div>
          ))}
      </div>
    </div>
  )
}
