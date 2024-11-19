'use client'

import { fetchFundingStatus } from '@/app/actions/labs'
import { Progress } from '@/components/ui/progress'
import { Muted, P } from '@/components/ui/typography'
import {} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function UntestedCard({ item }: { item: any }) {
  const [fundingStatus, setFundingStatus] = useState<any>(null)

  useEffect(() => {
    console.log('fetching funding status')
    console.log(item.id, item.type)

    if (item.id && item.type) {
      fetchFundingStatus({ itemId: item.id, type: item.type, name: item.name }).then(
        setFundingStatus
      )
    }
  }, [item.id, item.type])

  const getFundingPercentage = (fundedAmount: number, totalCost: number) => {
    return (fundedAmount / totalCost) * 100
  }

  return (
    <div className="flex flex-row justify-start items-center gap-2 bg-card rounded-xl border border-border relative">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center items-center w-24 h-24">
          <Image src={item.image} alt={item.name} width={75} height={75} objectFit="fill" />
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-between h-full">
        <P>{item.name}</P>
        {/* <Muted>Starndard water test</Muted> */}
        <div className="flex flex-col gap-1 max-w-xs">
          <Progress
            value={getFundingPercentage(
              fundingStatus?.funded_amount || 0,
              fundingStatus?.total_cost || 285
            )}
            max={100}
            className="h-2"
          />
          <div className="flex flex-row justify-between">
            <Muted className="text-xs">
              {getFundingPercentage(
                fundingStatus?.funded_amount || 0,
                fundingStatus?.total_cost || 285
              ).toFixed(0)}
              % raised
            </Muted>
          </div>
        </div>
      </div>
    </div>
  )
}
