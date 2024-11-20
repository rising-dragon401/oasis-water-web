'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserProvider } from '@/providers/UserProvider'
import { ActivitySquare, Home, Menu, Trophy, User, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import DownloadAppButton from '../shared/download-app-button'
import SignUpButton from '../shared/sign-up-button'
import SignOutButton from './log-out-button'

export default function MobileNavbar() {
  const { uid, user, userData } = useUserProvider()

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
            <>{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 mr-2 p-2" align="end">
          <DropdownMenuGroup className="flex flex-col gap-1">
            <div className="flex flex-row gap-2 items-center py-2 px-2">
              <DownloadAppButton className="h-8 w-full px-2" />
            </div>

            <DropdownMenuItem className="flex flex-row gap-2 items-center">
              <Link href="/" className="flex flex-row gap-2 items-center">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex flex-row gap-2 items-center">
              <Trophy className=" w-4 h-4" />
              <Link href="/product-testing">Product testing</Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex flex-row gap-2 items-center">
              <ActivitySquare className=" w-4 h-4" />
              <Link href="/blog">Research</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {user && (
              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link href={`/account`} className="flex flex-row items-center">
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            )}

            {uid && userData ? (
              <DropdownMenuGroup>
                <SignOutButton />
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/auth/signin" className="text-sm pb-2">
                    Login
                  </Link>
                </DropdownMenuItem>

                <SignUpButton />
              </DropdownMenuGroup>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
