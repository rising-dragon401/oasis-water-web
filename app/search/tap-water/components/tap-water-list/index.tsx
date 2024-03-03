import Typography from '@/components/typography'
import React, { useMemo } from 'react'
import { TapWaterLocation } from '@/types/custom'
import ItemPreviewCard from '@/components/shared/item-preview-card'

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

      <div className="flex flex-row flex-wrap justify-between ">
        {sorted && sorted.map((item) => <ItemPreviewCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
