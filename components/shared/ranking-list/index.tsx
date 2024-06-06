'use client'

import { getFilters } from '@/app/actions/filters'
import { getFlavoredWater, getItems, getWaterGallons } from '@/app/actions/items'
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
import useDevice from '@/lib/hooks/use-device'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { Item, ItemType, WaterFilter } from '@/types/custom'
import { Check, ChevronDown, CupSoda, Droplet, Filter, GlassWater, Lock, Milk } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ItemSkeleton from './item-skeleton'

const CATEGORIES = [
  {
    id: 'bottled-water',
    title: 'Bottled water',
    href: '/search/bottled-water',
    logo: <GlassWater className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'tap-water',
    title: 'Tap water',
    logo: <Droplet className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'filters',
    title: 'Water Filters',
    logo: <Filter className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'flavored-water',
    title: 'Flavored water',
    logo: <CupSoda className="text-slate-400 w-4 h-4" />,
  },
  {
    id: 'water-gallons',
    title: '5 Gallons',
    logo: <Milk className="text-slate-400 w-4 h-4" />,
  },
]

type Props = {
  title?: string
  items?: Item[] | WaterFilter[] | null
}

export default function RankingList({ title, items }: Props) {
  const { subscription, uid } = useUserProvider()
  const { openModal } = useModal()
  const { isMobile } = useDevice()
  const pathname = usePathname()

  const lastPath = useCallback(() => pathname.split('/').pop() as ItemType, [pathname])

  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState('bottled-water')
  const [filter, setFilter] = useState<ItemType | 'all' | 'large_gallons' | null>('all')
  const [sortMethod, setSortMethod] = useState('name')
  const [allItems, setAllItems] = useState<any[]>([])
  const [resultItems, setResultItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])

  const [bottledWater, setBottledWater] = useState<any[]>([])
  const [waterGallons, setWaterGallons] = useState<any[]>([])
  const [tapWater, setTapWater] = useState<any[]>([])
  const [filters, setFilters] = useState<any[]>([])
  const [flavoredWater, setFlavoredWater] = useState<any[]>([])

  const [page, setPage] = useState(1)

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

      setLoading(false)
      Promise.all([getLocations(), getFilters(), getFlavoredWater(), getWaterGallons()]).then(
        ([locations, filters, flavoredWater, waterGallons]) => {
          if (locations) {
            setTapWater(locations)
          }
          if (filters) {
            setFilters(filters)
          }
          if (flavoredWater) {
            setFlavoredWater(flavoredWater)
          }
          if (waterGallons) {
            setWaterGallons(waterGallons)
          }
        }
      )
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // handle existing /search routes
  useEffect(() => {
    if (lastPath && typeof lastPath === 'string') {
      setTabValue(lastPath)
    }
  }, [lastPath])

  useEffect(() => {
    if (tabValue === 'bottled-water') {
      setAllItems(bottledWater)
    } else if (tabValue === 'tap-water') {
      setAllItems(tapWater)
    } else if (tabValue === 'filters') {
      setAllItems(filters)
    } else if (tabValue === 'flavored-water') {
      setAllItems(flavoredWater)
    } else if (tabValue === 'water-gallons') {
      setAllItems(waterGallons)
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
    let sorted = allItems
    if (sortMethod === 'score') {
      sorted = sorted?.sort((a, b) => (b.score || 0) - (a.score || 0))
    } else if (sortMethod === 'name') {
      sorted = sorted?.sort((a, b) => a.name.localeCompare(b.name))
    }
    setResultItems(sorted)
  }, [sortMethod, allItems])

  const handleClickSortByScore = () => {
    if (subscription) {
      setSortMethod('score')
    } else {
      openModal('SubscriptionModal')
    }
  }
  const itemsWithNoReports = filteredItems?.filter((item) => item.score === null)

  const renderFilters = () => {
    return (
      <div className="flex flex-row w-full justify-end">
        {!subscription && (
          <SubscribeButton label="Unlock top scoring" className="md:w-70 w-54 px-8" />
        )}

        <div className="flex flex-row gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row justify-center items-center gap-1 bg-transparent rounded-lg w-full px-3 max-w-56 h-8 hover:cursor-pointer">
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
                className="hover:cursor-pointer flex justify-between"
              >
                Name
                {sortMethod === 'name' && <Check className="w-3 h-3" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-14">
      <Tabs
        defaultValue={tabValue}
        className="md:mt-6 max-w-[95vw]"
        onValueChange={(value) => {
          setTabValue(value)
        }}
      >
        <div className="py-4 flex flex-row justify-between w-full ">
          <TabsList className="gap-2 bg-transparent flex justify-start md:max-w-[60vw] overflow-x-scroll hide-scrollbar">
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

          <div className="md:flex hidden">{renderFilters()}</div>
        </div>

        <div className="md:hidden flex">{renderFilters()}</div>

        <TabsContent value={tabValue} className="w-full">
          <div className="grid md:grid-cols-3 grid-cols-2 gap-6 w-full min-w-full max-w-[95vw]">
            {resultItems &&
              resultItems
                .filter((item) => item.score !== null && !item.is_draft)
                .slice(0, 20 * page)
                .map((item, index, array) => <ItemPreviewCard key={item.id} item={item} />)}

            {loading &&
              Array(10)
                .fill(0)
                .map((_, index) => <ItemSkeleton key={index} />)}

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

            <div ref={lastItemRef} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
