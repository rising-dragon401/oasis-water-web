'use client'

import Typography from '@/components/typography'
import { SubscribeModal } from '../subscribe-modal'
import { useState } from 'react'
import { useUserProvider } from '@/providers/UserProvider'

type BlurredLineItemProps = {
  label: string
  value: string
  labelClassName?: string
}

export default function BlurredLineItem({ label, value, labelClassName }: BlurredLineItemProps) {
  const { subscription } = useUserProvider()
  const [open, setOpen] = useState(false)

  const handleOpenPaywall = () => {
    setOpen(true)
  }

  return (
    <div>
      <SubscribeModal open={open} setOpen={setOpen} />

      <Typography size="base" fontWeight="normal" className="text-secondary my-0">
        <span className={labelClassName}>{label}:</span>{' '}
        <span
          onClick={!subscription ? handleOpenPaywall : undefined}
          style={{
            filter: !subscription ? 'blur(4px)' : 'none',
            cursor: !subscription ? 'pointer' : 'default',
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
