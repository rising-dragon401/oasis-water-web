'use client'

import { getAllContaminants, getFilterDetails } from '@/app/actions/filters'
import { getIngredients } from '@/app/actions/ingredients'
import { incrementItemsViewed } from '@/app/actions/user'
import RecommendedFiltersRow from '@/components/sections/recs-filter-row'
import ItemImage from '@/components/shared/item-image'
import OasisDisclaimer from '@/components/shared/oasis-disclaimer'
import Score from '@/components/shared/score'
import Sources from '@/components/shared/sources'
import TestingCta from '@/components/shared/testing-cta'
import { UntestedTooltip } from '@/components/shared/untested-tooltip'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { IngredientCategories } from '@/lib/constants/filters'
import { useUserProvider } from '@/providers/UserProvider'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import ContaminantTable from '../contaminant-table'
import ItemSkeleton from '../item-skeleton'
import ShowerFilterMetadata from '../shower-filter-metadata'
import WaterFilterMetadata from '../water-filter-metadata'

type Props = {
  id: string
}

interface ContaminantsByCategory {
  [key: string]: {
    percentageFiltered: number
    contaminants: any[]
  }
}

export default function FilterForm({ id }: Props) {
  const { uid, subscription } = useUserProvider()

  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<any>({})

  const { data: allIngredients } = useSWR('ingredients', getIngredients)
  const { data: allContaminants } = useSWR('water-contaminants', getAllContaminants)

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

  const filteredContaminants = filter.contaminants_filtered
  const categories = filter.filtered_contaminant_categories

  // Some filters only list the categories
  const categoryNames = categories?.map((item: any) => item.category)

  const contaminantsByCategory = useMemo(() => {
    return IngredientCategories.reduce((acc, category) => {
      const contaminantsInCategory = allContaminants?.filter(
        (contaminant) => contaminant.category === category
      )

      let filteredInCategory = []
      let percentageFiltered = 0

      // Check for case where filter simply lists category and % filtered
      if (categories && categoryNames?.includes(category)) {
        filteredInCategory = (contaminantsInCategory ?? []).map((contaminant) => {
          return {
            id: contaminant.id,
            name: contaminant.name,
            is_common: contaminant.is_common,
            // isFiltered: filteredContaminants.some((fc) => fc.id === contaminant.id) || 'unknown',
          }
        })
        percentageFiltered = categories.find((item: any) => item.category === category)?.percentage
      } else {
        filteredInCategory = (contaminantsInCategory ?? []).map((contaminant) => {
          return {
            id: contaminant.id,
            name: contaminant.name,
            is_common: contaminant.is_common,
            isFiltered: filteredContaminants?.some((fc: any) => fc.id === contaminant.id),
          }
        })

        const totalFiltered =
          filteredInCategory?.filter((contaminant) => contaminant.isFiltered).length ?? 0
        const totalInCategory = contaminantsInCategory?.length

        percentageFiltered = Math.round(
          totalInCategory ? (totalFiltered / totalInCategory) * 100 : 0
        )
      }

      acc[category] = {
        percentageFiltered,
        contaminants: filteredInCategory,
      }

      return acc
    }, {} as ContaminantsByCategory)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allContaminants, filteredContaminants])

  const contaminantCategories = Object.fromEntries(
    filter?.filtered_contaminant_categories?.map((category: any) => [
      category.category,
      category.percentage,
    ]) ?? []
  )

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

  return (
    <div className="flex-col flex w-full md:px-0 px-2 gap-y-8">
      <div className="md:pt-10 pt-2">
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
              <div className="flex md:flex-row md:justify-start justify-end md:gap-10 items-start w-40">
                <Score score={filter.is_indexed ? filter.score : null} size="md" />{' '}
              </div>
            </div>

            <div>
              {/* {item.is_indexed === false && <UntestedTooltip />} */}

              {filter.type === 'shower_filter' && (
                <ShowerFilterMetadata
                  filteredContaminants={filteredContaminants}
                  contaminantsByCategory={contaminantsByCategory}
                />
              )}

              {(filter.type === 'filter' || filter.type === 'bottle_filter') && (
                <WaterFilterMetadata contaminantCategories={contaminantCategories} />
              )}

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

        {filter.description && (
          <div className="flex flex-row gap-2 mt-4">
            <Typography size="base" fontWeight="normal" className="text-seoncdary-foreground">
              {filter.description}
            </Typography>
          </div>
        )}

        <>
          <div className="flex flex-col gap-6 mt-6">
            <ContaminantTable
              filteredContaminants={filter.contaminants_filtered}
              categories={filter.filtered_contaminant_categories}
              showPaywall={!subscription}
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
