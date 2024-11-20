import { cn } from '@/lib/utils'

export const Logo = ({ className = '', ...props }) => (
  <svg
    width="56"
    height="70"
    viewBox="0 0 71.58 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('w-10 h-10 pt-2', className)}
    {...props}
  >
    <g>
      <circle
        fillRule="evenodd"
        clipRule="evenodd"
        fill="none"
        stroke="#0d00f3"
        strokeWidth="2"
        cx="35.79"
        cy="29.64"
        r="28.14"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="none"
        stroke="#0d00f3"
        strokeWidth="2"
        d="m.5,32.17c0-1.44,8.05,32.24,35.29,32.24,29.04,0,35.29-33.55,35.29-32.2,0,12.45-6.24,40.65-35.14,40.65S.5,47.27.5,32.17Z"
      />
      <circle
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#0d00f3"
        cx="35.79"
        cy="95.37"
        r="16.87"
      />
    </g>
  </svg>
)

export default Logo
