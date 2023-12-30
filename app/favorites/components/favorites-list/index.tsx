import Typography from '@/components/typography'
import { Item, TapWaterLocation, Filter } from '@/types/custom'
import ItemPreviewCard from '@/components/item-preview-card'

type Props = {
  favorites: any
}

export default function FavoritesList({ favorites }: Props) {
  const determineLink = (item: Item | TapWaterLocation | Filter) => {
    if (item.type === 'tap_water') {
      return `/location/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
    } else if (item.type === 'filter') {
      return `/filter/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
    } else {
      return `/item/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
    }
  }

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
        <Typography size="2xl" fontWeight="normal">
          My Favorites
        </Typography>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-6">
        {favorites &&
          favorites.map((fav: Item | TapWaterLocation | Filter) => (
            <ItemPreviewCard key={fav.id} item={fav} href={determineLink(fav)} />
          ))}
      </div>
    </div>
  )
}
