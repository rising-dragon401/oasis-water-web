'use client'

import { getFiltersByContaminant } from '@/app/actions/filters'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WaterFilter } from '@/types/custom'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Props = {
  contaminantId: number
  align?: 'start' | 'end'
}

export function ContaminantFiltersDropdown({ contaminantId, align }: Props) {
  const [filters, setFilters] = useState<WaterFilter[]>([])

  useEffect(() => {
    const fetchFilters = async () => {
      const result = await getFiltersByContaminant(contaminantId)
      setFilters(result)
    }

    fetchFilters()
  }, [contaminantId])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Filters that remove this
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align={align}>
        <DropdownMenuLabel>Filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {filters.length > 0 ? (
            filters.map((filter: WaterFilter) => (
              <div key={filter.id}>
                <DropdownMenuItem key={filter.id}>
                  <Link href={`/search/filter/${filter.id}`}>{filter.name}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            ))
          ) : (
            <DropdownMenuItem>
              <Typography size="base" fontWeight="normal" className="text-secondary mt-2">
                None
              </Typography>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
