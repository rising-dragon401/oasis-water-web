import { Item, TapWaterLocation } from '@/types/custom'
import Image from 'next/image'
import Typography from '@/components/typography'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

type Props = {
  itemResult: Item | TapWaterLocation
}

export default function ResultsRow({ itemResult }: Props) {
  return (
    <Link
      className="flex flex-row gap-2 px-2 py-1 justify-between items-center"
      href={
        // @ts-ignore
        itemResult?.zip_codes
          ? `/location/${itemResult.id}?name=${itemResult.name.toLowerCase().replace(/ /g, '-')}`
          : `/item/${itemResult.id}?name=${itemResult.name.toLowerCase().replace(/ /g, '-')}`
      }
    >
      <div className="flex flex-row gap-2 items-center">
        <Image src={itemResult.image || ''} alt={itemResult.name} width={50} height={50} />
        <Typography size="base" fontWeight="normal">
          {itemResult.name}
        </Typography>
      </div>

      {/* @ts-ignore */}
      {itemResult?.zip_codes && <MapPin className="text-secondary-foreground" />}
    </Link>
  )
}
