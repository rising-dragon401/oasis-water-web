'use client'

import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import Link from 'next/link'

type BlurredLineItemProps = {
  label: string
  value: string
  labelClassName?: string
  tooltipContent?: string
  tooltipLink?: string
}

export default function BlurredLineItem({
  label,
  value,
  labelClassName,
  tooltipContent,
  tooltipLink,
}: BlurredLineItemProps) {
  const { subscription } = useUserProvider()
  const { openModal } = useModal()

  const handleOpenPaywall = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!subscription) {
      openModal('SubscriptionModal')
    }
  }

  const showPaywall = !subscription
  // && user?.metadata?.items_viewed < 3

  const content = (
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
  )

  return (
    <div>
      {tooltipContent && tooltipLink ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="text-left pl-0 pb-0 mb-0 pt-0 rounded-none">
                {content}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Link href={tooltipLink}>{tooltipContent}</Link>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Typography size="base" fontWeight="normal" className="text-secondary my-0">
          <span className={labelClassName}>{label}:</span>{' '}
          <span
            onClick={showPaywall ? handleOpenPaywall : undefined}
            style={{
              minWidth: '3rem',
            }}
            className="min-w-14"
          >
            {value}
          </span>
        </Typography>
      )}
    </div>
  )
}
