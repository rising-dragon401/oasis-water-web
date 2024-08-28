'use client'

import { getIngredients } from '@/app/actions/ingredients'
import BasicSearch from '@/components/basic-search'
import HomeNavbar from '@/components/menu/home-navbar'
import Footer from '@/components/shared/footer'
import Logo from '@/components/shared/logo'
import Typography from '@/components/typography'
import { ModalName, useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { PropsWithChildren, Suspense, useEffect } from 'react'
import useSWR from 'swr'
import { AccountMenu } from '../menu/account-menu'
import BottomNavbar from '../menu/bottom-bar'
import SignUpButton from '../shared/sign-up-button'

type Props = {
  openModal: (modalName: ModalName) => void
  isOpen: boolean
}

const SearchParamsComponent = ({ openModal, isOpen }: Props) => {
  const searchParams = useSearchParams()
  const modalToOpen = searchParams.get('modalToOpen')

  useEffect(() => {
    if (modalToOpen) {
      console.log('isOpen', isOpen)
      if (!isOpen) {
        openModal(modalToOpen as ModalName)
      }
    }
  }, []) // Include all dependencies

  return null // This component doesn't render anything itself
}

export default function SubpageLayout({ children }: PropsWithChildren) {
  const { user, userData, subscription } = useUserProvider()
  const pathname = usePathname()
  const { openModal, isOpen } = useModal()

  const itemsViewed = userData?.metadata?.items_viewed

  // load for future use
  const { data: allIngredients } = useSWR('ingredients', getIngredients)

  return (
    <div className="min-h-[100vh] flex justify-center">
      <div className="xl:max-w-6xl lg:max-w-5xl md:max-w-4xl sm:max-w-xl max-w-sm w-full">
        <Suspense fallback={<div />}>
          <SearchParamsComponent openModal={openModal} isOpen={isOpen} />
        </Suspense>

        <div className="py-2 mt-2 text-center bg-muted border-input border rounded-lg">
          <Typography size="sm" fontWeight="normal">
            {!subscription ? (
              <>Start a free trial on our iOS app 🎉 {` `}</>
            ) : (
              <>iOS app is live 🎉 {` `}</>
            )}

            <a
              href="https://apps.apple.com/us/app/oasis-water-health-ratings/id6499478532"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-bold"
            >
              Download Now
            </a>
          </Typography>
        </div>

        <div className="md:flex hidden flex-w w-full justify-between items-center">
          <HomeNavbar />

          <div className="flex justify-end items-center gap-2">
            <BasicSearch showSearch={false} size="small" />

            {user ? (
              <AccountMenu />
            ) : (
              <div className="flex flex-row gap-4 items-center ml-4">
                <Link href={`/auth/signin?redirectUrl=${pathname}`} className="text-sm ">
                  Login
                </Link>
                <SignUpButton />
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden flex flex-row justify-between items-center pt-1 gap-4">
          <Link
            href="/"
            className="flex  flex-row items-center justify-center hover:cursor-pointer"
          >
            <Logo />

            <Typography size="2xl" fontWeight="normal" className="!text-accent">
              Oasis
            </Typography>
          </Link>

          <div className="flex flex-row items-center justify-end w-full">
            <BasicSearch showSearch={false} size="medium" />
          </div>
        </div>

        <div className="py-3 min-h-[70vh] flex justify-center w-full">{children}</div>

        <Footer />

        {/* <div className="fixed bottom-6 right-6 hidden md:flex">
          <AISearchDialog size="small" variant="button" />
        </div> */}

        <div className="md:hidden">
          <BottomNavbar />
        </div>
      </div>
    </div>
  )
}
