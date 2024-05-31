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
import { Item, ItemType, WaterFilter } from '@/types/custom'
import { Check, ChevronDown, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'

const FILTERS: any[] = [
  {
    id: 'all',
    name: 'All waters',
  },
  {
    id: 'bottled_water',
    name: 'Still and Sparkling',
  },
  {
    id: 'flavored_water',
    name: 'Flavored',
  },
  {
    id: 'large_gallons',
    name: 'Large gallons',
  },
]

type Props = {
  title: string
  items: Item[] | WaterFilter[] | null
}

export default function RankingList({ title, items }: Props) {
  const { subscription } = useUserProvider()
  const { openModal } = useModal()

  const [filter, setFilter] = useState<ItemType | 'all' | 'large_gallons' | null>('all')
  const [sortMethod, setSortMethod] = useState('name')
  const [allItems, setAllItems] = useState<any[]>([])
  const [resultItems, setResultItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])

  useEffect(() => {
    if (items) {
      setAllItems(items)
    }
  }, [items])

  useEffect(() => {
    if (subscription) {
      setSortMethod('score')
    }
  }, [subscription])

  useEffect(() => {
    let filtered = allItems
    if (filter !== 'all') {
      if (filter === 'large_gallons') {
        filtered = allItems.filter((item) => item.tags && item.tags.includes('gallon'))
      } else {
        filtered = allItems.filter((item) => item.type === filter)
      }
    }
    let sorted = filtered
    if (sortMethod === 'score') {
      sorted = filtered.sort((a, b) => (b.score || 0) - (a.score || 0))
    } else if (sortMethod === 'name') {
      sorted = filtered.sort((a, b) => a.name.localeCompare(b.name))
    }
    setResultItems(sorted)
  }, [filter, sortMethod, allItems])

  const handleClickSortByScore = () => {
    if (subscription) {
      setSortMethod('score')
    } else {
      openModal('SubscriptionModal')
    }
  }

  const handleFilterByType = (type: any) => {
    setFilter(type)
  }

  const itemsWithNoReports = filteredItems?.filter((item) => item.score === null)

  return (
    <div className="pb-14">
      <div className="py-4 flex flex-row justify-between md:mt-6">
        <Typography size="3xl" fontWeight="normal">
          {title}
        </Typography>

        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row items-center gap-2">
                Filter
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {FILTERS.map((filt) => (
                  <DropdownMenuItem
                    key={filt.id}
                    onClick={() => handleFilterByType(filt.id)}
                    className="hover:cursor-pointer flex flex-row justify-between w-40"
                  >
                    {filt.name}
                    {filt.id === filter && <Check className="w-3 h-3" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-row gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row items-center gap-2">
                Sort
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
      </div>

      {!subscription && (
        <div className="w-full justify-center flex flex-row gap-4 mb-4">
          <SubscribeButton label="Unlock the highest scoring items" className="w-70 px-8" />
        </div>
      )}

      <div className="grid md:grid-cols-3 grid-cols-2 w-full gap-6 ">
        {resultItems &&
          resultItems
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
            {resultItems &&
              resultItems
                .filter((item) => item.score === null)
                .map((item) => <ItemPreviewCard key={item.id} item={item} showWarning={true} />)}
          </div>
        </>
      )}
    </div>
  )
}
