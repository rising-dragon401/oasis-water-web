'use client'

import { getAllContaminants, getFilterDetails } from '@/app/actions/filters'
import { getIngredients } from '@/app/actions/ingredients'
import { incrementItemsViewed } from '@/app/actions/user'
import RecommendedFiltersRow from '@/components/sections/recs-filter-row'
import BlurredLineItem from '@/components/shared/blurred-line-item'
import ItemImage from '@/components/shared/item-image'
import PaywallContent from '@/components/shared/paywall-content'
import Score from '@/components/shared/score'
import Sources from '@/components/shared/sources'
import UnindexedDisclaimer from '@/components/shared/unindexed-disclaimer'
import UntestedDisclaimer from '@/components/shared/untested-disclaimer'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import ContaminantTable from '../contaminant-table'
import ItemSkeleton from '../item-skeleton'

type Props = {
  id: string
}

export default function FilterForm({ id }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<any>({})

  const { data: allContaminants } = useSWR('water-contaminants', getAllContaminants)
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

  // get common water contaminants
  const commonContaminants = useMemo(
    () => allContaminants?.filter((contaminant) => contaminant.is_common === true),
    [allContaminants]
  )

  // get uncommon water contaminants
  const uncommonContaminants = useMemo(
    () => allContaminants?.filter((contaminant) => contaminant.is_common !== true),
    [allContaminants]
  )

  // get categories filtred (if any)
  const categoriesFiltered = useMemo(
    () => filter.filtered_contaminant_categories ?? [],
    [filter.filtered_contaminant_categories]
  )

  // get the category contamiannts that are filtered
  const contaminantsFilteredFromCategory = useMemo(() => {
    console.log('categoriesFiltered: ', categoriesFiltered)
    return categoriesFiltered.flatMap((category: any) => {
      const percent = category.percentage

      const contaminantsInCategory =
        allContaminants?.filter((contaminant) => contaminant.category === category.category) || []

      const sliceIndex = Math.ceil(contaminantsInCategory.length * (percent / 100))

      const contaminantsInCategoryByPercent = contaminantsInCategory.slice(0, sliceIndex)

      return contaminantsInCategoryByPercent.map((contaminant) => {
        return {
          id: contaminant.id,
          name: contaminant.name,
        }
      })
    })
  }, [allContaminants, categoriesFiltered])

  // combine normal filtered contaminants with category filtered contaminants
  const combinedFilteredContaminants = useMemo(() => {
    const flatContaminantsFromCategory = contaminantsFilteredFromCategory.flat()
    const uniqueContaminants = new Map()

    // Add contaminants filtered directly
    filter?.contaminants_filtered?.forEach((contaminant: any) => {
      uniqueContaminants.set(contaminant.id, contaminant)
    })

    // Add contaminants filtered from categories
    flatContaminantsFromCategory.forEach((contaminant: any) => {
      if (!uniqueContaminants.has(contaminant.id)) {
        uniqueContaminants.set(contaminant.id, contaminant)
      }
    })

    return Array.from(uniqueContaminants.values())
  }, [contaminantsFilteredFromCategory, filter.contaminants_filtered])

  // now get the common contaminants that are filtered
  const commonContaminantsFiltered = useMemo(
    () =>
      allContaminants?.filter(
        (contaminant) =>
          contaminant.is_common === true &&
          combinedFilteredContaminants.some((filtered: any) => filtered.id === contaminant.id)
      ),
    [allContaminants, combinedFilteredContaminants]
  )

  // and the uncommon contaminants that are filtered
  const uncommonContaminantsFiltered = useMemo(
    () =>
      allContaminants?.filter(
        (contaminant) =>
          contaminant.is_common !== true &&
          combinedFilteredContaminants.some((filtered: any) => filtered.id === contaminant.id)
      ),
    [allContaminants, combinedFilteredContaminants]
  )

  // along with the percentage of common and uncommon contaminants filtered
  const percentCommonFiltered = useMemo(
    () =>
      Math.round(
        ((commonContaminantsFiltered?.length ?? 0) / (commonContaminants?.length ?? 1)) * 100
      ),
    [commonContaminantsFiltered, commonContaminants]
  )

  const percentUncommonFiltered = useMemo(
    () =>
      Math.round(
        ((uncommonContaminantsFiltered?.length ?? 0) / (uncommonContaminants?.length ?? 1)) * 100
      ),
    [uncommonContaminantsFiltered, uncommonContaminants]
  )

  useEffect(() => {
    fetchFilter(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, allIngredients])

  if (isLoading) {
    return <ItemSkeleton />
  }

  if (filter.is_draft) {
    return <div>This filter has not been rated yet. Please check back later.</div>
  }

  return (
    <div className="flex-col flex w-full md:px-0 px-2">
      <div className="md:py-10 py-6">
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
                  <Typography size="base" fontWeight="normal" className="text-secondary-foreground">
                    {filter.brand?.name} - {filter.company?.name}
                  </Typography>
                </Link>

                <div className="flex flex-col gap-y-2 mt-4">
                  <BlurredLineItem
                    label="Common contaminants filtered"
                    value={
                      `${commonContaminantsFiltered?.length.toString()} (${percentCommonFiltered}%)` ||
                      '0'
                    }
                    labelClassName="text-red-500"
                    tooltipContent="Learn more"
                    tooltipLink="/blog/how_we_score_water"
                  />
                  <BlurredLineItem
                    label="Uncommon contaminants filtered"
                    value={
                      `${uncommonContaminantsFiltered?.length.toString()} (${percentUncommonFiltered}%)` ||
                      '0'
                    }
                    labelClassName="text-red-500"
                    tooltipContent="Learn more"
                    tooltipLink="/blog/how_we_score_water"
                  />
                  <BlurredLineItem
                    label="Certifications"
                    value={filter.certifications?.join(', ') || 'None'}
                    tooltipContent="Learn more"
                    tooltipLink="/blog/how_we_score_water"
                  />
                </div>

                {filter.affiliate_url && (
                  <Button
                    variant={filter.score > 70 ? 'default' : 'outline'}
                    onClick={() => {
                      window.open(filter.affiliate_url, '_blank')
                    }}
                    className="w-40 mt-6"
                  >
                    Buy Now <ArrowUpRight size={16} className="ml-2 w-" />
                  </Button>
                )}
              </div>

              <div className="flex w-1/2 justify-end">
                <Score score={filter.score} size="lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2 mt-4">
          <Typography size="base" fontWeight="normal" className="text-seoncdary-foreground">
            {filter.description}
          </Typography>
        </div>

        {filter.is_indexed !== false && <UntestedDisclaimer />}

        {filter.is_indexed !== false ? (
          <>
            <div className="flex flex-col gap-6 mt-6">
              <ContaminantTable
                filteredContaminants={filter.contaminants_filtered}
                categories={categoriesFiltered}
              />
            </div>

            <PaywallContent className="mt-8" label="Unlock all data and reports">
              {filter?.sources && filter?.sources?.length > 0 && <Sources data={filter.sources} />}
            </PaywallContent>
          </>
        ) : (
          <UnindexedDisclaimer />
        )}
      </div>

      <RecommendedFiltersRow />
    </div>
  )
}
