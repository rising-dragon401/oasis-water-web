import Footer from '@/components/footer'
import HomeMenu from '@/components/home-navbar'
import { PropsWithChildren } from 'react'

export default async function SubpageLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-[100vh]">
      <HomeMenu />
      <div className="px-8 py-3 w-full min-h-[70vh]">{children}</div>
      <Footer />
    </div>
  )
}
