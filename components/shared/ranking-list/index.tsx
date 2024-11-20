'use client'

import { getFilters } from '@/app/actions/filters'
import { getItems } from '@/app/actions/items'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { CATEGORIES as CATEGORIES_CONST } from '@/lib/constants/categories'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import ItemSkeleton from './item-card-skeleton'

const CATEOGRIES = [
  {
    id: 'water',
    name: 'Water',
    tags: 'gallon, sparkling, still, spring, alkaline',
  },
  {
    id: 'filter',
    name: 'Filter',
    tags: 'shower, bottle, pitcher, countertop, sink, home',
  },
]

export default function RankingList({ categoryId }: { categoryId: string }) {
  const { subscription, uid } = useUserProvider()
  const { openModal } = useModal()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [allItems, setAllItems] = useState<any[]>([])
  const [title, setTitle] = useState('')
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
    setAllItems(data)
    setLoading(false)
  }

  // Fetch items based on categoryId
  useEffect(() => {
    const category = CATEGORIES_CONST.find((item) => item.id === categoryId)

    const productType_ = category?.productType || ''

    setTitle(category?.title || '')

    switch (productType_) {
      case 'water':
        fetchAndSetData('bottled_water', () =>
          getItems({
            limit: 500,
            sortMethod: 'name',
            type: category?.dbTypes,
            tags: category?.selectedTags,
          })
        )

        break
      case 'filter':
        fetchAndSetData('filter', () =>
          getFilters({
            limit: 250,
            sortMethod: 'name',
            type: category?.dbTypes,
            tags: category?.tags,
          })
        )

        break

      default:
        break
    }

    setTags((CATEOGRIES.find((category) => category.id === productType_)?.tags || '').split(', '))
  }, [categoryId])

  return (
    <div className="pb-14 mt-0 w-full">
      <div className="flex flex-col items-start gap-2 mb-6 w-full">
        <div className="flex md:flex-row md:gap-0 gap-2 flex-col justify-between w-full">
          <div className="flex flex-col gap-2">
            <Typography size="4xl" fontWeight="bold" className="max-w-lg">
              {title}
            </Typography>
            <Typography size="base" fontWeight="normal" className="max-w-lg">
              All the best {title.toLowerCase()} based on lab reports and science.
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
        </div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-2 md:gap-6 gap-2 w-full min-w-xl">
        {allItems &&
          allItems
            .filter((item) => !item.is_draft)
            // .filter((item) => {
            //   if (selectedTags.length === 0) return true
            //   return selectedTags.every((tag) => item.tags.includes(tag))
            // })
            .slice(0, 20 * page)
            .map((item, index, array) => <ItemPreviewCard key={item.id} item={item} alwaysShow />)}

        {(loading || !allItems) &&
          Array(10)
            .fill(0)
            .map((_, index) => <ItemSkeleton key={index} />)}

        <div ref={lastItemRef} />
      </div>
    </div>
  )
}
