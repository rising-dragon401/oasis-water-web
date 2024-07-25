'use client'

import Typography from '@/components/typography'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { AlertTriangle, Lock } from 'lucide-react'

type Props = {
  score: number | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showScore?: boolean
}

export default function Score({ score, size, showScore = false }: Props) {
  const { subscription } = useUserProvider()
  const { openModal } = useModal()

  const radius =
    size === 'xl' ? 80 : size === 'lg' ? 70 : size === 'md' ? 60 : size === 'sm' ? 50 : 40
  const strokeWidth = 6
  const svgSize = 2 * (radius + strokeWidth) // Adjust SVG size to accommodate stroke
  const validScore = score ?? 0 // Default to 0 if score is null
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (validScore / 100) * circumference

  const fontSize =
    size === 'xl' ? 18 : size === 'lg' ? 16 : size === 'md' ? 12 : size === 'sm' ? 8 : 10

  const bgColor =
    validScore >= 70 ? 'bg-green-200' : validScore >= 40 ? 'bg-yellow-200' : 'bg-red-200'

  const grade = () => {
    if (score === null) {
      return 'WARNING'
    }

    if (score >= 90) {
      return 'Excellent'
    } else if (score >= 70) {
      return 'Good'
    } else if (score >= 50) {
      return 'Pretty good'
    } else if (score >= 35) {
      return 'Poor'
    } else if (score >= 0 && score !== null) {
      return 'Bad'
    } else {
      return 'WARNING'
    }
  }

  // Gray out blue circle if no subscription
  if (!subscription && !showScore) {
    return (
      <>
        {/* <div className="flex flex-row gap-2 w-56 h-4 rounded-md bg-red-500"></div> */}
        <button onClick={() => openModal('SubscriptionModal')}>
          <div
            className="flex flex-col justify-center items-center bg-muted border rounded-lg p-2"
            style={{ width: '100%', height: '100%' }}
          >
            {/* <Typography size="lg" fontWeight="normal" className="flex gap-2 text-secondary mb-0">
          Score:
        </Typography> */}
            <div className="flex flex-row justify-center items-center gap-2">
              <Lock className="text-primary w-4 h-4" />
              <Typography size="xl" fontWeight="normal" className="flex gap-2 text-secondary">
                / 100
              </Typography>
            </div>
          </div>
        </button>
      </>
    )
  }

  return (
    <div
      className={`flex flex-col justify-center items-center ${bgColor} rounded-lg p-2 px-2`}
      style={{ width: '100%', height: '100%' }}
    >
      {score ? (
        <Typography size="xl" fontWeight="semibold" className="flex gap-2 text-secondary mb-0">
          {score} / 100
        </Typography>
      ) : (
        <div className="flex flex-row gap-1">
          <AlertTriangle className="text-red-500" />
          <Typography size="xl" fontWeight="normal" className="flex gap-2 text-secondary mb-0">
            / 100
          </Typography>
        </div>
      )}

      <span className="text-secondary py-0" style={{ fontSize: fontSize }}>
        {grade()}
      </span>
    </div>
  )
}
