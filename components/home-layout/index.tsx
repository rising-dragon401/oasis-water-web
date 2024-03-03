import Footer from '@/components/shared/footer'
import HomeNavbar from '@/components/menu/home-navbar'
import { PropsWithChildren } from 'react'
import MobileNavbar from '@/components/menu/mobile-navbar'
import Link from 'next/link'
import Logo from '@/components/shared/logo'
import Typography from '@/components/typography'
import BasicSearch from '@/components/basic-search'
import SignUpButton from '../shared/sign-up-button'
import { getSession } from '@/utils/supabase/server'
import { AccountMenu } from '../menu/account-menu'

export default async function SubpageLayout({ children }: PropsWithChildren) {
  const session = await getSession()

  const user = session?.user

  return (
    <div className="min-h-[100vh] flex justify-center">
      <div className="xl:max-w-6xl lg:max-w-5xl md:max-w-3xl sm:max-w-xl max-w-sm w-full">
        <div className="md:flex hidden flex-w w-full justify-between items-center">
          <HomeNavbar />

          <div className="flex justify-end items-center gap-2">
            <BasicSearch showSearch={false} />

            {user ? (
              <AccountMenu />
            ) : (
              <div className="flex flex-row gap-4 items-center ml-4">
                <Link href="/auth/signin" className="text-sm">
                  Login
                </Link>
                <SignUpButton />
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden flex flex-row justify-between items-center  pt-1">
          <Link
            href="/"
            className="flex  flex-row items-center justify-center hover:cursor-pointer"
          >
            <Logo />

            <Typography size="2xl" fontWeight="normal">
              Oasis
            </Typography>
          </Link>

          <div className="flex flex-row items-center gap-2">
            <div className="flex justify-end">
              <BasicSearch showSearch={false} />
            </div>
            <MobileNavbar />
          </div>
        </div>

        <div className="py-3 min-h-[70vh] flex justify-center w-full">{children}</div>

        <Footer />
      </div>
    </div>
  )
}
