'use client'

import { getFilters } from '@/app/actions/filters'
import { getItems } from '@/app/actions/items'
import { getLocations } from '@/app/actions/locations'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { ItemType } from '@/types/custom'
import {
  ArrowUpDown,
  Check,
  CupSoda,
  Droplet,
  Filter,
  GlassWater,
  Milk,
  ShowerHead,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ItemSkeleton from './item-skeleton'

export type TabKeys =
  | 'bottled_water'
  | 'flavored_water'
  | 'gallons'
  | 'tap_water'
  | 'filter'
  | 'shower_filter'

type CategoryType = {
  id: TabKeys
  title: string
  href?: string
  logo: React.ReactElement
  tags?: string[]
}

const CATEGORIES: CategoryType[] = [
  {
    id: 'bottled_water',
    title: 'Bottled water',
    href: '/search/bottled-water',
    logo: <GlassWater className="text-slate-400 w-4 h-4" />,
    tags: ['still', 'sparkling', 'gallon'],
  },
  {
    id: 'filter',
    title: 'Tap filters',
    logo: <Filter className="text-slate-4000 w-4 h-4" />,
    tags: ['tap', 'shower', 'bottle', 'sink', 'counter', 'pitcher'],
  },
  {
    id: 'flavored_water',
    title: 'Flavored water',
    href: '/search/flavored-water',
    logo: <CupSoda className="text-slate-4000 w-4 h-4" />,
    tags: ['still', 'sparkling'],
  },
  {
    id: 'gallons',
    title: 'Gallons',
    logo: <Milk className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'shower_filter',
    title: 'Shower filters',
    logo: <ShowerHead className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'tap_water',
    title: 'Tap water',
    logo: <Droplet className="text-slate-400 w-4 h-4" />,
  },
  // {
  //   id: 'mineral_packets',
  //   title: 'Mineral packets',
  //   logo: <Flower className="text-slate-400 w-4 h-4" />,
  // },
]

type SortMethod = 'name' | 'score'

export default function RankingList({ defaultTab }: { defaultTab?: TabKeys }) {
  const { subscription, uid } = useUserProvider()
  const { openModal } = useModal()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tab = searchParams.get('tab') as TabKeys | null

  const lastPath = useCallback(() => pathname.split('/').pop() as ItemType, [pathname])

  const [loading, setLoading] = useState({
    bottled_water: true,
    flavored_water: true,
    gallons: true,
    filter: true,
    tap_water: true,
    shower_filter: true,
    water_gallon: true,
  })
  const [tabValue, setTabValue] = useState<TabKeys>(tab || 'bottled_water')
  const [allItems, setAllItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [bottledWater, setBottledWater] = useState<any[]>([])
  const [flavoredWater, setFlavoredWater] = useState<any[]>([])
  const [gallons, setGallons] = useState<any[]>([])
  const [showerFilters, setShowerFilters] = useState<any[]>([])
  const [tapWater, setTapWater] = useState<any[]>([])
  const [filters, setFilters] = useState<any[]>([])
  const [sortMethod, setSortMethod] = useState('name')
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

  useEffect(() => {
    const initialFetch = async () => {
      const itemsPromise = getItems({ limit: 999, sortMethod: 'name', type: 'bottled_water' }).then(
        (items) => {
          setBottledWater(items)
          setLoading((prev) => ({ ...prev, bottled_water: false }))
          if (tabValue === 'bottled_water') {
            setAllItems(items)
          }
        }
      )

      const gallonsPromise = getItems({
        limit: 999,
        sortMethod: 'name',
        type: 'water_gallon',
      }).then((items) => {
        setGallons(items)
        setLoading((prev) => ({ ...prev, gallons: false }))

        if (tabValue === 'gallons') {
          setAllItems(items)
        }
      })

      const flavoredWaterPromise = getItems({
        limit: 999,
        sortMethod: 'name',
        type: 'flavored_water',
      }).then((items) => {
        setFlavoredWater(items)
        setLoading((prev) => ({ ...prev, flavored_water: false }))

        if (tabValue === 'flavored_water') {
          setAllItems(items)
        }
      })

      const filtersPromise = getFilters({
        limit: 999,
        sortMethod: 'name',
        type: 'filter',
      }).then((filters) => {
        setFilters(filters)
        setLoading((prev) => ({ ...prev, filter: false }))
        if (tabValue === 'filter') {
          setAllItems(filters)
        }
      })

      const showerFiltersPromise = getFilters({
        limit: 999,
        sortMethod: 'name',
        type: 'shower_filter',
      }).then((filters) => {
        setShowerFilters(filters)
        setLoading((prev) => ({ ...prev, shower_filter: false }))
        if (tabValue === 'shower_filter') {
          setAllItems(filters)
        }
      })

      const locationsPromise = getLocations({ limit: 999, sortMethod: 'name' }).then(
        (locations) => {
          setTapWater(locations)
          setLoading((prev) => ({ ...prev, tap_water: false }))
          if (tabValue === 'tap_water') {
            setAllItems(locations)
          }
        }
      )

      await Promise.all([
        itemsPromise,
        gallonsPromise,
        flavoredWaterPromise,
        filtersPromise,
        showerFiltersPromise,
        locationsPromise,
      ])

      setCompleteInit(true)
    }

    initialFetch()
  }, [tabValue])

  useEffect(() => {
    if (lastPath && typeof lastPath === 'string') setTabValue(lastPath)
  }, [lastPath])

  useEffect(() => {
    if (tab) setTabValue(tab)
  }, [tab])

  useEffect(() => {
    if (tabValue) manageTab(tabValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue])

  useEffect(() => {
    if (!allItems) return

    let sortedItems = [...allItems]
    if (sortMethod === 'score') {
      sortedItems.sort((a, b) => (b.score || 0) - (a.score || 0))
    } else {
      sortedItems.sort((a, b) => a.name.localeCompare(b.name))
    }

    if (selectedTags.length > 0) {
      sortedItems = sortedItems.filter((item) =>
        selectedTags.every((tag) => item?.tags?.includes(tag))
      )
    }

    setFilteredItems(sortedItems)
  }, [sortMethod, allItems, selectedTags])

  useEffect(() => {
    setSortMethod(subscription && uid ? 'score' : 'name')
  }, [subscription, uid])

  const manageTab = (tabValue: TabKeys) => {
    setSelectedTags([])

    if (tabValue === 'bottled_water') {
      setAllItems(bottledWater)
    } else if (tabValue === 'tap_water') {
      setAllItems(tapWater)
    } else if (tabValue === 'flavored_water') {
      setAllItems(flavoredWater)
    } else if (tabValue === 'filter') {
      setAllItems(filters)
    } else if (tabValue === 'shower_filter') {
      setAllItems(showerFilters)
    } else if (tabValue === 'gallons') {
      setAllItems(gallons)
    }

    setTags(CATEGORIES.find((category) => category.id === tabValue)?.tags || [])
  }

  const handleClickSortByScore = () => {
    if (subscription) {
      setSortMethod('score')
    } else {
      openModal('SubscriptionModal')
    }
  }

  const UnlockTopButton = () => {
    if (!subscription) {
      return (
        <Button variant="outline" className="flex flex-row gap-1" onClick={handleClickSortByScore}>
          Unlock scores and ratings
          <TrendingUp className="w-4 h-4" />
        </Button>
      )
    }
  }

  return (
    <div className="pb-14 mt-4">
      <div className="flex w-full justify-center mb-3">{UnlockTopButton()}</div>

      <Tabs
        defaultValue={tabValue}
        className="md:mt-6 xl:max-w-6xl lg:max-w-5xl md:max-w-4xl sm:max-w-xl max-w-sm w-full"
        onValueChange={(value) => {
          setTabValue(value as TabKeys)
        }}
      >
        <div className="py-2 flex flex-row justify-between w-full">
          <TabsList className="gap-2 bg-transparent flex justify-start md:w-5/6 w-5/6 overflow-x-scroll hide-scrollbar">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.title}
                value={category.id}
                disabled={loading[category.id] && category.id !== 'bottled_water'}
                className={`flex flex-row justify-left items-center gap-1 
                bg-transparent border rounded-lg  px-3 max-w-56 h-8 hover:shadow-md 
                hover:cursor-pointer ${tabValue === category.id ? 'border' : '!border-none'}`}
              >
                {React.cloneElement(category.logo, {
                  className: `w-4 h-4 ${tabValue === category.id ? 'text-primary' : 'text-slate-400'}`,
                })}
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex flex-row justify-end items-center md:w-1/6 w-1/6">
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

            {subscription && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex flex-row justify-center items-center gap-1 bg-transparent rounded-lg w-10 h-8 hover:cursor-pointer">
                  <ArrowUpDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Typography size="sm" fontWeight="bold" className="pl-1 py-1">
                    Sort by
                  </Typography>
                  <DropdownMenuItem
                    onClick={handleClickSortByScore}
                    className="hover:cursor-pointer flex justify-between"
                  >
                    Score
                    {sortMethod === 'score' && <Check className="w-3 h-3" />}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      setSortMethod('name')
                    }}
                    className="hover:cursor-pointer flex justify-between"
                  >
                    Name
                    {sortMethod === 'name' && <Check className="w-3 h-3" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <TabsContent value={tabValue} className="w-full">
          <div className="grid md:grid-cols-3 grid-cols-2 gap-6 w-full min-w-full max-w-[95vw] ">
            {filteredItems &&
              filteredItems
                .filter((item) => item.score !== null && !item.is_draft)
                .slice(0, 20 * page)
                .map((item, index, array) => <ItemPreviewCard key={item.id} item={item} />)}

            {(loading[tabValue] || !completeInit || !filteredItems) &&
              Array(10)
                .fill(0)
                .map((_, index) => <ItemSkeleton key={index} />)}

            <div ref={lastItemRef} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
