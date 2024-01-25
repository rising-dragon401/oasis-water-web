import Footer from '@/components/footer'
import HomeNavbar from '@/components/menu/home-navbar'
import { PropsWithChildren } from 'react'
import MobileNavbar from '@/components/menu/mobile-navbar'
import Link from 'next/link'
import Logo from '@/components/logo'
import Typography from '@/components/typography'
import BasicSearch from '@/components/basic-search'

export default async function SubpageLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-[100vh] flex justify-center">
      <div className="xl:max-w-6xl lg:max-w-5xl md:max-w-4xl sm:max-w-3xl max-w-sm w-full">
        <div className="hidden  md:flex w-full justify-center">
          <HomeNavbar />
        </div>

        <div className="md:hidden flex flex-row justify-between items-center  pt-1">
          <Link href="/" className="flex  flex-row  items-center hover:cursor-pointer">
            <Logo />

            <Typography size="2xl" fontWeight="normal" className="md:block hidden">
              Oaisys
            </Typography>
          </Link>

          <div className="flex flex-row items-center gap-2">
            <div className="flex justify-end">
              <BasicSearch showSearch={false} />
            </div>
            <MobileNavbar />
          </div>
        </div>

        <div className="py-3 min-h-[70vh] flex justify-center">{children}</div>

        <Footer />
      </div>
    </div>
  )
}
