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
import { Source } from '@/types/custom'
import Link from 'next/link'

type Props = {
  sources: Source[]
}

export function SourcesDropdown({ sources }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Sources</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Sources</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {sources.map((source: Source) => (
            <DropdownMenuItem key={source.url}>
              <Link href={source.url}>{source.label} </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
