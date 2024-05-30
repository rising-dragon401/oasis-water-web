'use client'

import { getAllContaminants } from '@/app/actions/filters'
import { ContaminantFiltersDropdown } from '@/components/contamintant-card/contaminant-filters-dropdown'
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
import { CheckCircle2, X } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import useSWR from 'swr'

type Props = {
  filteredContaminants: Contaminant[]
  categories?: any[]
}

export default function ContaminantTable({ filteredContaminants, categories }: Props) {
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
            isFiltered: filteredContaminants.some((fc) => fc.id === contaminant.id) || 'unknown',
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
      <Typography size="xl" fontWeight="normal" className="text-secondary">
        Contaminants filtered
      </Typography>
      <Typography size="xs" fontWeight="normal" className="text-secondary">
        *Note some filters only list categories and % filtered so individual contaminants may or may
        not be filtered. This is our best guess based on the information provided.
      </Typography>

      {contaminantsByCategory.map((item) => (
        <Accordion key={item.category} type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="w-full flex flex-row justify-start">
              <div className="w-full justify-start flex">
                <Typography size="lg" fontWeight="normal" className="text-secondary text-left">
                  {item.category}
                </Typography>
              </div>
              <div className="flex justify-end w-full md:mr-10 mr-4">
                <Typography size="lg" fontWeight="normal" className="text-secondary justify-end">
                  {item.percentageFiltered}%
                </Typography>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-y-4">
                {item.contaminants?.map((contaminant) => (
                  <Link
                    href={determineLink(contaminant)}
                    className="flex flex-row gap-6 justify-between items-center"
                    key={contaminant.name}
                  >
                    <div className="w-96" key={contaminant.name}>
                      {contaminant.name} {contaminant?.is_common ? '(c)' : ''}
                    </div>
                    <div className="w-14">
                      {contaminant.isFiltered === true && (
                        <CheckCircle2 className="w-4 h-4 text-center" />
                      )}
                      {contaminant.isFiltered === false && <X className="w-4 h-4 text-center" />}
                    </div>
                    <ContaminantFiltersDropdown contaminantId={contaminant?.id} align="end" />
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
      {/* 
      <table className="min-w-full divide-y divide-gray-200 overflow-scroll">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-32"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-18"
            >
              Filtered?
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Filtered By
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedContaminants?.map((contaminant, index) => (
            <tr key={index}>
              <td className="px-2 py-4  md:text-sm text-xs font-medium text-gray-900 max-w-36 text-wrap">
                <Link href={determineLink(contaminant)}>{contaminant.name}</Link>
              </td>

              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 max-w-14">
                {categoryNames?.map((name) => name).includes(contaminant.category) ? (
                  <HelpCircle className="w-4 h-4 text-center" />
                ) : (
                  <>
                    {filteredContaminants.some((fc) => fc.id === contaminant.id) ? (
                      <CheckCircle2 className="w-4 h-4 text-center" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </>
                )}
              </td>

              <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 max-w-24">
                <ContaminantFiltersDropdown contaminantId={contaminant?.id} align="end" />
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
      {/* 
      {categories && (
        <div className="flex flex-col gap-2">
          <Typography size="lg" fontWeight="normal" className="text-secondary">
            Additional categories
          </Typography>
          {categories.map((item) => (
            <Card key={item.category} className="w-[350px]">
              <CardHeader>
                <CardTitle>
                  {item.category} {item.percentage}%
                </CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          ))}
        </div>
      )} */}
    </div>
  )
}
