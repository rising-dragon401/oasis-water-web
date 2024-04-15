'use client'

import PaywallContent from '@/components/shared/paywall-content'
import Typography from '@/components/typography'

type Props = {
  score: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function Score({ score, size }: Props) {
  const radius =
    size === 'xl' ? 80 : size === 'lg' ? 70 : size === 'md' ? 60 : size === 'sm' ? 50 : 40
  const strokeWidth = 6
  const svgSize = 2 * (radius + strokeWidth) // Adjust SVG size to accommodate stroke
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const fontSize =
    size === 'xl' ? 24 : size === 'lg' ? 20 : size === 'md' ? 16 : size === 'sm' ? 14 : 12
  const color =
    score >= 70 ? 'stroke-green-500' : score >= 40 ? 'stroke-yellow-500' : 'stroke-red-500'

  const grade = () => {
    if (score >= 90) {
      return 'Excellent'
    } else if (score >= 70) {
      return 'Good'
    } else if (score >= 50) {
      return 'Alright'
    } else if (score >= 35) {
      return 'Poor'
    } else {
      return 'Bad'
    }
  }

  return (
    // <Popover>
    //   <PopoverTrigger className="flex justify-center flex-col items-center">
    <div
      className="relative flex justify-center items-center"
      style={{ width: svgSize, height: svgSize }}
    >
      <svg className="progress-ring absolute" width={svgSize} height={svgSize}>
        <circle
          className={`${color} opacity-30`}
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={svgSize / 2} // Center circle
          cy={svgSize / 2} // Center circle
        />
        <circle
          className={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
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
        <Typography size="xl" fontWeight="normal" className="flex gap-2 text-secondary mb-0">
          <PaywallContent label="" hideButton={true}>
            {score}
          </PaywallContent>
          / 100
        </Typography>

        <span className="text-secondary" style={{ fontSize: fontSize }}>
          {grade()}
        </span>
      </div>
    </div>

    // <svg className="progress-ring" width={svgSize} height={svgSize}>
    //     <circle
    //       className="stroke-secondary-muted"
    //       stroke="#c5caf5"
    //       strokeWidth={strokeWidth}
    //       fill="transparent"
    //       r={radius}
    //       cx={svgSize / 2} // Center circle
    //       cy={svgSize / 2} // Center circle
    //     />
    //     <circle
    //       className="stroke-primary"
    //       stroke="#6b46c1"
    //       strokeWidth={strokeWidth}
    //       strokeDasharray={`${circumference} ${circumference}`}
    //       strokeDashoffset={offset}
    //       strokeLinecap="round"
    //       fill="transparent"
    //       r={radius}
    //       cx={svgSize / 2} // Center circle
    //       cy={svgSize / 2} // Center circle
    //     />
    //     <text
    //       x="50%"
    //       y="50%"
    //       textAnchor="middle"
    //       stroke="text-secondary"
    //       strokeWidth="2px"
    //       dy="-0.1em"
    //       fontSize={fontSize}
    //     >
    //       {score} / 100
    //     </text>
    //     <text
    //       x="50%"
    //       y="50%"
    //       textAnchor="middle"
    //       stroke="text-secondary"
    //       strokeWidth="2px"
    //       fontSize={fontSize}
    //       dy="1.0em"
    //     >
    //       {grade()}
    //     </text>
    //   </svg>
    //     <Typography size="sm" fontWeight="normal" className="text-center">
    //       About this score
    //     </Typography>
    //   </PopoverTrigger>

    //   <PopoverContent>
    //     This score was generated using the Oasis algorithim.
    //     <Link href="/blog/how_we_score_water" className="text-secondary-foreground ml-2 italic">
    //       Learn more
    //     </Link>
    //   </PopoverContent>
    // </Popover>
  )
}
