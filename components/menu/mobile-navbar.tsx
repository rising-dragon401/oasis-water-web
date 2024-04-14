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
import { Droplet, Filter, Milk, Heart } from 'lucide-react'
import SignUpButton from '../shared/sign-up-button'
import ManageSubscriptionButton from '@/components/shared/manage-subscription-btn'
import SubscribeButton from '@/components/shared/subscribe-button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { PROFILE_AVATAR } from '@/lib/constants/images'

export default function MobileNavbar() {
  const { uid, userData, subscription } = useUserProvider()

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
            <DropdownMenuItem className="my-2 justify-start">
              <Link href="/search/bottled-water" className="flex flex-row gap-2 items-center">
                <Milk className="text-secondary w-4 h-4" />
                Bottled waters
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="my-2 justify-start">
              <Link href="/search/tap-water" className="flex flex-row gap-2 items-center">
                <Droplet className="text-secondary w-4 h-4" />
                Tap water
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex flex-row gap-2 items-center my-2">
              <Filter className="text-secondary w-4 h-4" />
              <Link href="/search/filters">Filters</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="my-2 justify-start">
              <Link href="/mission">About</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="my-2 justify-start">
              <Link href="/blog/how_we_score_water">How Scoring Works</Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="my-2 justify-start">
              <Link href="/blog/water_testing_parter">Test your water</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <ManageSubscriptionButton />

            {uid && userData ? (
              <DropdownMenuGroup>
                <DropdownMenuSeparator />
                {!subscription && <SubscribeButton />}
                <DropdownMenuItem className="my-2 justify-start">
                  <Heart className="mr-2 h-4 w-4" />

                  <Link href="/account/my-oasis">Favorites</Link>
                </DropdownMenuItem>
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
