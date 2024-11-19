'use client'

import HomeNavbar from '@/components/menu/home-navbar'
import MobileNavbar from '@/components/menu/mobile-navbar'
import Footer from '@/components/shared/footer'
import Logo from '@/components/shared/logo'
import Typography from '@/components/typography'
import { ModalName, useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { PropsWithChildren, Suspense, useEffect } from 'react'
import { AccountMenu } from '../menu/account-menu'
import DownloadAppButton from '../shared/download-app-button'

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
  const { user } = useUserProvider()
  const pathname = usePathname()

  const { openModal, isOpen } = useModal()

  return (
    <div className="min-h-[100vh] flex justify-center">
      <div className="xl:max-w-6xl lg:max-w-4xl md:max-w-4xl w-full flex flex-col items-center">
        <Suspense fallback={<div />}>
          <SearchParamsComponent openModal={openModal} isOpen={isOpen} />
        </Suspense>
        <div className="md:flex hidden w-full justify-center items-center">
          <div className="flex-1 flex justify-start w-full">
            <Link href="/" className="flex flex-row items-center hover:cursor-pointer">
              <Logo />

              <Typography size="2xl" fontWeight="normal" className="!text-accent">
                Oasis
              </Typography>
            </Link>
          </div>

          <div className="flex-1 flex justify-center w-full">
            <HomeNavbar />
          </div>

          <div className="flex-1 flex justify-end items-center gap-2">
            {/* <BasicSearch showSearch={false} size="small" /> */}

            {user ? (
              <div className="flex flex-row gap-4 items-center ml-4">
                <DownloadAppButton />
                <AccountMenu />
              </div>
            ) : (
              <div className="flex flex-row gap-4 items-center ml-4">
                <Link href={`/auth/signin?redirectUrl=${pathname}`} className="text-sm ">
                  Login
                </Link>
                <DownloadAppButton />
                {/* <SignUpButton />  */}
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden flex flex-row w-full max-w-sm justify-between items-center pt-1 gap-4">
          <Link
            href="/"
            className="flex  flex-row items-center justify-center hover:cursor-pointer"
          >
            <Logo />

            <Typography size="2xl" fontWeight="normal" className="!text-accent">
              Oasis
            </Typography>
          </Link>

          <div className="flex flex-row items-center justify-end w-full gap-4">
            {!user && (
              <Link href={`/auth/signin?redirectUrl=${pathname}`} className="text-sm ">
                Login
              </Link>
            )}
            <MobileNavbar />
            {/* <BasicSearch showSearch={false} size="medium" /> */}
          </div>
        </div>

        <div className="py-3 min-h-[70vh] flex justify-center w-full xl:max-w-6xl lg:max-w-4xl md:max-w-4xl sm:max-w-xl max-w-sm">
          {children}
        </div>

        <Footer />
      </div>
    </div>
  )
}
