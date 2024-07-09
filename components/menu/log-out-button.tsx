'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import useLocalStorage from '@/lib/hooks/use-local-storage'
import { useUserProvider } from '@/providers/UserProvider'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()
  const { logout } = useUserProvider()

  const [, setChecked] = useLocalStorage('oasis-subscribe-to-newsletter', false)

  const handleSignOut = async () => {
    await logout()

    router.refresh()
    router.push('/')
    setChecked(false)
  }
  return (
    <DropdownMenuItem onClick={handleSignOut} className="hover:cursor-pointer">
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </DropdownMenuItem>
  )
}
