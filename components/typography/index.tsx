import React from 'react'

type SizeType = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
type WeightType =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black'

interface TypographyProps {
  size?: SizeType
  fontWeight: WeightType
  children?: React.ReactNode
  className?: string
}

const sizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
}

const weights = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
}

const Typography: React.FC<TypographyProps> = ({ size, fontWeight, children, className = '' }) => {
  const textSize = size ? sizes[size] : ''
  const textWeight = weights[fontWeight] || weights.normal
  return <p className={`${textSize} ${textWeight} text-primary ${className}`}>{children}</p>
}

export default Typography
