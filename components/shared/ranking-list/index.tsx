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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { ItemType } from '@/types/custom'
import {
  Beaker,
  Check,
  CupSoda,
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
  | 'bottle_filter'

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
    tags: ['still', 'sparkling'],
  },
  {
    id: 'filter',
    title: 'Water filters',
    logo: <Filter className="text-slate-4000 w-4 h-4" />,
    tags: ['sink', 'counter', 'pitcher'],
  },
  {
    id: 'flavored_water',
    title: 'Flavored drinks',
    href: '/search/flavored-water',
    logo: <CupSoda className="text-slate-4000 w-4 h-4" />,
    tags: ['still', 'sparkling'],
  },
  {
    id: 'gallons',
    title: 'Water gallons',
    logo: <Milk className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'shower_filter',
    title: 'Shower filters',
    logo: <ShowerHead className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'bottle_filter',
    title: 'Bottle filters',
    logo: <Beaker className="text-slate-4000 w-4 h-4" />,
  },
  // {
  //   id: 'tap_water',
  //   title: 'Tap water',
  //   logo: <Droplet className="text-slate-400 w-4 h-4" />,
  // },
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
    bottle_filter: true,
  })
  const [tabValue, setTabValue] = useState<TabKeys>(tab || 'bottled_water')
  const [allItems, setAllItems] = useState<any[]>([])
  const [bottledWater, setBottledWater] = useState<any[]>([])
  const [flavoredWater, setFlavoredWater] = useState<any[]>([])
  const [gallons, setGallons] = useState<any[]>([])
  const [showerFilters, setShowerFilters] = useState<any[]>([])
  const [bottledFilters, setBottledFilters] = useState<any[]>([])
  const [tapWater, setTapWater] = useState<any[]>([])
  const [filters, setFilters] = useState<any[]>([])
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
    const fetchAndSetData = async (
      key: string,
      fetchFunction: () => Promise<any>,
      setState: React.Dispatch<React.SetStateAction<any[]>>,
      tabKey: TabKeys
    ) => {
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
      setState(data)
      localStorage.setItem(key, JSON.stringify(data))
      setLoading((prev) => ({ ...prev, [key]: false }))
      if (tabValue === tabKey) {
        setAllItems(data)
      }
    }

    const initialFetch = async () => {
      await Promise.all([
        fetchAndSetData(
          'bottled_water',
          () => getItems({ limit: 500, sortMethod: 'name', type: 'bottled_water' }),
          setBottledWater,
          'bottled_water'
        ),
        fetchAndSetData(
          'shower_filter',
          () => getFilters({ limit: 25, sortMethod: 'name', type: 'shower_filter' }),
          setShowerFilters,
          'shower_filter'
        ),
        fetchAndSetData(
          'flavored_water',
          () => getItems({ limit: 25, sortMethod: 'name', type: 'flavored_water' }),
          setFlavoredWater,
          'flavored_water'
        ),
        fetchAndSetData(
          'gallons',
          () => getItems({ limit: 25, sortMethod: 'name', type: 'water_gallon' }),
          setGallons,
          'gallons'
        ),
        fetchAndSetData(
          'bottle_filter',
          () => getFilters({ limit: 25, sortMethod: 'name', type: 'bottle_filter' }),
          setBottledFilters,
          'bottle_filter'
        ),
        // fetchAndSetData(
        //   'tap_water',
        //   () => getLocations({ limit: 199, sortMethod: 'name' }),
        //   setTapWater,
        //   'tap_water'
        // ),
        fetchAndSetData(
          'filter',
          () => getFilters({ limit: 50, sortMethod: 'name', type: 'filter' }),
          setFilters,
          'filter'
        ),
      ])

      setCompleteInit(true)
    }

    initialFetch()
  }, [])

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
    if (subscription && uid) {
      setAllItems((prevItems) => {
        return [...prevItems].sort((a, b) => b.score - a.score)
      })
    }
  }, [subscription, uid, tabValue, loading])

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
    } else if (tabValue === 'bottle_filter') {
      setAllItems(bottledFilters)
    } else if (tabValue === 'gallons') {
      setAllItems(gallons)
    }

    setTags(CATEGORIES.find((category) => category.id === tabValue)?.tags || [])
  }

  const UnlockTopButton = () => {
    if (!subscription) {
      return (
        <Button
          variant="outline"
          className="flex flex-row gap-1"
          onClick={() => {
            openModal('SubscriptionModal')
          }}
        >
          Unlock scores and ratings
          <TrendingUp className="w-4 h-4" />
        </Button>
      )
    }
  }

  return (
    <div className="pb-14 mt-14">
      <div className="flex flex-col w-full items-center justify-center gap-y-4">
        <div className="flex flex-col items-center text-center gap-2">
          <Typography size="5xl" fontWeight="bold" className="max-w-lg">
            Top Rated Products
          </Typography>
          <Typography size="base" fontWeight="normal" className="max-w-lg">
            Discover the healthiest water options based on science.
          </Typography>
        </div>
      </div>

      <div className="flex w-full justify-center m-3">{UnlockTopButton()}</div>

      <Tabs
        defaultValue={tabValue}
        className="md:mt-6 xl:max-w-6xl lg:max-w-5xl md:max-w-4xl sm:max-w-xl max-w-sm w-full"
        onValueChange={(value) => {
          setTabValue(value as TabKeys)
        }}
      >
        <div className="py-2 flex flex-row justify-between w-full">
          <TabsList className="gap-2 bg-transparent flex justify-start w-7/8 overflow-x-scroll hide-scrollbar">
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

          <div className="flex flex-row justify-end items-center w-1/8">
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

            {/* {subscription && (
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
            )} */}
          </div>
        </div>

        <TabsContent value={tabValue} className="w-full">
          <div className="grid md:grid-cols-3 grid-cols-2 gap-6 w-full min-w-full max-w-[95vw] ">
            {allItems &&
              allItems
                .filter((item) => !item.is_draft)
                .filter((item) => {
                  if (selectedTags.length === 0) return true
                  return selectedTags.every((tag) => item.tags.includes(tag))
                })
                .slice(0, 20 * page)
                .map((item, index, array) => <ItemPreviewCard key={item.id} item={item} />)}

            {(loading[tabValue] || !completeInit || !allItems) &&
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
