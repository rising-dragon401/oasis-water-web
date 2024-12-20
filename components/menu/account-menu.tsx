'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PROFILE_AVATAR } from '@/lib/constants/images'
import { useUserProvider } from '@/providers/UserProvider'
import { User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import SignOutButton from './log-out-button'

export function AccountMenu() {
  const { userData } = useUserProvider()
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="relative h-8 w-8 rounded-full" onClick={() => setOpen(!open)}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={userData?.avatar_url || PROFILE_AVATAR} alt="oasis pfp" />
        </Avatar>
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

        <DropdownMenuSeparator />

        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <Link href={`/account/`} className="flex flex-row items-center">
            <User className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
