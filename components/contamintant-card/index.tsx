import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Typography from '@/components/typography'
import { SourcesDropdown } from './sources-dropdown'
import { Button } from '@/components/ui/button'
import { ContaminantFiltersDropdown } from './contaminant-filters-dropdown'

type Props = {
  data: any
}

export default function ContaminantCard({ data }: Props) {
  const exceedingHealthGuideline = data.metadata?.health_guideline
    ? Math.floor(data?.amount / data.metadata?.health_guideline) || false
    : false

  const exceedingLegalLimit = data.metadata?.legal_limit
    ? Math.floor(data?.amount / data.metadata?.legal_limit) || false
    : false

  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex flex-col w-full justify-between relative">
          <div className="w-full flex flex-row justify-between items-center">
            <div>{data?.metadata.name}</div>
            {exceedingHealthGuideline && exceedingHealthGuideline > 0 && (
              <div className=" rounded-full bg-primary w-full max-w-[8rem] gap-2 h-8 flex flex-row justify-center items-center">
                <Typography size="xl" fontWeight="normal" className="!text-background">
                  {exceedingHealthGuideline}x
                </Typography>
                <Typography
                  size="xs"
                  fontWeight="normal"
                  className="!text-secondary-foreground flex-wrap"
                >
                  Guidelines
                </Typography>
              </div>
            )}
            {!exceedingHealthGuideline && exceedingLegalLimit && exceedingLegalLimit > 0 && (
              <div className=" rounded-full bg-primary w-full max-w-[8rem] gap-2 h-8 flex flex-row justify-center items-center">
                <Typography size="xl" fontWeight="normal" className="!text-background">
                  {exceedingLegalLimit}x
                </Typography>
                <Typography
                  size="xs"
                  fontWeight="normal"
                  className="!text-secondary-foreground flex-wrap"
                >
                  Limit
                </Typography>
              </div>
            )}
          </div>
        </CardTitle>
        <CardDescription>{data?.metadata.description}</CardDescription>
        <CardContent className="pl-0">
          <Typography size="base" fontWeight="normal" className="text-secondary">
            Risks: {data?.metadata.risks}
          </Typography>
          {data.amount && (
            <Typography size="base" fontWeight="normal" className="text-secondary mt-2">
              • Amount: {data?.amount} {data?.metadata.unit} {data?.metadata.measure}
            </Typography>
          )}
        </CardContent>
        <CardFooter className="flex flex-row  w-full justify-between p-0">
          <ContaminantFiltersDropdown contaminantId={data?.metadata.id || ''} />

          {data?.metadata.sources ? (
            <SourcesDropdown sources={data?.metadata.sources || []} />
          ) : (
            <div></div>
          )}
        </CardFooter>
      </CardHeader>
    </Card>
  )
}
