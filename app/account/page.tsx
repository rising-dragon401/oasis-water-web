'use client'

import { addUserToAlgolia } from '@/app/actions/algolia'
import { updateUserData, updateUsername } from '@/app/actions/user'
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
  const { provider, userData, subscription, fetchUserData, logout } = useUserProvider()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [newName, setNewName] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newBio, setNewBio] = useState('')
  const [newAvatar, setNewAvatar] = useState('')

  useEffect(() => {
    if (userData) {
      setNewName(userData.full_name || '')
      setNewUsername(userData.username || '')
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

      const username = await updateUsername(userData.id, newUsername)
      if (!username) {
        toast('Username already taken')
        setLoading(false)
        return
      }

      // todo combine these into one call
      const res = await updateUserData('full_name', newName)
      const res2 = await updateUserData('bio', newBio)
      const res3 = await updateUserData('avatar_url', newAvatar)

      fetchUserData(userData.id)

      const userObject = {
        id: userData.id,
        name: newName,
        username: newUsername,
        bio: newBio,
        is_oasis_public: userData.is_oasis_public,
        image: newAvatar,
      }

      await addUserToAlgolia(userObject)
      toast('Profile updated')
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

          <div className="flex flex-col items-center mt-2">
            <Typography size="lg" fontWeight="normal" className="mb">
              {userData.full_name}
            </Typography>
            <Typography size="base" fontWeight="normal" className="text-secondary">
              @{userData.username}
            </Typography>

            <Typography size="xs" fontWeight="normal" className="my-2">
              Logged in as <span className="font-bold">{userData?.email}</span> using {provider}
            </Typography>
          </div>

          <Typography
            size="base"
            fontWeight="normal"
            className="my-2 mt-1 px-4 py-1 bg-muted rounded-lg"
          >
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

          <div className="flex flex-col space-y-6 mt-8 w-full">
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
                  </div>
                </div>

                <div className="flex flex-col w-96 space-y-2">
                  <Label htmlFor="username" className="text-sm">
                    Username
                  </Label>
                  <div className="flex flex-row w-full space-x-2">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full"
                    />
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

              <div className="mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-40"
                  loading={loading}
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              </div>
            </div>

            <PasswordResetForm />

            {/* <div className="mt-6">
            <OasisSwitch userData={userData} />
          </div> */}
          </div>

          <div className="md:hidden flex mt-14">
            <Button variant="ghost" onClick={handleSignOut}>
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
