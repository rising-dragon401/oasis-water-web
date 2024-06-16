import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  title: string
  description: string
}

export default function MetaDataCard({ title, description }: Props) {
  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
