import Link from 'next/link'
import Typography from '@/components/typography'
import React, { useMemo } from 'react'
import { Item } from '@/types/custom'
import ItemPreviewCard from '@/components/item-preview-card'

type Props = {
  items: Item[] | null | []
}

export default function TopRatedSection({ items }: Props) {
  const topItems = useMemo(() => {
    return items?.sort((a, b) => (b.score || 0) - (a.score || 0))
  }, [items])

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Top rated
        </Typography>

        <Link href="/bottled-water" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6 hide-scrollbar">
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
