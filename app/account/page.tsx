'use client'

import SubpageLayout from '@/components/home-layout'
import Typography from '@/components/typography'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUserProvider } from '@/providers/UserProvider'
import NameForm from './components/name-form'
import { OasisSwitch } from './components/oasis-switch'
import PasswordResetForm from './components/password-reset-form'

export default function AccountSettings() {
  const { provider, userData } = useUserProvider()

  return (
    <SubpageLayout>
      <div className="flex flex-col w-full justify-start my-4 px-4">
        <Typography size="xl" fontWeight="bold" className="mb-4">
          Settings
        </Typography>
        <Typography size="base" fontWeight="normal" className="mb-2">
          You are logged in as <span className="font-bold">{userData?.email}</span> using {provider}
        </Typography>

        <div className="flex flex-col space-y-6">
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
