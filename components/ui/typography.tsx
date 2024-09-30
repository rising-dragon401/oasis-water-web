import { cn } from '@/lib/utils'
import * as React from 'react'

const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h1
        className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

H1.displayName = 'H1'

const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        className={cn(
          'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

H2.displayName = 'H2'

const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

H3.displayName = 'H3'

const H4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h4
        className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

H4.displayName = 'H4'

const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p className={cn('text-base', className)} ref={ref} {...props} />
  }
)

P.displayName = 'P'

const BlockQuote = React.forwardRef<
  HTMLQuoteElement,
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 border-border pl-6 italic', className)}
      ref={ref}
      {...props}
    />
  )
})

BlockQuote.displayName = 'BlockQuote'

const Code = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <code
        className={cn(
          'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Code.displayName = 'Code'

const Lead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p className={cn('text-xl text-muted-foreground', className)} ref={ref} {...props} />
  }
)

Lead.displayName = 'Lead'

const Large = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn('text-lg font-semibold', className)} ref={ref} {...props} />
  }
)

Large.displayName = 'Large'

const Small = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <small className={cn('text-sm font-medium leading-none', className)} ref={ref} {...props} />
    )
  }
)

Small.displayName = 'Small'

const Muted = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p className={cn('text-sm text-muted-foreground', className)} ref={ref} {...props} />
  }
)

Muted.displayName = 'Muted'

export { BlockQuote, Code, H1, H2, H3, H4, Large, Lead, Muted, P, Small }
