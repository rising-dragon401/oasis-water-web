'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { P } from '@/components/ui/typography'
import Image from 'next/image'

type DonationSuccessModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const donationSuccessImage =
  'https://connect.live-oasis.com/storage/v1/object/public/website/images/elements/hand-above-water.jpeg?t=2024-11-18T22%3A26%3A39.923Z'

export default function DonationSuccessModal({ open, setOpen }: DonationSuccessModalProps) {
  const handleClose = () => {
    setOpen(false)
    const url = new URL(window.location.href)
    if (url.searchParams.has('modalToOpen')) {
      url.searchParams.delete('modalToOpen') // Remove the param from the URL
      window.history.replaceState({}, document.title, url.toString())
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] overflow-y-scroll max-h-[90vh] ">
        <DialogHeader>
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center justify-center rounded-xl h-40 w-full overflow-hidden">
              <Image
                src={donationSuccessImage}
                alt="logo"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <P className="text-center mt-2 text-xl">Thank you for your donation!</P>
          </div>

          <div className="flex flex-col mt-2">
            <P className="text-center mt-2">
              It directly supports transparent water quality testing and trusted health ratings
              everyone!
            </P>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-4 w-full mt-2">
          <Button variant="default" onClick={handleClose} className="w-36">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
