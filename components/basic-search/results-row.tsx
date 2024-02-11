import { Item, TapWaterLocation, WaterFilter, Ingredient } from '@/types/custom'
import Image from 'next/image'
import Typography from '@/components/typography'
import Link from 'next/link'
import { MapPin, Droplet, Filter, Milk, Building } from 'lucide-react'

type ExtendedType = {
  type?: string
}

type Props = {
  itemResult:
    | (Item & ExtendedType)
    | (TapWaterLocation & ExtendedType)
    | (WaterFilter & ExtendedType)
    | (Ingredient & ExtendedType)
}

export default function ResultsRow({ itemResult }: Props) {
  const determineLink = () => {
    if (itemResult.type === 'tap_water') {
      return `/search/location/${itemResult.id}?name=${itemResult?.name
        ?.toLowerCase()
        .replace(/ /g, '-')}`
    } else if (itemResult.type === 'filter') {
      return `/search/filter/${itemResult.id}?name=${itemResult?.name
        ?.toLowerCase()
        .replace(/ /g, '-')}`
    } else if (itemResult.type === 'ingredient') {
      return `/search/ingredient/${itemResult.id}?name=${itemResult?.name
        ?.toLowerCase()
        .replace(/ /g, '-')}`
    } else {
      return `/search/item/${itemResult.id}?name=${itemResult?.name
        ?.toLowerCase()
        .replace(/ /g, '-')}`
    }
  }

  const getIcon = () => {
    if (itemResult.type === 'tap_water') {
      return <Droplet className="text-secondary-foreground" />
    } else if (itemResult.type === 'filter') {
      return <Filter className="text-secondary-foreground" />
    } else if (itemResult.type === 'ingredient') {
      return <MapPin className="text-secondary-foreground" />
    } else if (itemResult.type === 'company') {
      return <Building className="text-secondary-foreground" />
    } else {
      return <Milk className="text-secondary-foreground" />
    }
  }

  return (
    <Link
      className="flex flex-row gap-2 px-2 py-1 justify-between items-center hover:opacity-70 "
      href={determineLink()}
    >
      <div className="flex flex-row gap-2 items-center">
        <Image
          src={itemResult.image || ''}
          alt={itemResult.name || ''}
          width={50}
          height={50}
          quality={40}
          blurDataURL={itemResult.image || ''}
          placeholder={itemResult.image ? 'blur' : 'empty'}
          className="rounded-md h-10 w-10 object-cover"
        />
        <Typography size="base" fontWeight="normal">
          {itemResult.name}
        </Typography>
      </div>

      {getIcon()}
    </Link>
  )
}
