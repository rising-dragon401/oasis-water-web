'use client'

import Typography from '@/components/typography'
import React, { useMemo, useState } from 'react'
import { Item } from '@/types/custom'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

type Props = {
  items: Item[] | null
}

export default function BottledWaterList({ items }: Props) {
  const [sortMethod, setSortMethod] = useState('score')

  const sorted = useMemo(() => {
    if (!items) return null

    return [...items].sort((a, b) => {
      if (sortMethod === 'score') {
        if (a.score === null) return 1
        if (b.score === null) return -1
        return b.score - a.score
      } else if (sortMethod === 'name') {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
  }, [items, sortMethod])

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between md:mt-6">
        <Typography size="3xl" fontWeight="normal">
          All bottled water ratings
        </Typography>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row items-center gap-2">
            Sort
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                setSortMethod('score')
              }}
              className="hover:cursor-pointer"
            >
              Score
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSortMethod('name')
              }}
              className="hover:cursor-pointer"
            >
              Name
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-6 ">
        {sorted &&
          sorted
            .filter((item) => item.score !== null)
            .map((item) => <ItemPreviewCard key={item.id} item={item} />)}
      </div>

      <div className="pt-4 pb-8 flex flex-row justify-between mt-24">
        <Typography size="3xl" fontWeight="normal">
          ⚠️ NO WATER REPORTS LOCATED
        </Typography>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-6 pb-24">
        {sorted &&
          sorted
            .filter((item) => item.score === null)
            .map((item) => <ItemPreviewCard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
