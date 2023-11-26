import React from 'react'

type Props = {
  score: number
}

export default function Score({ score }: Props) {
  const radius = 94 // Increased radius
  const strokeWidth = 6
  const svgSize = 2 * (radius + strokeWidth) // Adjust SVG size to accommodate stroke
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const grade = () => {
    if (score >= 90) {
      return 'Excellent'
    } else if (score >= 80) {
      return 'Good'
    } else if (score >= 70) {
      return 'Poor'
    } else if (score >= 60) {
      return 'Bad'
    } else {
      return 'Very Bad'
    }
  }

  return (
    <svg className="progress-ring" width={svgSize} height={svgSize}>
      <circle
        className="stroke-secondary-muted"
        stroke="#c5caf5"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={svgSize / 2} // Center circle
        cy={svgSize / 2} // Center circle
      />
      <circle
        className="stroke-primary"
        stroke="#6b46c1"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        fill="transparent"
        r={radius}
        cx={svgSize / 2} // Center circle
        cy={svgSize / 2} // Center circle
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        stroke="text-secondary"
        strokeWidth="2px"
        dy=".3em"
        fontSize="20" // Add this line
      >
        {score} / 100
      </text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        stroke="text-secondary"
        strokeWidth="2px"
        dy="1.5em"
      >
        {grade()}
      </text>
    </svg>
  )
}
