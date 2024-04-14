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
import Logo from '@/components/shared/logo'
import Typography from '../typography'
import { cn } from '@/lib/utils'
import { MapPin, Droplet, Filter, Milk, Building } from 'lucide-react'

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  logo?: React.ReactNode
  title: string
}

const components: {
  title: string
  href: string
  description: string
  logo: React.ReactNode
}[] = [
  {
    title: 'Bottled waters',
    href: '/search/bottled-water',
    description: 'Discover the health rating of your bottled water.',
    logo: <Milk className="text-secondary w-4 h-4" />,
  },
  {
    title: 'Tap water',
    href: '/search/tap-water',
    description: 'Lookup what contaminants are inside your tap water',
    logo: <Droplet className="text-secondary w-4 h-4" />,
  },
  {
    title: 'Filters',
    href: '/search/filters',
    description: 'Find the best filter for your water.',
    logo: <Filter className="text-secondary w-4 h-4" />,
  },
]

const aboutComponents: { title: string; href: string; description: string }[] = [
  {
    title: 'About',
    href: '/about',
    description: 'We make living a clean healthy life easy',
  },
  {
    title: 'Mission',
    href: '/mission',
    description: 'We are dedicated to simplifying the journey towards conscious consumption.',
  },
  {
    title: 'Blog',
    href: '/blog',
    description: 'Discover and read more about the water industry and Oasis.',
  },
  {
    title: 'How Scoring Works',
    href: '/blog/how_we_score_water',
    description: 'The science and formula behind our water scoring system.',
  },
]

export default function HomeNavbar() {
  return (
    <NavigationMenu className="flex w-full justify-between py-2">
      <NavigationMenuList>
        <NavigationMenuItem className="mr-4">
          <Link href="/" className="flex  flex-row  items-center hover:cursor-pointer">
            <Logo />

            <Typography size="2xl" fontWeight="normal">
              Oasis
            </Typography>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Water</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  logo={component.logo}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {aboutComponents.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <div
            onClick={() =>
              window.open(`${process.env.NEXT_PUBLIC_BASE_URL}blog/water_testing_parter`, '_blank')
            }
            className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}
          >
            Water testing
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, logo, children, href = '/', ...props }) => {
    // Provide a default value for href
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={href}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
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
