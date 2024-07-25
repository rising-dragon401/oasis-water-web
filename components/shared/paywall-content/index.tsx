import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import cn from 'classnames'
import { Lock } from 'lucide-react'
import React from 'react'

type PaywallContentProps = {
  children: React.ReactNode
  className?: string
  hideButton?: boolean
  label: string
  showPaywall?: boolean
}

const PaywallContent: React.FC<PaywallContentProps> = ({
  children,
  className,
  hideButton = false,
  label,
  showPaywall = true,
}) => {
  const { openModal } = useModal()
  const { subscription } = useUserProvider()

  const handleBlurClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!subscription) {
      openModal('SubscriptionModal')
    }
  }

  if (subscription || !showPaywall) {
    return <>{children}</>
  }

  return (
    <>
      <div
        className={cn('relative rounded-lg hover:cursor-pointer', className)}
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
        <div className="filter blur-md overflow-hidden max-h-96">{children}</div>
      </div>
    </>
  )
}

export default PaywallContent
