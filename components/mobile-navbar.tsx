'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X } from 'lucide-react'
import React from 'react'
import CTAButton from '@/components/cta-button'

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <DropdownMenu
      onOpenChange={() => {
        setIsOpen(!isOpen)
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/" legacyBehavior passHref>
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/blog" legacyBehavior passHref>
              Blog
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/about">About</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full justify-center flex">
            <CTAButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
