import React from 'react'

type Props = {
  score: number
}

export default function Score({ score }: Props) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <svg className="progress-ring" width="100" height="100">
      <circle
        className="stroke-secondary-muted"
        stroke="#c5caf5"
        strokeWidth="4"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
      />

      <circle
        className="stroke-primary"
        stroke="#6b46c1"
        strokeWidth="4"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
      />

      <text x="50%" y="50%" textAnchor="middle" stroke="text-secondary" strokeWidth="2px" dy=".3em">
        {score} / 100
      </text>
    </svg>
  )
}
