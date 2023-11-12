'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import Link from 'next/link'
import cn from 'classnames'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Logo from '@/components/logo'
import Typography from './typography'

export default function HomeMenu() {
  return (
    <NavigationMenu className="flex flex-row w-full justify-between py-2 md:px-8 px-4 list-none">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" className="flex  flex-row  items-center hover:cursor-pointer">
            <Logo />

            <Typography size="2xl" fontWeight="normal">
              Oaisys
            </Typography>
          </Link>
        </NavigationMenuItem>

        {/* <NavigationMenuItem>
          <Link href="/manifesto" className={navigationMenuTriggerStyle()}>
            About
          </Link>
        </NavigationMenuItem> */}
      </NavigationMenuList>

      <NavigationMenuItem>
        <Link href="/blog" className={navigationMenuTriggerStyle()}>
          Blog
        </Link>
      </NavigationMenuItem>

      <NavigationMenuList>
        {/* <NavigationMenuItem>
          <Link href="/auth/signin" className={navigationMenuTriggerStyle()}>
            Login
          </Link>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <NavigationMenuItem className="ml-2">
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.5 }}>
              <Link
                href="/"
                className={cn(
                  'bg-primary text-primary-foreground dark:text-secondary hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                )}
              >
                <Button>Search water</Button>
              </Link>
            </motion.div>
          </NavigationMenuItem>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
