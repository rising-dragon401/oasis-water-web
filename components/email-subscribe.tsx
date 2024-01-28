'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import Typography from '@/components/typography'

export default function EmailSubscribe() {
  return (
    <div className="flex flex-col max-w-lg justify-start space-x-2">
      <div>
        <Typography size="lg" className="text-secondary" fontWeight="normal">
          Join the longevity waitlist
        </Typography>
        <div className="max-w-xs">
          <Typography size="xs" className="text-secondary" fontWeight="normal">
            We are working on creating the world&apos;s cleanest water. Be the first to get access.
          </Typography>
        </div>
      </div>
      <div className="w-full !ml-0 mt-2">
        <Button
          type="submit"
          className="w-48"
          onClick={() => {
            window.open('https://3efs5kbf7k4.typeform.com/to/AIFR8ZFm', '_blank')
          }}
        >
          Join waitlist
        </Button>
      </div>
    </div>
  )
}
