'use client'

import { addUserToAlgolia } from '@/app/actions/algolia'
import { updateUserData, updateUsername } from '@/app/actions/user'
import SubpageLayout from '@/components/home-layout'
import AccountSkeleton from '@/components/shared/account-skeleton'
import { ImageUpload } from '@/components/shared/image-upload'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useModal } from '@/providers/ModalProvider'
import { useSupabase } from '@/providers/SupabaseProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { postData } from '@/utils/helpers'
import { BadgeCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getUserReferralStats } from '../actions/admin'
import PasswordResetForm from './components/password-reset-form'

export default function AccountSettings() {
  const { provider, userData, subscription, subProvider, fetchUserData, logout } = useUserProvider()
  const { session } = useSupabase()
  const router = useRouter()
  const { openModal } = useModal()

  const [loading, setLoading] = useState(false)
  const [loadingSubscription, setLoadingSubscription] = useState(false)

  const [newName, setNewName] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newBio, setNewBio] = useState('')
  const [newAvatar, setNewAvatar] = useState('')
  const [referralStats, setReferralStats] = useState({
    total_earnings: 0,
    total_paid_referrals: 0,
    total_trials: 0,
  })
  const [socials, setSocials] = useState({
    instagram: '',
    youtube: '',
    twitter: '',
    tiktok: '',
  })
  const [loadingSocials, setLoadingSocials] = useState(false)

  useEffect(() => {
    if (userData) {
      setNewName(userData.full_name || '')
      setNewUsername(userData.username || '')
      setNewBio(userData.bio || '')
      setNewAvatar(userData.avatar_url || '')
      setSocials(userData.socials || {})
      getReferralStats()
    }
  }, [userData])

  const getReferralStats = async () => {
    const stats = await getUserReferralStats(userData.id)
    setReferralStats(stats)
  }

  console.log('subProvider', subProvider)

  const handleManageSubscription = async () => {
    setLoadingSubscription(true)

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

    setLoadingSubscription(false)
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

  const handleAvatarSuccess = async (url: string) => {
    const res = await updateUserData('avatar_url', url, userData.id)

    if (res) {
      setNewAvatar(url)
      toast('Avatar updated')
    } else {
      toast('Error updating avatar')
    }
  }

  const handleUpgrade = async () => {
    openModal('SubscriptionModal')
  }

  const handleSocialsUpdate = async () => {
    try {
      setLoadingSocials(true)

      const res = await updateUserData(
        'socials',
        {
          instagram: socials.instagram,
          youtube: socials.youtube,
          twitter: socials.twitter,
          tiktok: socials.tiktok,
        },
        userData.id
      )

      console.log('res', res)

      if (res) {
        toast('Socials updated')
        fetchUserData(userData.id)
      } else {
        toast('Error updating socials')
      }
    } catch (error) {
      console.error('Error updating socials:', error)
      toast('Error updating socials')
    }

    setLoadingSocials(false)
  }

  if (session && !userData) {
    return (
      <SubpageLayout>
        <AccountSkeleton />
      </SubpageLayout>
    )
  }

  return (
    <SubpageLayout>
      {userData ? (
        <div className="flex flex-col w-full items-center my-4 px-4">
          <ImageUpload
            itemId={userData?.id}
            label=""
            file={newAvatar}
            setFile={setNewAvatar}
            height="20"
            onSuccess={handleAvatarSuccess}
            showIcon
          />

          <div className="flex flex-col items-center mt-2">
            <Typography size="2xl" fontWeight="medium" className="pb-0">
              {userData.full_name}
            </Typography>
            <Typography size="base" fontWeight="normal" className="text-secondary">
              @{userData.username}
            </Typography>
          </div>

          <div className="flex flex-col space-y-2 w-full max-w-2xl mt-6">
            <Typography size="xs" fontWeight="normal" className="text-muted-foreground">
              Membership
            </Typography>
            <div className="flex flex-col justify-between w-full bg-muted border border-border p-4 rounded-xl">
              <div className="flex md:flex-row flex-col  justify-between w-full">
                <Typography size="base" fontWeight="normal" className="py-1 bg-muted rounded-lg">
                  {subscription ? (
                    <div className="flex flex-row items-center">
                      <BadgeCheck className="w-4 h-4 mr-1" />
                      Oasis Member
                    </div>
                  ) : (
                    'Free account'
                  )}
                </Typography>

                {/* @ts-ignore */}
                {subscription && subProvider !== 'revenue_cat' && (
                  <Button
                    variant="outline"
                    onClick={handleManageSubscription}
                    className="w-60"
                    loading={loadingSubscription}
                  >
                    Manage
                  </Button>
                )}

                {!subscription && (
                  <Button variant="default" onClick={handleUpgrade} className="w-40">
                    Upgrade
                  </Button>
                )}
              </div>

              {subProvider === 'revenue_cat' && (
                <Typography size="xs" fontWeight="normal" className="text-muted-foreground">
                  Manage your membership in your phone settings
                </Typography>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-2 w-full max-w-2xl mt-6">
            <Typography size="xs" fontWeight="normal" className="text-muted-foreground">
              Edit Profile
            </Typography>
            <div className="flex flex-col space-y-6 w-full bg-muted border border-border p-4 rounded-xl">
              <div className="flex flex-col mt-2">
                <div className="mx-auto flex w-full flex-col space-y-4">
                  <div className="flex flex-col max-w-96 space-y-2">
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

                  <div className="flex flex-col max-w-96 space-y-2">
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

                  <div className="flex flex-col max-w-96 space-y-2 ">
                    <Label htmlFor="password" className="text-sm">
                      Bio
                    </Label>
                    <div className="flex flex-row w-full space-x-2">
                      <Textarea
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        className="bg-transparent border w-full border-slate-300"
                      />
                    </div>
                  </div>
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

              {/* <div className="mt-6">
            <OasisSwitch userData={userData} />
          </div> */}
            </div>
          </div>
          {/* 
          <div className="flex flex-col space-y-2 w-full max-w-2xl mt-6">
            <Typography size="xs" fontWeight="normal" className="text-muted-foreground">
              Socials
            </Typography>
            <div className="flex flex-col space-y-6 w-full bg-muted border border-border p-4 rounded-xl">
              <div className="flex flex-col mt-2">
                <div className="mx-auto flex w-full flex-col space-y-4">
                  <div className="flex flex-col max-w-96 space-y-2">
                    <Label htmlFor="instagram" className="text-sm">
                      Instagram
                    </Label>
                    <div className="flex flex-row w-full space-x-2">
                      <Input
                        type="text"
                        placeholder="https://www.instagram.com/oasiswaterapp/"
                        value={socials.instagram}
                        onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col max-w-96 space-y-2">
                    <Label htmlFor="youtube" className="text-sm">
                      YouTube
                    </Label>
                    <div className="flex flex-row w-full space-x-2">
                      <Input
                        type="text"
                        placeholder="https://www.youtube.com/@oasiswaterapp"
                        value={socials.youtube}
                        onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col max-w-96 space-y-2">
                    <Label htmlFor="twitter" className="text-sm">
                      X (Twitter)
                    </Label>
                    <div className="flex flex-row w-full space-x-2">
                      <Input
                        type="text"
                        placeholder="https://x.com/oasiswaterapp"
                        value={socials.twitter}
                        onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col max-w-96 space-y-2">
                    <Label htmlFor="tiktok" className="text-sm">
                      TikTok
                    </Label>
                    <div className="flex flex-row w-full space-x-2">
                      <Input
                        type="text"
                        placeholder="https://www.tiktok.com/@oasiswaterapp"
                        value={socials.tiktok}
                        onChange={(e) => setSocials({ ...socials, tiktok: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-40"
                    loading={loadingSocials}
                    onClick={handleSocialsUpdate}
                  >
                    Update Socials
                  </Button>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="flex flex-col space-y-2 w-full max-w-2xl mt-6">
            <Typography size="xs" fontWeight="normal" className="text-muted-foreground">
              Referrals and Earnings
            </Typography>
            <div className="flex flex-col justify-between w-full bg-muted border border-border p-4 rounded-xl">
              <div className="flex md:flex-row flex-col justify-between gap-2">
                <Typography size="xs" fontWeight="normal" className="py-1 bg-muted rounded-lg">
                  Earn 20% each time someone becomes an Oasis member using your username as the
                  referral code.
                </Typography>

                <div
                  className="flex bg-card w-full max-w-96 gap-2 items-center justify-center rounded-lg cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(userData.username)
                    toast.success('Copied referral code!')
                  }}
                >
                  <Typography size="xs" fontWeight="normal" className="py-1 rounded-lg">
                    {userData.username}
                  </Typography>
                  <Copy className="w-3 h-3" />
                </div>
              </div>

              <div className="flex flex-row justify-between mt-4 gap-4">
                <div className="w-40 h-20 rounded-lg flex flex-col items-center justify-center border">
                  <Typography size="base" fontWeight="normal">
                    ${referralStats.total_earnings}
                  </Typography>
                  <Typography size="xs" fontWeight="normal" className="py-1 bg-muted rounded-lg">
                    Earnings
                  </Typography>
                </div>
                <div className="w-40 h-20 rounded-lg flex flex-col items-center justify-center border">
                  <Typography size="lg" fontWeight="normal">
                    {referralStats.total_paid_referrals}
                  </Typography>
                  <Typography size="xs" fontWeight="normal" className="py-1 bg-muted rounded-lg">
                    Paid referrals
                  </Typography>
                </div>
                <div className="w-40 h-20 rounded-lg flex flex-col items-center justify-center border">
                  <Typography size="lg" fontWeight="normal">
                    {referralStats.total_trials}
                  </Typography>
                  <Typography size="xs" fontWeight="normal" className="py-1 bg-muted rounded-lg">
                    Trial referrals
                  </Typography>
                </div>
              </div>
            </div>
          </div> */}

          <div className="flex flex-col space-y-2 w-full max-w-2xl mt-6">
            <Typography size="xs" fontWeight="normal" className="text-muted-foreground">
              Account
            </Typography>
            <div className="flex flex-col items-start space-y-4 w-full bg-muted border border-border p-4 rounded-xl">
              <Typography size="xs" fontWeight="normal" className="">
                Logged in as <span className="font-bold">{userData?.email}</span>
              </Typography>

              <PasswordResetForm />

              <Button variant="outline" onClick={handleSignOut}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full justify-center items-center my-4 px-4 mb-14 gap-y-4">
          <Typography size="lg" fontWeight="normal">
            No account found.
          </Typography>
          <Button variant="outline" onClick={() => router.push('/auth/signin')}>
            Login / Sign Up
          </Button>
        </div>
      )}
    </SubpageLayout>
  )
}
