'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useToast } from '@/components/ui/use-toast'
import Typography from '@/components/typography'
import { useRouter } from 'next/navigation'

export default function EmailSubscribe() {
  const toast = useToast()
  const router = useRouter()

  const [email, setEmail] = React.useState('')

  return (
    <div className="flex flex-col max-w-lg justify-start  space-x-2">
      <div>
        <Typography size="lg" className="text-secondary" fontWeight="normal">
          Join waitlist
        </Typography>
        <div className="max-w-xs">
          <Typography size="xs" className="text-secondary" fontWeight="normal">
            We have some exciting things coming to transform healthy, clean living and could use
            your help.
          </Typography>
        </div>
      </div>
      <div className="w-48 !ml-0 mt-2">
        <Button
          type="submit"
          className="w-24"
          onClick={() => {
            window.open('https://3efs5kbf7k4.typeform.com/to/AIFR8ZFm', '_blank')
          }}
        >
          Join
        </Button>
      </div>
    </div>
  )
}
