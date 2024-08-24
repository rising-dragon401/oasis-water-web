'use client'

import { getFilters } from '@/app/actions/filters'
import { getItems } from '@/app/actions/items'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { CATEGORIES } from '@/lib/constants/categories'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { ArrowLeft, Lock } from 'lucide-react'
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
    const data = await fetchFunction()
    localStorage.setItem(key, JSON.stringify(data))

    // Sort the data if the user has a subscription
    if (subscription && uid) {
      console.log('sorting')
      const indexedItems = data.filter((item: any) => item.is_indexed !== false)
      const nonIndexedItems = data.filter((item: any) => item.is_indexed === false)

      console.log('indexedItems:', indexedItems)
      indexedItems.sort((a: any, b: any) => b.score - a.score)
      nonIndexedItems.sort((a: any, b: any) => b.score - a.score)

      setAllItems([...indexedItems, ...nonIndexedItems])
    } else {
      setAllItems(data)
    }

    setLoading(false)
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
      case 'energy_drink':
        fetchAndSetData('energy_drink', () =>
          getItems({ limit: 25, sortMethod: 'name', type: 'energy_drink' })
        )
        break
      case 'sports_drink':
        fetchAndSetData('sports_drink', () =>
          getItems({ limit: 25, sortMethod: 'name', type: 'sports_drink' })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, subscription, uid])

  // // handle sorting by score
  // useEffect(() => {
  //   if (subscription && uid) {
  //     setAllItems((prevItems) => {
  //       const indexedItems = prevItems.filter((item) => item.is_indexed !== false)
  //       const nonIndexedItems = prevItems.filter((item) => item.is_indexed === false)

  //       indexedItems.sort((a, b) => b.score - a.score)

  //       return [...indexedItems, ...nonIndexedItems]
  //     })
  //   }
  // }, [subscription, uid, loading])

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
          {subscription ? (
            <div className="flex flex-col gap-2">
              <Typography size="4xl" fontWeight="bold" className="max-w-lg">
                Top rated {category?.title.toLowerCase()}
              </Typography>
              <Typography size="base" fontWeight="normal" className="max-w-lg">
                Best {category?.title.toLowerCase()} based on science sorted by score
              </Typography>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Typography size="4xl" fontWeight="bold" className="max-w-lg">
                All {category?.title.toLowerCase()}
              </Typography>
              <Typography size="base" fontWeight="normal" className="max-w-lg">
                Want to know the best {category?.title.toLowerCase()} based on science?
              </Typography>
              <Button
                variant="default"
                className="flex flex-row gap-1"
                onClick={() => {
                  openModal('SubscriptionModal')
                }}
              >
                Show me the ratings
                <Lock className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

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
