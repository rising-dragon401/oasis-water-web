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
import { useEffect, useState } from 'react'

export default function AllProductsPage() {
  const [untestedItems, setUntestedItems] = useState<any[]>([])
  const [untestedPage, setUntestedPage] = useState(0)
  const [inProgressItems, setInProgressItems] = useState<any[]>([])
  const [testedItems, setTestedItems] = useState<any[]>([])
  const [fundingStats, setFundingStats] = useState<any>({})
  const [isLoading, setIsLoading] = useState({
    untested: true,
    inProgress: true,
    tested: true,
  })
  const itemsPerPage = 10

  useEffect(() => {
    const fetchUntestedItems = async (offset: number) => {
      const untestedItems = await fetchUntestedThings({
        tables: ['items'],
        limit: itemsPerPage,
        offset,
      })

      const uniqueItems = Array.from(
        new Set([...untestedItems, ...untestedItems].map((item) => item.id))
      ).map((id) => untestedItems.find((item) => item.id === id))

      uniqueItems.sort((a, b) => b.funding - a.funding)

      setUntestedItems((prevItems) => [...prevItems, ...uniqueItems])
      setIsLoading((prevState) => ({ ...prevState, untested: false }))
    }

    const fetchInProgressItems = async () => {
      const inProgressItems = await fetchInProgressThings({ type: ['bottled_water'], limit: 2 })
      setInProgressItems(inProgressItems)
      setIsLoading((prevState) => ({ ...prevState, inProgress: false }))
    }

    const fetchTestedItems = async () => {
      const testedItems = await fetchTestedThings({ tables: ['items'], limit: 2 })
      setTestedItems(testedItems)
      setIsLoading((prevState) => ({ ...prevState, tested: false }))
    }

    loadFundingStats()
    fetchUntestedItems(untestedPage * itemsPerPage)
    fetchInProgressItems()
    fetchTestedItems()
  }, [untestedPage])

  const loadFundingStats = async () => {
    const fundingStats = await getFundingStats()
    setFundingStats(fundingStats)
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
            item={item}
            linkToProduct={true}
            showContribute={tab === 'untested'}
            date={tab === 'tested' || tab === 'in_progress' ? item.updated_at : null}
            titleClassName={'text-lg'}
          />
        ))}
      </div>
    )
  }

  const handleLoadMore = () => {
    setUntestedPage((prevPage) => prevPage + 1)
  }

  return (
    <SubpageLayout>
      <div className="flex flex-col w-full px-4 pt-8 pb-10">
        <div className="flex flex-col w-full mb-8">
          <div className="flex flex-row mb-2 items-start justify-between ">
            <div className="flex flex-col">
              <H2>Product testing</H2>
              <Muted>Track and contribute to testing water brands</Muted>
            </div>

            <div className="flex flex-col gap-2 items-end p-2 w-40">
              <Muted>Total raised:</Muted>
              {fundingStats.totalRaised ? (
                <P className="font-bold">${fundingStats.totalRaised?.toLocaleString()}</P>
              ) : (
                <Skeleton className="w-20 h-4 rounded-md" />
              )}
            </div>
          </div>

          <div className="flex flex-row mt-2 mb-6">
            <BasicSearch
              showSearch={true}
              size="medium"
              placeholder="Search waters, filters and location"
            />
          </div>

          <Tabs defaultValue="untested" className="">
            <TabsList className="w-full justify-start gap-4">
              <TabsTrigger value="untested">Upcoming</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="tested">Testing complete</TabsTrigger>
            </TabsList>
            <TabsContent value="untested">
              <Muted>Fundraising progress for untested items – sorted by most funded</Muted>
              {renderRow(untestedItems, isLoading.untested, 'untested')}

              <div className="flex flex-row justify-center w-full mt-4">
                <Button variant="outline" onClick={() => handleLoadMore()}>
                  Load more
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="in_progress">
              <Muted>Funded items that are currently being tested in the lab</Muted>
              {renderRow(inProgressItems, isLoading.inProgress, 'in_progress')}
            </TabsContent>
            <TabsContent value="tested">
              <Muted>Most recently tested and updated items</Muted>

              {renderRow(testedItems, isLoading.tested, 'tested')}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SubpageLayout>
  )
}
