import { ArrowUpRight } from 'lucide-react'
import { Button } from '../ui/button'

interface OasisButtonProps {
  children: React.ReactNode
  href: string | undefined
}

export const OasisButton = ({ children, href }: OasisButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    className="!rounded-md "
    onClick={() => href && window.open(href, '_blank')}
  >
    {children}
    <ArrowUpRight className="w-4 h-4 ml-1 text-secondary" />
  </Button>
)
