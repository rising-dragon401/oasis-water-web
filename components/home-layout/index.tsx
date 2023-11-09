import Footer from '@/components/footer'
import Navbar from '@/components/home-navbar'
import { PropsWithChildren } from 'react'

export default async function SubpageLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <div className="px-8 py-3">{children}</div>
      <Footer />
    </>
  )
}
