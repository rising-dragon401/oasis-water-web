import React from 'react'
import Typography from '@/components/typography'
import JoinWaitListButton from '@/components/shared/JoinWaitlistButton'

export default async function EmailSubscribe() {
  return (
    <div className="flex flex-col max-w-lg justify-start space-x-2">
      <div>
        <Typography size="lg" className="text-secondary" fontWeight="normal">
          Get clean water delivered to your door
        </Typography>
        <div className="max-w-xs">
          <Typography size="xs" className="text-secondary" fontWeight="normal">
            We are creating the world&apos;s cleanest water delivery service and health store. Be
            the first to get access.
          </Typography>
        </div>
      </div>
      <div className="w-full !ml-0 mt-2">
        <JoinWaitListButton />
      </div>
    </div>
  )
}
