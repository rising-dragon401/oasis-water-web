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
import ItemImage from '@/components/shared/item-image'
import BlurredLineItem from '@/components/shared/blurred-line-item'

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
          <div className="flex justify-center md:w-1/2 w-full">
            {filter.affiliate_url ? (
              <Link href={filter.affiliate_url} target="_blank" rel="noopener noreferrer">
                <ItemImage src={filter.image} alt={filter.name} />
              </Link>
            ) : (
              <ItemImage src={filter.image} alt={filter.name} />
            )}
          </div>

          <div className="flex flex-col justify-start">
            <div className="flex flex-row justify-between  gap-2">
              <div className="flex flex-col gap-2">
                <Typography size="3xl" fontWeight="normal">
                  {filter.name}
                </Typography>
                <Link href={`/search/company/${filter.company?.name}`}>
                  <Typography size="base" fontWeight="normal" className="text-secondary-foreground">
                    {filter.brand?.name} - {filter.company?.name}
                  </Typography>
                </Link>

                {filter.affiliate_url && (
                  <Button
                    variant={filter.score > 70 ? 'default' : 'outline'}
                    onClick={() => {
                      window.open(filter.affiliate_url, '_blank')
                    }}
                    className="w-40"
                  >
                    Buy Now <ArrowUpRight size={16} className="ml-2 w-" />
                  </Button>
                )}
              </div>

              <Score score={filter.score} isFull={true} />
            </div>
            <div className="flex flex-col gap-6 mt-10">
              <BlurredLineItem
                label="Contaminants not filtered"
                value={notFilteredContaminants?.length.toString() || '0'}
                labelClassName="text-red-500"
              />
              <BlurredLineItem
                label="Contaminants filtered"
                value={filter.contaminants_filtered?.length.toString() || '0'}
              />
            </div>
          </div>
        </div>

        <PaywallContent className="mt-8" label="Unlock all data and reports">
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
