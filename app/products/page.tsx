'use client'

import { fetchInProgressThings, fetchTestedThings, fetchUntestedThings } from '@/app/actions/labs'
import SubpageLayout from '@/components/home-layout'
import ItemFundingRow from '@/components/shared/item-funding-row'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { H1 } from '@/components/ui/typography'
import { useEffect, useState } from 'react'

export default function AllProductsPage() {
  const [untestedItems, setUntestedItems] = useState<any[]>([])
  const [inProgressItems, setInProgressItems] = useState<any[]>([])
  const [testedItems, setTestedItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUntestedThings({ tables: ['items'], limit: 10 }).then(setUntestedItems)
    fetchInProgressThings({ type: ['bottled_water'], limit: 10 }).then(setInProgressItems)
    fetchTestedThings({ tables: ['items'], limit: 10 }).then(setTestedItems)
    setIsLoading(false)
  }, [])

  const getFundingPercentage = (fundedAmount: number, totalCost: number) => {
    return (fundedAmount / totalCost) * 100
  }

  const renderRow = (items: any[]) => {
    return (
      <div className="flex flex-col gap-4 w-full">
        {items.map((item) => (
          <ItemFundingRow key={item.id} item={item} />
        ))}
      </div>
    )
  }

  return (
    <SubpageLayout>
      <div className="flex flex-col w-full px-4 pt-8 pb-10">
        <div className="flex flex-col w-full mb-8">
          <div className="flex flex-row mb-2">
            <H1>Products</H1>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="w-[400px] h-[30px]" />
              <Skeleton className="w-[400px] h-[30px]" />
              <Skeleton className="w-[400px] h-[30px]" />
            </div>
          ) : (
            <Tabs defaultValue="untested" className="max-w-xl">
              <TabsList className="w-full justify-start gap-2 ">
                <TabsTrigger value="untested">Untested</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="tested">Tested</TabsTrigger>
              </TabsList>
              <TabsContent value="untested">{renderRow(untestedItems)}</TabsContent>
              <TabsContent value="in_progress">{renderRow(inProgressItems)}</TabsContent>
              <TabsContent value="tested">{renderRow(testedItems)}</TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </SubpageLayout>
  )
}
