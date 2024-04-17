import dynamic from 'next/dynamic'

const SubscriptionModal = dynamic(() => import('@/components/shared/subscribe-modal'), {
  ssr: false,
})

export const kModalMap = { SubscriptionModal }
