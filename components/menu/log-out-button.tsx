'use client'

import { useSupabase } from '@/providers/SupabaseProvider'
import { useRouter } from 'next/navigation'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { useUserProvider } from '@/providers/UserProvider'
import useLocalStorage from '@/lib/hooks/use-local-storage'

export default function SignOutButton() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const { refreshUserData } = useUserProvider()

  const [checked, setChecked] = useLocalStorage('oasis-subscribe-to-newsletter', false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()

    router.refresh()
    router.push('/')
    setChecked(false)
    refreshUserData()
  }
  return (
    <DropdownMenuItem onClick={handleSignOut} className="hover:cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </DropdownMenuItem>
  )
}
