'use client'

import { resetPassword } from '@/app/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserProvider } from '@/providers/UserProvider'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

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
          <div className="flex flex-row">
            <Input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
            />
            <Button
              type="button"
              variant="secondary"
              loading={loading}
              onClick={handleResetPassword}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
