'use client'

import React, { useState, useEffect } from 'react'
import Typography from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addToEmailList } from '@/app/actions/user'
import { useUserProvider } from '@/providers/UserProvider'
import { toast } from 'sonner'

export default function EmailSubscribe() {
  const { userData, emailSubscriptions } = useUserProvider()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (email: string) => {
    setLoading(true)
    const res = await addToEmailList(userData.id || null, email, 'newsletter', true)

    if (res) {
      toast('Subscribed to newsletter!')
      setEmail('')
    } else {
      toast('Unable to subscribe')
    }
    setLoading(false)
  }

  const showNesletter = emailSubscriptions?.find((sub) => sub.list !== 'newsletter')

  if (!showNesletter) {
    return null
  }

  return (
    <div className="flex flex-col max-w-lg justify-start">
      <div>
        <Typography size="lg" className="text-secondary" fontWeight="normal">
          Subscribe to updates
        </Typography>
        <div className="max-w-xs">
          <Typography size="xs" className="text-secondary" fontWeight="normal">
            Get the latest science backed health research delivered to your inbox.
          </Typography>
        </div>
      </div>
      <div className="flex w-full max-w-sm items-center mt-2 gap-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="button"
          onClick={() => handleSubscribe(email)}
          loading={loading}
          disabled={loading}
        >
          Subscribe
        </Button>
      </div>
    </div>
  )
}
