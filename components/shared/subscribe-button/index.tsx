import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/ModalProvider'
import { Lock } from 'lucide-react'

export default function SubscribeButton({
  label,
  className,
}: {
  label?: string
  className?: string
}) {
  const { openModal } = useModal()

  return (
    <>
      <Button
        variant="outline"
        className={`w-full rounded-full ${className} `}
        onClick={() => openModal('SubscriptionModal')}
      >
        <Lock size={16} className="mr-2" />
        {label || 'Upgrade'}
      </Button>
    </>
  )
}
