import Typography from '@/components/typography'
import { SubscribeModal } from '../subscribe-modal'
import { useState } from 'react'

type BlurredLineItemProps = {
  label: string
  value: string
  labelClassName?: string
}

export default function BlurredLineItem({ label, value, labelClassName }: BlurredLineItemProps) {
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
          onClick={handleOpenPaywall}
          style={{ filter: 'blur(4px)', cursor: 'pointer', minWidth: '3rem' }}
          className="min-w-14"
        >
          {value}
        </span>
      </Typography>
    </div>
  )
}
