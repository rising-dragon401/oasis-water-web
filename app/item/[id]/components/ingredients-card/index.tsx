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
  ingredients: any[]
}

export default function IngredientsCard({ ingredients }: Props) {
  console.log({ ingredients })
  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
        <CardDescription>
          {ingredients.map((ingredient, index) => (
            <div key={index}>
              <Typography size="2xl" fontWeight="normal" className="my-4">
                {ingredient.name}
              </Typography>

              <Typography size="base" fontWeight="normal" className="text-secondary">
                Benefits
              </Typography>
              {ingredient.benefits.map((benefit: any, index: number) => (
                <Typography
                  key={index}
                  size="sm"
                  fontWeight="normal"
                  className="text-secondary ml-4"
                >
                  •  {benefit.label}: {benefit.description}
                </Typography>
              ))}

              <Typography size="base" fontWeight="normal" className="text-secondary mt-2">
                Harms
              </Typography>
              {ingredient.harms.map((harm: any, index: number) => (
                <Typography
                  key={index}
                  size="sm"
                  fontWeight="normal"
                  className="text-secondary ml-4"
                >
                  • {harm.label}: {harm.description}
                </Typography>
              ))}
            </div>
          ))}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
