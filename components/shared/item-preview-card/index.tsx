'use client'

import Typography from '@/components/typography'
import { P } from '@/components/ui/typography'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import { determineLink } from '@/utils/helpers'
import { AlertTriangle, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  item: Item | WaterFilter | TapWaterLocation
  showWarning?: boolean
  showFavoriteButton?: boolean
  size?: 'small' | 'medium' | 'large'
  isAuthUser?: boolean
  alwaysShow?: boolean
}

export default function ItemPreviewCard({
  item,
  showWarning,
  showFavoriteButton,
  size,
  isAuthUser,
  alwaysShow = false,
}: Props) {
  const { subscription } = useUserProvider()
  const { openModal } = useModal()

  // show if listed in top-rate or preview list but not on favorites page
  // unless subscribed or is the auth user
  const showData = subscription || isAuthUser || alwaysShow

  const renderScore = () => {
    const score = item?.score
    const color = 'text-blue-800'

    return (
      <div className="flex flex-col items-end w-full text-right">
        <Typography size="base" fontWeight="normal" className={`!no-underline ${color} text-right`}>
          {score}
        </Typography>

        <Typography
          size="xs"
          fontWeight="normal"
          className="!no-underline text-muted-foreground text-right"
        >
          /100
        </Typography>
      </div>
    )
  }

  const renderWarning = () => {
    return (
      <div className="flex flex-col items-end gap-1">
        <AlertTriangle className=" w-4 h-4" />
        <Typography
          size="xs"
          fontWeight="normal"
          className="!no-underline text-muted-foreground text-right"
        >
          /100
        </Typography>
      </div>
    )
  }

  const isFilter =
    item.type === 'shower_filter' || item.type === 'bottle_filter' || item.type === 'filter'

  const getHeightClass = () => {
    switch (size) {
      case 'small':
        return 'h-24 md:h-48 lg:h-64'
      case 'medium':
        return 'h-48 md:h-56 lg:h-64'
      case 'large':
        return 'h-64 md:h-72 lg:h-80'
      default:
        return 'h-40 md:h-56 lg:h-full' // Default to medium if size is not specified
    }
  }

  const getWidthClass = () => {
    switch (size) {
      case 'small':
        return 'w-24 md:w-48 lg:w-64'
      case 'medium':
        return 'w-48 md:w-56 lg:w-64'
      case 'large':
        return 'w-64 md:w-72 lg:w-80'
      default:
        return 'w-40 md:w-56 lg:w-full' // Default to medium if size is not specified
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!showData) {
      e.preventDefault()
      openModal('SubscriptionModal')
    }
  }

  const renderImage = () => {
    const size = 300 // Set a fixed size for both width and height to ensure a square
    return (
      <Image
        src={item.image || ''}
        className={`w-full h-full rounded-lg object-cover hover:cursor-pointer ${!showData ? 'blur-2xl rounded-lg' : ''}`}
        width={size}
        height={size}
        quality={70}
        objectFit="cover"
        blurDataURL={item.image || ''}
        alt={item.name}
      />
    )
  }

  return (
    <Link
      href={determineLink(item)}
      onClick={handleClick}
      className={`flex flex-col hover:opacity-80 relative max-w-sm rounded-md fade-in ${getWidthClass()}`}
    >
      <div
        className={`relative flex w-full rounded-lg bg-card border border-border aspect-w-1 aspect-h-1 ${getHeightClass()} ${getWidthClass()}`}
      >
        {renderImage()}
      </div>
      <div className="flex flex-row justify-between p-1 px-2 md:gap-2 items-start w-full">
        <div className="flex flex-col w-5/6 justify-start">
          <P
            className={`text-sm !no-underline text-primary flex-wrap overflow-hidden ${!showData ? 'blur-lg' : ''}`}
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
          >
            {item.name}
          </P>
        </div>

        <div className="flex w-1/6 justify-end">
          {/* @ts-ignore */}
          {isFilter && !item?.is_indexed ? (
            <div>{renderWarning()}</div>
          ) : (
            <>
              <div className="flex flex-col items-end w-full text-right">
                <button onClick={() => openModal('SubscriptionModal')}>
                  <Lock size={16} />
                </button>
                <Typography
                  size="xs"
                  fontWeight="normal"
                  className="!no-underline text-muted-foreground text-right"
                >
                  /100
                </Typography>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
