'use client'

import { getRandomItems } from '@/app/actions/items'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import { useEffect, useState } from 'react'

export default function RecommendedRow() {
  const [ranked, setRanked] = useState<any>([])

  const fetchRecommendedItems = async () => {
    const recommended = await getRandomItems()
    // const ranked_ = recommended.sort((a, b) => (b.score || 0) - (a.score || 0))

    setRanked(recommended)
  }

  useEffect(() => {
    fetchRecommendedItems()
  }, [])

  return (
    <div className="mb-10">
      <div className="pt-4 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Other bottled waters
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
