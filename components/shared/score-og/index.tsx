type Props = {
  score: number
  isFull?: boolean
}

export default function ScorOG({ score, isFull }: Props) {
  const radius = 115
  const strokeWidth = 10
  const svgSize = 2 * (radius + strokeWidth) // Adjust SVG size to accommodate stroke
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const fontSize = 42

  return (
    <svg
      className="progress-ring"
      width={svgSize}
      height={svgSize}
      style={{ fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}
    >
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
        stroke="#0d00f3"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx={svgSize / 2} // Center circle
        cy={svgSize / 2} // Center circle
      />
      {score} / 100
    </svg>
  )
}
