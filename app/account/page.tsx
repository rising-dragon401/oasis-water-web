'use client'

import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { useUserProvider } from '@/providers/UserProvider'
import { postData } from '@/utils/helpers'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import NameForm from './components/name-form'
import { OasisSwitch } from './components/oasis-switch'
import PasswordResetForm from './components/password-reset-form'

export default function AccountSettings() {
  const { provider, userData, subscription } = useUserProvider()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

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

  return (
    <SubpageLayout>
      <div className="flex flex-col w-full justify-start my-4 px-4 mb-14">
        <Typography size="xl" fontWeight="bold" className="mb-4">
          Settings
        </Typography>
        <Typography size="base" fontWeight="normal" className="mb-2">
          You are logged in as <span className="font-bold">{userData?.email}</span> using {provider}
        </Typography>

        {subscription && (
          <Button
            variant="outline"
            onClick={handleManageSubscription}
            className="w-60"
            loading={loading}
          >
            Manage Subscription
          </Button>
        )}

        <Typography size="xs" fontWeight="normal" className="mt-0 text-muted-foreground max-w-sm">
          (Heads up, if you subscribed using a mobile device, you might need to manage your
          subscription there.)
        </Typography>

        <div className="flex flex-col space-y-6 mt-10">
          <PasswordResetForm />

          <NameForm />

          <div className="mt-6">
            <OasisSwitch userData={userData} />
          </div>
        </div>

        {/* <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="py-2">
            You are logged in as <span className="font-bold">{userData?.email}</span> using{' '}
            {provider}.
            <PasswordResetForm />
          </TabsContent>
          {/* <TabsContent value="password">Change your password here.</TabsContent> */}
        {/* </Tabs> */}
      </div>
    </SubpageLayout>
  )
}
