'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Menu, X } from 'lucide-react'
import React from 'react'
import SignOutButton from './log-out-button'
import { useEffect, useState } from 'react'
import { useUserProvider } from '@/providers/UserProvider'
import cn from 'classnames'
import { buttonVariants } from '@/components/ui/button'

export default function MobileNavbar() {
  const { uid, userData } = useUserProvider()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // This is a side effect that runs after the first render and sets the isMounted state to true
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // See: https://stackoverflow.com/questions/75094010/nextjs-13-hydration-failed-because-the-initial-ui-does-not-match-what-was-render
  if (!isMounted) {
    return null
  } else {
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
        <DropdownMenuContent className="w-full" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem className="my-2 justify-start">
              <Link href="/search/bottled-water">Bottled water</Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="my-2 justify-start">
              <Link href="/tap-water">Tap water</Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="my-2 justify-start">
              <Link href="/filters">Filters</Link>
            </DropdownMenuItem>

            {uid && userData ? (
              <DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="my-2 justify-start">
                  <Link href="/account/my-oaisys">Favorites</Link>
                </DropdownMenuItem>
                <SignOutButton />
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuItem className={cn(buttonVariants(), 'w-32')}>
                <Link href="/auth/signin">Login</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
