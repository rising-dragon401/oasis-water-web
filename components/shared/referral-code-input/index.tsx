import { getUserByUsername, updateUserData } from '@/app/actions/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, SendHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const ReferralCodeInput = () => {
  const [referralCode, setReferralCode] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  useEffect(() => {
    const existingReferralCode = localStorage.getItem('referralCode')
    if (existingReferralCode) {
      setReferralCode(existingReferralCode)
    }
  }, [])

  const handleSubmit = async () => {
    // check if referral code (username) is valid
    // also get referring user id
    const user = await getUserByUsername(referralCode)
    if (!user) {
      toast.error('Invalid referral code')
      return
    }

    const referredByUserId = user.id

    // update user data with referred_by id
    const success = await updateUserData('referred_by', referredByUserId)
    if (success) {
      setIsSubmitted(true)
      toast.success('Referral code set!')
    } else {
      toast.error('Failed to set referral code')
    }
  }

  return (
    <div>
      {!isOpen ? (
        <Button onClick={() => setIsOpen(true)} variant="outline" className="w-full rounded-full">
          Referred by someone?
        </Button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <Input
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter referral code (username)"
                className="w-full rounded-full pr-12"
                disabled={isSubmitted}
              />
              <Button
                onClick={handleSubmit}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-0 w-8 h-8 bg-black rounded-full flex items-center justify-center"
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <SendHorizontal className="w-4 h-4 text-white" />
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
