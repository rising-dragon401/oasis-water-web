'use client'

import Link from 'next/link'
import Typography from '@/components/typography'
import React from 'react'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import Image from 'next/image'

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
    <Link href={determineLink()} className="flex flex-col hover:opacity-80 mt-4">
      <div className="md:w-80 md:h-80 w-40 h-40 relative">
        <Image
          src={item.image || ''}
          className="w-full h-full rounded-md object-cover hover:cursor-pointer"
          width={300}
          height={300}
          quality={70}
          blurDataURL={item.image || ''}
          alt={item.name}
        />
      </div>
      <div className="flex flex-row justify-between pt-1 md:gap-2 items-start md:w-80 w-40">
        <div className="flex flex-col gap-1">
          <Typography
            size="sm"
            fontWeight="bold"
            className="!no-underline text-primary max-h-14 overflow-hidden max-w-48 text-ellipsis	"
          >
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
