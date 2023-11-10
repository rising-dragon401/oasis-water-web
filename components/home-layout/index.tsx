import Footer from '@/components/footer'
import HomeMenu from '@/components/home-navbar'
import { PropsWithChildren } from 'react'

export default async function SubpageLayout({ children }: PropsWithChildren) {
  return (
    <>
      <HomeMenu />
      <div className="px-8 py-3 w-full">{children}</div>
      <Footer />
    </>
  )
}
