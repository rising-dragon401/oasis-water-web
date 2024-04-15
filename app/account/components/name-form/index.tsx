'use client'

import { updateUserData } from '@/app/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserProvider } from '@/providers/UserProvider'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function NameForm() {
  const { userData } = useUserProvider()

  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userData && userData.full_name) {
      setNewName(userData.full_name)
    }
  }, [userData])

  const handleChangeName = async () => {
    if (!newName) {
      toast('Name is required')
      return
    }

    setLoading(true)

    const res = await updateUserData('full_name', newName)

    if (res) {
      toast('Name updated successfully')
      redirect('/')
    } else {
      toast('Error updating name')
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col mt-2">
      <div className="mx-auto flex w-full flex-col space-y-6 ">
        <div className="flex flex-col w-96 space-y-2">
          <Label htmlFor="password" className="text-sm">
            Name
          </Label>
          <div className="flex flex-row w-full space-x-2">
            <Input
              type="name"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full"
            />
            <Button type="button" loading={loading} onClick={handleChangeName} className="w-40">
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
