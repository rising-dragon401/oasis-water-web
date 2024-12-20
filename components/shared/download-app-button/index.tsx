'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { kAppStore, kGooglePlay } from '@/lib/constants/socials'
import { ArrowRight } from 'lucide-react'
import { TbBrandApple, TbBrandGooglePlay } from 'react-icons/tb'

export default function DownloadAppButton({
  referral,
  showIcon = false,
  className,
  overrideText,
  variant = 'default',
}: {
  referral?: string
  showIcon?: boolean
  className?: string
  overrideText?: string
  variant?: 'default' | 'outline'
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className={className}>
          {overrideText || 'Download'}
          {showIcon && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem className="p-4 hover:bg-secondary">
          <TbBrandApple className="w-5 h-5 mr-3" />
          <a href={kAppStore} target="_blank" rel="noopener noreferrer">
            iOS app
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-4 hover:bg-secondary">
          <TbBrandGooglePlay className="w-5 h-5 mr-3" />
          <a href={kGooglePlay} target="_blank" rel="noopener noreferrer">
            Android app
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
