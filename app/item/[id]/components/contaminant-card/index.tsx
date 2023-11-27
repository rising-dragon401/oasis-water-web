import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Ingredient } from '@/types/custom'
import Typography from '@/components/typography'

type Props = {
  data: Ingredient
}

export default function ContaminantCard({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data?.name}</CardTitle>
        <CardDescription>{data?.description}</CardDescription>
        <CardContent className="pl-0">
          <Typography size="base" fontWeight="normal" className="text-secondary">
            Risks: {data?.risks}
          </Typography>
        </CardContent>
      </CardHeader>
    </Card>
  )
}
