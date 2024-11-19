'use client'

import Typography from '@/components/typography'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import cn from 'classnames'
import { Lock } from 'lucide-react'

type BlurredLineItemProps = {
  label: string
  value: string
  labelClassName?: string
  tooltipContent?: string
  tooltipLink?: string
  isPaywalled?: boolean
  score?: 'good' | 'bad' | 'neutral'
}

export default function BlurredLineItem({
  label,
  value,
  labelClassName,
  tooltipContent,
  tooltipLink,
  isPaywalled = false,
  score = 'neutral',
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

  const colorMark =
    score === 'good' ? 'bg-green-200' : score === 'bad' ? 'bg-red-200' : 'bg-gray-200'

  const content = (
    <div className="my-0 gap-y-1 flex justify-between w-full">
      <Typography size="base" fontWeight="normal" className="flex-wrap max-w-30">
        {label}
      </Typography>{' '}
      <div className="flex flex-row gap-2 items-center min-w-18">
        {showPaywall && isPaywalled ? (
          <div onClick={handleOpenPaywall} className="cursor-pointer">
            <Lock className="w-4 h-4" />
          </div>
        ) : (
          <Typography
            size="base"
            fontWeight="semibold"
            className={cn(labelClassName, 'min-w-14 text-right')}
          >
            {value}
          </Typography>
        )}

        <div className={`min-w-8 h-4 rounded-full ${colorMark}`} />
      </div>
    </div>
  )

  return (
    <div>
      {/* {tooltipContent && tooltipLink ? (
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
      )} */}
      <>{content}</>
    </div>
  )
}
