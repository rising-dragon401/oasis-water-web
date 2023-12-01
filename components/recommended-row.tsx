'use client'

import Typography from '@/components/typography'
import React from 'react'
import { getRecommendedItems } from '@/app/actions/items'
import { useEffect, useState } from 'react'
import ItemPreviewCard from '@/components/item-preview-card'

export default function RecommendedRow() {
  const [ranked, setRanked] = useState<any>([])

  const fetchRecommendedItems = async () => {
    const recommended = await getRecommendedItems()
    const ranked_ = recommended.sort((a, b) => b.score - a.score)

    setRanked(ranked_)
  }

  useEffect(() => {
    fetchRecommendedItems()
  }, [])

  return (
    <div className="mb-10">
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Recommended water
        </Typography>

        {/* <Link href="/bottled-water" className="underline italic text-primary">
          see all
        </Link> */}
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-6">
        {ranked &&
          ranked.map((item: any) => (
            <ItemPreviewCard
              key={item.id}
              item={item}
              href={`/item/${item.id}?name=${item.name.toLowerCase().replace(/ /g, '-')}`}
            />
          ))}
      </div>
    </div>
  )
}
