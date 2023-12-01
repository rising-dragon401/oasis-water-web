'use client'

import Typography from '@/components/typography'
import { getItemDetails } from '@/app/actions/items'
import React, { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Score from '@/components/score'
import MetaDataCard from '../metadata-card'
import IngredientsCard from '../ingredients-card'
import ItemSkeleton from '../item-skeleton'
import RecommendedRow from '@/components/recommended-row'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import ContaminantCard from '@/components/contaminant-card'
import Sources from '@/components/sources'

type Props = {
  id: string
}

export default function ItemForm({ id }: Props) {
  const [item, setItem] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchItem = async (id: string) => {
    const item = await getItemDetails(id)
    setItem(item)
    setIsLoading(false)
    return item
  }

  useEffect(() => {
    fetchItem(id)
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
              src={item.image}
              alt={item.name}
              width={400}
              height={400}
              className="rounded-lg"
            />

            <div className="flex md:flex-row flex-col gap-2 w-full">
              <div className="flex flex-col md:gap-2 md:w-3/5">
                <Typography size="3xl" fontWeight="normal">
                  {item.name}
                </Typography>
                <Typography size="base" fontWeight="normal" className="text-secondary-foreground">
                  {item.brand?.name} - {item.company?.name}
                </Typography>

                <Typography size="base" fontWeight="normal" className="text-secondary">
                  Fluoride: {item.metadata?.fluoride} ppm
                </Typography>
                <Typography size="base" fontWeight="normal" className="text-secondary">
                  pH: {item.metadata?.ph_level}
                </Typography>

                <div className="flex flex-col md:w-40 w-full mt-2 gap-2">
                  {item.recommended && (
                    <Typography
                      size="base"
                      fontWeight="normal"
                      className="text-white text-center italic bg-primary rounded-full"
                    >
                      Recommended
                    </Typography>
                  )}
                  {item.recommended && item.affiliate_url && (
                    <Button
                      variant="outline"
                      className="bg-card"
                      onClick={() => {
                        window.open(item.affiliate_url, '_blank')
                      }}
                    >
                      {' '}
                      Shop <ArrowUpRight size={16} className="ml-2" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 md:w-2/5 items-center">
                <Score score={item.score} isFull={true} />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 md:grid-rows-1 grid-rows-2 gap-4 mt-6">
            <MetaDataCard title="Source" description={item.metadata?.source} />
            <MetaDataCard
              title="Treatment Process"
              description={item.metadata?.treatment_process}
            />
          </div>

          {item.contaminants && (
            <div className="flex flex-col gap-6 mt-6">
              <Typography size="2xl" fontWeight="normal">
                Contaminants ☠️
              </Typography>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                {item.contaminants.map((contaminant: any) => (
                  <ContaminantCard key={contaminant.id} data={contaminant} />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6 my-10">
            <Typography size="2xl" fontWeight="normal">
              Ingredients
            </Typography>
            {item.ingredients.length > 0 ? (
              <IngredientsCard ingredients={item.ingredients} />
            ) : (
              <Typography size="base" fontWeight="normal" className="text-secondary">
                Unclear ingredients found. This could mean the water is pure or the manufacturer is
                not being transparent
              </Typography>
            )}
          </div>

          {item?.sources && (
            <div className="flex flex-col gap-6 my-10">
              <Typography size="2xl" fontWeight="normal">
                Sources
              </Typography>
              {item && item?.sources?.length > 0 && <Sources data={item.sources} />}
            </div>
          )}
        </Suspense>
      </div>

      <RecommendedRow />
    </>
  )
}
