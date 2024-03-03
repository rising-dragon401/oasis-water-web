'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import useLocalStorage from '@/lib/hooks/use-local-storage'

export function AuthOverlay({ referral }: { referral?: string }) {
  const router = useRouter()

  const [, setPreviousPath] = useLocalStorage('oasis-previous-path', '/')

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to access</DialogTitle>
          <DialogDescription>Please sign in to access this data.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              router.back()
            }}
          >
            Go back
          </Button>
          <Link href="/auth/signin">
            <Button
              variant="default"
              className="px-4"
              onClick={() => {
                if (referral) {
                  setPreviousPath(referral)
                }
              }}
            >
              Sign in
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
