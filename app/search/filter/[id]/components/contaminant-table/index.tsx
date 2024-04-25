'use client'

import { getAllContaminants } from '@/app/actions/filters'
import { ContaminantFiltersDropdown } from '@/components/contamintant-card/contaminant-filters-dropdown'
import Typography from '@/components/typography'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Contaminant } from '@/types/custom'
import { determineLink } from '@/utils/helpers'
import { CheckCircle2, HelpCircle, X } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'

type Props = {
  filteredContaminants: Contaminant[]
  categories?: any[]
}

export default function ContaminantTable({ filteredContaminants, categories }: Props) {
  const { data: allContaminants } = useSWR('water-contaminants', getAllContaminants)

  const categoryNames = categories?.map((item) => item.category)

  // Sort contaminants: filtered ones first
  const sortedContaminants = allContaminants?.sort((a, b) => {
    const aIsFiltered = filteredContaminants.some((fc) => fc.id === a.id) ? 1 : 0
    const bIsFiltered = filteredContaminants.some((fc) => fc.id === b.id) ? 1 : 0
    return bIsFiltered - aIsFiltered
  })

  // TODO - add type to each ingredient in Supabase and create dropdowns for each
  // for now just adding dropwdowns if category is listed

  return (
    <>
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
      </table>

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
      )}
    </>
  )
}
