import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function UntestedTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="max-w-72 text-left px-0 rounded-none">
            ⚠️ NO REPORTS LOCATED – PROCEED WITH CAUTION.
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-sm">
            This item has not been tested in the lab yet, so we cannot verify what contaminants are
            present. Unverified items are docked 60 points by default to account for unknown
            contaminants. We are in the process of independently testing everything ourselves.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
