'use client'

import Typography from '@/components/typography'
import React, { useEffect, useState } from 'react'
import RecommendedFiltersRow from '@/components/sections/recs-filter-row'
import Image from 'next/image'
import Score from '@/components/score'
import ItemSkeleton from '../item-skeleton'
import ContaminantCard from '@/components/contamintant-card'
import Sources from '@/components/sources'
import { getFilterDetails, getAllContaminants } from '@/app/actions/filters'
import useSWR from 'swr'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  id: string
}

export default function FilterForm({ id }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<any>({})

  const fetchFilter = async (id: string) => {
    const filter = await getFilterDetails(id)
    setFilter(filter)

    setIsLoading(false)
    return filter
  }

  const { data: allContaminants } = useSWR('water-contaminants', getAllContaminants)

  const notFilteredContaminants = allContaminants?.filter(
    (contaminant) =>
      !filter.contaminants_filtered?.some((filtered: any) => filtered.id === contaminant.id)
  )

  useEffect(() => {
    fetchFilter(id)
  }, [id])

  if (isLoading) {
    return <ItemSkeleton />
  }

  return (
    <div className="flex-col flex w-full">
      <div className="md:py-10 py-6">
        <div className="flex md:flex-row flex-col gap-6">
          <Image
            src={filter.image}
            alt={filter.name}
            width={400}
            height={400}
            className="md:w-1/2 w-full h-full rounded-lg object-cover"
          />

          <div className="flex flex-col gap-6 ">
            <Typography size="3xl" fontWeight="normal">
              {filter.name}
            </Typography>
            <Link href={`/search/company/${filter.company?.name}`}>
              <Typography size="base" fontWeight="normal" className="text-secondary-foreground">
                {filter.brand?.name} - {filter.company?.name}
              </Typography>
            </Link>
            <Score score={filter.score} isFull={true} />
          </div>

          {filter.affiliate_url && filter.score > 80 && (
            <Button
              variant="outline"
              className="bg-card"
              onClick={() => {
                window.open(filter.affiliate_url, '_blank')
              }}
            >
              {' '}
              Shop <ArrowUpRight size={16} className="ml-2" />
            </Button>
          )}
        </div>

        {notFilteredContaminants && (
          <div className="flex flex-col gap-6 mt-10">
            <Typography size="2xl" fontWeight="normal">
              Contaminants Not Filtered ☠️
            </Typography>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              {notFilteredContaminants.map((contaminant: any) => (
                <ContaminantCard key={contaminant.id} data={contaminant} />
              ))}
            </div>
          </div>
        )}

        {filter.contaminants_filtered && (
          <div className="flex flex-col gap-6 mt-10">
            <Typography size="2xl" fontWeight="normal">
              Contaminants Filtered ✅
            </Typography>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              {filter.contaminants_filtered.map((contaminant: any) => (
                <ContaminantCard key={contaminant.id} data={contaminant} />
              ))}
            </div>
          </div>
        )}

        {filter?.sources && (
          <div className="flex flex-col gap-6 my-10">
            <Typography size="2xl" fontWeight="normal">
              Sources
            </Typography>
            {filter && filter?.sources?.length > 0 && <Sources data={filter.sources} />}
          </div>
        )}
      </div>
      <RecommendedFiltersRow />
    </div>
  )
}
