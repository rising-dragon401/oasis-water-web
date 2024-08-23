'use client'

import Logo from '@/components/shared/logo'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { ActivitySquare, Search, Trophy } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import Typography from '../typography'

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  logo?: React.ReactNode
  title: string
}

export default function HomeNavbar() {
  return (
    <NavigationMenu className="flex w-full justify-between py-2">
      <NavigationMenuList>
        <NavigationMenuItem className="mr-4">
          <Link href="/" className="flex  flex-row  items-center hover:cursor-pointer">
            <Logo />

            <Typography size="2xl" fontWeight="normal" className="!text-accent">
              Oasis
            </Typography>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/" className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}>
            <Search className="w-4 h-4 mr-2" />
            Explore
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/top-rated" className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}>
            <Trophy className="w-4 h-4 mr-2" />
            Top Rated
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/blog" className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}>
            <ActivitySquare className="w-4 h-4 mr-2" />
            Research
          </Link>
        </NavigationMenuItem>

        {/* <NavigationMenuItem>
          <Link href="/lab-testing" className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}>
            <FlaskConical className="w-4 h-4 text-secondary mr-2" />
            Lab testing
          </Link>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, logo, children, href = '/', ...props }, ref) => {
    // Provide a default value for href
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={href}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="flex flex-row gap-2">
              {logo}
              <div className="text-sm font-medium leading-none">{title}</div>
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'
