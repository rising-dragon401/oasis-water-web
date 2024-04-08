'use client'

import { redirect } from 'next/navigation'
import { useUserProvider } from '@/providers/UserProvider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { resetPassword } from '@/app/actions/user'
import { Label } from '@/components/ui/label'

export default function ResetPasswordForm() {
  const { provider, userData } = useUserProvider()

  const [newPassword, setNewPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!userData.email) {
      toast('No email found')
      return
    }

    setLoading(true)

    const response = await resetPassword(userData.email, newPassword)

    if (response) {
      toast('Password updated successfully')
      redirect('/')
    } else {
      toast('Error updating password')
    }

    setLoading(false)
  }

  if (provider !== 'email') {
    return
  }

  return (
    <div className="flex flex-col mt-2">
      <div className="mx-auto flex w-full flex-col space-y-6 ">
        <div className="flex flex-col w-full max-w-sm  space-y-2">
          <Label htmlFor="password" className="text-sm">
            New Password
          </Label>
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
