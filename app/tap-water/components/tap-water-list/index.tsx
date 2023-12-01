import Typography from '@/components/typography'
import React, { useMemo } from 'react'
import { TapWaterLocation } from '@/types/custom'
import ItemPreviewCard from '@/components/item-preview-card'

type Props = {
  locations: TapWaterLocation[] | null
}

export default function TapWaterList({ locations }: Props) {
  const sorted = useMemo(() => {
    return locations?.sort((a, b) => a.name.localeCompare(b.name))
  }, [locations])

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          All tap water ratings
        </Typography>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-6 ">
        {sorted &&
          sorted.map((item) => (
            <ItemPreviewCard
              key={item.id}
              item={item}
              href={`/location/${item.id}?name=${item.name.toLowerCase().replace(/ /g, '-')}`}
            />
          ))}
      </div>
    </div>
  )
}
