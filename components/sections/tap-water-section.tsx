import Link from 'next/link'
import Typography from '@/components/typography'
import React from 'react'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import { getFeaturedLocations } from '@/app/actions/locations'

export default async function TapWaterSection() {
  const featured = await getFeaturedLocations()

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          Tap water ratings
        </Typography>

        <Link href="/search/tap-water" className="underline italic text-primary">
          see all
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-8 hide-scrollbar" style={{ animation: 'fadeIn 1s' }}>
        {featured &&
          featured.map((location) => <ItemPreviewCard key={location.name} item={location} />)}
      </div>
    </div>
  )
}
