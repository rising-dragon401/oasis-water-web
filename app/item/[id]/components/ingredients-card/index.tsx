import { useMemo } from 'react'
import Typography from '@/components/typography'

type Props = {
  ingredients: any[]
}

export default function IngredientsCard({ ingredients }: Props) {
  const nonContaminantIngredients = useMemo(
    () => ingredients.filter((ingredient) => !ingredient.is_contaminant),
    [ingredients]
  )

  return (
    <>
      {nonContaminantIngredients?.map((ingredient, index) => (
        <div key={index}>
          <Typography size="lg" fontWeight="normal" className="mb-4 text-secondary">
            {ingredient.name}
          </Typography>

          <div className="ml-4">
            <Typography size="base" fontWeight="normal" className="text-secondary">
              Benefits: {` `}
              {ingredient.benefits}
            </Typography>

            <Typography size="base" fontWeight="normal" className="text-secondary mt-2">
              Harms: {` `}
              {ingredient.risks}
            </Typography>
          </div>
        </div>
      ))}
    </>
  )
}
