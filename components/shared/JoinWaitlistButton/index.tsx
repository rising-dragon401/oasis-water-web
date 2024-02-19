'use client'

import { Button } from '@/components/ui/button'

export default function JoinWaitListButton() {
  return (
    <Button
      type="submit"
      className="w-48"
      onClick={() => {
        window.open('https://3efs5kbf7k4.typeform.com/to/AIFR8ZFm', '_blank')
      }}
    >
      Join waitlist
    </Button>
  )
}
