'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { kAppStore, kGooglePlay } from '@/lib/constants/socials'
import { TbBrandApple, TbBrandGooglePlay } from 'react-icons/tb'

export default function DownloadAppButton({ referral }: { referral?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Download app</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem>
          <TbBrandApple className="w-4 h-4 mr-2" />
          <a href={kAppStore} target="_blank" rel="noopener noreferrer">
            iOS app
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <TbBrandGooglePlay className="w-4 h-4 mr-2" />
          <a href={kGooglePlay} target="_blank" rel="noopener noreferrer">
            Android app
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
