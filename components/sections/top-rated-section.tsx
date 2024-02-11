import Link from 'next/link'
import Typography from '@/components/typography'
import React from 'react'
import ItemPreviewCard from '@/components/item-preview-card'
import { getTopItems } from '@/app/actions/items'

export default async function TopRatedSection() {
  const topItems = await getTopItems()

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Top rated
        </Typography>

        <Link href="/search/bottled-water" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        {topItems &&
          topItems?.slice(0, 5).map((item) => (
            <div key={item.id} className="flex-shrink-0" style={{ minWidth: '20%' }}>
              <ItemPreviewCard key={item.id} item={item} />
            </div>
          ))}
      </div>
    </div>
  )
}
