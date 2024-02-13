'use client'

import Link from 'next/link'
import Typography from '@/components/typography'
import React from 'react'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import Image from 'next/image'
import FavoriteButton from './favorite-button'

type Props = {
  item: Item | TapWaterLocation | WaterFilter
}

export default function ItemPreviewCard({ item }: Props) {
  const renderScore = () => {
    // @ts-ignore
    if (item.score > 70) {
      return (
        <Typography
          size="xs"
          fontWeight="normal"
          className="!no-underline text-secondary text-right"
        >
          👍 {item.score} /100
        </Typography>
      )
      // @ts-ignore
    } else if (item.score > 60) {
      return (
        <Typography
          size="xs"
          fontWeight="normal"
          className="!no-underline text-secondary text-right"
        >
          👎 {item.score} /100
        </Typography>
      )
    } else {
      return (
        <Typography
          size="xs"
          fontWeight="normal"
          className="!no-underline text-secondarytext-right"
        >
          ⚠️ {item.score} /100
        </Typography>
      )
    }
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
    <Link
      href={determineLink()}
      className="flex flex-col lg:max-w-72 md:max-w-52 max-w-40 hover:opacity-80"
    >
      <div className="lg:w-72 lg:h-72 md:w-64 md:h-64 h-40 w-40 relative">
        <Image
          src={item.image || ''}
          className="w-full h-full rounded-md object-cover hover:cursor-pointer"
          width={400}
          height={400}
          quality={70}
          blurDataURL={item.image || ''}
          alt={item.name}
        />
        <div className="absolute top-0 right-0 p-2 cursor-pointer">
          <FavoriteButton item={item} />
        </div>
      </div>
      <div className="flex flex-row justify-between w-full pt-1 md:gap-2 items-start">
        <div className="flex flex-col gap-1">
          <Typography size="sm" fontWeight="bold" className="!no-underline text-primary">
            {item.name}
          </Typography>
          {item.company_name && (
            <Typography size="sm" fontWeight="normal" className="!no-underline text-primary">
              {item.company_name}
            </Typography>
          )}
        </div>

        {item.score && <div className="w-24 text-right">{renderScore()}</div>}
      </div>
    </Link>
  )
}
