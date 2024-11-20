'use client'

import BasicSearch from '@/components/basic-search'
import HomeNavbar from '@/components/menu/home-navbar'
import Footer from '@/components/shared/footer'
import Logo from '@/components/shared/logo'
import { ModalName, useModal } from '@/providers/ModalProvider'
import { kModalMap } from '@/providers/ModalProvider/modals'
import { useUserProvider } from '@/providers/UserProvider'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { PropsWithChildren, Suspense, useEffect } from 'react'
import { AccountMenu } from '../menu/account-menu'
import MobileNavbar from '../menu/mobile-navbar'
import DownloadAppButton from '../shared/download-app-button'
type Props = {
  openModal: (modalName: ModalName) => void
  isOpen: boolean
}

const SearchParamsComponent = ({ openModal, isOpen }: Props) => {
  const searchParams = useSearchParams()
  const modalToOpen = searchParams.get('modalToOpen')

  const removeModalParam = () => {
    const url = new URL(window.location.href)
    if (url.searchParams.has('modalToOpen')) {
      url.searchParams.delete('modalToOpen') // Remove the param from the URL
      window.history.replaceState({}, document.title, url.toString())
    }
  }

  useEffect(() => {
    if (
      modalToOpen === null ||
      modalToOpen === '' ||
      !Object.keys(kModalMap).includes(modalToOpen)
    ) {
      removeModalParam()
      return
    }

    if (!isOpen) {
      openModal(modalToOpen as ModalName)
    }
  }, [modalToOpen, isOpen]) //

  return null
}

export default function SubpageLayout({ children }: PropsWithChildren) {
  const { user } = useUserProvider()
  const pathname = usePathname()

  const { openModal, isOpen } = useModal()

  return (
    <div className="min-h-[100vh] flex justify-center">
      <div className="w-full flex flex-col items-center px-4">
        <Suspense fallback={<div />}>
          <SearchParamsComponent openModal={openModal} isOpen={isOpen} />
        </Suspense>
        <div className="md:flex hidden w-full justify-center items-center py-2">
          <div className="flex-1 flex justify-start w-full gap-4">
            <HomeNavbar />
          </div>

          <div className="flex-1 justify-center items-center w-full">
            <BasicSearch showSearch={true} size="small" />
          </div>

          <div className="flex-1 flex justify-end items-center gap-2">
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
            className="flex h-6 flex-row items-center justify-center hover:cursor-pointer"
          >
            <Logo className="h-full pt-0" />
            {/* <P className="!text-accent">Oasis</P> */}
          </Link>

          <div className="flex flex-row items-center justify-end w-full gap-2 mx-2">
            <BasicSearch showSearch={false} size="small" />

            <MobileNavbar />
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
