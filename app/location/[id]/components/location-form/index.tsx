'use client'

import Typography from '@/components/typography'
import { getLocationDetails } from '@/app/actions/locations'
import React, { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Score from '@/components/score'
import ItemSkeleton from '../item-skeleton'
import RecommendedRow from '@/components/recommended-row'
import ContaminantCard from '@/components/contaminant-card'
import Sources from '@/components/sources'

type Props = {
  id: string
}

export default function LocationForm({ id }: Props) {
  const [location, setLocation] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchLocation = async (id: string) => {
    const item = await getLocationDetails(id)
    setLocation(item)
    setIsLoading(false)
    return item
  }

  useEffect(() => {
    fetchLocation(id)
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
              src={location.image}
              alt={location.name}
              width={400}
              height={400}
              className="md:w-1/2 w-full h-full rounded-lg object-cover"
            />

            <div className="flex flex-col gap-6 ">
              <Typography size="3xl" fontWeight="normal">
                {location.name} Tap Water
              </Typography>
              <Score score={location.score} isFull={true} />
            </div>
          </div>

          {location.contaminants && (
            <div className="flex flex-col gap-6 mt-10">
              <Typography size="2xl" fontWeight="normal">
                Contaminants ☠️
              </Typography>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                {location.contaminants.map((contaminant: any) => (
                  <ContaminantCard key={contaminant.id} data={contaminant} />
                ))}
              </div>
            </div>
          )}

          {location?.sources && (
            <div className="flex flex-col gap-6 my-10">
              <Typography size="2xl" fontWeight="normal">
                Sources
              </Typography>
              {location && location?.sources?.length > 0 && <Sources data={location.sources} />}
            </div>
          )}
        </Suspense>
      </div>
      <RecommendedRow />
    </>
  )
}
