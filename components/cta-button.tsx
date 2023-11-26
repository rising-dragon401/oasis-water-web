'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import cn from 'classnames'
import useDevice from '@/lib/hooks/use-device'
import { SearchIcon } from 'lucide-react'

export default function CTAButton() {
  const { isMobile } = useDevice()
  return (
    <Link href="/">
      {!isMobile ? (
        <Button>Water Assistant</Button>
      ) : (
        <Button variant="ghost">
          <SearchIcon />
        </Button>
      )}
    </Link>
  )
}
