'use client'

import Link from 'next/link'
import { AUTH_IMAGES } from '@/lib/constants/images'
import { getCurrentUserData } from '@/app/actions/user'
import { redirect } from 'next/navigation'
import { useUserProvider } from '@/providers/UserProvider'
import { useEffect } from 'react'
import useLocalStorage from '@/lib/hooks/use-local-storage'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Typography from '@/components/typography'
import { toast } from 'sonner'
import { resetPassword } from '@/app/actions/user'

export default function ResetPassowrd() {
  const { refreshUserData } = useUserProvider()

  const [newPassword, setNewPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [previousPath, setPreviousPath] = useLocalStorage('oasis-previous-path', '/')

  useEffect(() => {
    const fetch = async () => {
      refreshUserData()

      const userData = await getCurrentUserData()

      if (userData?.email) {
        setEmail(userData.email)
      } else {
        console.log('No user found')
      }
    }
    fetch()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleResetPassword = async () => {
    if (!email) {
      toast('No email found')
      return
    }

    setLoading(true)

    const response = await resetPassword(email, newPassword)

    if (response) {
      toast('Password updated successfully')
      redirect('/')
    } else {
      toast('Error updating password')
    }

    setLoading(false)
  }

  let showToast = false
  let toastMessage = ''

  const image = AUTH_IMAGES[Math.floor(Math.random() * AUTH_IMAGES.length)]

  return (
    <div className="flex relative h-full flex-col items-center justify-center ">
      <Typography size="xl" fontWeight="bold" className="text-center">
        Reset your Oasis Password
      </Typography>
      <Typography size="base" fontWeight="normal" className="text-center">
        Email: {email}
      </Typography>
      <div className="mx-auto flex w-full flex-col justify-center md:mt-14 mt-16 space-y-6 sm:w-[350px]">
        <div className="flex flex-col w-full max-w-sm items-center space-y-2">
          <Input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full"
          />
          <Button type="button" loading={loading} onClick={handleResetPassword} className="w-full">
            Update Password
          </Button>
        </div>
      </div>
    </div>
  )
}
