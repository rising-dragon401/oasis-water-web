import Logo from '@/components/shared/logo'
import Link from 'next/link'
import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-full">
      <div className="flex flex-row justify-between md:absolute relative top-0 left-0 w-full bg-transparent z-20 md:px-10 md:pt-6 pt-2 px-4 ">
        <div className="">
          <Link href="/" aria-label="Logo" className="flex items-center">
            <Logo />
          </Link>
        </div>

        {/* <AuthMenu /> */}
      </div>

      {children}
    </section>
  )
}
