import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function UntestedTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="max-w-72 text-left px-0">
            {' '}
            ⚠️ NO REPORTS LOCATED – PROCEED WITH CAUTION.
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-sm">
            This item has not been tested in the lab yet, so we cannot verify what contaminants are
            present. This usally means the company has not publicized or refuses to share their lab
            reports so we cannot recommend or provide a score for this item. We are working to
            independently test everything ourselves soon.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
