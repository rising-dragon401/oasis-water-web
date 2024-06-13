'use client'

import { getFilters } from '@/app/actions/filters'
import { getFlavoredWater, getItems, getWaterGallons } from '@/app/actions/items'
import { getLocations } from '@/app/actions/locations'
import ItemPreviewCard from '@/components/shared/item-preview-card'
import Typography from '@/components/typography'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useLocalStorage from '@/lib/hooks/use-local-storage'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { Item, ItemType, WaterFilter } from '@/types/custom'
import {
  Check,
  CupSoda,
  Droplet,
  Filter,
  GlassWater,
  Lock,
  Milk,
  SlidersHorizontal,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ItemSkeleton from './item-skeleton'

type TabKeys = 'bottled_water' | 'tap_water' | 'filter' | 'flavored_water' | 'water_gallons'

type CategoryType = {
  id: TabKeys
  title: string
  href?: string
  logo: React.ReactElement
}

const CATEGORIES: CategoryType[] = [
  {
    id: 'bottled_water',
    title: 'Bottled water',
    href: '/search/bottled-water',
    logo: <GlassWater className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'filter',
    title: 'Water Filters',
    logo: <Filter className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'flavored_water',
    title: 'Flavored water',
    logo: <CupSoda className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'water_gallons',
    title: '5 Gallons',
    logo: <Milk className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'tap_water',
    title: 'Tap water',
    logo: <Droplet className="text-slate-400 w-4 h-4" />,
  },
]

type SortMethod = 'name' | 'score'

type Props = {
  title?: string
  items?: Item[] | WaterFilter[] | null
}

export default function RankingList({ title, items }: Props) {
  const { subscription, uid } = useUserProvider()
  const { openModal } = useModal()
  const pathname = usePathname()

  const lastPath = useCallback(() => pathname.split('/').pop() as ItemType, [pathname])

  const [loading, setLoading] = useState({
    bottled_water: true,
    tap_water: true,
    filter: true,
    flavored_water: true,
    water_gallons: true,
  })
  const [tabValue, setTabValue] = useLocalStorage<TabKeys>('tabValue', 'bottled_water')
  const [sortMethod, setSortMethod] = useState('name')
  const [allItems, setAllItems] = useLocalStorage<any[]>('allItems', [])
  const [filteredItems, setFilteredItems] = useLocalStorage<any[]>('filteredItems', [])
  const [bottledWater, setBottledWater] = useLocalStorage<any[]>('bottledWater', [])
  const [waterGallons, setWaterGallons] = useLocalStorage<any[]>('waterGallons', [])
  const [tapWater, setTapWater] = useLocalStorage<any[]>('tapWater', [])
  const [filters, setFilters] = useLocalStorage<any[]>('filters', [])
  const [flavoredWater, setFlavoredWater] = useLocalStorage<any[]>('flavoredWater', [])
  const [completeInit, setCompleteInit] = useState(false)
  const [page, setPage] = useState(1)

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

  // load initial 20 items on page load
  useEffect(() => {
    const fetch = async () => {
      let sort: SortMethod = 'name'

      if (!items) {
        const items = await getItems({ limit: 18, sortMethod: sort })
        setBottledWater(items)
        setFilteredItems(items)
        setLoading((prev) => ({ ...prev, bottled_water: false }))
      } else {
        setLoading((prev) => ({ ...prev, bottled_water: false }))
      }

      const fetchLocations = async () => {
        const locations = await getLocations({ limit: 18, sortMethod: sort })
        if (locations) {
          setTapWater(locations)
          setLoading((prev) => ({ ...prev, tap_water: false }))
        }
      }

      const fetchFilters = async () => {
        const filters = await getFilters({ limit: 18, sortMethod: sort })
        if (filters) {
          setFilters(filters)
          setLoading((prev) => ({ ...prev, filter: false }))
        }
      }

      const fetchFlavoredWater = async () => {
        const flavoredWater = await getFlavoredWater({ limit: 18, sortMethod: sort })
        if (flavoredWater) {
          setFlavoredWater(flavoredWater)
          setLoading((prev) => ({ ...prev, flavored_water: false }))
        }
      }

      const fetchWaterGallons = async () => {
        const waterGallons = await getWaterGallons({ limit: 18, sortMethod: sort })
        if (waterGallons) {
          setWaterGallons(waterGallons)
          setLoading((prev) => ({ ...prev, water_gallons: false }))
        }
      }

      if (!tapWater) {
        fetchLocations()
      } else {
        setLoading((prev) => ({ ...prev, tap_water: false }))
      }

      if (!filters) {
        fetchFilters()
      } else {
        setLoading((prev) => ({ ...prev, filter: false }))
      }

      if (!flavoredWater) {
        fetchFlavoredWater()
      } else {
        setLoading((prev) => ({ ...prev, flavored_water: false }))
      }

      if (waterGallons) {
        fetchWaterGallons()
      } else {
        setLoading((prev) => ({ ...prev, water_gallons: false }))
      }

      setCompleteInit(true)
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // load all items
  useEffect(() => {
    if (completeInit) {
      let sort: SortMethod = 'name'
      if (subscription && uid) {
        sort = 'score'
      }

      getItems({ sortMethod: sort }).then((items) => {
        setBottledWater(items)
        if (tabValue === 'bottled_water') {
          setAllItems(items)
        }
      })

      getLocations({ sortMethod: sort }).then((locations: any) => {
        setTapWater(locations)
        if (tabValue === 'tap_water') {
          setAllItems(locations)
        }
      })

      getFilters({ sortMethod: sort }).then((filters) => {
        setFilters(filters)
        if (tabValue === 'filter') {
          setAllItems(filters)
        }
      })

      getFlavoredWater({ sortMethod: sort }).then((flavoredWater) => {
        setFlavoredWater(flavoredWater)
        if (tabValue === 'flavored_water') {
          setAllItems(flavoredWater)
        }
      })

      getWaterGallons({ sortMethod: sort }).then((waterGallons) => {
        setWaterGallons(waterGallons)
        if (tabValue === 'water_gallons') {
          setAllItems(waterGallons)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeInit])

  // handle existing /search routes
  useEffect(() => {
    if (lastPath && typeof lastPath === 'string') {
      setTabValue(lastPath)
    }
  }, [lastPath])

  // manage tab switching.
  useEffect(() => {
    if (tabValue) {
      manageTab(tabValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue])

  useEffect(() => {
    if (!allItems) return

    let sorted = allItems
    if (sortMethod === 'score') {
      sorted = sorted?.sort((a, b) => (b.score || 0) - (a.score || 0))
    } else if (sortMethod === 'name') {
      sorted = sorted?.sort((a, b) => a.name.localeCompare(b.name))
    }

    if (sorted && sorted?.length > 5) {
      setFilteredItems(sorted)
    }
  }, [sortMethod, allItems])

  // manage sort based on subscription
  useEffect(() => {
    if (!subscription || !uid) {
      setSortMethod('name')
    } else if (subscription && uid) {
      setSortMethod('score')
    }
  }, [subscription, uid])

  const manageTab = (tabValue: TabKeys) => {
    if (tabValue === 'bottled_water') {
      setAllItems(bottledWater)
    } else if (tabValue === 'tap_water') {
      setAllItems(tapWater)
    } else if (tabValue === 'filter') {
      setAllItems(filters)
    } else if (tabValue === 'flavored_water') {
      setAllItems(flavoredWater)
    } else if (tabValue === 'water_gallons') {
      setAllItems(waterGallons)
    }
  }

  const handleClickSortByScore = () => {
    if (subscription) {
      setSortMethod('score')
    } else {
      openModal('SubscriptionModal')
    }
  }

  const itemsWithNoReports = filteredItems?.filter((item) => item.score === null)

  return (
    <div className="pb-14 mt-4">
      <Tabs
        defaultValue={tabValue}
        className="md:mt-6 xl:max-w-6xl lg:max-w-5xl md:max-w-4xl sm:max-w-xl max-w-sm w-full"
        onValueChange={(value) => {
          setTabValue(value as TabKeys)
        }}
      >
        <div className="py-2 flex flex-row justify-between w-full">
          <TabsList className="gap-2 bg-transparent flex justify-start w-5/6 overflow-x-scroll hide-scrollbar">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.title}
                value={category.id}
                disabled={loading[category.id] && category.id !== 'bottled_water'}
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

          <div className="flex flex-row justify-end items-center w-1/6">
            <div className="flex flex-row gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex flex-row justify-center items-center gap-1 bg-transparent rounded-lg w-full px-3 max-w-56 h-8 hover:cursor-pointer">
                  <SlidersHorizontal className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Typography size="sm" fontWeight="medium" className="p-2">
                    Sort by
                  </Typography>
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
                    className="hover:cursor-pointer flex justify-between"
                  >
                    Name
                    {sortMethod === 'name' && <Check className="w-3 h-3" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <TabsContent value={tabValue} className="w-full">
          <div className="grid md:grid-cols-3 grid-cols-2 gap-6 w-full min-w-full max-w-[95vw]">
            {filteredItems &&
              filteredItems
                .filter((item) => item.score !== null && !item.is_draft)
                .slice(0, 20 * page)
                .map((item, index, array) => <ItemPreviewCard key={item.id} item={item} />)}

            {loading[tabValue] &&
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
