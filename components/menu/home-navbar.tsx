'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import Logo from '@/components/logo'
import Typography from '../typography'
import { useState, useEffect } from 'react'
import BasicSearch from '@/components/basic-search'
import { AccountMenu } from './account-menu'

export default function HomeNavbar() {
  const [isMounted, setIsMounted] = useState(false)

  // This is a side effect that runs after the first render and sets the isMounted state to true
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // This is a conditional rendering that returns null if the component is not mounted yet
  if (!isMounted) {
    return null
  } else {
    return (
      <NavigationMenu className="flex flex-row w-full justify-between py-2 md:px-8 px-4 list-none">
        <NavigationMenuList>
          <NavigationMenuItem className="mr-4">
            <Link href="/" className="flex  flex-row  items-center hover:cursor-pointer">
              <Logo />

              <Typography size="2xl" fontWeight="normal" className="md:block hidden">
                Oaisys
              </Typography>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/bottled-water" className={navigationMenuTriggerStyle()}>
              Bottled Water
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/tap-water" className={navigationMenuTriggerStyle()}>
              Tap Water
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/filters" className={navigationMenuTriggerStyle()}>
              Filters
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/recommendations" className={navigationMenuTriggerStyle()}>
              Recommended
            </Link>
          </NavigationMenuItem>

          {/* <NavigationMenuItem>
            <Link href="/blog" className={navigationMenuTriggerStyle()}>
              Blog
            </Link>
          </NavigationMenuItem> */}
        </NavigationMenuList>

        <NavigationMenuList>
          <BasicSearch showSearch={false} />

          <AccountMenu />
        </NavigationMenuList>
      </NavigationMenu>
    )
  }
}
