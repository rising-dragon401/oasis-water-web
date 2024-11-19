import dynamic from 'next/dynamic'

const SubscriptionModal = dynamic(() => import('@/components/shared/subscribe-modal'), {
  ssr: false,
})

const AuthWallModal = dynamic(() => import('@/components/shared/auth-wall-modal'), {
  ssr: false,
})

const DonationSuccessModal = dynamic(() => import('@/components/shared/donation-success-modal'), {
  ssr: false,
})

export const kModalMap = { SubscriptionModal, AuthWallModal, DonationSuccessModal }
