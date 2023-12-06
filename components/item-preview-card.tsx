import Link from 'next/link'
import Typography from '@/components/typography'
import React from 'react'
import { Item, TapWaterLocation, Filter } from '@/types/custom'
import Image from 'next/image'

type Props = {
  item: Item | TapWaterLocation | Filter
  href: string
}

export default function ItemPreviewCard({ item, href }: Props) {
  const renderScore = () => {
    // @ts-ignore
    if (item.score > 80) {
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

  return (
    <Link href={href} className="flex flex-col lg:w-80 md:w-64 w-40 hover:opacity-80">
      <div className="lg:w-80 lg:h-80 md:w-64 md:h-64 h-40 w-40">
        <Image
          src={item.image || ''}
          className="w-full h-full rounded-md object-cover hover:cursor-pointer"
          width={400}
          height={400}
          alt={item.name}
        />
      </div>
      <div className="flex flex-row justify-between w-full pt-1 md:gap-2 items-center">
        <Typography size="sm" fontWeight="bold" className="!no-underline text-primary">
          {item.name}
        </Typography>
        {item.score && <div className="w-24 text-right">{renderScore()}</div>}
      </div>
    </Link>
  )
}
