'use client'

import { Button } from '@/components/ui/button'
import { kAppStore } from '@/lib/constants/socials'
import { TbBrandApple } from 'react-icons/tb'

export default function AppleButton() {
  return (
    <Button
      variant="default"
      className="w-full"
      onClick={() => {
        window.open(kAppStore, '_blank')
      }}
    >
      <TbBrandApple className="w-4 h-4 mr-2" />
      iOS app
    </Button>
  )
}
