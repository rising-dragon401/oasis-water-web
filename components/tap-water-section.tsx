import Link from 'next/link'
import Typography from '@/components/typography'
import React, { useMemo } from 'react'
import { TapWaterLocation } from '@/types/custom'
import ItemPreviewCard from '@/components/item-preview-card'

type Props = {
  locations: TapWaterLocation[] | null
}

export default function TapWaterSection({ locations }: Props) {
  const topItems = useMemo(() => {
    return locations?.sort((a, b) => (b.score || 0) - (a.score || 0))
  }, [locations])

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Tap water ratings
        </Typography>

        <Link href="/tap-water" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6">
        {topItems &&
          topItems?.slice(0, 3).map((item) => (
            <div key={item.id} className="flex-shrink-0" style={{ minWidth: '20%' }}>
              <ItemPreviewCard
                key={item.name}
                item={item}
                href={`/location/${item.id}?id=${item.name.toLowerCase().replace(/ /g, '-')}`}
              />
            </div>
          ))}
      </div>
    </div>
  )
}
