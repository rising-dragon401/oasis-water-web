import Typography from '@/components/typography'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { useMemo } from 'react'

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
        <div key={index} className="rounded-md border">
          <div className="flex flex-row justify-between items-center w-full bg-muted rounded-t-md px-4 py-2">
            <Typography size="lg" fontWeight="medium" className="text-secondary">
              {ingredient.name}
            </Typography>
            {ingredient.amount > 0 && (
              <Typography size="base" fontWeight="normal" className="text-secondary">
                {ingredient.amount} {ingredient.measure}
              </Typography>
            )}
          </div>

          <div className="px-4 py-2 flex md:flex-row flex-col justify-between">
            <div className="flex flex-col w-full md:w-1/2 pr-2">
              <div className="flex flex-row items-center">
                <ThumbsUp className="w-3 h-3 mr-1" />
                <Typography size="sm" fontWeight="normal" className="text-secondary">
                  Benefits:
                </Typography>
              </div>
              <Typography size="sm" fontWeight="normal" className="text-secondary">
                {ingredient.benefits}
              </Typography>
            </div>
            <div className="flex flex-col w-full md:w-1/2 md:pl-4 md:mt-0 mt-2">
              <div className="flex flex-row items-center">
                <ThumbsDown className="w-3 h-3 mr-1" />
                <Typography size="sm" fontWeight="normal" className="text-secondary">
                  Harms:
                </Typography>
              </div>
              <Typography size="sm" fontWeight="normal" className="text-secondary">
                {ingredient.risks}
              </Typography>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
