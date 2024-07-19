'use client'

import SubpageLayout from '@/components/home-layout'
import SubscribeModal from '@/components/shared/subscribe-modal'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function OasisMemberPage() {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  if (open === false) {
    router.back()
  }

  return (
    <SubpageLayout>
      <div className="flex flex-col w-full px-4 py-14 items-left">
        <SubscribeModal open={open} setOpen={setOpen} />
      </div>
    </SubpageLayout>
  )
}
