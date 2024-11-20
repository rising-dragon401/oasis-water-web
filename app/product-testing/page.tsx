'use client'

import {
  fetchInProgressThings,
  fetchTestedThings,
  fetchUntestedThings,
  getFundingStats,
} from '@/app/actions/labs'
import BasicSearch from '@/components/basic-search'
import SubpageLayout from '@/components/home-layout'
import ItemFundingRow from '@/components/shared/item-funding-row'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { H2, Muted, P } from '@/components/ui/typography'
import { useEffect, useRef, useState } from 'react'

export default function AllProductsPage() {
  const [data, setData] = useState<{
    untestedItems: any[]
    inProgressItems: any[]
    testedItems: any[]
    fundingStats: { totalRaised?: number }
    isLoading: {
      untested: boolean
      inProgress: boolean
      tested: boolean
    }
  }>({
    untestedItems: [],
    inProgressItems: [],
    testedItems: [],
    fundingStats: {},
    isLoading: {
      untested: true,
      inProgress: true,
      tested: true,
    },
  })

  const [untestedPage, setUntestedPage] = useState(0)
  const [testedPage, setTestedPage] = useState(0)
  const isFetching = useRef(false)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      try {
        isFetching.current = true

        const untestedPromise = fetchUntestedItems(untestedPage * itemsPerPage)
        const inProgressPromise = fetchInProgressThings({
          type: ['bottled_water'],
          limit: itemsPerPage,
        })
        const testedPromise = fetchTestedItems(testedPage * itemsPerPage)
        const fundingStatsPromise = getFundingStats()

        const untested = await untestedPromise
        const validUntestedItems = untested
          .filter((item) => item.raised_amount !== undefined)
          .sort((a, b) => {
            if (b.raised_amount === 0) return -1
            if (a.raised_amount === 0) return 1
            return b.raised_amount - a.raised_amount
          })

        setData((prevState) => ({
          ...prevState,
          untestedItems: [...prevState.untestedItems, ...validUntestedItems],
          isLoading: {
            ...prevState.isLoading,
            untested: false,
          },
        }))

        const inProgress = await inProgressPromise
        setData((prevState) => ({
          ...prevState,
          inProgressItems: inProgress,
          isLoading: {
            ...prevState.isLoading,
            inProgress: false,
          },
        }))

        const tested = await testedPromise
        setData((prevState) => ({
          ...prevState,
          testedItems: [...prevState.testedItems, ...tested],
          isLoading: {
            ...prevState.isLoading,
            tested: false,
          },
        }))

        const fundingStats = await fundingStatsPromise
        setData((prevState) => ({
          ...prevState,
          fundingStats,
        }))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        isFetching.current = false
      }
    }

    if (!isFetching.current) {
      fetchData()
    }
  }, [untestedPage, testedPage])

  const handleLoadMore = () => {
    setUntestedPage((prevPage) => prevPage + 1)
  }

  const handleLoadMoreTested = () => {
    setTestedPage((prevPage) => prevPage + 1)
  }

  const renderRow = (items: any[], isLoading: boolean, tab: string) => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-4 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-24 rounded-xl" />
          ))}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4 w-full mt-4">
        {items.map((item) => (
          <ItemFundingRow
            key={item.id}
            raisedAmount={item.raised_amount}
            totalCost={item.total_cost}
            contributions={item.user_contributions}
            item={item}
            linkToProduct={true}
            showFundProgress={tab !== 'tested' || item.funding > 0}
            showFundButton={tab === 'untested'}
            date={tab === 'tested' ? item.updated_at : null}
            titleClassName="md:text-lg sm:text-sm"
          />
        ))}
      </div>
    )
  }

  return (
    <SubpageLayout>
      <div className="flex flex-col w-full px-4 pt-8 pb-10">
        <div className="flex flex-col w-full mb-8">
          <div className="flex flex-row mb-2 items-start justify-between">
            <div className="flex flex-col">
              <H2>Product testing</H2>
              <Muted>Track and contribute to testing waters. </Muted>
            </div>

            <div className="flex flex-col gap-2 items-end p-2 w-40">
              <Muted>Total raised:</Muted>
              {data.fundingStats.totalRaised ? (
                <P className="font-bold text-xl">
                  ${data.fundingStats.totalRaised?.toLocaleString()}
                </P>
              ) : (
                <Skeleton className="w-20 h-4 rounded-md" />
              )}
            </div>
          </div>

          <div className="flex flex-row mt-2 mb-6">
            <BasicSearch
              showSearch={true}
              size="medium"
              placeholder="Search your favorite brand, product or location"
            />
          </div>

          <Tabs defaultValue="untested">
            <TabsList className="w-full justify-start gap-4">
              <TabsTrigger value="untested">Upcoming</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="tested">Recently tested</TabsTrigger>
            </TabsList>
            <TabsContent value="untested">
              <Muted>Fundraising progress for untested items – sorted by most funded</Muted>
              {renderRow(data.untestedItems, data.isLoading.untested, 'untested')}
              <div className="flex flex-row justify-center w-full mt-4">
                <Button variant="outline" onClick={handleLoadMore}>
                  Load more
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="in_progress">
              <Muted>Funded items that are currently being tested in the lab</Muted>
              {renderRow(data.inProgressItems, data.isLoading.inProgress, 'in_progress')}
            </TabsContent>
            <TabsContent value="tested">
              <Muted>Most recently tested and updated items</Muted>
              {renderRow(data.testedItems, data.isLoading.tested, 'tested')}
              <div className="flex flex-row justify-center w-full mt-4">
                <Button variant="outline" onClick={handleLoadMoreTested}>
                  Load more
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SubpageLayout>
  )
}

async function fetchUntestedItems(offset: number) {
  const untestedItems = await fetchUntestedThings({
    tables: ['items'],
    limit: 10,
    offset,
  })

  return untestedItems
}

async function fetchTestedItems(offset: number) {
  const testedItems = await fetchTestedThings({
    tables: ['items', 'water_filters', 'tap_water_locations'],
    limit: 10,
    offset,
  })
  return testedItems
}
