'use client'

import useSWR from 'swr'
import { getAllContaminants } from '@/app/actions/filters'
import { Contaminant } from '@/types/custom'
import { CheckCircle2, X } from 'lucide-react'
import { ContaminantFiltersDropdown } from '@/components/contamintant-card/contaminant-filters-dropdown'

type Props = {
  filteredContaminants: Contaminant[]
}

export default function ContaminantTable({ filteredContaminants }: Props) {
  const { data: allContaminants } = useSWR('water-contaminants', getAllContaminants)

  // Sort contaminants: filtered ones first
  const sortedContaminants = allContaminants?.sort((a, b) => {
    const aIsFiltered = filteredContaminants.some((fc) => fc.id === a.id) ? 1 : 0
    const bIsFiltered = filteredContaminants.some((fc) => fc.id === b.id) ? 1 : 0
    return bIsFiltered - aIsFiltered
  })

  return (
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
              {contaminant.name}
            </td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 max-w-14">
              {filteredContaminants.some((fc) => fc.id === contaminant.id) ? (
                <CheckCircle2 className="w-4 h-4 text-center" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </td>

            <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 max-w-24">
              <ContaminantFiltersDropdown contaminantId={contaminant?.id} align="end" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
