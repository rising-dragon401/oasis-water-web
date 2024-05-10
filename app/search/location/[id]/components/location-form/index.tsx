'use client'

import { getIngredients } from '@/app/actions/ingredients'
import { getLocationDetails } from '@/app/actions/locations'
import { incrementItemsViewed } from '@/app/actions/user'
import ContaminantCard from '@/components/contamintant-card'
import RecommendedFilterRow from '@/components/sections/recommended-filter-row'
import BlurredLineItem from '@/components/shared/blurred-line-item'
import ItemImage from '@/components/shared/item-image'
import PaywallContent from '@/components/shared/paywall-content'
import Score from '@/components/shared/score'
import Sources from '@/components/shared/sources'
import Typography from '@/components/typography'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import ItemSkeleton from '../item-skeleton'

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
    incrementItemsViewed()

    return location
  }

  useEffect(() => {
    fetchLocation(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, allIngredients])

  const contaminants =
    location?.utilities?.length > 0 ? location?.utilities[0]?.contaminants || [] : []
  const contaminantsAboveLimit = contaminants.filter(
    (contaminant: any) => contaminant.exceedingLimit > 0
  )

  if (isLoading) {
    return <ItemSkeleton />
  }

  return (
    <div className="flex-col flex w-full">
      <div className="md:py-10 py-6 px-2">
        <div className="flex md:flex-row flex-col gap-6">
          <div className="flex justify-center w-full md:w-1/2">
            <ItemImage src={location.image} alt={location.name} item={location} />
          </div>

          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-col">
              <Typography size="3xl" fontWeight="normal" className="w-2/3">
                {location.name} Tap Water
              </Typography>

              <BlurredLineItem
                label="Contaminants found"
                value={contaminants.length}
                labelClassName="text-red-500"
              />

              <BlurredLineItem
                label="Toxins above health guidelines"
                value={contaminantsAboveLimit.length}
                labelClassName="text-red-500"
              />
            </div>

            <div className="w-1/2">
              <Score
                score={location.utilities?.length > 0 ? location?.utilities[0]?.score : 0}
                size="lg"
              />
            </div>
          </div>
        </div>

        {location?.utilities && (
          <div className="flex flex-col mt-4">
            <Typography size="2xl" fontWeight="normal">
              Water Utilities
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
                      <Typography size="base" fontWeight="normal" className="flex flex-row gap-4">
                        Score:
                        <PaywallContent label="" hideButton={true}>
                          {` `}
                          {utility.score}
                        </PaywallContent>
                      </Typography>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <PaywallContent className="mt-8" label="View contaminants">
                      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                        {utility.contaminants.map((contaminant: any) => (
                          <ContaminantCard key={contaminant.id} data={contaminant} />
                        ))}
                      </div>
                    </PaywallContent>
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

      <RecommendedFilterRow contaminants={location?.utilities[0]?.contaminants} />
    </div>
  )
}
