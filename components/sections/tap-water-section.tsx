import Link from 'next/link'
import Typography from '@/components/typography'
import React from 'react'
import ItemPreviewCard from '@/components/item-preview-card'
import { getLocations } from '@/app/actions/locations'

export default async function TapWaterSection() {
  const randomLocations = await getLocations()

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

      <div className="flex overflow-x-auto gap-6 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        {randomLocations &&
          randomLocations?.slice(0, 3).map((location) => (
            <div key={location.id} className="flex-shrink-0" style={{ minWidth: '20%' }}>
              <ItemPreviewCard key={location.name} item={location} />
            </div>
          ))}
      </div>
    </div>
  )
}
