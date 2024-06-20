import { useModal } from '@/providers/ModalProvider'
import { Lock } from 'lucide-react'

export default function LockUpgradeBtn() {
  const { openModal } = useModal()

  return (
    <button onClick={() => openModal('SubscriptionModal')}>
      <Lock size={16} />
    </button>
  )
}
