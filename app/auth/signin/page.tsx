'use client'

import { useEffect, useState } from 'react'
import AuthUI from './auth-ui'
import { getSession } from '@/app/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AUTH_IMAGES } from '@/lib/constants/images'
import { useUserProvider } from '@/providers/UserProvider'

export default function SignIn() {
  const { refreshUserData } = useUserProvider()

  useEffect(() => {
    const fetch = async () => {
      const session = await getSession()
      if (session) {
        refreshUserData()
        redirect('/')
      }
    }
    fetch()
  }, [])

  let showToast = false
  let toastMessage = ''

  const image = AUTH_IMAGES[Math.floor(Math.random() * AUTH_IMAGES.length)]

  return (
    <>
      <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none md:grid-cols-2 md:px-0">
        <div
          className="hidden md:flex h-full flex-col justify-end bg-muted p-10 text-white dark:border-r lg:flex"
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="flex" />
          {/* <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                “A common critique of technology is that it removes choice from
                our lives as machines make decisions for us. This is undoubtedly
                true, yet more than offset by the freedom to create our lives
                that flows from the material abundance created by our use of
                machines.”
              </p>
              <footer className="text-sm">Marc Andreeson</footer>
            </blockquote>
          </div> */}
        </div>
        <div className="lg:p-8 flex">
          <div className="mx-auto flex w-full flex-col justify-center md:mt-14 mt-16 space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back to your Oaisys</h1>
              <p className="text-sm text-muted-foreground">Live your cleanest way of life.</p>
            </div>

            <AuthUI showToast={showToast} toastMessage={toastMessage} />
            {/* <UserAuthForm /> */}
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
