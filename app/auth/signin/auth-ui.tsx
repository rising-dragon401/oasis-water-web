'use client'

import { useToast } from '@/components/ui/use-toast'
import useLocalStorage from '@/lib/hooks/use-local-storage'
import { useSupabase } from '@/providers/SupabaseProvider'
import { getURL } from '@/utils/helpers'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

type ViewType = 'sign_in' | 'sign_up'

type Props = {
  showToast: boolean
  toastMessage: string
}

export default function AuthUI({ showToast, toastMessage }: Props) {
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const [redirectUrl, setRedirectUrl] = useLocalStorage('redirectUrl', '')
  const [modalToOpen, setModalToOpen] = useLocalStorage('modalToOpen', '')

  // Suspense boundary for useSearchParams
  const AuthComponentWithSuspense = () => {
    const searchParams = useSearchParams()

    useEffect(() => {
      const redirectUrl = searchParams.get('redirectUrl')
      const modal = searchParams.get('modal')

      if (redirectUrl) setRedirectUrl(redirectUrl)
      if (modal) setModalToOpen(modal)
    }, [searchParams])

    const view = (searchParams.get('view') as ViewType) || 'sign_in'
    const modal = searchParams.get('modal') // Define modal here

    return (
      <Auth
        supabaseClient={supabase}
        providers={['google']}
        redirectTo={`${getURL()}/auth/callback?modalToOpen=${modal || ''}`}
        magicLink={true}
        view={view || 'sign_in'}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#4354A4',
                brandAccent: '#4354A4',
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
