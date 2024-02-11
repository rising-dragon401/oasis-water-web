'use client'

import Typography from '@/components/typography'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import ItemPreviewCard from '@/components/item-preview-card'
import { useUserProvider } from '@/providers/UserProvider'

export default function FavoritesList() {
  const { userFavorites } = useUserProvider()

  return (
    <div>
      <div className="pt-4 pb-8 flex w-full flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          My Oaisys
        </Typography>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-6">
        {userFavorites &&
          userFavorites.map((fav: Item | TapWaterLocation | WaterFilter) => (
            <ItemPreviewCard key={fav.id} item={fav} />
          ))}
      </div>
    </div>
  )
}
