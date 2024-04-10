import Link from 'next/link'
import Typography from '@/components/typography'
import React from 'react'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import { getWorstItems } from '@/app/actions/items'

export default async function LowestRatedSection() {
  const lowestItems = await getWorstItems()

  return (
    <div>
      <div className="py-4 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Lowest rated bottled water
        </Typography>

        <Link href="/search/bottled-water" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-8 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        {lowestItems &&
          lowestItems?.slice(0, 5).map((item) => <ItemPreviewCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
