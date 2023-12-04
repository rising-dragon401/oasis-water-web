import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Typography from '@/components/typography'

type Props = {
  data: any
}

export default function ContaminantCard({ data }: Props) {
  const exceedingHealthGuideline = data.metadata?.health_guideline
    ? Math.floor(data?.amount / data.metadata?.health_guideline) || false
    : false

  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex flex-col w-full justify-between ">
          {exceedingHealthGuideline && exceedingHealthGuideline > 0 && (
            <div className="flex flex-col mb-2 ">
              <Typography size="4xl" fontWeight="normal">
                {exceedingHealthGuideline}x
              </Typography>
              <Typography size="xs" fontWeight="normal" className="text-secondary">
                Health Guidelines
              </Typography>
            </div>
          )}
          {data?.metadata.name}
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
        {/* <CardFooter className="flex flex-col">
          <Typography size="base" fontWeight="normal" className="text-secondary">
            Amount: {data?.amount} {data?.metadata.unit}
          </Typography>
          <Typography size="base" fontWeight="normal" className="text-secondary">
            Source: {data?.metadata.measure}
          </Typography>
        </CardFooter> */}
      </CardHeader>
    </Card>
  )
}
