'use client'

import Typography from '@/components/typography'
import { getLocationDetails } from '@/app/actions/locations'
import React, { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Score from '@/components/score'
import ContaminantCard from '../contaminant-card'
import ItemSkeleton from '../item-skeleton'

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

  console.log('location>>', location)

  return (
    <div className="py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex md:flex-row flex-col gap-6">
          <Image src={location.image} alt={location.name} width={400} height={400} />

          <div className="flex flex-row gap-2 ">
            <div className="flex flex-col gap-2 ">
              <Typography size="3xl" fontWeight="normal">
                {location.name}
              </Typography>
              <Score score={location.score} />
            </div>
          </div>
        </div>

        {location.contaminants && (
          <div className="flex flex-col gap-6 mt-14">
            <Typography size="2xl" fontWeight="normal">
              Contaminants
            </Typography>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              {location.contaminants.map((contaminant: any) => (
                <ContaminantCard key={contaminant.id} data={contaminant} />
              ))}
            </div>
          </div>
        )}
      </Suspense>
    </div>
  )
}
