import { Button } from '@/components/ui/button'
import { useUserProvider } from '@/providers/UserProvider'
import cn from 'classnames'
import { Lock } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { SubscribeModal } from '../subscribe-modal'

type PaywallContentProps = {
  children: React.ReactNode
  className?: string
  hideButton?: boolean
  label: string
}

const PaywallContent: React.FC<PaywallContentProps> = ({
  children,
  className,
  hideButton = false,
  label,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, subscription, userData } = useUserProvider()

  const [open, setOpen] = useState(false)

  const handleBlurClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!subscription) {
      setOpen(true)
    }
  }

  // Dont't want to show scores on non-listing pages
  const isWithinFreeTier =
    userData?.metadata?.items_viewed < 3 &&
    (pathname.includes('/search/item') ||
      pathname.includes('/search/location') ||
      pathname.includes('/search/filter'))

  if (subscription) {
    return <>{children}</>
  }

  return (
    <>
      <SubscribeModal open={open} setOpen={setOpen} />

      <div
        className={cn('relative rounded-lg  hover:cursor-pointer', className)}
        onClick={handleBlurClick}
      >
        {/* Overlay container */}
        {!hideButton && (
          <div className="absolute inset-0 flex justify-center items-center">
            <Button variant="default" onClick={handleBlurClick} className="z-10">
              {label}
              <Lock size={16} className="ml-2" />
            </Button>
          </div>
        )}
        {/* Blurred children content */}
        <div className="filter blur-md overflow-hidden">{children}</div>
      </div>
    </>
  )
}

export default PaywallContent
