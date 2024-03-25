'use client'

import { useEffect, useState } from 'react'
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
import { Heart, Wallet } from 'lucide-react'
import Link from 'next/link'
import { PROFILE_AVATAR } from '@/lib/constants/images'
import { useUserProvider } from '@/providers/UserProvider'
import useSubscription from '@/lib/hooks/use-subscription'
import { postData } from '@/utils/helpers'
import { useRouter } from 'next/navigation'

export function AccountMenu() {
  const router = useRouter()
  const { userData, refreshUserData } = useUserProvider()
  const { subscription } = useSubscription()

  const [isLoadingCustomerPortal, setIsLoadingCustomerPortal] = useState(false)

  useEffect(() => {
    refreshUserData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleManageSubscription = async () => {
    setIsLoadingCustomerPortal(true)
    try {
      const { url } = await postData({
        url: '/api/create-portal-link',
      })

      console.log('url', url)

      if (url) {
        router.push(url)
      } else {
        throw new Error('Error')
      }
    } catch (error) {
      console.log('error', error)
    }

    setIsLoadingCustomerPortal(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full ">
          <Avatar className="h-8 w-8">
            <AvatarImage src={PROFILE_AVATAR} alt="maia pfp" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 hover:cursor-pointer" align="end" forceMount>
        {userData?.full_name && (
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-xs leading-none text-muted-foreground">{userData.full_name}</p>
            </div>
          </DropdownMenuLabel>
        )}

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

        {subscription && subscription.status === 'active' && (
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Button
              variant="ghost"
              onClick={handleManageSubscription}
              className="flex flex-row items-center"
              loading={isLoadingCustomerPortal}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Subscription
            </Button>
          </DropdownMenuItem>
        )}

        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
