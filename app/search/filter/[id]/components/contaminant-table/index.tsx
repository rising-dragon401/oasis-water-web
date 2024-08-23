'use client'

import { getAllContaminants } from '@/app/actions/filters'
import PaywallContent from '@/components/shared/paywall-content'
import Typography from '@/components/typography'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { IngredientCategories } from '@/lib/constants/filters'
import { Contaminant } from '@/types/custom'
import { determineLink } from '@/utils/helpers'
import Link from 'next/link'
import { useMemo } from 'react'
import useSWR from 'swr'

type Props = {
  filteredContaminants: Contaminant[]
  categories?: any[]
  showPaywall?: boolean
}

export default function ContaminantTable({ filteredContaminants, categories, showPaywall }: Props) {
  const { data: allContaminants } = useSWR('water-contaminants', getAllContaminants)

  // Some filters only list the categories
  const categoryNames = categories?.map((item) => item.category)

  const contaminantsByCategory = useMemo(() => {
    return IngredientCategories.map((category) => {
      const contaminantsInCategory = allContaminants?.filter(
        (contaminant) => contaminant.category === category
      )

      let filteredInCategory = []
      let percentageFiltered = 0
      let name = ''

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
        percentageFiltered = categories.find((item) => item.category === category)?.percentage
        name = categories.find((item) => item.category === category)?.name
      } else {
        filteredInCategory = (contaminantsInCategory ?? []).map((contaminant) => {
          return {
            id: contaminant.id,
            name: contaminant.name,
            is_common: contaminant.is_common,
            isFiltered: filteredContaminants.some((fc) => fc.id === contaminant.id),
          }
        })

        const totalFiltered =
          filteredInCategory?.filter((contaminant) => contaminant.isFiltered).length ?? 0
        const totalInCategory = contaminantsInCategory?.length

        percentageFiltered = Math.round(
          totalInCategory ? (totalFiltered / totalInCategory) * 100 : 0
        )
      }

      return {
        category,
        percentageFiltered,
        contaminants: filteredInCategory,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allContaminants, filteredContaminants])

  return (
    <div>
      <Typography size="xl" fontWeight="normal">
        Contaminants categories
      </Typography>
      <PaywallContent label="Unlock contaminants this filter removes" showPaywall={false}>
        <Typography size="xs" fontWeight="normal" className="text-secondary">
          Individual contaminant filtration levels may vary. Check the lab report for exact
          measurements
        </Typography>

        {contaminantsByCategory.map((item) => (
          <Accordion
            key={item.category}
            type="single"
            collapsible
            className="w-full bg-card rounded-md my-4 px-4"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="w-full flex flex-row justify-start rounded-md">
                <div className="w-full justify-start flex">
                  <Typography size="lg" fontWeight="normal" className="text-left">
                    {item.category}
                  </Typography>
                </div>
                <div className="flex justify-end w-full md:mr-10 mr-4">
                  {showPaywall ? (
                    <PaywallContent label="" buttonVariant="ghost">
                      <Typography
                        size="lg"
                        fontWeight="normal"
                        className="text-secondary justify-end"
                      >
                        {'Locked'}
                      </Typography>
                    </PaywallContent>
                  ) : (
                    <Typography size="lg" fontWeight="normal" className="justify-end">
                      {item.percentageFiltered ? `${item.percentageFiltered}%` : 'Unknown'}
                    </Typography>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex gap-1 flex-wrap">
                  {item.contaminants?.map((contaminant, index) => (
                    <Link
                      href={determineLink(contaminant)}
                      className="flex flex-row gap-6 justify-between items-center"
                      key={contaminant.name}
                    >
                      <Typography size="sm" fontWeight="normal" className="text-secondary">
                        {contaminant.name}
                        {index < item.contaminants.length - 1 ? ', ' : ''}
                      </Typography>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </PaywallContent>
    </div>
  )
}
