'use client'

import { useToast } from '@/components/ui/use-toast'
import { useSupabase } from '@/providers/SupabaseProvider'
import { getURL } from '@/utils/helpers'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

type Props = {
  showToast: boolean
  toastMessage: string
}

export default function AuthUI({ showToast, toastMessage }: Props) {
  const { toast } = useToast()
  const { supabase } = useSupabase()

  // Suspense boundary for useSearchParams
  const AuthComponentWithSuspense = () => {
    const searchParams = useSearchParams()
    const redirectUrl = searchParams.get('redirectUrl')
    console.log('redirectUrl: ', redirectUrl)

    return (
      <Auth
        supabaseClient={supabase}
        providers={['google']}
        redirectTo={`${getURL()}/auth/callback?redirectUrl=${redirectUrl || '/'}`}
        magicLink={true}
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
    )
  }

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
      <Suspense fallback={<div>Loading...</div>}>
        <AuthComponentWithSuspense />
      </Suspense>
    </div>
  )
}
