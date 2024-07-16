'use client'

import { getItemDetails } from '@/app/actions/items'
import { incrementItemsViewed } from '@/app/actions/user'
import ContaminantCard from '@/components/contamintant-card'
import RecommendedRow from '@/components/sections/recommended-row'
import BlurredLineItem from '@/components/shared/blurred-line-item'
import ItemImage from '@/components/shared/item-image'
import NutritionTable from '@/components/shared/nutrition-table'
import OasisDisclaimer from '@/components/shared/oasis-disclaimer'
import PaywallContent from '@/components/shared/paywall-content'
import Score from '@/components/shared/score'
import Sources from '@/components/shared/sources'
import TestingCta from '@/components/shared/testing-cta'
import { UntestedTooltip } from '@/components/shared/untested-tooltip'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import useDevice from '@/lib/hooks/use-device'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import IngredientsCard from '../ingredients-card'
import ItemSkeleton from '../item-skeleton'
import MetaDataCard from '../metadata-card'

type Props = {
  id: string
}

export default function ItemForm({ id }: Props) {
  const { isMobile } = useDevice()

  const [item, setItem] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchItem = async (id: string) => {
    const item = await getItemDetails(id)

    if (item) {
      setItem(item)
    }

    setIsLoading(false)
    incrementItemsViewed()
    return item
  }

  useEffect(() => {
    fetchItem(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const contaminants = item?.contaminants || []

  const contaminantsAboveLimit = contaminants.filter(
    (contaminant: any) => contaminant.exceedingLimit > 0
  )

  const fluorideContaminant = item.contaminants?.find(
    (contaminant: { name: string }) => contaminant.name.toLowerCase() === 'fluoride'
  )
  const fluorideValue = fluorideContaminant ? `${fluorideContaminant.amount} ppm` : 'Not Detected'

  const sortedContaminants = contaminants.sort(
    (a: { exceedingLimit: number }, b: { exceedingLimit: number }) => {
      return b.exceedingLimit - a.exceedingLimit
    }
  )

  const nanoPlasticsValue =
    item.packaging === 'plastic'
      ? 'Yes'
      : item.packaging === 'aluminum' ||
          item.packaging === 'aluminum (can)' ||
          item.packaging === 'cardboard'
        ? 'Some'
        : 'Minimal'

  if (isLoading || !item) {
    return <ItemSkeleton />
  }

  return (
    <div className="flex-col flex w-full gap-y-8">
      <div className="md:pt-10 pt-2 md:px-0 px-4">
        <div className="flex md:flex-row flex-col gap-6">
          <div className="flex justify-center w-full md:w-2/5">
            {item.affiliate_url ? (
              <Link href={item.affiliate_url} target="_blank" rel="noopener noreferrer">
                <ItemImage src={item.image} alt={item.name} item={item} />
              </Link>
            ) : (
              <ItemImage src={item.image} alt={item.name} item={item} />
            )}
          </div>

          <div className="flex flex-row gap-2 md:w-3/5 justify-between">
            <div className="flex flex-col md:gap-2 md:w-3/5">
              <Typography size="3xl" fontWeight="normal">
                {item.name}
              </Typography>
              <Link href={`/search/company/${item.company?.name}`}>
                <Typography size="base" fontWeight="normal" className="text-secondary-foreground">
                  {item.company?.name}
                </Typography>
              </Link>

              <>
                {item.is_indexed === false && <UntestedTooltip />}

                <div className="flex flex-col gap-y-1 md:w-72 w-50 border rounded-md p-2 mt-1">
                  {item.is_indexed === true && (
                    <>
                      <BlurredLineItem
                        label="Contaminants found"
                        value={contaminants.length}
                        labelClassName="text-red-500"
                      />

                      <BlurredLineItem
                        label="Above guidelines"
                        value={contaminantsAboveLimit.length}
                        labelClassName="text-red-500"
                      />
                    </>
                  )}

                  {item.type === 'bottled_water' && (
                    <>
                      <BlurredLineItem
                        label="Microplastics"
                        value={nanoPlasticsValue}
                        isPaywalled={true}
                      />

                      <BlurredLineItem label="Fluoride" value={fluorideValue} isPaywalled={true} />

                      <BlurredLineItem
                        label="pH"
                        value={
                          item.metadata?.ph_level === 0 || item.metadata?.ph_level == null
                            ? 'Unknown'
                            : item.metadata.ph_level
                        }
                        isPaywalled={true}
                      />

                      <BlurredLineItem
                        label="TDS"
                        value={
                          item.metadata?.tds === 0 || item.metadata?.tds == null
                            ? 'N/A'
                            : item.metadata.tds
                        }
                        isPaywalled={true}
                      />

                      <BlurredLineItem
                        label="PFAS"
                        value={item.metadata?.pfas || 'N/A'}
                        isPaywalled={true}
                      />
                    </>
                  )}

                  <BlurredLineItem
                    label="Packaging"
                    value={item?.packaging || 'Unknown'}
                    isPaywalled={true}
                  />
                </div>

                <div className="flex flex-col md:w-40 w-full md:mt-6 mt-2 gap-2">
                  {item.affiliate_url && item.score > 70 && (
                    <Button
                      variant={item.score > 70 ? 'outline' : 'outline'}
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
            </div>

            <div className="flex md:flex-row md:justify-start md:gap-10 md:items-start flex-col-reverse justify-end items-end">
              <Score score={item.score} size={isMobile ? 'md' : 'lg'} />{' '}
            </div>
          </div>
        </div>

        {item.is_indexed !== false && <OasisDisclaimer />}

        {item.description && (
          <div className="flex flex-row gap-2 mt-4">
            <Typography size="base" fontWeight="normal" className="text-seoncdary-foreground">
              {item.description}
            </Typography>
          </div>
        )}

        <>
          <div className="flex flex-col gap-2 mt-6">
            <Typography size="2xl" fontWeight="normal">
              Contaminants ☠️
            </Typography>
            {sortedContaminants && sortedContaminants.length > 0 ? (
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <PaywallContent label="Unlock contaminant amounts">
                  {sortedContaminants.map((contaminant: any, index: number) => (
                    <ContaminantCard key={contaminant.id || index} data={contaminant} />
                  ))}
                </PaywallContent>
              </div>
            ) : (
              <>
                {item.is_indexed !== false ? (
                  <Typography size="base" fontWeight="normal">
                    No contaminants found
                  </Typography>
                ) : (
                  <Typography size="base" fontWeight="normal" className="text-secondary">
                    Unable to verify the safety of this product or the contaminants it contains.
                  </Typography>
                )}
              </>
            )}
          </div>

          {item.type === 'bottled_water' && (
            <div className="grid md:grid-cols-2 md:grid-rows-1 grid-rows-2 gap-4 mt-6">
              <MetaDataCard title="Water source" description={item.metadata?.source || 'Unkown'} />
              <MetaDataCard
                title="Treatment Process"
                description={
                  Array.isArray(item.filtration_methods) && item.filtration_methods.length > 0
                    ? item.filtration_methods.join(', ') + '. ' + item.metadata?.treatment_process
                    : item.metadata?.treatment_process || 'Unknown'
                }
              />
            </div>
          )}

          <div className="flex flex-col gap-2 my-10">
            <Typography size="2xl" fontWeight="normal">
              Other Ingredients
            </Typography>
            {item?.ingredients?.length > 0 ? (
              <div className="flex flex-col gap-4 mt-1">
                <PaywallContent label="Unlock nutrients">
                  <IngredientsCard ingredients={item.ingredients} />
                </PaywallContent>
              </div>
            ) : (
              <Typography size="base" fontWeight="normal">
                Unknown ingredients
              </Typography>
            )}
          </div>

          {item.nutrients && item.nutrients.length > 0 && (
            <div className="flex flex-col gap-2 my-10">
              <Typography size="2xl" fontWeight="normal">
                Nutrition
              </Typography>
              <NutritionTable nutrients={item.nutrients} />
            </div>
          )}

          {item && item?.sources?.length > 0 && <Sources data={item.sources} />}
        </>
      </div>

      <TestingCta />

      <RecommendedRow category={item.type} />
    </div>
  )
}
