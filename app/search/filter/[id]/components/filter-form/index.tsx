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
import { UntestedTooltip } from '@/components/shared/untested-tooltip'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import useDevice from '@/lib/hooks/use-device'
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
  const { isMobile } = useDevice()

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

  // along with the percentage of common and uncommon contaminants filtered
  const percentCommonFiltered = filter?.percent_common_filtered

  const percentUncommonFiltered = filter?.percent_uncommon_filtered

  useEffect(() => {
    fetchFilter(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, allIngredients])

  if (isLoading) {
    return <ItemSkeleton />
  }

  if (filter.is_draft) {
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

                <div className=" flex-col border rounded-md px-2 mt-4 w-full md:flex hidden">
                  {filter.is_indexed === false && <UntestedTooltip />}

                  <BlurredLineItem
                    label="Common contaminants removed"
                    value={`${percentCommonFiltered}%` || '0'}
                    // labelClassName="text-red-500"
                    tooltipContent="Learn more"
                    tooltipLink="/blog/how_we_score_water"
                  />
                  <BlurredLineItem
                    label="Uncommon contaminants removed"
                    value={`${percentUncommonFiltered}%` || '0'}
                    // labelClassName="text-red-500"
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

                {filter.affiliate_url && filter.score > 70 && (
                  <Button
                    variant={filter.score > 70 ? 'default' : 'outline'}
                    onClick={() => {
                      window.open(filter.affiliate_url, '_blank')
                    }}
                    className="w-40 mt-4"
                  >
                    Learn more <ArrowUpRight size={16} />
                  </Button>
                )}
              </div>

              <div className="flex w-1/2 justify-end">
                <Score score={filter.score} size={isMobile ? 'md' : 'lg'} />
              </div>
            </div>
          </div>
        </div>

        <div className=" flex-col border rounded-md px-2 mt-4 w-full md:hidden flex">
          {filter.is_indexed === false && <UntestedTooltip />}

          <BlurredLineItem
            label="Common contaminants removed"
            value={`${percentCommonFiltered}%` || '0'}
            // labelClassName="text-red-500"
            tooltipContent="Learn more"
            tooltipLink="/blog/how_we_score_water"
          />
          <BlurredLineItem
            label="Uncommon contaminants removed"
            value={`${percentUncommonFiltered}%` || '0'}
            // labelClassName="text-red-500"
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

        <div className="flex flex-row gap-2 mt-4">
          <Typography size="base" fontWeight="normal" className="text-seoncdary-foreground">
            {filter.description}
          </Typography>
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

      <RecommendedFiltersRow />
    </div>
  )
}
