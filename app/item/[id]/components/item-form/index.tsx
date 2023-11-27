'use client'

import Typography from '@/components/typography'
import { getItemDetails } from '@/app/actions/items'
import React, { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Score from '../score'
import MetaDataCard from '../metadata-card'
import IngredientsCard from '../ingredients-card'
import ContaminantCard from '../contaminant-card'
import ItemSkeleton from '../item-skeleton'

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
    <div className="py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex md:flex-row flex-col gap-6">
          <Image
            src={item.image}
            alt={item.name}
            width={400}
            height={400}
            // className="w-40 h-40 object-cover"
          />

          <div className="flex flex-row gap-2 ">
            <div className="flex flex-col gap-2 md:w-3/5">
              <Typography size="3xl" fontWeight="normal">
                {item.name}
              </Typography>
              <Typography size="base" fontWeight="normal" className="text-secondary-foreground">
                {item.brand?.name} - {item.company?.name}
              </Typography>
              {/* <Typography
                size="base"
                fontWeight="normal"
                className="text-secondary md:block hidden"
              >
                {item.description}
              </Typography> */}
              <Typography size="base" fontWeight="normal" className="text-secondary">
                Fluoride: {item.metadata?.fluoride} ppm
              </Typography>
              <Typography size="base" fontWeight="normal" className="text-secondary">
                pH: {item.metadata?.ph_level}
              </Typography>
            </div>
            <div className="flex flex-col gap-2 w-2/5 items-center">
              <Score score={item.score} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <MetaDataCard title="Source" description={item.metadata?.source} />
          <MetaDataCard title="Treatment Process" description={item.metadata?.treatment_process} />
        </div>

        <div className="flex flex-col gap-6 mt-6">
          <Typography size="2xl" fontWeight="normal">
            Ingredients
          </Typography>
          {item.ingredients.length > 0 ? (
            <IngredientsCard ingredients={item.ingredients} />
          ) : (
            <Typography size="base" fontWeight="normal" className="text-secondary">
              Unclear ingredients found
            </Typography>
          )}
        </div>

        {item.contaminants && (
          <div className="flex flex-col gap-6 mt-6">
            <Typography size="2xl" fontWeight="normal">
              Contaminants
            </Typography>
            <div className="grid grid-cols-2 gap-6">
              {item.contaminants.map((contaminant: any) => (
                <ContaminantCard key={contaminant.id} data={contaminant} />
              ))}
            </div>
          </div>
        )}
      </Suspense>
    </div>
  )
}
