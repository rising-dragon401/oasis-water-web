'use client'

import { addUserToAlgolia } from '@/app/actions/algolia'
import { updateUserData } from '@/app/actions/user'
import { ImageUpload } from '@/components/shared/image-upload'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useUserProvider } from '@/providers/UserProvider'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function NameForm() {
  const { userData } = useUserProvider()

  const [newName, setNewName] = useState('')
  const [newBio, setNewBio] = useState('')
  const [newAvatar, setNewAvatar] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userData) {
      setNewName(userData.full_name || '')
      setNewBio(userData.bio || '')
      setNewAvatar(userData.avatar_url || '')
    }
  }, [userData])

  const handleUpdate = async () => {
    try {
      if (!newName || !newBio) {
        toast('Name and bio are required')
        return
      }

      setLoading(true)

      // todo combine these into one call
      const res = await updateUserData('full_name', newName)
      const res2 = await updateUserData('bio', newBio)
      const res3 = await updateUserData('avatar_url', newAvatar)

      if (res && res2) {
        const userObject = {
          id: userData.id,
          name: newName,
          bio: newBio,
          is_oasis_public: userData.is_oasis_public,
          image: newAvatar,
        }

        await addUserToAlgolia(userObject)
        toast('Profile updated')
      } else {
        toast('Error updating name')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast('Error updating profile')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col mt-2">
      <Typography size="base" fontWeight="bold" className="mb-2">
        Profile
      </Typography>
      <div className="mx-auto flex w-full flex-col space-y-2">
        <div className="flex flex-col w-96 space-y-2">
          <ImageUpload
            itemId={userData?.id}
            label="Avatar"
            file={newAvatar}
            setFile={setNewAvatar}
          />
        </div>

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
          </div>
        </div>

        <div className="flex flex-col w-96 space-y-2">
          <Label htmlFor="password" className="text-sm">
            Bio
          </Label>
          <div className="flex flex-row w-full space-x-2">
            <Textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} />
          </div>
        </div>

        <Button type="button" loading={loading} onClick={handleUpdate} className="w-40 mt-2">
          Update
        </Button>
      </div>
    </div>
  )
}
