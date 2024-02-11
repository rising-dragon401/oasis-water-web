import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  title: string | null
  description: string | null
}

export default function BenefitCard({ title, description }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
