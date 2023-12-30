import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import Image from 'next/image'
import Typography from '@/components/typography'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

type ExtendedType = {
  type?: string
}

type Props = {
  itemResult:
    | (Item & ExtendedType)
    | (TapWaterLocation & ExtendedType)
    | (WaterFilter & ExtendedType)
}

export default function ResultsRow({ itemResult }: Props) {
  const determineLink = () => {
    if (itemResult.type === 'tap_water') {
      return `/location/${itemResult.id}?name=${itemResult?.name?.toLowerCase().replace(/ /g, '-')}`
    } else if (itemResult.type === 'filter') {
      return `/filter/${itemResult.id}?name=${itemResult?.name?.toLowerCase().replace(/ /g, '-')}`
    } else {
      return `/item/${itemResult.id}?name=${itemResult?.name?.toLowerCase().replace(/ /g, '-')}`
    }
  }

  return (
    <Link
      className="flex flex-row gap-2 px-2 py-1 justify-between items-center hover:opacity-70"
      href={determineLink()}
    >
      <div className="flex flex-row gap-2 items-center">
        <Image
          src={itemResult.image || ''}
          alt={itemResult.name || ''}
          width={50}
          height={50}
          quality={40}
          className="rounded-md h-10 w-10 object-contain"
        />
        <Typography size="base" fontWeight="normal">
          {itemResult.name}
        </Typography>
      </div>

      {/* @ts-ignore */}
      {itemResult?.zip_codes && <MapPin className="text-secondary-foreground" />}
    </Link>
  )
}
