'use client'

import { getFilters } from '@/app/actions/filters'
import { getFlavoredWater, getItems } from '@/app/actions/items'
import { getLocations } from '@/app/actions/locations'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import SubscribeButton from '@/components/shared/subscribe-button'
import Typography from '@/components/typography'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { Item, ItemType, WaterFilter } from '@/types/custom'
import { Check, ChevronDown, CupSoda, Droplet, Filter, Lock, Milk } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const CATEGORIES = [
  {
    id: 'bottled-water',
    title: 'Bottled water',
    href: '/search/bottled-water',
    logo: <Milk className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'tap-water',
    title: 'Tap water',
    href: '/search/tap-water',
    logo: <Droplet className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'filters',
    title: 'Water Filters',
    href: '/search/filters',
    logo: <Filter className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'flavored-water',
    title: 'Flavored water',
    href: '/search/bottled-water',
    logo: <CupSoda className="text-slate-400 w-4 h-4" />,
  },
]

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
  title?: string
  items?: Item[] | WaterFilter[] | null
}

export default function RankingList({ title, items }: Props) {
  const { subscription, uid } = useUserProvider()
  const { openModal } = useModal()

  const [tabValue, setTabValue] = useState('bottled-water')
  const [filter, setFilter] = useState<ItemType | 'all' | 'large_gallons' | null>('all')
  const [sortMethod, setSortMethod] = useState('name')
  const [allItems, setAllItems] = useState<any[]>([])
  const [resultItems, setResultItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])

  const [bottledWater, setBottledWater] = useState<any[]>([])
  const [tapWater, setTapWater] = useState<any[]>([])
  const [filters, setFilters] = useState<any[]>([])
  const [flavoredWater, setFlavoredWater] = useState<any[]>([])

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Pagination
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

  // load items on first render
  useEffect(() => {
    const fetch = async () => {
      const items = await getItems()
      setBottledWater(items)
      setAllItems(items)

      const locations = await getLocations()
      if (locations) {
        setTapWater(locations)
      }

      const filters = await getFilters()
      if (filters) {
        setFilters(filters)
      }

      const flavoredWater = await getFlavoredWater()
      if (flavoredWater) {
        setFlavoredWater(flavoredWater)
      }
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tabValue === 'bottled-water') {
      setAllItems(bottledWater)
    } else if (tabValue === 'tap-water') {
      setAllItems(tapWater)
    } else if (tabValue === 'filters') {
      setAllItems(filters)
    } else if (tabValue === 'flavored-water') {
      setAllItems(flavoredWater)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue])

  // handle logging out
  useEffect(() => {
    if (!subscription || !uid) {
      setSortMethod('name')
    } else if (subscription && uid) {
      setSortMethod('score')
    }
  }, [subscription, uid])

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
      sorted = filtered?.sort((a, b) => (b.score || 0) - (a.score || 0))
    } else if (sortMethod === 'name') {
      sorted = filtered?.sort((a, b) => a.name.localeCompare(b.name))
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
      <Tabs
        defaultValue={tabValue}
        className="mt-10 "
        onValueChange={(value) => {
          console.log('tab value', value)
          setTabValue(value)
        }}
      >
        <div className="py-4 flex flex-row justify-between md:mt-6 w-full ">
          <TabsList className="gap-4 bg-transparent">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.title}
                value={category.id}
                className={`flex flex-row justify-center items-center gap-1 
                bg-transparent border rounded-lg w-full px-3 max-w-56 h-8 hover:shadow-md 
                hover:cursor-pointer ${tabValue === category.id ? 'border-secondary' : ''}`}
              >
                {React.cloneElement(category.logo, {
                  className: `w-4 h-4 ${tabValue === category.id ? 'text-primary' : 'text-slate-400'}`,
                })}
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex flex-row justify-center items-center gap-1 bg-transparent rounded-lg w-full px-3 max-w-56 h-8 hover:cursor-pointer">
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
                <DropdownMenuTrigger className="flex flex-row justify-center items-center gap-1 bg-transparent rounded-lg w-full px-3 max-w-56 h-8 hover:cursor-pointer">
                  Sort
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleClickSortByScore}
                    className="hover:cursor-pointer"
                  >
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
          <div className="w-full justify-center flex flex-row gap-4 mb-2">
            <SubscribeButton label="Unlock the highest scoring items" className="w-70 px-8" />
          </div>
        )}

        <TabsContent value={tabValue} className="w-full">
          <div className="grid md:grid-cols-3 grid-cols-2 gap-6 md:min-w-[80vw] min-w-[80vw">
            {resultItems &&
              resultItems
                .filter((item) => item.score !== null && !item.is_draft)
                .slice(0, 20 * page)
                .map((item, index, array) => <ItemPreviewCard key={item.id} item={item} />)}

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
                      .map((item) => (
                        <ItemPreviewCard key={item.id} item={item} showWarning={true} />
                      ))}
                </div>
              </>
            )}

            {/* {hasMore && <div ref={lastItemRef} />} */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
