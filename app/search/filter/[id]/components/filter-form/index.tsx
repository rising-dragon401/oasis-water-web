'use client'

import Typography from '@/components/typography'
import React, { useEffect, useState } from 'react'
import RecommendedFiltersRow from '@/components/sections/recs-filter-row'
import Image from 'next/image'
import Score from '@/components/shared/score'
import ItemSkeleton from '../item-skeleton'
import Sources from '@/components/shared/sources'
import { getFilterDetails, getAllContaminants } from '@/app/actions/filters'
import { getIngredients } from '@/app/actions/ingredients'
import useSWR from 'swr'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ContaminantTable from '../contaminant-table'
import PaywallContent from '@/components/shared/paywall-content'

type Props = {
  id: string
}

export default function FilterForm({ id }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<any>({})

  const { data: allContaminants } = useSWR('water-contaminants', getAllContaminants)
  const { data: allIngredients } = useSWR('ingredients', getIngredients)

  const fetchFilter = async (id: string) => {
    if (!allIngredients) {
      return
    }

    const filter = await getFilterDetails(id, allIngredients)
    setFilter(filter)

    setIsLoading(false)
    return filter
  }

  const notFilteredContaminants = allContaminants?.filter(
    (contaminant) =>
      !filter.contaminants_filtered?.some((filtered: any) => filtered.id === contaminant.id)
  )

  useEffect(() => {
    fetchFilter(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, allIngredients])

  if (isLoading) {
    return <ItemSkeleton />
  }

  return (
    <div className="flex-col flex w-full md:px-0 px-2">
      <div className="md:py-10 py-6">
        <div className="flex md:flex-row flex-col gap-6">
          <div className="relative md:w-1/2">
            {filter.affiliate_url ? (
              <Link href={filter.affiliate_url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={filter.image}
                  alt={filter.name}
                  width={700}
                  height={700}
                  blurDataURL={filter.image}
                  placeholder="blur"
                  className="rounded-lg"
                />
              </Link>
            ) : (
              <Image
                src={filter.image}
                alt={filter.name}
                width={700}
                height={700}
                blurDataURL={filter.image}
                placeholder="blur"
                className="rounded-lg"
              />
            )}
          </div>
          <div className="flex flex-col gap-6 md:w-1/2">
            <Typography size="3xl" fontWeight="normal">
              {filter.name}
            </Typography>
            <Link href={`/search/company/${filter.company?.name}`}>
              <Typography size="base" fontWeight="normal" className="text-secondary-foreground">
                {filter.brand?.name} - {filter.company?.name}
              </Typography>
            </Link>
            <div className="flex items-center justify-start gap-4">
              <Score score={filter.score} isFull={true} />
            </div>
            {filter.affiliate_url && (
              <Button
                variant={filter.score > 70 ? 'default' : 'outline'}
                onClick={() => {
                  window.open(filter.affiliate_url, '_blank')
                }}
              >
                Buy Now <ArrowUpRight size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </div>

        <PaywallContent className="mt-8">
          <div className="flex flex-col gap-6 mt-10">
            <ContaminantTable filteredContaminants={filter.contaminants_filtered} />
          </div>

          {filter?.sources && filter?.sources?.length > 0 && <Sources data={filter.sources} />}
        </PaywallContent>
      </div>

      <RecommendedFiltersRow />
    </div>
  )
}
