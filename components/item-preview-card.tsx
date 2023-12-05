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
          size="sm"
          fontWeight="normal"
          className="!no-underline text-secondary  text-right"
        >
          👍 {item.score} /100
        </Typography>
      )
      // @ts-ignore
    } else if (item.score > 60) {
      return (
        <Typography
          size="sm"
          fontWeight="normal"
          className="!no-underline text-secondary  text-right"
        >
          👎 {item.score} /100
        </Typography>
      )
    } else {
      return (
        <Typography
          size="sm"
          fontWeight="normal"
          className="!no-underline text-secondarytext-right"
        >
          ⚠️ {item.score} /100
        </Typography>
      )
    }
  }

  return (
    <article key={item.id}>
      <Link href={href}>
        <div
          className="rounded-lg overflow-hidden transform transition-transform duration-500 ease-in-out hover:-translate-y-2 hover:shadow-md flex flex-col justify-end hover:cursor-pointer"
          style={{
            backgroundImage: `url(${item.image})`,
          }}
        >
          <Image
            src={item.image || ''}
            className="w-full h-56 rounded-md object-cover hover:cursor-pointer"
            width={300}
            height={300}
            alt={item.name}
          />
        </div>
        <div className="flex flex-row justify-between pt-1 gap-2">
          <Typography size="xl" fontWeight="normal" className="!no-underline w-full">
            {item.name}
          </Typography>
          {item.score && <div className="w-24 text-right">{renderScore()}</div>}
        </div>
      </Link>
    </article>
  )
}
