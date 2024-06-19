'use client'

import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import cn from 'classnames'
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
    <div className="my-0 gap-y-1 flex justify-between w-full">
      <Typography size="sm" fontWeight="normal">
        {label}:
      </Typography>{' '}
      <Typography
        size="sm"
        fontWeight="semibold"
        className={cn(labelClassName, 'min-w-14 text-right')}
      >
        {value}
      </Typography>
    </div>
  )

  return (
    <div>
      {tooltipContent && tooltipLink ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="text-left pl-0 pb-0 mb-0 pt-0 rounded-none w-full">
                {content}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Link href={tooltipLink}>{tooltipContent}</Link>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <>{content}</>
      )}
    </div>
  )
}
