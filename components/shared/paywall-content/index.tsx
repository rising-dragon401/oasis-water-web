import React from 'react'
import { Button } from '@/components/ui/button'
import cn from 'classnames'
import { SubscribeModal } from '../subscribe-modal'
import { useState } from 'react'
import { Lock } from 'lucide-react'
import useSubscription from '@/lib/hooks/use-subscription'

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
  const [open, setOpen] = useState(false)

  const { subscription } = useSubscription()

  if (subscription) {
    return <>{children}</>
  }

  // Function to stop click event propagation
  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <>
      <SubscribeModal open={open} setOpen={setOpen} />

      <div className={cn('relative rounded-lg', className)} onClick={handleOverlayClick}>
        {/* Overlay container */}
        {!hideButton && (
          <div className="absolute max-h-72  inset-0 flex justify-center items-center">
            <Button variant="default" onClick={() => setOpen(true)} className="z-10">
              {label}
              <Lock size={16} className="ml-2" />
            </Button>
          </div>
        )}
        {/* Blurred children content */}
        <div className="filter blur-lg">{children}</div>
      </div>
    </>
  )
}

export default PaywallContent
