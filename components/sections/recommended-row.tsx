'use client'

import { getRandomItems } from '@/app/actions/items'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import { ItemType } from '@/types/custom'
import { useEffect, useState } from 'react'

type Props = {
  category?: ItemType
}

export default function RecommendedRow({ category }: Props) {
  const [ranked, setRanked] = useState<any>([])

  const fetchRecommendedItems = async () => {
    const recommended = await getRandomItems({ type: category })
    // const ranked_ = recommended.sort((a, b) => (b.score || 0) - (a.score || 0))

    setRanked(recommended)
  }

  useEffect(() => {
    fetchRecommendedItems()
  }, [])

  const label =
    category === 'bottled_water'
      ? 'drinks'
      : category === 'mineral_packets'
        ? 'Mineral packets'
        : 'bottled water'

  return (
    <div className="mb-10">
      <div className="pt-4 pb-2 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Other {label}
        </Typography>
      </div>

      <div className="flex overflow-x-auto md:gap-6 gap-4 hide-scrollbar">
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
