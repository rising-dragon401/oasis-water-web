'use client'

import Typography from '@/components/typography'
import React, { useEffect, useMemo, useState } from 'react'
import { Item } from '@/types/custom'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Lock } from 'lucide-react'
import { useUserProvider } from '@/providers/UserProvider'
import { SubscribeModal } from '@/components/shared/subscribe-modal'
import SubscribeButton from '@/components/shared/subscribe-button'

type Props = {
  items: Item[] | null
}

export default function BottledWaterList({ items }: Props) {
  const { subscription } = useUserProvider()
  const [sortMethod, setSortMethod] = useState('name')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (subscription) {
      setSortMethod('score')
    }
  }, [subscription])

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

  const handleClickSortByScore = () => {
    if (subscription) {
      setSortMethod('score')
    } else {
      setOpen(true)
    }
  }

  return (
    <div>
      <SubscribeModal open={open} setOpen={setOpen} />

      <div className="py-4 flex flex-row justify-between md:mt-6">
        <Typography size="3xl" fontWeight="normal">
          Bottled water ratings
        </Typography>

        <div className="flex flex-row gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row items-center gap-2">
              Sort
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleClickSortByScore} className="hover:cursor-pointer">
                {!subscription && <Lock className="w-4 h-4 mr-2" />}
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
      </div>

      <SubscribeButton label="Unlock ranked list of top waters" className="w-70" />

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
