'use client'

import Typography from '@/components/typography'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import { AlertTriangle, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import FavoriteButton from '../favorite-button'

type Props = {
  item: Item | TapWaterLocation | WaterFilter
  showWarning?: boolean
  showFavoriteButton?: boolean
}

export default function ItemPreviewCard({ item, showWarning, showFavoriteButton }: Props) {
  const { subscription } = useUserProvider()
  const { openModal } = useModal()

  const renderScore = () => {
    const score = item?.score || 0
    const color = 'text-blue-800'

    return (
      <div className="flex flex-col items-end ">
        {subscription ? (
          <Typography
            size="2xl"
            fontWeight="normal"
            className={`!no-underline ${color} text-right`}
          >
            {score}
          </Typography>
        ) : (
          <button onClick={() => openModal('SubscriptionModal')}>
            <Lock size={16} />
          </button>
        )}

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

  const renderWarning = () => {
    return (
      <div className="flex flex-col items-end gap-1">
        <AlertTriangle className="text-red-500" />
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
      <div className="relative lg:w-80 lg:h-80 md:w-72 md:h-72 sm:w-40 sm:h-40">
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
        {showFavoriteButton && (
          <div className="absolute top-0 right-0">
            <FavoriteButton item={item} />
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

        {/* Position renderScore relative to the image */}
        {item.score && <div>{renderScore()}</div>}
        {/* Position the warning symbol relative to the image */}
        {!item.score && <div>{renderWarning()}</div>}
      </div>
    </Link>
  )
}
