'use client'

import * as React from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import Logo from '@/components/logo'
import Typography from '../typography'
import { useState, useEffect } from 'react'
import BasicSearch from '@/components/basic-search'
import { AccountMenu } from './account-menu'
import { cn } from '@/lib/utils'

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Bottled water',
    href: '/bottled-water',
    description: 'Discover the health rating of your bottled water.',
  },
  {
    title: 'Tap water',
    href: '/tap-water',
    description: 'Lookup what contaminants are inside your tap water',
  },
  {
    title: 'Filters',
    href: '/filters',
    description: 'Find the best filter for your water.',
  },
  // {
  //   title: 'Scroll-area',
  //   href: '/docs/primitives/scroll-area',
  //   description: 'Visually or semantically separates content.',
  // },
  // {
  //   title: 'Tabs',
  //   href: '/docs/primitives/tabs',
  //   description:
  //     'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  // },
  // {
  //   title: 'Tooltip',
  //   href: '/docs/primitives/tooltip',
  //   description:
  //     'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  // },
]

export default function HomeNavbar() {
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
      <NavigationMenu className="flex w-full justify-between py-2">
        <NavigationMenuList>
          <NavigationMenuItem className="mr-4">
            <Link href="/" className="flex  flex-row  items-center hover:cursor-pointer">
              <Logo />

              <Typography size="2xl" fontWeight="normal">
                Oaisys
              </Typography>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Water</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/about" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/blog" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Blog</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
  }
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'
