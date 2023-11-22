import Footer from '@/components/footer'
import HomeNavbar from '@/components/home-navbar'
import { PropsWithChildren } from 'react'
import MobileNavbar from '@/components/mobile-navbar'
import Link from 'next/link'
import Logo from '@/components/logo'
import Typography from '@/components/typography'
import CTAButton from '@/components/cta-button'

export default async function SubpageLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-[100vh]">
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

        <div className="flex flex-row items-center">
          <CTAButton />
          <MobileNavbar />
        </div>
      </div>
      <div className="px-8 py-3 w-full min-h-[70vh]">{children}</div>
      <Footer />
    </div>
  )
}
