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
import Link from 'next/link'
import { getFiltersByContaminant } from '@/app/actions/filters'
import Typography from '@/components/typography'

type Props = {
  contaminantId: number
}

export async function ContaminantFiltersDropdown({ contaminantId }: Props) {
  const filters = await getFiltersByContaminant(contaminantId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filtered by</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {filters.length > 0 ? (
            filters.map((filter: WaterFilter) => (
              <DropdownMenuItem key={filter.id}>
                <Link href={`/filter/${filter.id}`}>{filter.name}</Link>
              </DropdownMenuItem>
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
