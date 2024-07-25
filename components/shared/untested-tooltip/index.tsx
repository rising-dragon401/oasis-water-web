import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Flag } from 'lucide-react'

export function UntestedTooltip({ description }: { description: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="max-w-72 text-left bg-secondary rounded-md px-2 py-0 h-8 text-background"
          >
            <Flag className="w-4 h-4 mr-2" />
            Not tested
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
