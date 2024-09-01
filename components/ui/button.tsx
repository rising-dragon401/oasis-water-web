import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center !overflow-hidden flex flex-row justify-center rounded-lg text-sm !font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 !outline-none outline-opacity-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-background dark:text-secondary hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:text-accent hover:border-accent',
        secondary: 'dark:bg-secondary  dark:text-secondary hover:bg-secondary/80',
        ghost: 'hover:opacity-80',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 rounded-lg px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, loading, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {props.children}
        {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
