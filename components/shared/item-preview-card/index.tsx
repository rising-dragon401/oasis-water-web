'use client'

import Link from 'next/link'
import Typography from '@/components/typography'
import React from 'react'
import { Item, TapWaterLocation, WaterFilter } from '@/types/custom'
import Image from 'next/image'
import useSubscription from '@/lib/hooks/use-subscription'
import PaywallContent from '@/components/shared/paywall-content'

type Props = {
  item: Item | TapWaterLocation | WaterFilter
}

export default function ItemPreviewCard({ item }: Props) {
  const { subscription } = useSubscription()

  const renderScore = () => {
    const score = item?.score || 0

    const color = score > 70 ? 'text-green-500' : score > 40 ? 'text-yellow-500' : 'text-red-500'

    return (
      <PaywallContent label="Unlock score" hideButton={true}>
        <div>
          <Typography
            size="2xl"
            fontWeight="normal"
            className={`!no-underline ${color} text-right`}
          >
            {score}
          </Typography>
          <Typography
            size="xs"
            fontWeight="normal"
            className="!no-underline text-secondary text-right"
          >
            /100
          </Typography>
        </div>
      </PaywallContent>
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
        <div className="flex flex-col ">
          <Typography
            size="lg"
            fontWeight="bold"
            className="!no-underline text-primary overflow-hidden max-w-64 text-ellipsis	"
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

        {item.score && <div className="w-24 text-right">{renderScore()}</div>}
      </div>
    </Link>
  )
}
