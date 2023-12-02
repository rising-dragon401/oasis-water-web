'use client'

import Typography from '@/components/typography'
import React, { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Score from '@/components/score'
import ItemSkeleton from '../item-skeleton'
import RecommendedRow from '@/components/recommended-row'
import ContaminantCard from '@/components/contaminant-card'
import Sources from '@/components/sources'
import { getFilterDetails, getAllContaminants } from '@/app/actions/filters'
import { WATER_CONTAMINANTS } from '../../constants/contaminants'
import useSWR from 'swr'

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

  const notFilteredContaminants =
    allContaminants &&
    allContaminants.filter(
      (contaminant: any) =>
        !filter?.contaminants_filtered?.some(
          (filteredContaminant: any) => filteredContaminant === contaminant.id
        )
    )

  useEffect(() => {
    fetchFilter(id)
  }, [id])

  if (isLoading) {
    return <ItemSkeleton />
  }

  return (
    <>
      <div className="py-10">
        <Suspense fallback={<div>Loading...</div>}>
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
              <Score score={filter.score} isFull={true} />
            </div>
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
                Contaminants Filtered ☠️
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
        </Suspense>
      </div>
      <RecommendedRow />
    </>
  )
}
