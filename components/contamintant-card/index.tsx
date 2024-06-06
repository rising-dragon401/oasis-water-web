import Typography from '@/components/typography'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { ArticlesDropdown } from './articles-dropdown'

type Props = {
  data: any
}

export default function ContaminantCard({ data }: Props) {
  const exceedingPercentage = data?.exceedingLimit
    ? `${Number((data.exceedingLimit * 100).toFixed(0)).toLocaleString()}%`
    : undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col w-full justify-between relative">
          <div className="w-full flex flex-row justify-between items-top">
            <div className="max-w-48 break-words flex-wrap">{data?.name}</div>
            {data.exceedingLimit !== undefined &&
              data.exceedingLimit !== null &&
              data.exceedingLimit > 0 && (
                <div className="rounded-md bg-red-500 w-full !max-w-16	gap-2 h-6 flex flex-row justify-center items-center">
                  <Typography size="base" fontWeight="normal" className="!text-background">
                    {exceedingPercentage}
                  </Typography>
                </div>
              )}
          </div>
        </CardTitle>
        <CardDescription className="text-xs">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="max-h-12 overflow-hidden text-left">
                {data?.description}
              </TooltipTrigger>
              <TooltipContent className="max-w-72">
                <p>{data?.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardDescription>
        <CardContent className="pl-0">
          <div className="h-14 overflow-hidden">
            <Typography size="base" fontWeight="medium" className="text-secondary ">
              ⚠️ Risks
            </Typography>
            <Typography size="xs" fontWeight="normal" className="text-secondary ">
              {data?.risks}
            </Typography>
          </div>
          {data.amount && (
            <div className="flex flex-col w-full mt-4">
              <Typography size="base" fontWeight="medium" className="text-secondary">
                Amounts
              </Typography>
              <div className="flex flex-row w-full justify-between">
                <Typography size="xs" fontWeight="normal" className="text-secondary">
                  Contains:
                </Typography>
                <Typography size="sm" fontWeight="medium" className="text-secondary">
                  {data?.amount} {data?.unit} {data?.measure}
                </Typography>
              </div>
              <div className="flex flex-row w-full justify-between">
                <Typography size="xs" fontWeight="normal" className="text-secondary">
                  Health Guideline:
                </Typography>
                <Typography size="sm" fontWeight="medium" className="text-secondary">
                  {data?.health_guideline ? `${data.health_guideline} ${data.measure}` : 'None'}{' '}
                </Typography>
              </div>
              <div className="flex flex-row w-full justify-between">
                <Typography size="xs" fontWeight="normal" className="text-secondary">
                  Legal Limit:
                </Typography>
                <Typography size="sm" fontWeight="medium" className="text-secondary">
                  {data?.legal_limit ? `${data.legal_limit} ${data.measure}` : 'None'}
                </Typography>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-row h-10 w-full justify-between pl-0 pr-6 pb-0">
          {data?.sources ? <ArticlesDropdown sources={data?.sources || []} /> : <div></div>}

          <Link href={`/search/ingredient/${data?.id}`} className="hover:pointer">
            <Typography size="xs" fontWeight="normal" className="text-secondary">
              Learn more
            </Typography>
          </Link>
        </CardFooter>
      </CardHeader>
    </Card>
  )
}
