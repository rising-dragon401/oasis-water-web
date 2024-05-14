'use client'

import ManageSubscriptionButton from '@/components/shared/manage-subscription-btn'
import SubscribeButton from '@/components/shared/subscribe-button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PROFILE_AVATAR } from '@/lib/constants/images'
import { useUserProvider } from '@/providers/UserProvider'
import { Droplet, Filter, Menu, Milk, Palmtree, User, Users, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import SignUpButton from '../shared/sign-up-button'
import SignOutButton from './log-out-button'

export default function MobileNavbar() {
  const { uid, user, userData, subscription } = useUserProvider()

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
            {userData ? (
              <Avatar className="h-8 w-8 p-0">
                <AvatarImage src={userData?.avatar_url || PROFILE_AVATAR} alt="oasis pfp" />
              </Avatar>
            ) : (
              <>{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 mr-2 p-2" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem className="justify-start">
              <Link href="/search/bottled-water" className="flex flex-row gap-2 items-center">
                <Milk className="text-secondary w-4 h-4" />
                Bottled waters
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="justify-start">
              <Link href="/search/tap-water" className="flex flex-row gap-2 items-center">
                <Droplet className="text-secondary w-4 h-4" />
                Tap water
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex flex-row gap-2 items-center">
              <Filter className="text-secondary w-4 h-4" />
              <Link href="/search/filters">Filters</Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex flex-row gap-2 items-center">
              <Users className="text-secondary w-4 h-4" />
              <Link href="/users">People</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <ManageSubscriptionButton />

            {user && (
              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link href={`/oasis/${user?.id}`} className="flex flex-row items-center">
                  <Palmtree className="mr-2 h-4 w-4" />
                  My Oasis
                </Link>
              </DropdownMenuItem>
            )}

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
                <DropdownMenuSeparator />
                {!subscription && <SubscribeButton />}

                <SignOutButton />
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link href="/auth/signin" className="text-sm py-2">
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
