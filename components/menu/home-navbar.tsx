'use client'

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import * as React from 'react'

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  logo?: React.ReactNode
  title: string
}

export default function HomeNavbar() {
  return (
    <NavigationMenu className="flex w-full justify-between py-2 ">
      <NavigationMenuList>
        <Link href="/" className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}>
          Home
        </Link>

        <Link
          href="/product-testing"
          className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}
        >
          Product testing
        </Link>

        <Link href="/blog" className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}>
          Research
        </Link>
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
