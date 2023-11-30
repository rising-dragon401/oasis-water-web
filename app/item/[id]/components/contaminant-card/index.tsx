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
      <CardHeader>
        <CardTitle>{data?.metadata.name}</CardTitle>
        <CardDescription>{data?.metadata.description}</CardDescription>
        <CardContent className="pl-0">
          {exceedingHealthGuideline && exceedingHealthGuideline > 0 && (
            <div className="flex flex-col mb-2">
              <Typography size="3xl" fontWeight="normal">
                {exceedingHealthGuideline}x
              </Typography>
              <Typography size="base" fontWeight="normal" className="text-secondary">
                Health Guidelines
              </Typography>
            </div>
          )}
          <Typography size="base" fontWeight="normal" className="text-secondary">
            Risks: {data?.metadata.risks}
          </Typography>
        </CardContent>
      </CardHeader>
    </Card>
  )
}
