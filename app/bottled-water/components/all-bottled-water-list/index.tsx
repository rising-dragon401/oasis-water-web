'use client'

import Typography from '@/components/typography'
import React, { useMemo, useState } from 'react'
import { Item } from '@/types/custom'
import ItemPreviewCard from '@/components/item-preview-card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

type Props = {
  items: Item[] | null
}

export default function BottledWaterList({ items }: Props) {
  const [sortMethod, setSortMethod] = useState('score')

  const sorted = useMemo(() => {
    if (!items) return null

    return [...items].sort((a, b) => {
      switch (sortMethod) {
        case 'score':
          if (b.score === null || a.score === null) {
            return 0
          }
          return b.score - a.score
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }, [items, sortMethod])

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between md:mt-6">
        <Typography size="3xl" fontWeight="normal">
          All bottled water ratings
        </Typography>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" className="flex flex-row items-center gap-2">
              Sort
              <ChevronDown className="w-4 h-4" />
            </Button>
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
