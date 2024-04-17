'use client'

import ItemPreviewCard from '@/components/shared/item-preview-card'
import SubscribeButton from '@/components/shared/subscribe-button'
import Typography from '@/components/typography'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { Item, WaterFilter } from '@/types/custom'
import { ChevronDown, Lock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  title: string
  items: Item[] | WaterFilter[] | null
}

export default function RankingList({ title, items }: Props) {
  const { subscription } = useUserProvider()
  const { openModal } = useModal()

  const [sortMethod, setSortMethod] = useState('name')

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
      openModal('SubscriptionModal')
    }
  }

  const itemsWithNoReports = sorted?.filter((item) => item.score === null)

  return (
    <div className="pb-14">
      <div className="py-4 flex flex-row justify-between md:mt-6">
        <Typography size="3xl" fontWeight="normal">
          {title}
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

      {!subscription && (
        <div className="w-full justify-center flex flex-row gap-4">
          <SubscribeButton label="Unlock ranked list sorted by score" className="w-70" />
        </div>
      )}

      <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-6 ">
        {sorted &&
          sorted
            .filter((item) => item.score !== null)
            // @ts-ignore
            .filter((item) => item?.is_draft !== true)
            .map((item) => <ItemPreviewCard key={item.id} item={item} />)}
      </div>

      {itemsWithNoReports && itemsWithNoReports.length > 0 && (
        <>
          <div className="pt-4 pb-8 flex flex-row justify-between mt-24">
            <Typography size="3xl" fontWeight="normal">
              ⚠️ NO REPORTS LOCATED
            </Typography>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-6 pb-24">
            {sorted &&
              sorted
                .filter((item) => item.score === null)
                .map((item) => <ItemPreviewCard key={item.id} item={item} showWarning={true} />)}
          </div>
        </>
      )}
    </div>
  )
}
