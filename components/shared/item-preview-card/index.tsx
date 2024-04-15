'use client'

import PaywallContent from '@/components/shared/paywall-content'
import Typography from '@/components/typography'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import Image from 'next/image'
import Link from 'next/link'
import FavoriteButton from '../favorite-button'

type Props = {
  item: Item | TapWaterLocation | WaterFilter
  showWarning?: boolean
}

export default function ItemPreviewCard({ item, showWarning }: Props) {
  const renderScore = () => {
    const score = item?.score || 0

    const color = score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500'

    return (
      <div>
        <PaywallContent label="Unlock score" hideButton={true}>
          <Typography
            size="2xl"
            fontWeight="normal"
            className={`!no-underline ${color} text-right`}
          >
            {score}
          </Typography>
        </PaywallContent>
        <Typography
          size="xs"
          fontWeight="normal"
          className="!no-underline text-secondary text-right"
        >
          /100
        </Typography>
      </div>
    )
  }

  const determineLink = () => {
    if (item.type === 'tap_water') {
      return `/search/location/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
    } else if (item.type === 'filter') {
      return `/search/filter/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
    } else {
      return `/search/item/${item.id}?name=${item?.name?.toLowerCase().replace(/ /g, '-')}`
    }
  }

  return (
    <Link href={determineLink()} className="flex flex-col hover:opacity-80 mt-4 relative">
      <div className="relative md:w-80 md:h-80 w-40 h-40">
        {' '}
        {/* Make this div relative */}
        <Image
          src={item.image || ''}
          className="w-full h-full rounded-md object-cover hover:cursor-pointer"
          width={300}
          height={300}
          quality={70}
          blurDataURL={item.image || ''}
          alt={item.name}
        />
        {/* Position the FavoriteButton relative to the image */}
        <div className="absolute top-0 right-0">
          <FavoriteButton item={item} />
        </div>
        {/* Position renderScore relative to the image */}
        {item.score && <div className="absolute bottom-2 right-2">{renderScore()}</div>}
        {/* Position the warning symbol relative to the image */}
        {!item.score && showWarning && (
          <div className="absolute bottom-2 right-3">
            <Typography size="xl" fontWeight="normal" className="text-red-500">
              ⚠️
            </Typography>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between pt-1 md:gap-2 items-start md:w-80 w-40">
        <div className="flex flex-col">
          <Typography
            size="base"
            fontWeight="bold"
            className="!no-underline text-primary md:overflow-hidden md:max-w-64 flex-wrap md:max-h-14 max-h-24 md:whitespace-nowrap overflow-ellipsis"
          >
            {item.name}
          </Typography>
          {item.company_name && (
            <Typography
              size="sm"
              fontWeight="normal"
              className="!no-underline text-primary-muted mt-0"
            >
              {item.company_name}
            </Typography>
          )}
        </div>
      </div>
    </Link>
  )
}
