import Typography from '@/components/typography'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

type Props = {
  ingredients: any[]
}

export default function IngredientsCard({ ingredients }: Props) {
  const nonContaminantIngredients = useMemo(
    () =>
      ingredients
        .filter((ingredient) => !ingredient.is_contaminant)
        .sort((a, b) => b.severity_score - a.severity_score),
    [ingredients]
  )

  const getBgColor = (severityScore: number, bonusScore: number) => {
    if (severityScore > 2) return 'bg-red-100'
    if (severityScore > 0) return 'bg-yellow-100'
    if (bonusScore > 0) return 'bg-green-100'
    return 'bg-muted'
  }

  return (
    <>
      {nonContaminantIngredients
        ?.sort((a, b) => {
          if (a.severity_score !== b.severity_score) {
            return b.severity_score - a.severity_score // Highest severity score first
          }
          return a.bonus_score - b.bonus_score // Then lowest bonus score first (highest last)
        })
        .map((ingredient, index) => (
          <Link
            key={index}
            href={`/search/ingredient/${ingredient.id}`}
            className="rounded-md border"
          >
            <div
              className={`flex flex-row justify-between items-center w-full ${getBgColor(
                ingredient.severity_score,
                ingredient.bonus_score
              )} rounded-t-md px-4 py-2`}
            >
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
          </Link>
        ))}
    </>
  )
}
