'use client'

import Typography from '@/components/typography'
import { getLocationDetails } from '@/app/actions/locations'
import React, { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Score from '@/components/score'
import ItemSkeleton from '../item-skeleton'
import RecommendedRow from '@/components/sections/recommended-row'
import ContaminantCard from '@/components/contamintant-card'
import Sources from '@/components/shared/sources'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import useSWR from 'swr'
import { getIngredients } from '@/app/actions/ingredients'

type Props = {
  id: string
}

export default function LocationForm({ id }: Props) {
  const [location, setLocation] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [openUtility, setOpenUtility] = useState<string>('0')

  const { data: allIngredients } = useSWR('ingredients', getIngredients)

  const fetchLocation = async (id: string) => {
    if (!allIngredients) {
      return
    }

    const location = await getLocationDetails(id, allIngredients)
    setLocation(location)
    setIsLoading(false)
    return location
  }

  useEffect(() => {
    fetchLocation(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, allIngredients])

  if (isLoading) {
    return <ItemSkeleton />
  }

  return (
    <div className="flex-col flex w-full">
      <div className="md:py-10 py-6">
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
            <Score
              score={location.utilities?.length > 0 ? location?.utilities[0]?.score : 0}
              isFull={true}
            />
          </div>
        </div>

        {location?.utilities && (
          <div className="flex flex-col gap-6 mt-10">
            <Typography size="2xl" fontWeight="normal">
              Utilities
            </Typography>
            <Accordion type="single" collapsible value={openUtility} onValueChange={setOpenUtility}>
              {location.utilities.map((utility: any, index: number) => (
                <AccordionItem key={index} value={index.toString()}>
                  <AccordionTrigger className="w-full flex flex-row justify-start">
                    <div className="w-full">
                      <Typography size="lg" fontWeight="normal" className="text-left">
                        {utility.name}
                      </Typography>
                    </div>
                    <div className="flex justify-end w-full md:mr-10 mr-4">
                      <Typography size="base" fontWeight="normal">
                        Score: {utility.score}
                      </Typography>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                      {utility.contaminants.map((contaminant: any) => (
                        <ContaminantCard key={contaminant.id} data={contaminant} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
      </div>
      <RecommendedRow />
    </div>
  )
}
