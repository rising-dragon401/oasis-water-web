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
    <div className="min-h-[100vh] px-8">
      <div className="md:block hidden">
        <HomeNavbar />
      </div>

      <div className="md:hidden flex flex-row justify-between items-center px-4">
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

      <div className=" py-3 w-full min-h-[70vh]">{children}</div>

      <Footer />
    </div>
  )
}
