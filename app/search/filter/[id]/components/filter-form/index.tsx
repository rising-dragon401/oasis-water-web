'use client'

import { getFilterDetails } from '@/app/actions/filters'
import { getIngredients } from '@/app/actions/ingredients'
import { incrementItemsViewed } from '@/app/actions/user'
import RecommendedFiltersRow from '@/components/sections/recs-filter-row'
import BlurredLineItem from '@/components/shared/blurred-line-item'
import ItemImage from '@/components/shared/item-image'
import OasisDisclaimer from '@/components/shared/oasis-disclaimer'
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
import useSWR from 'swr'
import ContaminantTable from '../contaminant-table'
import ItemSkeleton from '../item-skeleton'

type Props = {
  id: string
}

export default function FilterForm({ id }: Props) {
  const { uid } = useUserProvider()

  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<any>({})

  const { data: allIngredients } = useSWR('ingredients', getIngredients)

  const fetchFilter = async (id: string) => {
    if (!allIngredients) {
      return
    }

    const filter = await getFilterDetails(id, allIngredients)
    setFilter(filter)

    setIsLoading(false)
    incrementItemsViewed()

    return filter
  }

  useEffect(() => {
    if (uid) {
      incrementItemsViewed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid])

  useEffect(() => {
    fetchFilter(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, allIngredients])

  if (isLoading) {
    return <ItemSkeleton />
  }

  if (filter?.is_draft) {
    return (
      <div className="flex-col flex w-full md:px-0 px-2 gap-y-8">
        <div className="md:pt-10 pt-6">
          <div className="flex md:flex-row flex-col gap-6">
            <div className="flex justify-center md:w-2/5 w-full">
              {filter.affiliate_url ? (
                <Link href={filter.affiliate_url} target="_blank" rel="noopener noreferrer">
                  <ItemImage src={filter.image} alt={filter.name} item={filter} />
                </Link>
              ) : (
                <ItemImage src={filter.image} alt={filter.name} item={filter} />
              )}
            </div>

            <div className="flex flex-col justify-start md:w-3/5">
              <div className="flex flex-row justify-between gap-2">
                <div className="flex flex-col  w-2/3">
                  <Typography size="3xl" fontWeight="normal">
                    {filter.name}
                  </Typography>
                  <Link href={`/search/company/${filter.company?.name}`}>
                    <Typography
                      size="base"
                      fontWeight="normal"
                      className="text-secondary-foreground"
                    >
                      {filter.brand?.name} - {filter.company?.name}
                    </Typography>
                  </Link>
                </div>
              </div>

              <div className="max-w-sm mt-6">
                <Typography size="base" fontWeight="normal">
                  This filter has not been fully tested and rated yet. Please check again later
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const contaminantCategories = Object.fromEntries(
    filter?.filtered_contaminant_categories.map((category: any) => [
      category.category,
      category.percentage,
    ])
  )

  return (
    <div className="flex-col flex w-full md:px-0 px-2 gap-y-8">
      <div className="md:pt-10 pt-6">
        <div className="flex md:flex-row flex-col gap-6">
          <div className="flex justify-center md:w-3/5 w-full">
            {filter.affiliate_url ? (
              <Link href={filter.affiliate_url} target="_blank" rel="noopener noreferrer">
                <ItemImage src={filter.image} alt={filter.name} item={filter} />
              </Link>
            ) : (
              <ItemImage src={filter.image} alt={filter.name} item={filter} />
            )}
          </div>

          <div className="flex flex-col w-full justify-betwen h-full">
            <div className="flex md:flex-col flex-row justify-between w-full items-start gap-2">
              <div className="flex flex-col w-full">
                <Typography size="3xl" fontWeight="normal">
                  {filter.name}
                </Typography>
                <Link href={`/search/company/${filter.company?.name}`}>
                  <Typography size="base" fontWeight="normal" className="text-secondary-foreground">
                    {filter.company?.name}
                  </Typography>
                </Link>

                <div className="w-64 mt-2">
                  {filter.is_indexed === false && (
                    <UntestedTooltip description="This filter has not been tested in the lab yet, so we cannot verify what contaminants it filters. Oasis does not score filters without lab report." />
                  )}
                </div>
              </div>
              <div className="flex md:flex-row justify-start md:gap-10 items-start w-40">
                <Score score={filter.is_indexed ? filter.score : null} size="md" />{' '}
              </div>
            </div>

            <div>
              {/* {item.is_indexed === false && <UntestedTooltip />} */}

              <div className="flex md:flex-row flex-col gap-10 gap-y-1 w-full md:mt-2 mt-4">
                <div className="flex flex-col gap-y-1 ">
                  <BlurredLineItem
                    label="Heavy metals"
                    value={contaminantCategories['Heavy Metals'] > 70 ? 'Yes' : 'No'}
                    isPaywalled={false}
                    score={
                      contaminantCategories['Heavy Metals'] > 70
                        ? 'good'
                        : contaminantCategories['Heavy Metals'] > 30
                          ? 'neutral'
                          : 'bad'
                    }
                  />

                  <BlurredLineItem
                    label="Fluoride"
                    value={contaminantCategories['Fluoride'] > 70 ? 'Yes' : 'No'}
                    isPaywalled={false}
                    score={
                      contaminantCategories['Fluoride'] > 70
                        ? 'good'
                        : contaminantCategories['Fluoride'] > 30
                          ? 'neutral'
                          : 'bad'
                    }
                  />

                  <BlurredLineItem
                    label="Microplastics"
                    value={contaminantCategories['Microplastics'] > 70 ? 'Yes' : 'No'}
                    isPaywalled={false}
                    score={
                      contaminantCategories['Microplastics'] > 70
                        ? 'good'
                        : contaminantCategories['Microplastics'] > 30
                          ? 'neutral'
                          : 'bad'
                    }
                  />

                  <BlurredLineItem
                    label="Perfluorinated Chemicals (PFAS)"
                    value={
                      contaminantCategories['Perfluorinated Chemicals (PFAS)'] > 70 ? 'Yes' : 'No'
                    }
                    isPaywalled={false}
                    score={
                      contaminantCategories['Perfluorinated Chemicals (PFAS)'] > 70
                        ? 'good'
                        : contaminantCategories['Perfluorinated Chemicals (PFAS)'] > 30
                          ? 'neutral'
                          : 'bad'
                    }
                  />
                </div>

                <div className="flex flex-col gap-y-1">
                  <BlurredLineItem
                    label="Trihalomethanes"
                    value={contaminantCategories['Trihalomethanes'] > 70 ? 'Yes' : 'No'}
                    isPaywalled={false}
                    score={
                      contaminantCategories['Trihalomethanes'] > 70
                        ? 'good'
                        : contaminantCategories['Trihalomethanes'] > 30
                          ? 'neutral'
                          : 'bad'
                    }
                  />

                  <BlurredLineItem
                    label="Haloacetic Acids"
                    value={contaminantCategories['Haloacetic Acids'] > 70 ? 'Yes' : 'No'}
                    isPaywalled={false}
                    score={
                      contaminantCategories['Haloacetic Acids'] > 70
                        ? 'good'
                        : contaminantCategories['Haloacetic Acids'] > 30
                          ? 'neutral'
                          : 'bad'
                    }
                  />

                  <BlurredLineItem
                    label="Chemical Disinfectants"
                    value={contaminantCategories['Chemical Disinfectants'] > 70 ? 'Yes' : 'No'}
                    isPaywalled={false}
                    score={
                      contaminantCategories['Chemical Disinfectants'] > 70
                        ? 'good'
                        : contaminantCategories['Chemical Disinfectants'] > 30
                          ? 'neutral'
                          : 'bad'
                    }
                  />

                  <BlurredLineItem
                    label="Radiological Elements"
                    value={contaminantCategories['Radiological Elements'] > 70 ? 'Yes' : 'No'}
                    isPaywalled={false}
                    score={
                      contaminantCategories['Radiological Elements'] > 70
                        ? 'good'
                        : contaminantCategories['Radiological Elements'] > 30
                          ? 'neutral'
                          : 'bad'
                    }
                  />
                </div>
              </div>

              {filter.affiliate_url && filter.score > 70 && (
                <Button
                  variant={filter.score > 70 ? 'outline' : 'outline'}
                  onClick={() => {
                    window.open(filter.affiliate_url, '_blank')
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

        {filter.is_indexed !== false && <OasisDisclaimer />}

        <>
          <div className="flex flex-col gap-6 mt-6">
            <ContaminantTable
              filteredContaminants={filter.contaminants_filtered}
              categories={filter.filtered_contaminant_categories}
            />
          </div>

          {filter?.sources && filter?.sources?.length > 0 && <Sources data={filter.sources} />}
        </>
      </div>

      <TestingCta />

      <RecommendedFiltersRow />
    </div>
  )
}
