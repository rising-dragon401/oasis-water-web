'use client'

import Typography from '@/components/typography'
import { useModal } from '@/providers/ModalProvider'
import { useUserProvider } from '@/providers/UserProvider'
import { Lock } from 'lucide-react'

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

  const color = 'stroke-blue-800'

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
    } else if (score >= 1 || score === null) {
      return 'Bad'
    } else if (score === 0) {
      return 'Untested'
    } else {
      return 'Untested'
    }
  }

  // Gray out blue circle if no subscription
  // if (!subscription && !showScore) {
  return (
    <>
      <div
        onClick={() => openModal('SubscriptionModal')}
        className="relative flex justify-center items-center cursor-pointer "
        style={{ width: svgSize, height: svgSize }}
      >
        <svg className="progress-ring absolute" width={svgSize} height={svgSize}>
          <circle
            className={`stroke-gray-400 `}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={svgSize / 2} // Center circle
            cy={svgSize / 2} // Center circle
          />
        </svg>
        <div
          className="absolute flex flex-col justify-center items-center"
          style={{ width: '100%', height: '100%' }}
        >
          <Typography size="lg" fontWeight="normal" className="flex gap-2 text-secondary mb-0">
            Score:
          </Typography>
          <Typography size="xl" fontWeight="normal" className="flex gap-2 text-secondary mb-0">
            <button onClick={() => openModal('SubscriptionModal')}>
              <Lock className="text-primary w-4 h-4" />
            </button>
            / 100
          </Typography>
        </div>
      </div>
    </>
  )
  // }

  // return (
  //   <div
  //     className="relative flex justify-center items-center cursor-pointer"
  //     style={{ width: svgSize, height: svgSize }}
  //   >
  //     <svg className="progress-ring absolute" width={svgSize} height={svgSize}>
  //       <circle
  //         className={`${color} opacity-30`}
  //         strokeWidth={strokeWidth}
  //         fill="transparent"
  //         r={radius}
  //         cx={svgSize / 2} // Center circle
  //         cy={svgSize / 2} // Center circle
  //       />
  //       <circle
  //         className={color}
  //         strokeWidth={strokeWidth}
  //         strokeDasharray={`${circumference} ${circumference}`}
  //         strokeDashoffset={offset}
  //         strokeLinecap="round"
  //         fill="transparent"
  //         r={radius}
  //         cx={svgSize / 2} // Center circle
  //         cy={svgSize / 2} // Center circle
  //       />
  //     </svg>
  //     <div
  //       className="absolute flex flex-col justify-center items-center"
  //       style={{ width: '100%', height: '100%' }}
  //     >
  //       {score ? (
  //         <Typography size="xl" fontWeight="normal" className="flex gap-2 mb-0">
  //           {score} / 100
  //         </Typography>
  //       ) : (
  //         <div className="flex flex-row gap-1">
  //           <AlertTriangle className="text-secondary" />
  //           <Typography size="xl" fontWeight="normal" className="flex gap-2 text-secondary mb-0">
  //             / 100
  //           </Typography>
  //         </div>
  //       )}

  //       <span className="text-secondary" style={{ fontSize: fontSize }}>
  //         {grade()}
  //       </span>
  //     </div>
  //   </div>
  // )
}
