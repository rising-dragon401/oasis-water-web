'use client'

import SignOutButton from './sign-out-button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import useUser from '@/lib/hooks/use-user'
import { PROFILE_AVATAR } from '@/lib/constants/images'

export function AccountMenu() {
  const { uid, userData } = useUser()

  if (!uid || !userData) {
    return (
      <Link
        href="/auth/signin"
        className="bg-accent text-primary-foreground hover:bg-accent/80 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:cursor-pointer"
      >
        <Button variant="default">Login</Button>
      </Link>
    )
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={PROFILE_AVATAR} alt="maia pfp" />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 hover:cursor-pointer" align="end" forceMount>
          {userData.full_name && (
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
            <Link href="/favorites" className="flex flex-row items-center">
              <Heart className="mr-2 h-4 w-4" />
              Favorites
            </Link>
          </DropdownMenuItem>

          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
