'use client'

import { Button } from '@/components/ui/button'
import React from 'react'
import Typography from '@/components/typography'

export default function EmailSubscribe() {
  return (
    <div className="flex flex-col max-w-lg justify-start space-x-2">
      <div>
        <Typography size="lg" className="text-secondary" fontWeight="normal">
          Upgrade your water source
        </Typography>
        <div className="max-w-xs">
          <Typography size="xs" className="text-secondary" fontWeight="normal">
            {`We are working on the creating the cleanest source of water filled with the world's
            healthiest and most natural ingredients.`}
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
          Join Waitlist
        </Button>
      </div>
    </div>
  )
}
