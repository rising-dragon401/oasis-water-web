import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SubscribeModal } from '@/components/shared/subscribe-modal'

export default function SubscribeButton({ label }: { label?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <SubscribeModal open={open} setOpen={setOpen} />

      <Button variant="default" className="w-full" onClick={() => setOpen(true)}>
        <Plus size={16} className="mr-2" />
        {label || 'Upgrade'}
      </Button>
    </>
  )
}
