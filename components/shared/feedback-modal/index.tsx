'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useUserProvider } from '@/providers/UserProvider'
import { submitFeedback } from '@/app/actions/feedback'
import { toast } from 'sonner'

type FeedbackModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function FeedbackModal({ open, setOpen }: FeedbackModalProps) {
  const router = useRouter()
  const { uid } = useUserProvider()

  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmission = async () => {
    setLoading(true)

    const res = await submitFeedback(value, uid)

    if (res.error) {
      toast('Unable to submit feedback at this time. Please try again later.')
    } else {
      toast('Thank you for the feedback!')
      setOpen(false)
      router.back()
    }

    setLoading(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription>Be honest, we can handle it.</DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex flex-col items-start gap-4">
            <Textarea
              id="feedback"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button variant="default" className="px-4" onClick={handleSubmission} loading={loading}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
