'use client'

import { useEffect } from 'react'
import SignOutButton from './log-out-button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { PROFILE_AVATAR } from '@/lib/constants/images'
import { useUserProvider } from '@/providers/UserProvider'
import ManageSubscriptionButton from '../shared/manage-subscription-btn'
import SubscribeButton from '@/components/shared/subscribe-button'

export function AccountMenu() {
  const { userData, user, subscription } = useUserProvider()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full ">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData?.avatar_url || PROFILE_AVATAR} alt="oasis pfp" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 hover:cursor-pointer" align="end" forceMount>
        {(userData?.full_name || userData?.email) && (
          <DropdownMenuLabel className="font-normal">
            <Link href="/account">
              <div className="flex flex-col space-y-1">
                {userData.full_name && (
                  <p className="text-xs leading-none text-muted-foreground">{userData.full_name}</p>
                )}

                {userData.email && (
                  <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                )}
              </div>
            </Link>
            {/* <Typography size="sm" fontWeight="normal" className="mt-2">
              Free reports left: {2 - (userData?.metadata?.items_viewed || 0)}
            </Typography> */}
          </DropdownMenuLabel>
        )}

        {subscription && (
          <p className="text-xs leading-none text-muted-foreground px-2">
            Subscription: {subscription.plan}
          </p>
        )}

        {user && !subscription && <SubscribeButton />}

        <DropdownMenuSeparator />
        {/* 
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/dashboard/settings/profile" className="flex flex-row items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem> */}

        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <Link href="/account/my-oasis" className="flex flex-row items-center">
            <Heart className="mr-2 h-4 w-4" />
            Favorites
          </Link>
        </DropdownMenuItem>

        <ManageSubscriptionButton />

        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
