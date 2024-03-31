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
}

const PaywallContent: React.FC<PaywallContentProps> = ({ children, className }) => {
  const [open, setOpen] = useState(false)

  const { subscription } = useSubscription()

  if (subscription) {
    return <>{children}</>
  }

  return (
    <>
      <SubscribeModal open={open} setOpen={setOpen} />

      <div className={cn('relative max-h-96 overflow-hidden rounded-lg px-4', className)}>
        <div className="absolute inset-0 bg-black bg-opacity-20 flex justify-center items-center z-10">
          <Button variant="default" onClick={() => setOpen(true)}>
            Unlock All Data <Lock size={16} className="ml-2" />
          </Button>
        </div>
        <div className="filter blur-md">{children}</div>
      </div>
    </>
  )
}

export default PaywallContent
