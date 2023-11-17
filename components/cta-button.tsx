import Link from 'next/link'
import { Button } from '@/components/ui/button'
import cn from 'classnames'

export default function CTAButton() {
  return (
    <Link
      href="/"
      className={cn(
        'bg-primary text-primary-foreground dark:text-secondary hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
      )}
    >
      <Button>Search water</Button>
    </Link>
  )
}
