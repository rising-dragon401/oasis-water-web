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
import { ArrowUpRight } from 'lucide-react'

type Props = {
  sources: Source[]
}

export function ArticlesDropdown({ sources }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Articles</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end">
        <DropdownMenuLabel>Articles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {sources.map((source: Source) => (
            <DropdownMenuItem key={source.url} className="relative hover:opacity-70">
              <Link
                href={source.url}
                className="flex items-center justify-between w-full pr-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.label}
                <ArrowUpRight className="absolute top-1 right-1 text-muted-foreground" size={16} />
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
