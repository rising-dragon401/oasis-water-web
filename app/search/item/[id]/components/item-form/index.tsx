'use client'

import { getItemDetails } from '@/app/actions/items'
import { incrementItemsViewed } from '@/app/actions/user'
import ContaminantCard from '@/components/contamintant-card'
import RecommendedRow from '@/components/sections/recommended-row'
import BlurredLineItem from '@/components/shared/blurred-line-item'
import ItemImage from '@/components/shared/item-image'
import ItemSkeleton from '@/components/shared/item-skeleton'
import NutritionTable from '@/components/shared/nutrition-table'
import OasisDisclaimer from '@/components/shared/oasis-disclaimer'
import PaywallContent from '@/components/shared/paywall-content'
import Score from '@/components/shared/score'
import Sources from '@/components/shared/sources'
import TestingCta from '@/components/shared/testing-cta'
import { UntestedTooltip } from '@/components/shared/untested-tooltip'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { useUserProvider } from '@/providers/UserProvider'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import IngredientsCard from '../ingredients-card'
import MetaDataCard from '../metadata-card'

type Props = {
  id: string
}

export default function ItemForm({ id }: Props) {
  const { uid, userData } = useUserProvider()

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
    if (uid) {
      incrementItemsViewed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

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
  const fluorideValue = fluorideContaminant ? `${fluorideContaminant.amount} ppm` : 'ND'

  const sortedContaminants = contaminants.sort(
    (a: { exceedingLimit: number }, b: { exceedingLimit: number }) => {
      return b.exceedingLimit - a.exceedingLimit
    }
  )

  const harmfulIngredients = item.ingredients?.filter(
    (ingredient: any) => ingredient.severity_score > 0
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

  // only bottled water drinks are required to have a water quality report
  const itemScore = item.type !== 'bottled_water' ? item.score : item.is_indexed ? item.score : null

  const waterSource = (() => {
    switch (item.water_source) {
      case 'municipal_supply':
        return 'Tap water'
      case 'mountain_spring':
        return 'Mountain Spring'
      case 'aquifer':
        return 'Aquifer'
      case 'iceberg':
        return 'Iceberg'
      case 'spring':
        return 'Spring'
      case 'well':
        return 'Well'
      case 'rain':
        return 'Rain'
      default:
        return 'Unknown'
    }
  })()

  return (
    <div className="flex-col flex w-full gap-y-8">
      <div className="md:pt-4 pt-2 md:px-0 px-4">
        <div className="flex md:flex-row flex-col gap-6">
          <div className="flex justify-center md:w-4/5 w-full">
            {item.affiliate_url ? (
              <Link href={item.affiliate_url} target="_blank" rel="noopener noreferrer">
                <ItemImage src={item.image} alt={item.name} item={item} />
              </Link>
            ) : (
              <ItemImage src={item.image} alt={item.name} item={item} />
            )}
          </div>

          <div className="flex flex-col w-full justify-betwen h-full">
            <div className="flex md:flex-col flex-row justify-between w-full items-start md:gap-2">
              <div className="flex flex-col w-full">
                <Typography size="3xl" fontWeight="normal">
                  {item.name}
                </Typography>
                <Link href={`/search/company/${item.company?.name}`}>
                  <Typography
                    size="base"
                    fontWeight="normal"
                    className="text-sechoondary-foreground"
                  >
                    {item.company?.name}
                  </Typography>
                </Link>

                <div className="w-64 mt-2">
                  {item.is_indexed === false && (
                    <UntestedTooltip description="This drink has not been tested in the lab yet, so we cannot verify what contaminants are present. Untested drink are docked 35 points by default to account for unknown contaminants. We are in the process of independently testing everything ourselves." />
                  )}
                </div>
              </div>

              <div className="flex md:flex-row md:justify-start justify-end md:gap-10 w-40">
                <Score score={itemScore} size="md" />
              </div>
            </div>

            <div>
              <div className="flex md:flex-row flex-col gap-10 gap-y-1 w-full mt-2 ">
                {item.is_indexed && (
                  <div className="flex flex-col gap-y-1 w-full">
                    <BlurredLineItem
                      label="Contaminants"
                      value={contaminants.length}
                      isPaywalled={false}
                      score={contaminants.length > 0 ? 'bad' : 'good'}
                    />

                    <BlurredLineItem
                      label="Above guidelines"
                      value={contaminantsAboveLimit.length}
                      isPaywalled={false}
                      score={contaminantsAboveLimit.length > 0 ? 'bad' : 'good'}
                    />

                    <BlurredLineItem
                      label="pH"
                      value={
                        item.metadata?.ph_level === 0 || item.metadata?.ph_level == null
                          ? 'Unknown'
                          : item.metadata.ph_level
                      }
                      isPaywalled={false}
                      score={parseFloat(item.metadata?.ph_level) > 7 ? 'good' : 'neutral'}
                    />

                    <BlurredLineItem
                      label="TDS"
                      value={item.metadata?.tds || 'N/A'}
                      isPaywalled={false}
                      score="neutral"
                    />

                    <BlurredLineItem
                      label="PFAS"
                      value={item.metadata?.pfas || 'N/A'}
                      isPaywalled={false}
                      score={item.metadata?.pfas === 'Yes' ? 'bad' : 'good'}
                    />

                    <BlurredLineItem
                      label="Fluoride"
                      value={fluorideValue}
                      isPaywalled={false}
                      score={parseFloat(fluorideValue) > 0 ? 'bad' : 'good'}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-y-1 w-full">
                  <BlurredLineItem
                    label="Harmful ingredients"
                    value={harmfulIngredients?.length}
                    isPaywalled={false}
                    score={harmfulIngredients?.length > 0 ? 'bad' : 'good'}
                  />

                  <BlurredLineItem
                    label="Microplastics"
                    value={nanoPlasticsValue}
                    isPaywalled={false}
                    score={nanoPlasticsValue === 'Yes' ? 'bad' : 'good'}
                  />

                  <BlurredLineItem
                    label="Packaging"
                    value={
                      item?.packaging
                        ? item.packaging.charAt(0).toUpperCase() + item.packaging.slice(1)
                        : 'Unknown'
                    }
                    isPaywalled={false}
                    score={item.packaging === 'glass' ? 'good' : 'bad'}
                  />

                  <BlurredLineItem
                    label="Source"
                    value={waterSource ? waterSource : 'Unknown'}
                    isPaywalled={false}
                    score={
                      item.water_source === 'spring' ||
                      item.water_source === 'aquifer' ||
                      item.water_source === 'mountain_spring'
                        ? 'good'
                        : 'bad'
                    }
                  />
                </div>
              </div>

              {item.affiliate_url && item.score > 70 && (
                <Button
                  variant={item.score > 70 ? 'outline' : 'outline'}
                  onClick={() => {
                    window.open(item.affiliate_url, '_blank')
                  }}
                  className="mt-4"
                >
                  Shop now
                  <ArrowUpRight size={16} className="ml-2" />
                </Button>
              )}
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
              <PaywallContent
                label="Unlock contaminants"
                items={[
                  'Rating and scores 🌟',
                  'Research reports and data 🔬',
                  'Latest lab results 💧',
                  'Request new products 🌿',
                ]}
              >
                <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                  {sortedContaminants.map((contaminant: any, index: number) => (
                    <ContaminantCard key={contaminant.id || index} data={contaminant} />
                  ))}
                </div>
              </PaywallContent>
            ) : (
              <>
                {item.is_indexed !== false ? (
                  <Typography size="base" fontWeight="normal">
                    No contaminants found
                  </Typography>
                ) : (
                  <Typography size="base" fontWeight="normal">
                    Unable to verify contaminants in this product. Please see{' '}
                    <Link href="/blog/oasis_scoring" className="underline italic">
                      how we score
                    </Link>{' '}
                    to learn more.
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
                <PaywallContent label="Unlock nutrients" showPaywall={false}>
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
