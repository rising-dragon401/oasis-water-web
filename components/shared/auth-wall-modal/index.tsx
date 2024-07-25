'use client'

import Logo from '@/components/shared/logo'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { useUserProvider } from '@/providers/UserProvider'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

type AuthWallModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AuthWallModal({ open, setOpen }: AuthWallModalProps) {
  const router = useRouter()
  const pathName = usePathname()
  const { user } = useUserProvider()

  useEffect(() => {
    if (user) {
      setOpen(false)
    }
  }, [user])

  useEffect(() => {
    if (pathName && !pathName.includes('/search')) {
      setOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName])

  const redirectToSignIn = () => {
    router.push('/auth/signin')
    setOpen(false)
  }

  const redirectToSignUp = () => {
    router.push('/auth/signin?view=sign_up')
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      // onOpenChange={() => {
      //   if (pathName && !pathName.includes('/search')) {
      //     setOpen(!open)
      //   }
      // }}
    >
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-[90vh] ">
        <DialogHeader>
          <div className="flex flex-col justify-center items-center">
            <Logo className="w-20 h-20" />
            <Typography size="2xl" fontWeight="bold" className="text-center mt-2">
              Login to access this feature
            </Typography>
          </div>

          <div className="flex flex-col">
            <Typography size="base" fontWeight="normal" className="text-center text-secondary">
              Oasis works best with an account
            </Typography>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-4 w-full mt-2">
          <Button variant="outline" onClick={redirectToSignUp}>
            Sign up
          </Button>
          <Button variant="default" onClick={redirectToSignIn}>
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
