'use client'

import { addUserToAlgolia } from '@/app/actions/algolia'
import { updateUserData } from '@/app/actions/user'
import SubpageLayout from '@/components/home-layout'
import { ImageUpload } from '@/components/shared/image-upload'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserProvider } from '@/providers/UserProvider'
import { postData } from '@/utils/helpers'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import PasswordResetForm from './components/password-reset-form'

export default function AccountSettings() {
  const { provider, userData, subscription, logout } = useUserProvider()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [newName, setNewName] = useState('')
  const [newBio, setNewBio] = useState('')
  const [newAvatar, setNewAvatar] = useState('')

  useEffect(() => {
    if (userData) {
      setNewName(userData.full_name || '')
      setNewBio(userData.bio || '')
      setNewAvatar(userData.avatar_url || '')
    }
  }, [userData])

  const handleManageSubscription = async () => {
    setLoading(true)

    try {
      const { url } = await postData({
        url: '/api/create-portal-link',
      })

      if (url) {
        router.push(url)
      } else {
        throw new Error('Error')
      }
    } catch (error) {
      toast.error('Error opening subscription portal')
      console.log('error', error)
    }

    setLoading(false)
  }

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

  const handleSignOut = async () => {
    await logout()

    router.refresh()
    router.push('/')
  }

  return (
    <SubpageLayout>
      {userData ? (
        <div className="flex flex-col w-full items-center my-4 px-4 mb-14">
          <ImageUpload itemId={userData?.id} label="" file={newAvatar} setFile={setNewAvatar} />

          {userData.full_name && (
            <Typography size="base" fontWeight="normal" className="mb-2 mt-4">
              {userData.full_name}
            </Typography>
          )}

          <Typography size="base" fontWeight="normal" className="mb-2 mt-4">
            Logged in as <span className="font-bold">{userData?.email}</span> using {provider}
          </Typography>

          <Typography size="lg" fontWeight="bold" className="my-2 px-4 py-2 bg-muted rounded-lg">
            Plan: {subscription ? 'Oasis Member' : 'Free'}
          </Typography>

          {/* @ts-ignore */}
          {subscription && subscription?.metadata?.provider !== 'revenue_cat' && (
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              className="w-60"
              loading={loading}
            >
              Manage Subscription
            </Button>
          )}

          <div className="flex flex-col space-y-6 mt-8">
            <div className="flex flex-col mt-2">
              <Typography size="base" fontWeight="bold" className="mb-2">
                Edit Profile
              </Typography>
              <div className="mx-auto flex w-full flex-col space-y-2">
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
                    <Button
                      type="button"
                      variant="secondary"
                      loading={loading}
                      onClick={handleUpdate}
                    >
                      Update
                    </Button>
                  </div>
                </div>

                {/* <div className="flex flex-col w-96 space-y-2">
                  <Label htmlFor="password" className="text-sm">
                    Bio
                  </Label>
                  <div className="flex flex-row w-full space-x-2">
                    <Textarea value={newBio} onChange={(e) => setNewBio(e.target.value)} />
                  </div>
                </div> */}
              </div>
            </div>

            <PasswordResetForm />

            {/* <div className="mt-6">
            <OasisSwitch userData={userData} />
          </div> */}
          </div>

          <div className="mt-14">
            <Button variant="outline" onClick={handleSignOut}>
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center my-4 px-4 mb-14 gap-y-4">
          <Image
            src="https://connect.live-oasis.com/storage/v1/object/public/website/images/sad%20water%20illustration.png?t=2024-07-20T23%3A13%3A15.703Z"
            alt="Oasis Logo"
            width={100}
            height={100}
          />

          <Typography size="lg" fontWeight="normal">
            You are not logged in.
          </Typography>
          <Button variant="outline" onClick={() => router.push('/auth/signin')}>
            Login / Sign Up
          </Button>
        </div>
      )}
    </SubpageLayout>
  )
}
