'use client'

import Link from 'next/link'
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
          return b.score - a.score // assuming score is a number
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }, [items, sortMethod])

  return (
    <div>
      <div className="pt-4 pb-8 flex flex-row justify-between">
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

      <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-6 ">
        {sorted &&
          sorted.map((item) => (
            <ItemPreviewCard
              key={item.id}
              item={item}
              href={`/item/${item.id}?name=${item.name.toLowerCase().replace(/ /g, '-')}`}
            />
          ))}
      </div>
    </div>
  )
}
