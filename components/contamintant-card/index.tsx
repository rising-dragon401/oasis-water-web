import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Typography from '@/components/typography'
import { ArticlesDropdown } from './articles-dropdown'
import { ContaminantFiltersDropdown } from './contaminant-filters-dropdown'

type Props = {
  data: any
}

export default function ContaminantCard({ data }: Props) {
  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex flex-col w-full justify-between relative">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="max-w-72">{data?.name}</div>
            {data.exceedingRecommendedLimit && (
              <div className=" rounded-full bg-primary w-full max-w-[8rem] gap-2 h-8 flex flex-row justify-center items-center">
                <Typography size="xl" fontWeight="normal" className="!text-background">
                  {data.exceedingRecommendedLimit}x
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
          </div>
        </CardTitle>
        <CardDescription>{data?.description}</CardDescription>
        <CardContent className="pl-0">
          <div className="h-24 overflow-hidden">
            <Typography size="base" fontWeight="normal" className="text-secondary ">
              Risks: {data?.risks}
            </Typography>
          </div>
          {data.amount && (
            <Typography size="base" fontWeight="normal" className="text-secondary mt-2">
              Amount: {data?.amount} {data?.unit} {data?.measure}
            </Typography>
          )}
        </CardContent>
        <CardFooter className="flex flex-row  w-full justify-between p-0">
          <ContaminantFiltersDropdown contaminantId={data?.id || ''} />

          {data?.sources ? <ArticlesDropdown sources={data?.sources || []} /> : <div></div>}
        </CardFooter>
      </CardHeader>
    </Card>
  )
}
