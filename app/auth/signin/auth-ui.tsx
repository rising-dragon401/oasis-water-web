'use client'

import { useSupabase } from '@/app/supabase-provider'
import { useToast } from '@/components/ui/use-toast'
import { getURL } from '@/utils/helpers'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect } from 'react'

type Props = {
  showToast: boolean
  toastMessage: string
}

export default function AuthUI({ showToast, toastMessage }: Props) {
  const { toast } = useToast()
  const { supabase } = useSupabase()

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        toast({
          title: toastMessage,
        })
      }, 1000)
    }
  }, [showToast, toastMessage, toast])

  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={['google']}
        redirectTo={`${getURL()}/auth/callback`}
        magicLink={false}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#232c74',
                brandAccent: '#232c74',
              },
            },
          },
        }}
        theme="light"
      />
    </div>
  )
}
