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

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <DropdownMenu
      onOpenChange={() => {
        setIsOpen(!isOpen)
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/">Home</Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/bottled-water">Bottled water</Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/tap-water">Tap water</Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/filters">Filters</Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/recommendations">Recommended</Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="my-2 justify-center">
            <Link href="/about">About</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
