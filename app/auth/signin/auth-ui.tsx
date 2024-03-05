'use client'

import { useState } from 'react'
import { useSupabase } from '@/providers/SupabaseProvider'
import { useToast } from '@/components/ui/use-toast'
import { getURL } from '@/utils/helpers'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import useLocalStorage from '@/lib/hooks/use-local-storage'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type Props = {
  showToast: boolean
  toastMessage: string
}

export default function AuthUI({ showToast, toastMessage }: Props) {
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const [checked, setChecked] = useLocalStorage('oasis-subscribe-to-newsletter', false)

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

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={checked}
                onCheckedChange={() => setChecked(!checked)}
              />
              <label
                htmlFor="newsletter"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Subscribe to our newsletter
              </label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Receive emails about the latest science/research.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
