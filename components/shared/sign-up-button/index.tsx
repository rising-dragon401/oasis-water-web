'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SignUpButton({ referral }: { referral?: string }) {
  const pathname = usePathname()

  return (
    <Link href={`/auth/signin?redirectUrl=${pathname}&view=sign_up`}>
      <Button variant="ghost" className="w-full">
        Sign up
      </Button>
    </Link>
  )
}
