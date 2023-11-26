'use client'

import Typography from '@/components/typography'
import { getItemDetails } from '@/app/actions/items'
import React, { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Score from '../score'
import MetaDataCard from '../metadata-card'
import IngredientsCard from '../ingredients-card'

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
    return <div>Loading...</div>
  }

  return (
    <div className="py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-row gap-6">
          <Image src={item.image} alt={item.name} width={400} height={400} />

          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2 w-3/5">
              <Typography size="4xl" fontWeight="normal">
                {item.name}
              </Typography>
              <Typography size="base" fontWeight="normal">
                {item.brand?.name} - {item.company?.name}
              </Typography>
              <Typography size="base" fontWeight="normal" className="text-secondary">
                {item.description} / 100
              </Typography>
            </div>
            <div className="flex flex-col gap-2 w-2/5 items-center">
              <Score score={item.score} />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-6 mt-6">
          <MetaDataCard title="Source" description={item.metadata?.source} />
          <MetaDataCard title="Treatment Process" description={item.metadata?.treatment_process} />
        </div>

        <div className="flex flex-row gap-6 mt-6">
          <IngredientsCard ingredients={item.ingredients} />
        </div>

        {item.contaminants && (
          <div className="flex flex-col gap-6 mt-6">
            <Typography size="2xl" fontWeight="normal">
              Contaminants
            </Typography>
            <IngredientsCard ingredients={item.ingredients} />
          </div>
        )}
      </Suspense>
    </div>
  )
}
