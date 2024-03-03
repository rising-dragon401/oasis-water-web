'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function GoBackButton() {
  const router = useRouter()

  return (
    <Button variant="outline" className="w-48" onClick={() => router.back()}>
      Go back
    </Button>
  )
}
