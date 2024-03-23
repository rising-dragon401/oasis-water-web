import { Button } from '../ui/button'

interface OasisButtonProps {
  children: React.ReactNode
  href: string | undefined
}

export const OasisButton = ({ children, href }: OasisButtonProps) => (
  <Button variant="outline" onClick={() => href && window.open(href, '_blank')}>
    {children}
  </Button>
)
