'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import useLocalStorage from '@/lib/hooks/use-local-storage'

export default function SignUpButton({ referral }: { referral?: string }) {
  const [previousPath, setPreviousPath] = useLocalStorage('oasis-previous-path', '/')

  useEffect(() => {
    if (referral) setPreviousPath(referral)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referral])

  return (
    <Link href="/auth/signin">
      <Button variant="default">Create account</Button>
    </Link>
  )
}
