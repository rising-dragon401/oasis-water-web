'use client'

import { Button } from '@/components/ui/button'
import { kGooglePlay } from '@/lib/constants/socials'
import { TbBrandGooglePlay } from 'react-icons/tb'

export default function GooglePlayButton() {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        window.open(kGooglePlay, '_blank')
      }}
    >
      <TbBrandGooglePlay className="w-4 h-4 mr-2" />
      Android app
    </Button>
  )
}
