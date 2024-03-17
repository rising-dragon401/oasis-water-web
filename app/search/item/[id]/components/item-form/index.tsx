'use client'

import Typography from '@/components/typography'
import { getItemDetails } from '@/app/actions/items'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Score from '@/components/shared/score'
import MetaDataCard from '../metadata-card'
import IngredientsCard from '../ingredients-card'
import ItemSkeleton from '../item-skeleton'
import RecommendedRow from '@/components/sections/recommended-row'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import ContaminantCard from '@/components/contamintant-card'
import Sources from '@/components/shared/sources'
import Link from 'next/link'
import useSWR from 'swr'
import { getIngredients } from '@/app/actions/ingredients'

type Props = {
  id: string
}

export default function ItemForm({ id }: Props) {
  const [item, setItem] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  const { data: allIngredients } = useSWR('ingredients', getIngredients)

  const fetchItem = async (id: string) => {
    if (!allIngredients) {
      return
    }

    const item = await getItemDetails(id, allIngredients)

    if (item) {
      setItem(item)
    }

    setIsLoading(false)
    return item
  }

  useEffect(() => {
    fetchItem(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, allIngredients])

  const contaminants = item?.contaminants || []

  const sortedContaminants = contaminants.sort(
    (a: { exceedingLimit: number }, b: { exceedingLimit: number }) => {
      return b.exceedingLimit - a.exceedingLimit
    }
  )

  if (isLoading || !item) {
    return <ItemSkeleton />
  }

  return (
    <div className="flex-col flex w-full">
      <div className="md:py-10 py-6">
        <div className="flex md:flex-row flex-col gap-6">
          <div className="relative">
            {item.affiliate_url ? (
              <Link href={item.affiliate_url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={700}
                  height={700}
                  blurDataURL={item.image}
                  placeholder="blur"
                  className="rounded-lg"
                />
              </Link>
            ) : (
              <Image
                src={item.image}
                alt={item.name}
                width={700}
                height={700}
                blurDataURL={item.image}
                placeholder="blur"
                className="rounded-lg"
              />
            )}
            {item.score > 70 && (
              <Typography
                size="base"
                fontWeight="normal"
                className="absolute top-0 right-0 text-secondary-foreground text-center italic bg-card border-2 px-2 border-secondary-foreground rounded-full m-2"
              >
                Recommended
              </Typography>
            )}
          </div>

          <div className="flex flex-row gap-2 w-full">
            <div className="flex flex-col md:gap-2 md:w-3/5">
              <Typography size="3xl" fontWeight="normal">
                {item.name}
              </Typography>
              <Link href={`/search/company/${item.company?.name}`}>
                <Typography size="base" fontWeight="normal" className="text-secondary-foreground">
                  {item.brand?.name} - {item.company?.name}
                </Typography>
              </Link>

              {item.is_indexed !== false ? (
                <>
                  <Typography size="base" fontWeight="normal" className="text-secondary">
                    Fluoride: {item.metadata?.fluoride} ppm
                  </Typography>
                  <Typography size="base" fontWeight="normal" className="text-secondary">
                    pH: {item.metadata?.ph_level}
                  </Typography>
                  {item.metadata?.tds && (
                    <Typography size="base" fontWeight="normal" className="text-secondary">
                      TDS: {item.metadata?.tds} ppm
                    </Typography>
                  )}
                  <Typography size="base" fontWeight="normal" className="text-secondary">
                    Packaging: {item.packaging}
                  </Typography>

                  <div className="flex flex-col md:w-40 w-full mt-2 gap-2">
                    {item.affiliate_url && item.score > 80 && (
                      <Button
                        variant="default"
                        onClick={() => {
                          window.open(item.affiliate_url, '_blank')
                        }}
                      >
                        Buy Now
                        <ArrowUpRight size={16} className="ml-2" />
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <Typography size="base" fontWeight="normal" className="text-secondary">
                  ⚠️ NO WATER REPORTS LOCATED
                </Typography>
              )}
            </div>

            <div className="flex md:flex-row md:justify-start md:gap-10 md:items-start flex-col-reverse justify-end items-end">
              {item.is_indexed !== false && (
                <div className="flex flex-col gap-2 items-center">
                  <Score score={item.score} isFull={true} />
                </div>
              )}
            </div>
          </div>
        </div>

        {item.is_indexed === false ? (
          <div className="flex flex-col gap-6 mt-6">
            <Typography size="base" fontWeight="normal" className="text-secondary">
              This item has not been tested and rated yet. This usally means the company has not
              publicized their water quality report.
            </Typography>
          </div>
        ) : (
          <>
            {sortedContaminants && sortedContaminants.length > 0 && (
              <div className="flex flex-col gap-6 mt-6">
                <Typography size="2xl" fontWeight="normal">
                  Contaminants ☠️
                </Typography>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                  {sortedContaminants.map((contaminant: any, index: number) => (
                    <ContaminantCard key={contaminant.id || index} data={contaminant} />
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 md:grid-rows-1 grid-rows-2 gap-4 mt-6">
              <MetaDataCard title="Source" description={item.metadata?.source} />
              <MetaDataCard
                title="Treatment Process"
                description={
                  Array.isArray(item.filtration_methods)
                    ? item.filtration_methods.join(', ')
                    : item.metadata?.treatment_process
                }
              />
            </div>

            <>
              {item?.ingredients.length > 0 && (
                <div className="flex flex-col gap-6 my-10">
                  <Typography size="2xl" fontWeight="normal">
                    Other Ingredients
                  </Typography>

                  <IngredientsCard ingredients={item.ingredients} />
                </div>
              )}
            </>

            {item && item?.sources?.length > 0 && <Sources data={item.sources} />}
          </>
        )}
      </div>

      <RecommendedRow />
    </div>
  )
}
