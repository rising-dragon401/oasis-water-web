'use client'

import { getFilters } from '@/app/actions/filters'
import { getItems } from '@/app/actions/items'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CATEGORIES } from '@/lib/constants/categories'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { ArrowLeft, Check, Lock, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import ItemSkeleton from './item-skeleton'

export default function RankingList({ categoryId }: { categoryId: string }) {
  const { subscription, uid } = useUserProvider()
  const { openModal } = useModal()
  const router = useRouter()

  const category = CATEGORIES.find((category) => category.id === categoryId)

  const [loading, setLoading] = useState(true)
  const [allItems, setAllItems] = useState<any[]>([])
  const [completeInit, setCompleteInit] = useState(false)
  const [page, setPage] = useState(1)
  const [tags, setTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Pagination.
  const observer = useRef<IntersectionObserver>()
  const lastItemRef = useCallback((node: any) => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [])

  const fetchAndSetData = async (key: string, fetchFunction: () => Promise<any>) => {
    // const cachedData = localStorage.getItem(key)
    // if (cachedData && cachedData.length > 5) {
    //   const parsedData = JSON.parse(cachedData)
    //   setState(parsedData)
    //   if (tabValue === tabKey) {
    //     console.log(' setAllItems cachedData', parsedData)
    //     setAllItems(parsedData)
    //   }
    //   setLoading((prev) => ({ ...prev, [key]: false }))
    // } else {
    //   const data = await fetchFunction()
    //   setState(data)
    //   localStorage.setItem(key, JSON.stringify(data))
    //   setLoading((prev) => ({ ...prev, [key]: false }))
    //   if (tabValue === tabKey) {
    //     setAllItems(data)
    //   }
    // }
    const data = await fetchFunction()
    localStorage.setItem(key, JSON.stringify(data))
    setLoading(false)
    setAllItems(data)
  }

  useEffect(() => {
    switch (categoryId) {
      case 'bottled_water':
        fetchAndSetData('bottled_water', () =>
          getItems({ limit: 500, sortMethod: 'name', type: 'bottled_water' })
        )
        break
      case 'filter':
        fetchAndSetData('filter', () =>
          getFilters({ limit: 50, sortMethod: 'name', type: 'filter' })
        )
        break
      case 'shower_filter':
        fetchAndSetData('shower_filter', () =>
          getFilters({ limit: 25, sortMethod: 'name', type: 'shower_filter' })
        )
        break
      case 'flavored_water':
        fetchAndSetData('flavored_water', () =>
          getItems({ limit: 25, sortMethod: 'name', type: 'flavored_water' })
        )
        break
      case 'gallons':
        fetchAndSetData('gallons', () =>
          getItems({ limit: 25, sortMethod: 'name', type: 'water_gallon' })
        )
        break
      case 'bottle_filter':
        fetchAndSetData('bottle_filter', () =>
          getFilters({ limit: 25, sortMethod: 'name', type: 'bottle_filter' })
        )
        break
      default:
        break
    }
  }, [categoryId])

  // handle sorting by score
  useEffect(() => {
    if (subscription && uid) {
      setAllItems((prevItems) => {
        const indexedItems = prevItems.filter((item) => item.is_indexed !== false)
        const nonIndexedItems = prevItems.filter((item) => item.is_indexed === false)

        indexedItems.sort((a, b) => b.score - a.score)

        return [...indexedItems, ...nonIndexedItems]
      })
    }
  }, [subscription, uid, loading])

  const UnlockTopButton = () => {
    if (!subscription) {
      return (
        <Button
          variant="default"
          className="flex flex-row gap-1"
          onClick={() => {
            openModal('SubscriptionModal')
          }}
        >
          Unlock top rated
          <Lock className="w-4 h-4" />
        </Button>
      )
    }
  }

  return (
    <div className="pb-14 md:mt-4 mt-0 w-full">
      <div className="flex flex-col items-start gap-2 mb-6 w-full">
        <Button
          variant="ghost"
          onClick={() => {
            router.push('/top-rated')
          }}
          className="p-0 mb-0"
        >
          <ArrowLeft className="w-4 h-4" />
          See all categories
        </Button>
        <div className="flex md:flex-row md:gap-0 gap-2 flex-col justify-between w-full">
          <Typography size="4xl" fontWeight="bold" className="max-w-lg">
            {subscription ? 'Top rated' : 'All'} {category?.title.toLowerCase()}
          </Typography>

          <div className="">{UnlockTopButton()}</div>
        </div>
      </div>

      {tags.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row justify-center items-center gap-1 bg-transparent rounded-lg w-10 h-8 hover:cursor-pointer">
            <SlidersHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Typography size="sm" fontWeight="bold" className="pl-1 py-1">
              Tags
            </Typography>
            {tags.map((tag) => (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTags((prevTags) =>
                    prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [tag]
                  )
                }}
                className="hover:cursor-pointer flex justify-between"
                key={tag}
              >
                {tag}
                {selectedTags.includes(tag) && <Check className="w-3 h-3" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="grid md:grid-cols-3 grid-cols-2 md:gap-6 gap-2 w-full">
        {allItems &&
          allItems
            .filter((item) => !item.is_draft)
            // .filter((item) => {
            //   if (selectedTags.length === 0) return true
            //   return selectedTags.every((tag) => item.tags.includes(tag))
            // })
            .slice(0, 20 * page)
            .map((item, index, array) => <ItemPreviewCard key={item.id} item={item} />)}

        {(loading || !allItems) &&
          Array(10)
            .fill(0)
            .map((_, index) => <ItemSkeleton key={index} />)}

        <div ref={lastItemRef} />
      </div>
    </div>
  )
}
