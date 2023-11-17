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
import CTAButton from './cta-button'

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

        <NavigationMenuItem>
          <Link href="/blog" className={navigationMenuTriggerStyle()}>
            Blog
          </Link>
        </NavigationMenuItem>
        {/* <NavigationMenuItem>
          <Link href="/manifesto" className={navigationMenuTriggerStyle()}>
            About
          </Link>
        </NavigationMenuItem> */}
      </NavigationMenuList>

      <NavigationMenuList>
        {/* <NavigationMenuItem>
          <Link href="/auth/signin" className={navigationMenuTriggerStyle()}>
            Login
          </Link>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <NavigationMenuItem className="ml-2">
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.5 }}>
              <CTAButton />
            </motion.div>
          </NavigationMenuItem>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
