import Typography from '@/components/typography'
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
  buttonVariant?: 'default' | 'secondary' | 'ghost'
  label: string
  showPaywall?: boolean
  items?: string[]
}

const PaywallContent: React.FC<PaywallContentProps> = ({
  children,
  className,
  hideButton = false,
  buttonVariant = 'default',
  label,
  showPaywall = true,
  items,
}) => {
  const { openModal } = useModal()
  const { subscription } = useUserProvider()

  const handleBlurClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!subscription) {
      openModal('SubscriptionModal')
    }
  }

  if (!showPaywall) {
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
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-y-6">
            <Button variant={buttonVariant} onClick={handleBlurClick} className="z-10">
              {label}
              <Lock size={16} className="ml-2" />
            </Button>

            {items && (
              <div className="flex flex-col gap-4 text-center z-50 mt-">
                {items.map((item, index) => (
                  <Typography
                    key={index}
                    size="base"
                    fontWeight="normal"
                    className="text-primary text-center"
                  >
                    {item}
                  </Typography>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Blurred children content */}
        <div className="filter blur-md overflow-hidden max-h-96">{children}</div>
      </div>
    </>
  )
}

export default PaywallContent
