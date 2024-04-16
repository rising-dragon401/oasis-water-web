'use client'

import Typography from '@/components/typography'
import { useUserProvider } from '@/providers/UserProvider'
import { useState } from 'react'
import { SubscribeModal } from '../subscribe-modal'

type BlurredLineItemProps = {
  label: string
  value: string
  labelClassName?: string
}

export default function BlurredLineItem({ label, value, labelClassName }: BlurredLineItemProps) {
  const { subscription } = useUserProvider()

  const [open, setOpen] = useState(false)

  const handleOpenPaywall = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!subscription) {
      setOpen(true)
    }
  }

  const showPaywall = !subscription
  // && user?.metadata?.items_viewed < 3

  return (
    <div>
      <SubscribeModal open={open} setOpen={setOpen} />

      <Typography size="base" fontWeight="normal" className="text-secondary my-0">
        <span className={labelClassName}>{label}:</span>{' '}
        <span
          onClick={showPaywall ? handleOpenPaywall : undefined}
          style={{
            // filter: showPaywall ? 'blur(4px)' : 'none',
            // cursor: showPaywall ? 'pointer' : 'default',
            minWidth: '3rem',
          }}
          className="min-w-14"
        >
          {value}
        </span>
      </Typography>
    </div>
  )
}
