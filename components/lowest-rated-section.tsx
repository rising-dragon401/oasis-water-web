import Link from 'next/link'
import Typography from '@/components/typography'
import React, { useMemo } from 'react'
import { Item } from '@/types/custom'
import ItemPreviewCard from '@/components/item-preview-card'

type Props = {
  items: Item[] | null
}

export default function LowestRatedSection({ items }: Props) {
  const lowestItems = useMemo(() => {
    return items
      ?.filter((item) => item.score !== null)
      .sort((a, b) => (a.score || 0) - (b.score || 0))
  }, [items])

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Lowest rated
        </Typography>

        <Link href="/bottled-water" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6">
        {lowestItems &&
          lowestItems?.slice(0, 5).map((item) => (
            <div key={item.id} className="flex-shrink-0" style={{ minWidth: '20%' }}>
              <ItemPreviewCard
                key={item.id}
                item={item}
                href={`/item/${item.id}?name=${item.name.toLowerCase().replace(/ /g, '-')}`}
              />
            </div>
          ))}
      </div>
    </div>
  )
}
