import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { SubscribeModal } from '@/components/shared/subscribe-modal'

export default function SubscribeButton({
  label,
  className,
}: {
  label?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <SubscribeModal open={open} setOpen={setOpen} />

      <Button
        variant="default"
        className={`w-full rounded-full ${className}`}
        onClick={() => setOpen(true)}
      >
        <Lock size={16} className="mr-2" />
        {label || 'Upgrade'}
      </Button>
    </>
  )
}
