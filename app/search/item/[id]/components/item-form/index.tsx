'use client'

import { getItemDetails } from '@/app/actions/items'
import { fetchFundingStatus } from '@/app/actions/labs'
import { incrementItemsViewed } from '@/app/actions/user'
import AppDownloadCta from '@/components/shared/app-download-cta'
import BlurredLineItem from '@/components/shared/blurred-line-item'
import ItemFundingRow from '@/components/shared/item-funding-row'
import ItemImage from '@/components/shared/item-image'
import ItemSkeleton from '@/components/shared/item-skeleton'
import PaywallContent from '@/components/shared/paywall-content'
import Score from '@/components/shared/score'
import { UntestedTooltip } from '@/components/shared/untested-tooltip'
import Typography from '@/components/typography'
import { H3, Muted, P } from '@/components/ui/typography'
import { useUserProvider } from '@/providers/UserProvider'
import Link from 'next/link'
import { useEffect, useState } from 'react'
type Props = {
  id: string
}

export default function ItemForm({ id }: Props) {
  const { uid } = useUserProvider()

  const [item, setItem] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [fundingDetails, setFundingDetails] = useState<any>({})

  const fetchItem = async (id: string) => {
    const item = await getItemDetails(id)

    if (item) {
      setItem(item)

      const fundingDetails = await fetchFundingStatus({
        itemId: item?.id,
        type: item.type,
        name: item.name,
        createLab: true,
      })

      setFundingDetails(fundingDetails)
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
    (ingredient: any) => ingredient.severity_score > 0 && ingredient.is_contaminant === true
  )

  const beneficialIngredients = item.ingredients?.filter(
    (ingredient: any) => ingredient.severity_score > 0 && ingredient.category === 'Minerals'
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

  const isTested = item.is_indexed === true

  return (
    <div className="flex-col flex w-full gap-y-8 pb-16">
      <div className="md:pt-4 pt-2 md:px-0 px-4">
        <div className="flex md:flex-row flex-col gap-6 md:h-full md:max-h-96">
          <div className="flex justify-center w-full md:max-h-96">
            {item.affiliate_url ? (
              <Link href={item.affiliate_url} target="_blank" rel="noopener noreferrer">
                <ItemImage src={item.image} alt={item.name} item={item} />
              </Link>
            ) : (
              <ItemImage src={item.image} alt={item.name} item={item} />
            )}
          </div>

          <div className="flex flex-col w-full justify-between h-full md:max-h-96">
            <div className="flex flex-row justify-between w-full items-start gap-4">
              <div className="flex flex-col w-full">
                <P className="text-2xl">{item.name}</P>
                <Link href={`/search/company/${item.company?.name}`}>
                  <Muted>{item.company?.name}</Muted>
                </Link>
              </div>

              <div className="flex md:flex-row md:justify-start justify-end md:gap-10 w-40">
                <Score score={itemScore} size="md" />
              </div>
            </div>

            {!isTested && (
              <div className="flex flex-col h-full w-40">
                <UntestedTooltip description="No lab reports available for this item so contaminant and toxin levels cannot be verified." />
              </div>
            )}

            <div className="flex md:flex-row flex-col gap-10 gap-y-1 w-full mt-2 ">
              {item.is_indexed && (
                <div className="flex flex-col gap-y-1 w-full ">
                  <BlurredLineItem
                    label="Harmful ingredients"
                    value={harmfulIngredients?.length}
                    isPaywalled={true}
                    score={harmfulIngredients?.length > 0 ? 'bad' : 'good'}
                  />

                  <BlurredLineItem
                    label="Beneficial ingredients"
                    value={beneficialIngredients?.length}
                    isPaywalled={true}
                    score={beneficialIngredients?.length > 0 ? 'good' : 'bad'}
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
                    label="Packaging"
                    value={
                      item?.packaging
                        ? item.packaging.charAt(0).toUpperCase() + item.packaging.slice(1)
                        : 'Unknown'
                    }
                    isPaywalled={false}
                    score={item.packaging === 'glass' ? 'good' : 'bad'}
                  />
                </div>
              )}
            </div>

            {!isTested && (
              <div className="md:mt-10 mt-4 h-full justify-end flex-col">
                <Muted className="mb-1">Help fund the testing of this item:</Muted>
                <ItemFundingRow
                  item={item}
                  lab_id={fundingDetails?.lab_id}
                  raisedAmount={fundingDetails?.raised_amount}
                  totalCost={fundingDetails?.total_cost}
                  contributions={fundingDetails?.user_contributions}
                  showFundButton={true}
                  showFundProgress={true}
                  date={item.updated_at}
                />
              </div>
            )}
          </div>
        </div>

        {item.description && (
          <div className="flex flex-row gap-2 mt-4">
            <Typography size="base" fontWeight="normal" className="text-seoncdary-foreground">
              {item.description}
            </Typography>
          </div>
        )}

        <>
          {isTested && (
            <div className="flex flex-col gap-2 mt-10">
              <H3>Contaminants and minerals</H3>
              {sortedContaminants && sortedContaminants.length > 0 ? (
                <>
                  <PaywallContent
                    label="View contaminants"
                    items={[
                      'Ratings and scores 🌟',
                      'Contaminant breakdown 🔬',
                      'Lab results 🧪',
                      'Health risks and benefits 🤍',
                    ]}
                  >
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-6 h-80 bg-muted rounded-md"></div>
                  </PaywallContent>
                  {/* {!subscription ? (
                    <PaywallContent
                      label="View contaminants"
                      items={[
                        'Ratings and scores 🌟',
                        'Contaminant breakdown 🔬',
                        'Lab results 🧪',
                        'Health risks and benefits 🤍',
                      ]}
                    >
                      <div className="grid md:grid-cols-2 grid-cols-1 gap-6 h-80 bg-muted rounded-md"></div>
                    </PaywallContent>
                  ) : (
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                      {sortedContaminants.map((contaminant: any, index: number) => (
                        <ContaminantCard key={contaminant.id || index} data={contaminant} />
                      ))}
                    </div>
                  )} */}
                </>
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
          )}

          {/* {item.type === 'bottled_water' && (
            <div className="grid md:grid-cols-2 md:grid-rows-1 grid-rows-2 gap-4 mt-14">
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
          )} */}

          <div className="flex flex-col gap-2 md:mt-24 mt-14 md:mb-14 mb-8">
            <AppDownloadCta title="Get the full picture with the Oasis app" />
          </div>
        </>
      </div>
    </div>
  )
}
