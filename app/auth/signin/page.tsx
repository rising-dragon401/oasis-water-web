'use client'

import { getCurrentUserData } from '@/app/actions/user'
import { AUTH_IMAGES } from '@/lib/constants/images'
import { useUserProvider } from '@/providers/UserProvider'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AuthUI from './auth-ui'

export default function SignIn() {
  const { refreshUserData } = useUserProvider()
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      refreshUserData()

      const userData = await getCurrentUserData()

      if (userData) {
        router.push('/')
      } else {
        console.log('No user found')
      }
    }
    fetch()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let showToast = false
  let toastMessage = ''

  const image = AUTH_IMAGES[Math.floor(Math.random() * AUTH_IMAGES.length)]

  return (
    <>
      <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none md:grid-cols-2 md:px-0">
        <div className="hidden md:flex h-full flex-col justify-center items-center p-10 dark:border-r lg:flex">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center w-80">
              <Image src={image} alt="Oasis" width={600} height={800} />
            </div>
            {/* <blockquote className="space-y-2">
              <p className="text-lg">
                “A common critique of technology is that it removes choice from our lives as
                machines make decisions for us. This is undoubtedly true, yet more than offset by
                the freedom to create our lives that flows from the material abundance created by
                our use of machines.”
              </p>
              <footer className="text-sm">Marc Andreeson</footer>
            </blockquote> */}
          </div>
        </div>

        <div className="lg:p-8 flex">
          <div className="mx-auto flex w-full flex-col justify-center md:mt-14 mt-16 space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Know your water</h1>
              <p className="text-sm text-muted-foreground">
                Learn what&apos;s in your drinking and find the healthiest options for you.
              </p>
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
