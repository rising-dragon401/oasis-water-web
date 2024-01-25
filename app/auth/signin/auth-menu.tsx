'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AuthMenu() {
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
      <NavigationMenu className="flex flex-row max-w-max w-full justify-between">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/auth/signin" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Login
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
  }
}
